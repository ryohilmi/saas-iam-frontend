"use client";

import { PlusCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import UserTable from "./components/UserTable";
import React, { useContext } from "react";
import CreateDialog from "./components/CreateDialog";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import useUsers from "@/hooks/useUsers";
import { useDebounceValue } from "usehooks-ts";
import { AuthContext } from "@/providers/AuthProvider";
import AssignRoleDialog from "./components/AssignRoleDialog";
import AssignGroupDialog from "./components/AssignGroupDialog";
import { User } from "@/types/user";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const Users = () => {
  const { userInfo } = useContext(AuthContext);
  const { selectedOrganization } = useContext(OrganizationContext);
  const organizationId = selectedOrganization?.organizationId || "";

  const [showDialog, setShowDialog] = React.useState(false);
  const [actionDialog, setActionDialog] = React.useState<{
    open: boolean;
    type: DialogTypes;
  }>({ open: false, type: "assign_role" });
  const [search, setSearch] = useDebounceValue("", 50);

  const { users, mutate, isLoading } = useUsers({ organizationId });
  const filteredUsers = users?.filter(
    (user) =>
      (user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())) &&
      user.user_id !== userInfo?.sub
  );

  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  if (!selectedOrganization) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">No Organization</h3>
          <p className="text-sm text-muted-foreground">
            You have not selected any organization yet.
          </p>
        </div>
      </div>
    );
  }

  if ((filteredUsers.length === 0 || !users) && !isLoading) {
    return (
      <main className="flex flex-col w-full min-h-[80vh] items-start gap-4 md:gap-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/" passHref>
                <BreadcrumbLink>Home</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center w-full justify-between">
          <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              // value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <div className="ml-auto flex whitespace-nowrap min-w-[110px] items-center gap-2">
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

        <div className="w-full flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">No User</h3>
            <p className="text-sm text-muted-foreground">
              You have not created any user yet.
            </p>
            <Button onClick={() => setShowDialog(true)} className="mt-4">
              Create User
            </Button>

            <CreateDialog
              showDialog={showDialog}
              setShowDialog={setShowDialog}
              mutate={mutate}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full items-start gap-4 md:gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center w-full justify-between">
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            // value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
        <div className="ml-auto flex whitespace-nowrap min-w-[110px] items-center gap-2">
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

      <Card className="w-full relative">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage users in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable
            users={filteredUsers}
            isLoading={isLoading}
            setActionDialog={(type, user) => {
              setActionDialog({ type, open: true });
              setSelectedUser(user);
            }}
          />
        </CardContent>
      </Card>

      <AssignRoleDialog
        showDialog={actionDialog.open && actionDialog.type == "assign_role"}
        setShowDialog={(open) => setActionDialog({ type: "assign_role", open })}
        user={selectedUser}
      />
      <AssignGroupDialog
        showDialog={actionDialog.open && actionDialog.type == "assign_group"}
        setShowDialog={(open) =>
          setActionDialog({ type: "assign_group", open })
        }
        user={selectedUser}
      />
      <CreateDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        mutate={mutate}
      />
    </main>
  );
};

export default Users;

export type DialogTypes =
  | "make_manager"
  | "make_member"
  | "remove"
  | "assign_role"
  | "assign_group";
