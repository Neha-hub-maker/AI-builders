import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ModulePage } from "@/components/modules";
const modules = ["documents", "summary", "trends", "doctor-access", "settings"];
export const dynamicParams = false;
export function generateStaticParams() {
  return modules.map((module) => ({ module }));
}
export default async function FutureModule({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  if (!modules.includes(module)) notFound();
  return (
    <AppShell>
      <ModulePage module={module} />
    </AppShell>
  );
}
