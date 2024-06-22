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
import useSWR, { useSWRConfig } from "swr";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import fetcher from "@/lib/fetcher";
import { User } from "@/types/user";
import { parseName } from "@/lib/parseName";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { parseAsString, useQueryState } from "nuqs";
import { Toaster } from "@/components/ui/sonner";
import ConfirmationDialog from "@/components/ConfirmationDialog";

type Props = {
  users: User[] | undefined;
  isLoading?: boolean;
};

const UserTable: React.FC<Props> = ({ users, isLoading }) => {
  const { mutate } = useSWRConfig();
  const { selectedOrganization, membershipLevel } =
    useContext(OrganizationContext);
  const organizationId = selectedOrganization?.organizationId || "";

  const [tenantId] = useQueryState("tenant_id", parseAsString);
  const [groupId] = useQueryState("group_id", parseAsString);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const functionOne = async (userOrgId: string) => {
    console.log("functionOne");

    if (!organizationId || !groupId || !tenantId || !userOrgId) return;

    setIsSubmitting(true);

    const payload = {
      organization_id: organizationId,
      user_org_id: userOrgId,
      group_id: groupId,
      tenant_id: tenantId,
    };

    await fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/user/group`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")} `,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.error(data);
          toast.error(data.message);
        } else {
          console.log(data);
          toast.success("Group removed successfully");
          mutate(
            `/group/users?tenant_id=${tenantId}&group_id=${groupId}&organization_id=${organizationId}`
          );
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        setShowDialog(false);
      });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Image</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            {membershipLevel !== "member" && (
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
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
                {membershipLevel !== "member" && (
                  <TableCell>
                    {user.level !== "owner" && (
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
                          <DropdownMenuItem
                            onClick={() => {
                              setShowDialog(true);
                              setSelectedUser(user);
                            }}
                          >
                            Remove Group
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      <ConfirmationDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        description={`Are you sure you want to remove the group from ${selectedUser?.name}?`}
        action={() => {
          functionOne(selectedUser?.user_org_id || "");
        }}
        isLoading={isSubmitting}
      />
      <Toaster />
    </>
  );
};

export default UserTable;
