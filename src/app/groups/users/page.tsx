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
import { OrganizationContext } from "@/providers/OrganizationProvider";
import useUsers from "@/hooks/useUsers";
import { useDebounceValue } from "usehooks-ts";
import { AuthContext } from "@/providers/AuthProvider";
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
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import useRoleUsers from "@/hooks/useRoleUsers";

const Users = () => {
  const router = useRouter();
  const { userInfo } = useContext(AuthContext);
  const { selectedOrganization } = useContext(OrganizationContext);
  const organizationId = selectedOrganization?.organizationId || "";

  const [tenantId] = useQueryState("tenant_id", parseAsString);
  const [roleId] = useQueryState("role_id", parseAsString);
  const [role] = useQueryState("role", parseAsString);

  const [search, setSearch] = useDebounceValue("", 50);

  const { users, mutate, isLoading } = useRoleUsers({
    organizationId,
    tenantId,
    roleId,
  });
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
      <main className="flex flex-col w-full min-h-[80vh] gap-4 md:gap-8">
        <div className="flex justify-between items-center w-full">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/" passHref>
                  <BreadcrumbLink>Home</BreadcrumbLink>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <Link href={`/roles?tenant_id=${tenantId}`}>
                <BreadcrumbLink>Roles</BreadcrumbLink>
              </Link>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

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
        </div>

        <div className="w-full flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">No User</h3>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full items-start gap-4 md:gap-8">
      <div className="flex justify-between items-center w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/" passHref>
                <BreadcrumbLink>Home</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <Link href={`/roles?tenant_id=${tenantId}`}>
              <BreadcrumbLink>Roles</BreadcrumbLink>
            </Link>
            <BreadcrumbSeparator />
            <BreadcrumbLink className="cursor-none">{role}</BreadcrumbLink>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
      </div>

      <Card className="w-full relative">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Users with <b>{role}</b> role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable users={filteredUsers} isLoading={isLoading} />
        </CardContent>
      </Card>
    </main>
  );
};

export default Users;
