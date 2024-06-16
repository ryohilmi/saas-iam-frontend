"use client";

import fetcher from "@/lib/fetcher";
import { parseJwt } from "@/lib/parseJwt";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { createContext, useEffect, useState } from "react";
import useSWR from "swr";

type Organization = {
  organizationId: string;
  name: string;
};

type OrganizationContextType = {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  membershipLevel: "owner" | "manager" | "member" | null;
  setSelectedOrganization: React.Dispatch<
    React.SetStateAction<Organization | null>
  >;
};

export const OrganizationContext = createContext<OrganizationContextType>({
  organizations: [],
  selectedOrganization: null,
  membershipLevel: null,
  setSelectedOrganization: () => {},
});

type Props = {
  children?: React.ReactNode;
};

const OrganizationProvider: React.FC<Props> = ({ children }) => {
  const { data, mutate } = useSWR("/organization", fetcher);
  const organizations =
    data?.map((org: any) => {
      return {
        organizationId: org.organization_id,
        name: org.name,
      };
    }) || [];

  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  const organizationId = selectedOrganization?.organizationId;
  const { data: membershipLevel } = useSWR(
    organizationId && `/organization/level?organization_id=${organizationId}`,
    fetcher
  );

  useEffect(() => {
    if (organizations.length > 0 && !selectedOrganization) {
      const newOrg = organizations.find(
        (org: any) =>
          org.organizationId === sessionStorage.getItem("selectedOrganization")
      );
      setSelectedOrganization(newOrg || organizations[0]);
    }
  }, [data]);

  useEffect(() => {
    if (selectedOrganization) {
      sessionStorage.setItem(
        "selectedOrganization",
        selectedOrganization.organizationId
      );
    }
  }, [selectedOrganization]);

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        selectedOrganization,
        membershipLevel: membershipLevel?.level || null,
        setSelectedOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationProvider;
