import { createFileRoute } from '@tanstack/react-router';
import { TableCreatePage } from '@/features/orders';
import z from 'zod';

const searchValidator = z.object({
  table: z.string(),
  customerCount: z.number(),
});

type SearchValidator = z.infer<typeof searchValidator>;

export const Route = createFileRoute('/_auth/tables/create')({
  component: TableCreatePage,
  validateSearch: (search): SearchValidator => {
    return searchValidator.parse(search);
  },
});
