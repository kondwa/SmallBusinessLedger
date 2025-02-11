import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  HomeIcon,
  ReceiptIcon,
  ArrowLeftRightIcon,
  LogOutIcon,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRightIcon },
  { name: "Invoices", href: "/invoices", icon: ReceiptIcon },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { logoutMutation, user } = useAuth();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r">
      <div className="flex h-14 items-center border-b px-4 py-2">
        <h1 className="text-lg font-semibold">BookKeeper</h1>
      </div>

      <div className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  location === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </div>

      <div className="border-t p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.businessName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.username}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
