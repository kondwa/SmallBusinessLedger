import { useQuery } from "@tanstack/react-query";
import { Transaction, Invoice } from "@shared/schema";
import StatsCards from "@/components/dashboard/stats-cards";
import TransactionChart from "@/components/dashboard/transaction-chart";
import Sidebar from "@/components/navigation/sidebar";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });

  if (transactionsLoading || invoicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Your business overview</p>
          </div>

          <StatsCards transactions={transactions || []} invoices={invoices || []} />

          <div className="rounded-lg border bg-card p-6">
            <h2 className="font-semibold mb-4">Monthly Transactions</h2>
            <div className="h-[400px]">
              <TransactionChart transactions={transactions || []} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
