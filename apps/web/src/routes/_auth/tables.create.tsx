import { createFileRoute, useSearch } from '@tanstack/react-router';
import { TableDetail } from '@/features/orders/components/table-detail';
import z from 'zod';

const searchValidator = z.object({
  table: z.string(),
  customerCount: z.number(),
});

type SearchValidator = z.infer<typeof searchValidator>;

// Component to be used in the route
const TableCreateView = () => {
  const search = useSearch({ from: '/_auth/tables/create' }) as any;
  
  return (
    <TableDetail
      createParams={{
        table: search.table as string,
        customerCount: Number(search.customerCount),
      }}
    />
  );
};

export const Route = createFileRoute('/_auth/tables/create')({
  component: TableCreateView,
  validateSearch: (search): SearchValidator => {
    return searchValidator.parse(search);
  },
});