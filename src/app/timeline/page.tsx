import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Timeline } from "@/components/timeline";
export const metadata: Metadata = { title: "Medical timeline" };
export default function TimelinePage() {
  return (
    <AppShell>
      <Timeline />
    </AppShell>
  );
}
