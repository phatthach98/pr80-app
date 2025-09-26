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

export function OrderStatusSelect() {
  const { data, isError, isPending } = useSettingOptionsQuery();

  if (isError || isPending) {
    return null;
  }

  if (!data?.orderStatuses || data.orderStatuses.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="Lọc đơn hàng" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="Lọc đơn hàng" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Trạng thái đơn hàng</SelectLabel>
          {data.orderStatuses.map((orderStatus) => (
            <SelectItem key={orderStatus.value} value={orderStatus.value}>
              {orderStatus.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
