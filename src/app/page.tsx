/* eslint-disable react/no-children-prop */
"use client";

import { AuthContext } from "@/providers/AuthProvider";
import { parseJwt } from "@/lib/parseJwt";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import Spinner from "@/components/ui/spinner";
import { Loader2 } from "lucide-react";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import CreateOrganizationDialog from "@/components/CreateOrganizationDialog";

export default function Home() {
  const { userInfo } = useContext(AuthContext);
  const { organizations } = useContext(OrganizationContext);

  const [showNewOrgDialog, setShowNewOrgDialog] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      identifier: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);

      fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/organization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")} `,
        },
        body: JSON.stringify(value),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
          } else {
            console.log(data);
          }
        })
        .finally(() => {
          setIsSubmitting(false);
          setShowNewOrgDialog(false);
        });
    },
  });

  if (!userInfo) {
    return (
      <div className="flex flex-col min-h-[80vh] items-center justify-center gap-6">
        <Spinner />
      </div>
    );
  }

  if (organizations.length > 0) {
    return (
      <div className="flex flex-col min-h-[80vh] items-center justify-center gap-6">
        <p className="text-4xl font-medium">Hi, {userInfo.name}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[80vh] items-center justify-center gap-6">
      <p className="font-medium text-xl px-4 text-center">
        It looks like you are not affiliated with any organization :/
      </p>
      <Button onClick={() => setShowNewOrgDialog(true)}>
        Create organization
      </Button>

      <CreateOrganizationDialog
        showDialog={showNewOrgDialog}
        setShowDialog={setShowNewOrgDialog}
      />
    </div>
  );
}
