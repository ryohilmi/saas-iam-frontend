"use client";

import { parseJwt } from "@/lib/parseJwt";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { createContext, useEffect, useState } from "react";

type Organization = {
  organizationId: string;
  name: string;
};

type OrganizationContextType = {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  setSelectedOrganization: React.Dispatch<
    React.SetStateAction<Organization | null>
  >;
};

export const OrganizationContext = createContext<OrganizationContextType>({
  organizations: [],
  selectedOrganization: null,
  setSelectedOrganization: () => {},
});

type Props = {
  children?: React.ReactNode;
};

const OrganizationProvider: React.FC<Props> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/organization`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")} `,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const newOrganizations: Organization[] = data.map((org: any) => ({
          name: org.name,
          organizationId: org.organization_id,
        }));
        setOrganizations(newOrganizations);

        if (newOrganizations.length > 0) {
          setSelectedOrganization(newOrganizations[0]);
        }
      });
  }, []);

  return (
    <OrganizationContext.Provider
      value={{ organizations, selectedOrganization, setSelectedOrganization }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationProvider;
