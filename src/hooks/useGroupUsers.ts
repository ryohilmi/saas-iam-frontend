import fetcher from "@/lib/fetcher";
import { User } from "@/types/user";
import useSWR from "swr";

const useGroupUsers = ({
  tenantId,
  groupId,
  organizationId,
}: {
  organizationId: string | undefined | null;
  tenantId: string | undefined | null;
  groupId: string | undefined | null;
}) => {
  const url =
    tenantId && organizationId && groupId
      ? `/group/users?tenant_id=${tenantId}&group_id=${groupId}&organization_id=${organizationId}`
      : null;

  const { data: users, isLoading, mutate } = useSWR<User[]>(url, fetcher);

  return { users: users || [], mutate, isLoading };
};

export default useGroupUsers;
