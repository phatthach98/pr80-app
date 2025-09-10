import { SidebarIcon } from 'lucide-react';
import { Button, Separator, useSidebar } from '@/components/ui';
import {
  OrderStatusSelect,
  AddDishOrderForm,
  CreateTableForm,
  SubmitOrderButton,
} from '@/features/orders/components';
import { useLocation } from '@tanstack/react-router';

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const { pathname } = useLocation();
  const isTablesPage = pathname === '/tables' || pathname === '/tables/';
  const isTableDetailPage = pathname.startsWith('/tables/') && pathname !== '/tables/';

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex w-full items-center justify-end gap-2 sm:ml-auto sm:w-auto">
          {isTablesPage && <HeaderActionOnTablesPage />}
          {isTableDetailPage && <HeaderActionOnTableDetailPage />}
        </div>
      </div>
    </header>
  );
}

const HeaderActionOnTablesPage = () => {
  return (
    <div className="flex items-center gap-2">
      <OrderStatusSelect />
      <CreateTableForm />
    </div>
  );
};

const HeaderActionOnTableDetailPage = () => {
  return (
    <div className="flex items-center gap-2">
      <AddDishOrderForm />
      <SubmitOrderButton />
    </div>
  );
};
