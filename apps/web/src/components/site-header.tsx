import { SidebarIcon } from 'lucide-react';
import { Button, Separator, useSidebar } from '@/components/ui';
import { CreateDraftTableForm } from '@/features/tables/components';
import { useLocation } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

export function SiteHeader() {
  const { toggleSidebar, open, openMobile } = useSidebar();
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);
  const isTablesPage = pathname === '/tables' || pathname === '/tables/';

  useEffect(() => {
    const pathNameChanged = pathname !== pathnameRef.current;
    if ((open || openMobile) && pathNameChanged) {
      toggleSidebar();
    }
    pathnameRef.current = pathname;
  }, [pathname, open]);

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-14 w-full items-center gap-2 px-4 md:h-(--header-height)">
        <Button className="h-8 w-12" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex w-full items-center justify-end gap-2 sm:ml-auto sm:w-auto">
          {isTablesPage && <HeaderActionOnTablesPage />}
        </div>
      </div>
    </header>
  );
}

const HeaderActionOnTablesPage = () => {
  return (
    <div className="flex items-center gap-2">
      <CreateDraftTableForm size="lg" />
    </div>
  );
};
