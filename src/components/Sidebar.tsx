"use client";

import Link from "next/link";
import {
  Bell,
  Box,
  Home,
  LineChart,
  Package,
  Package2,
  ReceiptText,
  ShoppingCart,
  Tags,
  User,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();

  console.log(pathname);

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">Saas IAM</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-md font-medium lg:px-4">
            <p className="mt-4 mb-2 ml-1 text-muted-foreground">Menu</p>

            <Link
              href="/"
              className={cn(
                pathname !== "/" && "text-muted-foreground",
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
              )}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="/users"
              className={cn(
                pathname !== "/users" && "text-muted-foreground",
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
              )}
            >
              <User className="h-4 w-4" />
              Users
            </Link>

            <Link
              href="/roles"
              className={cn(
                !pathname.startsWith("/roles") && "text-muted-foreground",
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
              )}
            >
              <Tags className="h-4 w-4" />
              Roles
            </Link>

            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-4 w-4" />
              Group
            </Link>

            <p className="mt-8 mb-2 ml-1 text-muted-foreground">
              External Apps
            </p>

            <Link
              href="#"
              className={cn(
                pathname !== "/tenants" && "text-muted-foreground",
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
              )}
            >
              <Box className="h-4 w-4" />
              Tenant Management
            </Link>

            <Link
              href="#"
              className={cn(
                pathname !== "/tenants" && "text-muted-foreground",
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
              )}
            >
              <ReceiptText className="h-4 w-4" />
              Billing
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
