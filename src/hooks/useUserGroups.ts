import fetcher from "@/lib/fetcher";
import { Group } from "@/types/group";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import useSWR from "swr";

const useUserGroups = ({
  organizationId,
  userOrgId,
}: {
  organizationId: string | undefined;
  userOrgId: string | undefined;
}) => {
  const url =
    organizationId &&
    userOrgId &&
    `/user/groups?organization_id=${organizationId}&user_org_id=${userOrgId}`;

  const { data, mutate, isLoading } = useSWR(url, fetcher);

  const groups: UserGroup[] = data?.groups || [];

  return { groups, mutate, isLoading };
};

export default useUserGroups;

interface UserGroup extends Group {
  tenant_name: string;
}
