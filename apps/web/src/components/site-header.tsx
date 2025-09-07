import { SidebarIcon } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  Button,
  Separator,
  useSidebar,
} from '@/components/ui';
import { OrderStatusSelect, MakeOrderForm } from '@/features/orders/components';
import { Link } from '@tanstack/react-router';

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/orders">Danh sách đơn hàng</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex w-full items-center justify-end gap-2 sm:ml-auto sm:w-auto">
          <OrderStatusSelect />
          <MakeOrderForm />
        </div>
      </div>
    </header>
  );
}
