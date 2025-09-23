import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import { TablesCreatePage } from '@/features/tables';

const searchValidator = z.object({
  table: z.string(),
  customerCount: z.number(),
});

type SearchValidator = z.infer<typeof searchValidator>;

export const Route = createFileRoute('/_auth/tables/create')({
  component: TablesCreatePage,
  validateSearch: (search): SearchValidator => {
    return searchValidator.parse(search);
  },
});
