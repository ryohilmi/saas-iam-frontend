import fetcher from "@/lib/fetcher";
import { Group } from "@/types/group";
import useSWR from "swr";

const useGroups = ({
  tenantId,
  organizationId,
}: {
  organizationId: string | undefined | null;
  tenantId: string | undefined | null;
}) => {
  const url =
    tenantId && organizationId
      ? `/tenant/groups?tenant_id=${tenantId}&organization_id=${organizationId}`
      : null;

  const { data, isLoading, mutate } = useSWR<Group[]>(url, fetcher);
  const groups = Array.isArray(data) ? data : [];

  return { groups, mutate, isLoading };
};

export default useGroups;
