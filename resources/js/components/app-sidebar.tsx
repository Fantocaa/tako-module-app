// resources/js/components/app-sidebar.tsx
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from './app-logo';
import { ScrollArea } from './ui/scroll-area';
import { LayoutGrid } from 'lucide-react';

export function AppSidebar() {
  const { menus = [] } = usePage().props as any;

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/papi">
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/papi" className="flex items-center gap-2 px-4 py-3">
                <LayoutGrid className="size-4" />
                <span>PAPI Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
