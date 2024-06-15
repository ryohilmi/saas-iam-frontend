import fetcher from "@/lib/fetcher";
import { User } from "@/types/user";
import useSWR from "swr";

const useRoles = ({
  tenantId,
  roleId,
  organizationId,
}: {
  organizationId: string | undefined | null;
  tenantId: string | undefined | null;
  roleId: string | undefined | null;
}) => {
  const url =
    tenantId && organizationId && roleId
      ? `/role/users?tenant_id=${tenantId}&role_id=${roleId}&organization_id=${organizationId}`
      : null;

  const { data: users, isLoading, mutate } = useSWR<User[]>(url, fetcher);

  return { users: users || [], mutate, isLoading };
};

export default useRoles;
