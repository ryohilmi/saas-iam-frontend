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

  useEffect(() => {
    if (organizations.length > 0) {
      setSelectedOrganization(organizations[0]);
    }
  }, [data]);

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        selectedOrganization,
        setSelectedOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationProvider;
