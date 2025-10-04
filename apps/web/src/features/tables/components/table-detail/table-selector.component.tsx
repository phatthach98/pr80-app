import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ordersKeys, useSettingOptionsQuery } from '@/hooks/query';
import { useUpdateOrderTableMutation } from '@/hooks/mutation/orders.mutation';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface TableSelectorProps {
  orderId: string;
  currentTable: string;
  disabled?: boolean;
}

export const TableSelector = ({ orderId, currentTable, disabled = false }: TableSelectorProps) => {
  const { data: options } = useSettingOptionsQuery();
  const { mutateAsync: updateOrderTable, isPending } = useUpdateOrderTableMutation();
  const [selectedTable, setSelectedTable] = useState<string>(currentTable);
  const [isChanging, setIsChanging] = useState(false);
  const queryClient = useQueryClient();
  // Filter out the current table from the options
  const availableTables = options?.tables?.filter((table) => table.value !== currentTable) || [];

  const handleChangeTable = async () => {
    if (selectedTable === currentTable || !selectedTable) {
      return;
    }

    // Store the previous table for optimistic updates
    const previousTable = currentTable;
    
    // Get the current order from cache
    const currentOrder = queryClient.getQueryData(ordersKeys.detail(orderId));
    
    // Optimistically update the UI
    if (currentOrder) {
      queryClient.setQueryData(ordersKeys.detail(orderId), {
        ...currentOrder,
        table: selectedTable
      });
    }

    try {
      // Make the API call
      const updatedOrder = await updateOrderTable({
        orderId,
        table: selectedTable,
      });
      
      // Update the cache with the server response
      queryClient.setQueryData(ordersKeys.detail(orderId), updatedOrder);
      
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists() });
      
      toast.success('Đã chuyển bàn thành công');
    } catch (error) {
      // Revert optimistic update on error
      if (currentOrder) {
        queryClient.setQueryData(ordersKeys.detail(orderId), {
          ...currentOrder,
          table: previousTable
        });
      }
      
      toast.error('Không thể chuyển bàn. Vui lòng thử lại.');
    } finally {
      setIsChanging(false);
    }
  };

  if (disabled) return null;

  return (
    <div className="flex items-center gap-2">
      {isChanging ? (
        <>
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn bàn" />
            </SelectTrigger>
            <SelectContent>
              {availableTables.map((table) => (
                <SelectItem key={table.value} value={table.value}>
                  {table.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleChangeTable}
              disabled={selectedTable === currentTable || isPending}
              isLoading={isPending}
            >
              Chuyển
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedTable(currentTable);
                setIsChanging(false);
              }}
              disabled={isPending}
            >
              Hủy
            </Button>
          </div>
        </>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsChanging(true)}
          className="flex items-center gap-1"
        >
          <ArrowRightLeft className="h-4 w-4" />
          Chuyển bàn
        </Button>
      )}
    </div>
  );
};
