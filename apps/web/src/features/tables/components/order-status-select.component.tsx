import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettingOptionsQuery } from '@/hooks/query';
import { ETableStatus } from '@/domain/entity/order';
import { cn } from '@/tailwind/utils';

interface OrderStatusSelectProps {
  onChange: (value: ETableStatus) => void;
  defaultStatus: ETableStatus;
  className?: string;
}

export function OrderStatusSelect({ defaultStatus, onChange, className }: OrderStatusSelectProps) {
  const { data, isError, isPending } = useSettingOptionsQuery();

  if (isError || isPending) {
    return null;
  }

  if (!data.tableStatuses || data.tableStatuses.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="Lọc đơn hàng" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select onValueChange={onChange} defaultValue={defaultStatus}>
      <SelectTrigger className={cn('w-auto', className)}>
        <SelectValue placeholder="Lọc đơn hàng" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Trạng thái bàn</SelectLabel>
          {data.tableStatuses.map((tableStatus) => (
            <SelectItem key={tableStatus.value} value={tableStatus.value}>
              {tableStatus.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
