import { fmtMonthLong } from './lib';
import { getBalanceSnapshot, listExpenses, listPropertiesWithPayments } from './queries';

export type BalanceMovement = {
  id: string;
  date: string;
  description: string;
  amountClp: number;
  type: 'income' | 'expense';
};

export type BalancePaymentDetail = {
  id: string;
  propertyName: string;
  tenantName: string;
  month: string;
  paidOn: string | null;
  amountClp: number;
  type: 'rent' | 'extra';
  status: string;
};

// Aggregates the full balance overview (snapshot + combined movements + payment
// history) shared by the balance landing page and its dedicated detail pages.
export async function getBalanceOverview() {
  const [properties, snapshot, expenses] = await Promise.all([
    listPropertiesWithPayments(),
    getBalanceSnapshot(),
    listExpenses(),
  ]);

  const appRentIncomeClp = properties.reduce(
    (sum, property) =>
      sum +
      property.payments
        .filter((payment) => payment.status === 'paid')
        .reduce((paymentSum, payment) => paymentSum + payment.amountClp, 0),
    0,
  );

  const appExtraIncomeClp = properties.reduce(
    (sum, property) =>
      sum + property.extraPayments.reduce((paymentSum, extra) => paymentSum + extra.amountClp, 0),
    0,
  );

  const appIncomeClp = appRentIncomeClp + appExtraIncomeClp;
  const appExpensesClp = expenses.reduce((sum, expense) => sum + expense.amountClp, 0);

  const totalIncomeClp = snapshot.incomeClp + appIncomeClp;
  const totalExpensesClp = snapshot.expensesClp + appExpensesClp;
  const currentBalanceClp = snapshot.balanceClp + appIncomeClp - appExpensesClp;

  const rentMovements: BalanceMovement[] = properties.flatMap((property) =>
    property.payments
      .filter((payment) => payment.status === 'paid')
      .map((payment) => ({
        id: `income-${payment.id}`,
        date: payment.paidOn ?? `${payment.month}-01`,
        description: `${property.nickname} · ${payment.tenantName ?? property.tenantName} · ${fmtMonthLong(payment.month)}`,
        amountClp: payment.amountClp,
        type: 'income' as const,
      })),
  );

  const extraMovements: BalanceMovement[] = properties.flatMap((property) =>
    property.extraPayments.map((extra) => ({
      id: `extra-${extra.id}`,
      date: extra.paidOn,
      description: `${extra.description} (${property.nickname})`,
      amountClp: extra.amountClp,
      type: 'income' as const,
    })),
  );

  const expenseMovements: BalanceMovement[] = expenses.map((expense) => ({
    id: `expense-${expense.id}`,
    date: expense.date,
    description: expense.description,
    amountClp: expense.amountClp,
    type: 'expense',
  }));

  const movements: BalanceMovement[] = [...rentMovements, ...extraMovements, ...expenseMovements];

  const payments: BalancePaymentDetail[] = properties
    .flatMap((property) => [
      ...property.payments.map((payment) => ({
        id: payment.id,
        propertyName: property.nickname,
        tenantName: payment.tenantName ?? property.tenantName,
        month: payment.month,
        paidOn: payment.paidOn,
        amountClp: payment.amountClp,
        type: 'rent' as const,
        status: payment.status,
      })),
      ...property.extraPayments.map((extra) => ({
        id: extra.id,
        propertyName: property.nickname,
        tenantName: property.tenantName,
        month: extra.month,
        paidOn: extra.paidOn,
        amountClp: extra.amountClp,
        type: 'extra' as const,
        status: 'paid',
      })),
    ])
    .toSorted((a, b) => b.month.localeCompare(a.month) || b.id.localeCompare(a.id));

  return {
    snapshot,
    expenses,
    appIncomeClp,
    appExpensesClp,
    totalIncomeClp,
    totalExpensesClp,
    currentBalanceClp,
    movements,
    payments,
  };
}
