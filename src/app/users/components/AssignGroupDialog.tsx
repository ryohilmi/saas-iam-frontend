/* eslint-disable react/no-children-prop */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { User } from "@/types/user";
import TenantSwitcher from "@/components/TenantSwitcher";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { parseAsString, useQueryState } from "nuqs";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import useGroups from "@/hooks/useGroups";

interface Props {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  children?: React.ReactNode;
  user: User | null;
}

const AssignGroupDialog: React.FC<Props> = ({
  showDialog,
  setShowDialog,
  children,
  user,
}) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { selectedOrganization } = React.useContext(OrganizationContext);
  const [tenantId] = useQueryState("tenant_id", parseAsString);

  const { groups } = useGroups({
    tenantId,
    organizationId: selectedOrganization?.organizationId,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm({
    defaultValues: {
      group: "",
    },
    onSubmit: async ({ value }) => {
      if (!selectedOrganization || !user || !value.group) {
        return;
      }

      setIsSubmitting(true);

      const payload = {
        organization_id: selectedOrganization.organizationId,
        user_org_id: user.user_org_id,
        group_id: value.group,
        tenant_id: tenantId,
      };

      fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/user/group`, {
        method: "POST",
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
            toast.success("Group assigned successfully");
            mutate(`/organization/users`);
          }
        })
        .finally(() => {
          setIsSubmitting(false);
          setShowDialog(false);
        });
    },
  });

  return (
    <>
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
              <DialogTitle>Assign Group</DialogTitle>
              <DialogDescription>
                Assign Group to {user?.name}
              </DialogDescription>
            </DialogHeader>

            <div>
              <div className="space-y-4 py-2 pb-4 mt-4">
                <div>
                  <Label htmlFor="tenant">Tenant</Label>
                  <TenantSwitcher id="tenant" className="w-full mt-2" />
                </div>

                <div>
                  <form.Field
                    name="group"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? "Group is required" : undefined,
                    }}
                    children={(field) => (
                      <>
                        <Label htmlFor="group">Group</Label>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(e) => field.handleChange(e)}
                        >
                          <SelectTrigger
                            id={field.name}
                            onBlur={field.handleBlur}
                            className="w-full mt-2"
                          >
                            <SelectValue placeholder="Group" />
                          </SelectTrigger>
                          <SelectContent>
                            {groups?.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  />
                </div>
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
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
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

export default AssignGroupDialog;
