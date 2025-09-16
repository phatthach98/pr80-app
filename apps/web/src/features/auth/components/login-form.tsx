import { GalleryVerticalEnd } from 'lucide-react';

import { cn } from '@/tailwind/utils';
import { Button, Input, Label } from '@/components/ui';
import { Controller, useForm } from 'react-hook-form';
import { LoginRequestDTO } from '@pr80-app/shared-contracts';
import { useAuth } from '@/features/auth/hooks';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<LoginRequestDTO>({
    defaultValues: {
      phoneNumber: '',
      passCode: '',
    },
  });

  const handleLogin = async (data: LoginRequestDTO) => {
    setIsLoading(true);
    await login(data.phoneNumber, data.passCode);
    setIsLoading(false);
    navigate({ to: '/tables', replace: true });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(handleLogin)}>
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
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <Input id="phoneNumber" placeholder="0907983993" required {...field} />
                )}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="passCode">Mã 4 số</Label>
              <Controller
                control={control}
                name="passCode"
                render={({ field }) => (
                  <Input id="passCode" type="password" placeholder="1234" required {...field} />
                )}
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Đăng nhập
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
