/* eslint-disable react/no-children-prop */
"use client";

import { AuthContext } from "@/providers/AuthProvider";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import Spinner from "@/components/ui/spinner";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import CreateOrganizationDialog from "@/components/CreateOrganizationDialog";

export default function Home() {
  const { userInfo } = useContext(AuthContext);
  const { organizations } = useContext(OrganizationContext);

  const [showNewOrgDialog, setShowNewOrgDialog] = React.useState(false);

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
        <button>TES</button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">No Organization</h3>
        <p className="text-sm text-muted-foreground">
          It seems you aren&apos;t affiliated with any organization yet.
        </p>
        <Button onClick={() => setShowNewOrgDialog(true)} className="mt-4">
          Create Organization
        </Button>

        <CreateOrganizationDialog
          showDialog={showNewOrgDialog}
          setShowDialog={setShowNewOrgDialog}
        />
      </div>
    </div>
  );
}
