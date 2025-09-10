import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { useNavigate } from '@tanstack/react-router';
import { useSettingOptionsQuery } from '@/hooks/query';
import { ordersStore } from '../store';
import { useStore } from '@tanstack/react-store';
import { useTables } from '../hooks/use-tables';
import { Order } from '@/domain/entity';

export function TablesPage() {
  const navigate = useNavigate();
  const { draftOrders } = useStore(ordersStore);
  const { selectOrderById } = useTables();
  const { data: tableOptions } = useSettingOptionsQuery();

  const handleOnTableClick = (tableId: string) => {
    selectOrderById(tableId);
    navigate({
      to: '/tables/$tableId',
      params: {
        tableId,
      },
    });
  };

  console.log('draftOrders', draftOrders);
  console.log('table view', Order.toTableView(draftOrders));

  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
      {Order.toTableView(draftOrders).map((table, index) => {
        const currentTable = tableOptions?.tables.find(
          (option) => option.value === table.tableNumber,
        );

        if (!currentTable) {
          return null;
        }
        return (
          <Card
            key={index}
            className="w-full md:w-[calc(50%-1rem)]"
            onClick={() => handleOnTableClick(table.tableNumber)}
          >
            <CardHeader>
              <CardTitle>{currentTable.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{table.customerCount} khách</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
