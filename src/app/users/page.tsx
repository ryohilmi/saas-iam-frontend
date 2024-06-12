"use client";

import Image from "next/image";
import Link from "next/link";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import UserTable from "./components/UserTable";
import React, { useContext } from "react";
import CreateDialog from "./components/CreateDialog";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export type User = {
  user_org_id: string;
  user_id: string;
  name: string;
  picture: string;
  email: string;
  level: string;
  joined_at: string;
};

const Users = () => {
  const { selectedOrganization } = useContext(OrganizationContext);

  const { data: users, mutate } = useSWR<User[]>(
    `${process.env.NEXT_PUBLIC_IAM_HOST}/organization/users?organization_id=${selectedOrganization?.organizationId}`,
    fetcher
  );

  const [showDialog, setShowDialog] = React.useState(false);

  return (
    <main className="flex flex-col w-full items-start gap-4 p-4 pt-6 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center w-full justify-between">
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => setShowDialog(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add User
            </span>
          </Button>
        </div>
      </div>

      <Card className="min-h-[60vh] w-full relative">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage users in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable users={users} />
        </CardContent>
        {/* <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong> users
          </div>
        </CardFooter> */}
      </Card>

      <CreateDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        mutate={mutate}
      />
    </main>
  );
};

export default Users;
