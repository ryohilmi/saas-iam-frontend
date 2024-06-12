import fetcher from "@/lib/fetcher";
import { User } from "@/types/user";
import useSWR from "swr";

const useUsers = ({
  organizationId,
}: {
  organizationId: string | undefined;
}) => {
  const url = `/organization/users?organization_id=${organizationId}`;

  const { data: users, mutate } = useSWR<User[]>(
    organizationId ? url : null,
    fetcher
  );

  return { users: users || [], mutate };
};

export default useUsers;
