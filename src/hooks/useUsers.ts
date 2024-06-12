import fetcher from "@/lib/fetcher";
import { User } from "@/types/user";
import useSWR from "swr";

const useUsers = ({ organizationId }: { organizationId: string }) => {
  const url = `${process.env.NEXT_PUBLIC_IAM_HOST}/organization/users?organization_id=${organizationId}`;

  const { data: users, mutate } = useSWR<User[]>(url, fetcher);

  return { users: users || [], mutate };
};

export default useUsers;
