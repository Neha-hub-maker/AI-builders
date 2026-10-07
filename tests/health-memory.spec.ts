import { test, expect } from "@playwright/test";

test("core pages render and primary navigation works", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your medical history",
  );
  await page
    .getByRole("link", { name: "Create your health memory" })
    .first()
    .click();
  await expect(page).toHaveURL("/dashboard");
  await expect(
    page.getByRole("heading", { name: /Good evening/ }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Medical timeline", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your medical timeline" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Add record", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Every record matters." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("language preference persists across pages and reloads", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Switch language to Bangla" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "bn");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "শুভ সন্ধ্যা",
  );
  await page
    .getByRole("link", { name: "মেডিক্যাল টাইমলাইন", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "আপনার মেডিক্যাল টাইমলাইন" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "আপনার মেডিক্যাল টাইমলাইন" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "ইংরেজিতে পরিবর্তন করুন" }).click();
  await expect(
    page.getByRole("heading", { name: "Your medical timeline" }),
  ).toBeVisible();
});

test("timeline filters, empty states, record details and source evidence work", async ({
  page,
}) => {
  await page.goto("/timeline");
  await expect(page.locator(".timeline-event")).toHaveCount(5);
  await page
    .getByRole("button", { name: "Prescriptions", exact: true })
    .click();
  await expect(page.locator(".timeline-event")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Record details", exact: true })
    .click();
  await expect(
    page.getByText("Ferrous sulfate · as recorded in sample"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Original document", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Illustrative sample document",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Hospital", exact: true }).click();
  await expect(page.getByText("No records in this chapter yet.")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page
    .getByRole("combobox", { name: "Filter year" })
    .selectOption("2018");
  await expect(page.locator(".timeline-event")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Antibiotic sensitivity report" }),
  ).toBeVisible();
});

test("sample processing requires review and persists the saved timeline record", async ({
  page,
}) => {
  await page.goto("/upload");
  await page.getByRole("button", { name: "Try a sample" }).click();
  await expect(
    page.getByText("Prototype preview", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "The details make the story." }),
  ).toBeVisible({ timeout: 10000 });
  await expect(
    page.getByRole("button", { name: "Connect to my timeline" }),
  ).toBeDisabled();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Connect to my timeline" }).click();
  await expect(
    page.getByRole("heading", { name: /Your memory just/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View in my timeline" }).click();
  await expect(page.locator(".timeline-event")).toHaveCount(6);
  await expect(
    page.getByRole("heading", {
      name: "Complete blood count (CBC)",
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator(".timeline-event")).toHaveCount(6);
});

test("real local file validates, saves entered details and retains original bytes", async ({
  page,
}) => {
  await page.goto("/upload");
  const input = page.getByLabel("Choose medical document");
  await input.setInputFiles({
    name: "notes.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("invalid file"),
  });
  await expect(page.locator('.form-error[role="alert"]')).toContainText(
    "Choose a PDF",
  );
  const content = Buffer.from("%PDF-1.4\n% Nira test document\n%%EOF");
  await input.setInputFiles({
    name: "visit.pdf",
    mimeType: "application/pdf",
    buffer: content,
  });
  await expect(
    page.getByRole("heading", { name: "The details make the story." }),
  ).toBeVisible({ timeout: 10000 });
  await expect(page.getByLabel("Test / record title")).toHaveValue("");
  await page
    .getByLabel("Test / record title")
    .fill("Annual blood investigation");
  await page.getByLabel("Healthcare provider").fill("Dhaka test clinic");
  await page
    .getByLabel("Finding from the report")
    .fill("Hemoglobin · 12.5 g/dL");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Connect to my timeline" }).click();
  await page.getByRole("link", { name: "View in my timeline" }).click();
  await expect(page).toHaveURL(/\/timeline\?record=upload-/);
  await page.reload();
  const record = page.locator("article").filter({
    has: page.getByRole("heading", { name: "Annual blood investigation" }),
  });
  await record.getByRole("button", { name: "Original document" }).click();
  await expect(page.getByRole("dialog")).toContainText("visit.pdf");
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download original file" }).click();
  expect((await download).suggestedFilename()).toBe("visit.pdf");
  const saved = await page.evaluate(async () => {
    const records = JSON.parse(localStorage.getItem("nira-records") || "[]");
    const id = records[0].id;
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open("nira-original-documents", 1);
      request.onsuccess = () => resolve(request.result);
    });
    const file = await new Promise<Blob>((resolve) => {
      const request = db
        .transaction("files", "readonly")
        .objectStore("files")
        .get(id);
      request.onsuccess = () => resolve(request.result);
    });
    const text = await file.text();
    db.close();
    return text;
  });
  expect(saved).toBe(content.toString());
});

test("global search and summary export include source records", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Search records" }).click();
  await page.getByRole("textbox", { name: "Search query" }).fill("Labaid");
  await expect(page.locator(".search-results a")).toHaveCount(1);
  await page.locator(".search-results a").click();
  await expect(page).toHaveURL(/timeline\?record=sensitivity-2018/);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export summary" }).click();
  expect((await download).suggestedFilename()).toBe("nira-medical-summary.txt");
});

test("core pages fit mobile and tablet with usable navigation", async ({
  page,
}) => {
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["/", "/dashboard", "/upload", "/timeline"]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));
      expect(
        dimensions.scroll,
        `Horizontal overflow on ${route} at ${width}px`,
      ).toBeLessThanOrEqual(dimensions.viewport);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("link", { name: "Medical timeline", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Medical timeline", exact: true })
    .click();
  await expect(page).toHaveURL("/timeline");
  await expect(page.locator(".sidebar")).not.toHaveClass(/sidebar-open/);
});
