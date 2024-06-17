import fetcher from "@/lib/fetcher";
import { User } from "@/types/user";
import useSWR from "swr";

const useUserDetail = ({
  organizationId,
  userOrgId,
}: {
  organizationId: string | undefined;
  userOrgId: string | undefined;
}) => {
  const url =
    organizationId &&
    userOrgId &&
    `/user/details?organization_id=${organizationId}&user_org_id=${userOrgId}`;

  const { data, mutate, isLoading } = useSWR(
    organizationId ? url : null,
    fetcher
  );

  const user: User | null = data?.user || null;

  return { user, mutate, isLoading };
};

export default useUserDetail;
