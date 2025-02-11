import { useQuery } from "@tanstack/react-query";
import { Transaction, Category } from "@shared/schema";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/navigation/sidebar";

const COLORS = ["#4ade80", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6"];

export default function AnalyticsPage() {
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<
    Transaction[]
  >({
    queryKey: ["/api/transactions"],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["/api/categories"],
  });

  if (transactionsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  // Calculate monthly data for the line chart
  const monthlyData = eachMonthOfInterval({
    start: transactions.length > 0 
      ? new Date(Math.min(...transactions.map(t => new Date(t.date).getTime())))
      : startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  }).map(date => {
    const month = format(date, "MMM yyyy");
    const monthTransactions = transactions.filter(
      t => format(new Date(t.date), "MMM yyyy") === month
    );

    return {
      month,
      income: monthTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0),
      expenses: monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0),
    };
  });

  // Calculate category-wise data for pie charts
  const categoryData = categories.map(category => ({
    name: category.name,
    value: transactions
      .filter(t => t.categoryId === category.id)
      .reduce((sum, t) => sum + Number(t.amount), 0),
    type: category.type,
  }));

  const incomeCategories = categoryData.filter(c => c.type === "income");
  const expenseCategories = categoryData.filter(c => c.type === "expense");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Financial insights and reports</p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Income</CardTitle>
                <CardDescription>All time income</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-500">
                  ${totalIncome.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Expenses</CardTitle>
                <CardDescription>All time expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-500">
                  ${totalExpenses.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Income</CardTitle>
                <CardDescription>Profit/Loss</CardDescription>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${(totalIncome - totalExpenses).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Income vs Expenses over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#4ade80"
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Income Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Income by Category</CardTitle>
                <CardDescription>Distribution of income sources</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeCategories}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: $${entry.value.toFixed(2)}`}
                    >
                      {incomeCategories.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Expense Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>Distribution of expenses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: $${entry.value.toFixed(2)}`}
                    >
                      {expenseCategories.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
