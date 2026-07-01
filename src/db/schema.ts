import { pgTable, uuid, text, numeric, timestamp } from 'drizzle-orm/pg-core';

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  profile_id: uuid('profile_id').notNull(),
  pet_id: uuid('pet_id'),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull(),
  transaction_code: text('transaction_code').unique(),
  type: text('type'),
  paid_at: timestamp('paid_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
