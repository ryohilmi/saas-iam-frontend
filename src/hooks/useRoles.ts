import fetcher from "@/lib/fetcher";
import { Role } from "@/types/role";
import { useEffect } from "react";
import useSWR from "swr";

const useRoles = ({
  tenantId,
  organizationId,
}: {
  organizationId: string | undefined | null;
  tenantId: string | undefined | null;
}) => {
  const url =
    tenantId && organizationId
      ? `/tenant/roles?tenant_id=${tenantId}&organization_id=${organizationId}`
      : null;

  const { data, isLoading, mutate } = useSWR<Role[]>(url, fetcher);
  const roles = Array.isArray(data) ? data : [];

  return { roles, mutate, isLoading };
};

export default useRoles;
