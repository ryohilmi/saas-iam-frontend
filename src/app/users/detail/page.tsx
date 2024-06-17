"use client";

import { MoreHorizontal, PlusCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { parseName } from "@/lib/parseName";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { parseAsString, useQueryState } from "nuqs";
import useUserDetail from "@/hooks/useUserDetail";
import { cn } from "@/lib/utils";
import useUserRoles from "@/hooks/useUserRoles";
import useUserGroups from "@/hooks/useUserGroups";

const Users = () => {
  const { userInfo } = useContext(AuthContext);
  const { selectedOrganization } = useContext(OrganizationContext);
  const organizationId = selectedOrganization?.organizationId || "";
  const [userOrgId] = useQueryState("user_org_id", parseAsString);

  const [showDialog, setShowDialog] = React.useState(false);
  const [actionDialog, setActionDialog] = React.useState<{
    open: boolean;
    type: DialogTypes;
  }>({ open: false, type: "assign_role" });

  const { user } = useUserDetail({
    organizationId,
    userOrgId: userOrgId || "",
  });

  const { roles } = useUserRoles({
    organizationId,
    userOrgId: userOrgId || "",
  });

  const { groups } = useUserGroups({
    organizationId,
    userOrgId: userOrgId || "",
  });

  const calculatedRoles = roles?.map((role) => ({
    ...role,
    tenant_length: roles.reduce(
      (acc, curr) => (curr.tenant_name === role.tenant_name ? acc + 1 : acc),
      0
    ),
  }));

  const calculatedGroups = groups?.map((group) => ({
    ...group,
    tenant_length: groups.reduce(
      (acc, curr) => (curr.tenant_name === group.tenant_name ? acc + 1 : acc),
      0
    ),
  }));

  if (!selectedOrganization) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            User Not Found :(
          </h3>
          <p className="text-sm text-muted-foreground">
            The user you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full items-start gap-4 md:gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/users" passHref>
              <BreadcrumbLink>Users</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full relative gap-8">
        <Card className="grid grid-cols-3 h-[75vh] overflow-y-clip">
          <div className="border-r">
            <div className="flex items-center px-8 h-[60px] border-b">
              <p className="font-semibold text-xl">User Detail</p>
            </div>

            {user && (
              <div className="h-[85%] flex flex-col gap-6 justify-between px-8 py-6">
                <div className="flex gap-8">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.picture} alt="User Image" />
                    <AvatarFallback>
                      <div className="bg-muted aspect-square flex items-center justify-center text-lg">
                        {parseName(user.name)}
                      </div>
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col justify-between py-1">
                    <p className="text-2xl font-medium text-primary">
                      {user.name}
                    </p>
                    <p className="font-light text-secondary-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Level</p>
                  <div className="space-x-2 text-lg">
                    <p className="font-semibold">
                      {user.level.charAt(0).toUpperCase() + user.level.slice(1)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Login Identities</p>
                  <div className="space-x-2 text-lg">
                    {user.identities.map((identity) => (
                      <Badge variant="outline" key={identity}>
                        {renderIdentity(identity)}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* <div className="space-y-1 mb-auto">
                <p className="text-muted-foreground">Latest Login</p>
                <div className="space-x-2">16 June 2021, 10:00 AM</div>
              </div> */}

                <div
                  className={cn(
                    user.level === "owner" && "invisible",
                    "flex items-center gap-3 !mt-auto"
                  )}
                >
                  <Button variant="outline" className="grow">
                    Remove
                  </Button>
                  {user.level === "manager" ? (
                    <Button className="ml-auto grow">Make Member</Button>
                  ) : (
                    <Button className="ml-auto grow">Make Manager</Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <Tabs
            defaultValue="roles"
            className="col-span-2 h-full overflow-y-clip"
          >
            <div className="flex h-[60px] justify-between px-8 py-3 border-b  items-center">
              <p className="font-semibold text-xl">Roles and Group</p>

              <TabsList className="flex w-fit !text-lg">
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="roles"
              className="px-4 py-3 overflow-y-scroll h-full"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                {calculatedRoles && (
                  <TableBody className="overflow-y-scroll">
                    {calculatedRoles.map((role, i) => {
                      let firstTenant =
                        i === 0 ||
                        roles[i - 1].tenant_name !== role.tenant_name;

                      return (
                        <TableRow key={role.id}>
                          {firstTenant && (
                            <TableCell
                              className="font-medium"
                              rowSpan={role.tenant_length}
                            >
                              {role.tenant_name}
                            </TableCell>
                          )}
                          <TableCell>{role.name}</TableCell>
                          <TableCell>
                            {role.permissions.map((perm) => (
                              <Badge
                                variant="outline"
                                className="mr-2"
                                key={perm}
                              >
                                {perm}
                              </Badge>
                            ))}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Remove</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                )}
              </Table>
            </TabsContent>

            <TabsContent
              value="groups"
              className="px-4 py-3 overflow-y-scroll h-full"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                {calculatedGroups && (
                  <TableBody className="overflow-y-scroll">
                    {calculatedGroups.map((group, i) => {
                      let firstTenant =
                        i === 0 ||
                        calculatedGroups[i - 1].tenant_name !==
                          group.tenant_name;

                      return (
                        <TableRow key={group.id}>
                          {firstTenant && (
                            <TableCell
                              className="font-medium"
                              rowSpan={group.tenant_length}
                            >
                              {group.tenant_name}
                            </TableCell>
                          )}
                          <TableCell>{group.name}</TableCell>
                          <TableCell>
                            {group.roles.map((role) => (
                              <Badge
                                variant="outline"
                                className="mr-2"
                                key={role}
                              >
                                {role}
                              </Badge>
                            ))}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Remove</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                )}
              </Table>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
};

const renderIdentity = (identity: string) => {
  switch (true) {
    case identity.includes("google"):
      return "Google";
    case identity.includes("github"):
      return "GitHub";
    case identity.includes("auth0"):
      return "Email";
    default:
      return "Unknown";
  }
};

export default Users;

export type DialogTypes =
  | "make_manager"
  | "make_member"
  | "remove"
  | "assign_role"
  | "assign_group";
