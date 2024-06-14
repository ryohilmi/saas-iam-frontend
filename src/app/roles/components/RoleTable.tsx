"use client";

import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import fetcher from "@/lib/fetcher";
import { User } from "@/types/user";
import { parseName } from "@/lib/parseName";
import { Role } from "@/types/role";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  roles: Role[] | undefined;
  isLoading?: boolean;
};

const RoleTable: React.FC<Props> = ({ roles, isLoading }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Description</TableHead>
          <TableHead>Permissions</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      {isLoading ? (
        <TableBody>
          {[1, 2, 3].map((index) => (
            <TableRow key={`skeleton-${index}`}>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="w-[100px] h-[20px]" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="w-[300px] h-[20px] mb-2" />
                <Skeleton className="w-[300px] h-[20px]" />
              </TableCell>
              <TableCell className="text-center">
                <div className="flex gap-3">
                  <Skeleton className="w-[80px] h-[20px]" />
                  <Skeleton className="w-[80px] h-[20px]" />
                  <Skeleton className="w-[80px] h-[20px]" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <TableBody>
          {roles?.map((role) => (
            <TableRow key={role.id}>
              <TableCell>
                <p className="text-lg font-medium">{role.name}</p>
              </TableCell>
              <TableCell>
                <p className="font-light">{role.description}</p>
              </TableCell>
              <TableCell>
                {role.permissions.map((permission) => (
                  <Badge key={permission} variant="outline" className="mr-2">
                    {permission}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>User list</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
};

export default RoleTable;
