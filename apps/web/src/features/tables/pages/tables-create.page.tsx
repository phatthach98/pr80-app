import { useSearch } from '@tanstack/react-router';
import { TableDetail } from '../components';

export function TablesCreatePage() {
  const search = useSearch({ from: '/_auth/tables/create' }) as any;

  return (
    <TableDetail
      createParams={{
        table: search.table as string,
        customerCount: Number(search.customerCount),
      }}
    />
  );
}
