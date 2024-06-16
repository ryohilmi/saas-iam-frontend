/* eslint-disable react/no-children-prop */
"use client";

import { AuthContext } from "@/providers/AuthProvider";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import Spinner from "@/components/ui/spinner";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import CreateOrganizationDialog from "@/components/CreateOrganizationDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useRecentUsers from "@/hooks/useRecentUsers";
import { parseName } from "@/lib/parseName";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import useStatitstics from "@/hooks/useStatistics";

export default function Home() {
  const { userInfo } = useContext(AuthContext);
  const { selectedOrganization, organizations } =
    useContext(OrganizationContext);
  const organizationId = selectedOrganization?.organizationId || "";
  const { statistics } = useStatitstics({ organizationId });

  const [showNewOrgDialog, setShowNewOrgDialog] = React.useState(false);

  if (!userInfo) {
    return (
      <div className="flex flex-col min-h-[80vh] items-center justify-center gap-6">
        <Spinner />
      </div>
    );
  }

  if (organizations.length > 0) {
    return (
      <main className="flex flex-col gap-4 h-[80vh] ">
        <div className="hidden flex-col md:flex">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics?.member_count}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Managers</CardTitle>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics?.manager_count}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tenants</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics?.tenant_count}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grow grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Login Activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <LoginActivity />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recently Joined</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentMembers />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">No Organization</h3>
        <p className="text-sm text-muted-foreground">
          It seems you aren&apos;t affiliated with any organization yet.
        </p>
        <Button onClick={() => setShowNewOrgDialog(true)} className="mt-4">
          Create Organization
        </Button>

        <CreateOrganizationDialog
          showDialog={showNewOrgDialog}
          setShowDialog={setShowNewOrgDialog}
        />
      </div>
    </div>
  );
}

const LoginActivity = () => {
  const max = 15;

  const data = [
    {
      name: "10/06",
      total: Math.floor(Math.random() * max),
    },
    {
      name: "11/06",
      total: Math.floor(Math.random() * max),
    },
    {
      name: "12/06",
      total: Math.floor(Math.random() * max),
    },
    {
      name: "13/06",
      total: Math.floor(Math.random() * max),
    },
    {
      name: "14/06",
      total: Math.floor(Math.random() * max),
    },
    {
      name: "15/06",
      total: Math.floor(Math.random() * max),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const RecentMembers = () => {
  const { selectedOrganization } = useContext(OrganizationContext);
  const organizationId = selectedOrganization?.organizationId || "";
  const { users } = useRecentUsers({ organizationId });

  return (
    <div className="space-y-6 mt-4">
      {users.map((user) => (
        <div className="flex items-center" key={user.user_id}>
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.picture}
              referrerPolicy="no-referrer"
              alt="Avatar"
            />
            <AvatarFallback>{parseName(user.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="ml-auto">
            {new Date(user.joined_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};
