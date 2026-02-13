import { speciesTable } from '@/db/schema';

export type Species = typeof speciesTable.$inferSelect;
