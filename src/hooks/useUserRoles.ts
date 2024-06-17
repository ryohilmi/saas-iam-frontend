import fetcher from "@/lib/fetcher";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import useSWR from "swr";

const useUserRoles = ({
  organizationId,
  userOrgId,
}: {
  organizationId: string | undefined;
  userOrgId: string | undefined;
}) => {
  const url =
    organizationId &&
    userOrgId &&
    `/user/roles?organization_id=${organizationId}&user_org_id=${userOrgId}`;

  const { data, mutate, isLoading } = useSWR(url, fetcher);

  const roles: UserRole[] = data?.roles || [];

  return { roles, mutate, isLoading };
};

export default useUserRoles;

interface UserRole extends Role {
  tenant_name: string;
}
