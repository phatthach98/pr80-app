import { GalleryVerticalEnd } from 'lucide-react';

import { cn } from '@/tailwind/utils';
import { Button, Input, Label } from '@/presentation/components/ui';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only"></span>
            </a>
            <h1 className="text-center text-xl font-bold">
              Không có khách hàng nào là người xa lạ, tất cả đều là bạn bè cần được giúp đỡ.
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input id="phoneNumber" placeholder="0907983993" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="passCode">Mã 4 số</Label>
              <Input id="passCode" type="password" placeholder="1234" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
