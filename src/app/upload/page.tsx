import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { UploadPage } from "@/components/upload";
export const metadata: Metadata = { title: "Upload medical records" };
export default function Upload() {
  return (
    <AppShell>
      <UploadPage />
    </AppShell>
  );
}
