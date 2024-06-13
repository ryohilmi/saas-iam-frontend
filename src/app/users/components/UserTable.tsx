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

type Props = {
  users: User[] | undefined;
};

const UserTable: React.FC<Props> = ({ users }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Level</TableHead>
          <TableHead className="hidden md:table-cell">Joined at</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

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
              <p className="font-light">{user.email}</p>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{user.level}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {new Date(user.joined_at).toLocaleDateString()}
            </TableCell>
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
                    {user.level == "member" ? (
                      <DropdownMenuItem>Make Manager</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>Make Member</DropdownMenuItem>
                    )}
                    <DropdownMenuItem>Remove</DropdownMenuItem>.
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
