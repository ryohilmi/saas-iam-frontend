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
import { DialogTypes } from "../page";
import { AuthContext } from "@/providers/AuthProvider";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";

type Props = {
  users: User[] | undefined;
  isLoading?: boolean;
  setActionDialog: (type: DialogTypes, user: User) => void;
};

const UserTable: React.FC<Props> = ({ users, isLoading, setActionDialog }) => {
  const { mutate } = useSWRConfig();
  const { selectedOrganization, membershipLevel } =
    useContext(OrganizationContext);
  const organizationId = selectedOrganization?.organizationId || "";

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"promote" | "demote">("promote");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const functionOne = async (userOrgId: string) => {
    console.log("functionOne");

    if (!organizationId || !userOrgId) return;

    setIsSubmitting(true);

    const payload = {
      organization_id: organizationId,
      user_org_id: userOrgId,
    };

    await fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/user/promote`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")} `,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data);
          toast.error(data.error);
        } else {
          console.log(data);
          toast.success("User promoted");
          mutate(`/organization/users?organization_id=${organizationId}`);
          mutate(`/organization/statistics?organization_id=${organizationId}`);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        setShowDialog(false);
      });
  };

  const demoteUser = async (userOrgId: string) => {
    if (!organizationId || !userOrgId) return;

    setIsSubmitting(true);

    const payload = {
      organization_id: organizationId,
      user_org_id: userOrgId,
    };

    await fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/user/demote`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")} `,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data);
          toast.error(data.error);
        } else {
          console.log(data);
          toast.success("User demoted");
          mutate(`/organization/users?organization_id=${organizationId}`);
          mutate(`/organization/statistics?organization_id=${organizationId}`);
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
            <TableHead>Level</TableHead>
            <TableHead className="hidden md:table-cell">Joined at</TableHead>
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
                  <Link href={`/users/detail?user_org_id=${user.user_org_id}`}>
                    <p className="text-lg text-blue-950 hover:font-medium">
                      {user.name}
                    </p>
                  </Link>
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
                          onClick={() => setActionDialog("assign_role", user)}
                        >
                          Assign Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setActionDialog("assign_group", user)}
                        >
                          Assign Group
                        </DropdownMenuItem>

                        {membershipLevel === "owner" &&
                          user.level == "member" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setShowDialog(true);
                                setDialogType("promote");
                                setSelectedUser(user);
                              }}
                            >
                              Make Manager
                            </DropdownMenuItem>
                          )}
                        {membershipLevel === "owner" &&
                          user.level == "manager" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setShowDialog(true);
                                setDialogType("demote");
                                setSelectedUser(user);
                              }}
                            >
                              Make Member
                            </DropdownMenuItem>
                          )}
                        <DropdownMenuItem>Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      <ConfirmationDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        description={`Are you sure you want to make ${selectedUser?.name} ${
          dialogType === "promote" ? "manager" : "member"
        }?`}
        action={() => {
          dialogType === "promote"
            ? functionOne(selectedUser?.user_org_id || "")
            : demoteUser(selectedUser?.user_org_id || "");
        }}
        isLoading={isSubmitting}
      />

      <Toaster />
    </>
  );
};

export default UserTable;
