/* eslint-disable react/no-children-prop */

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
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

interface Props {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  children?: React.ReactNode;
}

const CreateOrganizationDialog: React.FC<Props> = ({
  showDialog,
  setShowDialog,
  children,
}) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
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
            mutate(`/organization`);
          }
        })
        .finally(() => {
          setIsSubmitting(false);
          setShowDialog(false);
        });
    },
  });

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      {children}

      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Create organization to manage your team and projects.
            </DialogDescription>
          </DialogHeader>

          <div>
            <div className="space-y-4 py-2 pb-4">
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value ? "Organization name is required" : undefined,
                }}
                children={(field) => {
                  return (
                    <div className="space-y-2">
                      <Label htmlFor="name">Organization name</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="My Org."
                      />
                      <FieldInfo field={field} />
                    </div>
                  );
                }}
              />

              <form.Field
                name="identifier"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "Organization identifier is required"
                      : !/^[a-z_]+$/.test(value)
                      ? "Organization identifier must be in snake_case"
                      : undefined,
                }}
                children={(field) => {
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Organization identifier
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="my_org"
                      />
                      <FieldInfo field={field} />
                    </div>
                  );
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <div className="text-xs space-y-2 h-2">
      {field.state.meta.touchedErrors ? (
        <em className="text-red-700">{field.state.meta.touchedErrors}</em>
      ) : null}
    </div>
  );
}

export default CreateOrganizationDialog;
