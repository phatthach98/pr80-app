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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettingOptionsQuery } from '@/hooks/query';
import { PlusIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { EOrderStatus, EOrderType } from '@pr80-app/shared-contracts';
import { useTables } from '../hooks/use-tables';

type CreateTableFormData = {
  table: string;
  customerCount: number;
};

export function CreateTableForm() {
  const [open, setOpen] = React.useState(false);
  const { control, handleSubmit, reset } = useForm<CreateTableFormData>({
    defaultValues: {
      table: '',
      customerCount: 1,
    },
  });
  const { data: tableOptions } = useSettingOptionsQuery();
  const { addLocalTable } = useTables();

  const createTable = async (data: CreateTableFormData) => {
    addLocalTable({
      id: data.table,
      tableNumber: data.table,
      customerCount: Number(data.customerCount),
      status: EOrderStatus.DRAFT,
      source: 'local',
      totalAmount: '0',
      relatedOrderIds: [],
      type: EOrderType.MAIN,
    });
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" type="button">
          <PlusIcon className="size-4" />
          Thêm bàn mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(createTable)}>
          <DialogHeader>
            <DialogTitle>Thêm bàn mới</DialogTitle>
            <DialogDescription>Thêm bàn mới trước khi gọi món</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="table-list">Danh sách bàn</Label>
              <Controller
                control={control}
                name="table"
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="table-list">
                      <SelectValue placeholder="Chọn bàn" />
                    </SelectTrigger>
                    <SelectContent>
                      {tableOptions?.tables.map((table) => (
                        <SelectItem key={table.value} value={table.value}>
                          {table.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="customer-count">Số lượng khách</Label>
              <Controller
                control={control}
                name="customerCount"
                render={({ field }) => <Input id="customer-count" type="number" {...field} />}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">Thêm bàn</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
