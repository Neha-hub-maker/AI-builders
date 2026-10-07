import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Dashboard } from "@/components/dashboard";
export const metadata: Metadata = { title: "Your medical memory" };
export default function DashboardPage() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}
