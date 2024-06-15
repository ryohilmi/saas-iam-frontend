"use client";

import { Search } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useContext, useEffect } from "react";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { useDebounceValue } from "usehooks-ts";
import TenantSwitcher, { Tenant } from "@/components/TenantSwitcher";
import RoleTable from "./components/RoleTable";
import { AuthContext } from "@/providers/AuthProvider";
import { parseAsJson, parseAsString, useQueryState } from "nuqs";
import useRoles from "@/hooks/useRoles";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const Users = () => {
  const { userInfo } = useContext(AuthContext);
  const { selectedOrganization } = useContext(OrganizationContext);
  const organizationId = selectedOrganization?.organizationId || "";

  const [tenantId, setTenantId] = useQueryState("tenant_id", parseAsString);
  const [tenantName, setTenantName] = useQueryState(
    "tenant_name",
    parseAsString
  );
  const { roles, isLoading } = useRoles({
    organizationId,
    tenantId: tenantId || undefined,
  });

  const [search, setSearch] = useDebounceValue("", 50);

  const filteredRoles = roles?.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!tenantId) {
    return (
      <main className="flex flex-col w-full items-start gap-4 md:gap-8 min-h-[80vh]">
        <Header setSearch={setSearch} />

        <div className="flex flex-1 w-full items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">No Tenant</h3>
            <p className="text-sm text-muted-foreground">
              You have not selected any tenant yet.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full items-start gap-4 md:gap-8">
      <Header setSearch={setSearch} />

      <Card className="w-full relative">
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>
            View Roles In{" "}
            <span className="font-semibold inline">{tenantName}</span>{" "}
            Application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoleTable roles={filteredRoles} isLoading={isLoading} />
        </CardContent>
      </Card>
    </main>
  );
};

type HeaderProps = {
  setSearch: (value: string) => void;
};

const Header: React.FC<HeaderProps> = ({ setSearch }) => {
  return (
    <>
      <Breadcrumb className="-mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Roles</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center w-full justify-between">
        <div className="flex whitespace-nowrap min-w-[110px] items-center gap-2">
          <TenantSwitcher />
        </div>

        <div className="relative flex-1 md:grow-0 ml-auto">
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
    </>
  );
};

export default Users;
