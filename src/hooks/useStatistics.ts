import fetcher from "@/lib/fetcher";
import useSWR from "swr";

type Statistics = {
  member_count: number;
  manager_count: number;
  tenant_count: number;
};

const useStatitstics = ({
  organizationId,
}: {
  organizationId: string | undefined;
}) => {
  const url = `/organization/statistics?organization_id=${organizationId}`;

  const {
    data: statistics,
    mutate,
    isLoading,
  } = useSWR<{ data: Statistics }>(organizationId ? url : null, fetcher);

  return { statistics: statistics?.data || null, mutate, isLoading };
};

export default useStatitstics;
