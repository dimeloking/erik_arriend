import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

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
    isOccupied: boolean('is_occupied').notNull().default(true),
    vacantSince: varchar('vacant_since', { length: 10 }),
    rentClp: integer('rent_clp').notNull(),
    depositClp: integer('deposit_clp').notNull().default(0),
    startDate: varchar('start_date', { length: 10 }).notNull(), // YYYY-MM-DD
    paymentDay: integer('payment_day').notNull().default(5),
    contractMonths: integer('contract_months').notNull().default(12),
    contractDurationUnit: varchar('contract_duration_unit', { length: 12 })
      .notNull()
      .default('months'),
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
    tenantName: varchar('tenant_name', { length: 120 }),
    tenantPhone: varchar('tenant_phone', { length: 40 }),
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

export const balanceSnapshotSchema = pgTable(
  'balance_snapshot',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(),
    incomeClp: integer('income_clp').notNull().default(0),
    expensesClp: integer('expenses_clp').notNull().default(0),
    balanceClp: integer('balance_clp').notNull().default(0),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('balance_snapshot_user_uniq').on(table.userId)],
);

export const expenseSchema = pgTable(
  'expense',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull(),
    date: varchar('date', { length: 10 }).notNull(),
    month: varchar('month', { length: 7 }).notNull(),
    description: varchar('description', { length: 240 }).notNull(),
    amountClp: integer('amount_clp').notNull(),
    notes: text('notes'),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [index('expense_user_month_idx').on(table.userId, table.month)],
);
