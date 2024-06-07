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
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { OrganizationContext } from "@/providers/OrganizationProvider";

type User = {
  user_org_id: string;
  user_id: string;
  name: string;
  picture: string;
  email: string;
  level: string;
};

const UserTable = () => {
  const { selectedOrganization } = useContext(OrganizationContext);

  const { data: users } = useSWR<User[]>(
    `${process.env.NEXT_PUBLIC_IAM_HOST}/organization/user?organization_id=${selectedOrganization?.organizationId}`,
    fetcher
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Level</TableHead>
          <TableHead className="hidden md:table-cell">Latest Login</TableHead>
          <TableHead className="hidden md:table-cell">Joined at</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users?.map((user) => (
          <TableRow key={user.user_org_id}>
            <TableCell className="hidden sm:table-cell">
              <div className="rounded-full overflow-hidden">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.picture} alt="User Image" />
                  <AvatarFallback>R</AvatarFallback>
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
              07-06-2024 10:42 AM
            </TableCell>
            <TableCell className="hidden md:table-cell">
              06-06-2024 01:21 AM
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
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>.
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
