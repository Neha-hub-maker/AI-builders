import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const site = join(root, ".next-pages");

function git(args, options = {}) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(
      result.stderr || result.error?.message || "Git command failed.",
    );
  }
  return result.stdout.trim();
}

if (!existsSync(join(site, "index.html"))) {
  throw new Error("Build the static site first with npm run build:pages.");
}

// Keep Jekyll from discarding the Next.js asset directory.
writeFileSync(join(site, ".nojekyll"), "");
const source = git(["rev-parse", "HEAD"]);
const gitDir = git(["rev-parse", "--absolute-git-dir"]);
const remote = git(["ls-remote", "origin", "refs/heads/gh-pages"]);
const parent = remote ? remote.split(/\s+/)[0] : undefined;
if (parent) git(["fetch", "--no-tags", "origin", "gh-pages"]);

const temporary = mkdtempSync(join(tmpdir(), "nira-pages-"));
try {
  // An isolated index stages only the export, leaving the user's index and
  // working checkout untouched. No worktree or force push is needed.
  const env = { ...process.env, GIT_INDEX_FILE: join(temporary, "index") };
  const context = [`--git-dir=${gitDir}`, `--work-tree=${site}`];
  git([...context, "add", "--all"], { env, cwd: site });
  const tree = git([...context, "write-tree"], { env, cwd: site });
  const commit = git(
    [
      "commit-tree",
      tree,
      ...(parent ? ["-p", parent] : []),
      "-m",
      `Deploy Nira demo from ${source.slice(0, 7)}`,
    ],
    { env },
  );
  git(["push", "origin", `${commit}:refs/heads/gh-pages`]);
  console.log(
    `Published static site files to gh-pages (${commit.slice(0, 7)}).`,
  );
  console.log(
    "GitHub Pages must use gh-pages / (root) as its publishing source.",
  );
  console.log("Site address: https://neha-hub-maker.github.io/AI-builders/");
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
