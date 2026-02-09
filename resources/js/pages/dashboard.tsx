import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import AppLayout from "@/layouts/app-layout";
import * as Routes from "@/routes";
import { type BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";

// defensive resolution for dashboard route
const RoutesNS = Routes as any;
const adminDashboardUrl = (() => {
  try {
    if (typeof RoutesNS.adminDashboard === "function") return RoutesNS.adminDashboard().url;
    if (typeof RoutesNS.dashboard === "function") return RoutesNS.dashboard().url;
    if (RoutesNS.default && typeof RoutesNS.default.index === "function") return RoutesNS.default.index().url; // fallback to default.index (if default is papi)
  } catch (e) {
    // ignore
  }
  // last-resort fallback:
  return "/admin/dashboard";
})();

const papiIndexUrl = (() => {
  try {
    if (RoutesNS.default && typeof RoutesNS.default.index === "function") return RoutesNS.default.index().url;
    if (typeof RoutesNS.papi === "object" && typeof RoutesNS.papi.index === "function") return RoutesNS.papi.index().url;
    if (typeof RoutesNS.papiIndex === "function") return RoutesNS.papiIndex().url;
  } catch (e) {
    // ignore
  }
  return "/psychotest/papi";
})();

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: adminDashboardUrl,
  },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <Link
              href={papiIndexUrl}
              className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 hover:bg-muted transition flex items-center justify-center text-lg font-semibold"
            >
              PAPI Management
            </Link>

            <Link
              href="/admin/disc"
              className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 hover:bg-muted transition flex items-center justify-center text-lg font-semibold"
            >
              DISC Management
            </Link>

            <Link
              href="/admin/cfit"
              className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 hover:bg-muted transition flex items-center justify-center text-lg font-semibold"
            >
              CFIT Management
            </Link>

            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
          </div>

          <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
          </div>

          <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
          </div>
        </div>

        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
        </div>
      </div>
    </AppLayout>
  );
}
