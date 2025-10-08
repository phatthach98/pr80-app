import * as React from 'react';
import { Command, LogOut, Package2Icon, Table2Icon } from 'lucide-react';

import { NavMain } from '@/components';
import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui';
import { authStore, useAuth } from '@/features/auth/hooks/use-auth';
import { useNavigate } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Danh sách bàn',
      url: '/tables',
      icon: Table2Icon,
      isActive: true,
      items: [],
    },
    {
      title: 'Danh sách đơn hàng',
      url: '/orders',
      icon: Package2Icon,
      isActive: true,
      items: [],
    },
  ],
  navSecondary: [],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout } = useAuth();
  const { userDetail } = useStore(authStore);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Xin chào!</span>
                  <span className="truncate text-xs">{userDetail?.name || 'PR-80'}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut /> Đăng xuất
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
