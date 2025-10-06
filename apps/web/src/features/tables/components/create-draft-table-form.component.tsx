import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useSettingOptionsQuery } from '@/hooks/query';
import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Skeleton } from '@/components/ui';

const formValidator = z.object({
  table: z.string().min(1, 'Chọn số bàn'),
  customerCount: z.number().min(1, 'Nhập số lượng khách'),
});

type CreateDraftTableFormDataType = z.infer<typeof formValidator>;

type CreateDraftTableFormProps = {
  size?: 'default' | 'sm' | 'lg';
};

export function CreateDraftTableForm({ size = 'sm' }: CreateDraftTableFormProps) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<CreateDraftTableFormDataType>({
    defaultValues: {
      table: '',
      customerCount: 1,
    },
    resolver: zodResolver(formValidator),
  });
  const { data: tableOptions, isPending, isError } = useSettingOptionsQuery();
  const navigate = useNavigate();

  const createDraftTable = async (data: CreateDraftTableFormDataType) => {
    form.reset();
    navigate({
      to: `/tables/create?table=${data.table}&customerCount=${data.customerCount}`,
    });
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
    }
  };

  if (isPending) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (isError) {
    return <div>Lỗi khi tải danh sách bàn</div>;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size={size} type="button">
          <PlusIcon className="size-4" />
          Tạo đơn mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(createDraftTable)}>
            <DialogHeader>
              <DialogTitle>Thêm đơn bàn mới</DialogTitle>
              <DialogDescription>Thêm đơn hàng mới trước khi gọi món</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="table"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Danh sách đơn bàn</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn bàn" />
                        </SelectTrigger>
                        <SelectContent>
                          {tableOptions.tables.map((table) => (
                            <SelectItem key={table.value} value={table.value}>
                              {table.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Số lượng khách</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        inputMode="numeric"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Thêm đơn bàn</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
