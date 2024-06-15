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
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  users: User[] | undefined;
  isLoading?: boolean;
};

const UserTable: React.FC<Props> = ({ users, isLoading }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
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
                <Skeleton className="w-[60px] h-[60px] rounded-full" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="w-[300px] h-[20px] mb-3" />
                <Skeleton className="w-[150px] h-[20px]" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="w-[100px] h-[20px]" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="w-[300px] h-[20px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell className="hidden sm:table-cell">
                <div className="rounded-full !outline-none overflow-hidden">
                  <Avatar className="w-full">
                    <AvatarImage src={user.picture} alt="User Image" />
                    <AvatarFallback>
                      <div className="bg-muted aspect-square flex items-center justify-center text-lg">
                        {parseName(user.name)}
                      </div>
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-lg">{user.name}</p>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.level !== "owner" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Remove Role</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
};

export default UserTable;
