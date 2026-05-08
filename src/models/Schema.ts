import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// Need a database for production? Check out https://get.neon.com/BMFYNtx
// Tested and compatible with Next.js Boilerplate

export const counterSchema = pgTable('counter', {
  id: serial('id').primaryKey(),
  count: integer('count').default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Casero — control de arriendos

export const propertySchema = pgTable(
  'property',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(), // Clerk user ID — owner
    nickname: varchar('nickname', { length: 120 }).notNull(),
    address: varchar('address', { length: 240 }).notNull(),
    tenantName: varchar('tenant_name', { length: 120 }).notNull(),
    tenantPhone: varchar('tenant_phone', { length: 40 }),
    rentClp: integer('rent_clp').notNull(),
    depositClp: integer('deposit_clp').notNull().default(0),
    startDate: varchar('start_date', { length: 10 }).notNull(), // YYYY-MM-DD
    contractMonths: integer('contract_months').notNull().default(12),
    increasePct: integer('increase_pct').notNull().default(0),
    increaseAnchor: varchar('increase_anchor', { length: 2 }).notNull().default('01'), // 01..12
    color: varchar('color', { length: 16 }).notNull().default('mint'),
    notes: text('notes'),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [index('property_user_idx').on(table.userId)],
);

export const paymentSchema = pgTable(
  'payment',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    propertyId: uuid('property_id')
      .notNull()
      .references(() => propertySchema.id, { onDelete: 'cascade' }),
    month: varchar('month', { length: 7 }).notNull(), // YYYY-MM
    amountClp: integer('amount_clp').notNull(),
    paidOn: varchar('paid_on', { length: 10 }), // YYYY-MM-DD or null
    status: varchar('status', { length: 16 }).notNull().default('pending'), // paid|late|pending|overdue
    method: varchar('method', { length: 32 }),
    reference: varchar('reference', { length: 80 }),
    notes: text('notes'),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [
    index('payment_property_idx').on(table.propertyId),
    uniqueIndex('payment_property_month_uniq').on(table.propertyId, table.month),
  ],
);
