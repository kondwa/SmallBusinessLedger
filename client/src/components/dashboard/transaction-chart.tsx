import { Transaction } from "@shared/schema";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { startOfMonth, format, parseISO } from "date-fns";

interface TransactionChartProps {
  transactions: Transaction[];
}

interface ChartData {
  date: string;
  income: number;
  expenses: number;
}

export default function TransactionChart({ transactions }: TransactionChartProps) {
  const monthlyData = transactions.reduce((acc: ChartData[], transaction) => {
    const date = startOfMonth(new Date(transaction.date));
    const monthKey = format(date, "MMM yyyy");
    
    const existingMonth = acc.find((item) => item.date === monthKey);
    if (existingMonth) {
      if (transaction.type === "income") {
        existingMonth.income += Number(transaction.amount);
      } else {
        existingMonth.expenses += Number(transaction.amount);
      }
    } else {
      acc.push({
        date: monthKey,
        income: transaction.type === "income" ? Number(transaction.amount) : 0,
        expenses: transaction.type === "expense" ? Number(transaction.amount) : 0,
      });
    }
    
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={monthlyData}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#4ade80"
          fillOpacity={0.2}
          fill="#4ade80"
          name="Income"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          fillOpacity={0.2}
          fill="#ef4444"
          name="Expenses"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
