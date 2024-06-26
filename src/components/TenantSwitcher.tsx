"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import CreateOrganizationDialog from "./CreateOrganizationDialog";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { parseAsJson, parseAsString, useQueryState } from "nuqs";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TenantSwitcherProps extends PopoverTriggerProps {}

export type Tenant = {
  tenant_id: string;
  name: string;
};

export default function TenantSwitcher({ className }: TenantSwitcherProps) {
  const [open, setOpen] = React.useState(false);

  const { selectedOrganization } = React.useContext(OrganizationContext);
  const { data: tenants, isLoading } = useSWR<Tenant[]>(
    selectedOrganization &&
      `/tenants?organization_id=${selectedOrganization?.organizationId}`,
    fetcher
  );

  const [tenantId, setTenantId] = useQueryState("tenant_id", parseAsString);
  const [tenantName, setTenantName] = useQueryState(
    "tenant_name",
    parseAsString
  );

  const tenantOptions = tenants?.map((tenant) => ({
    value: tenant.tenant_id,
    label: tenant.name,
  }));

  const selectedTenant = tenantOptions?.find(
    (tenant) => tenant.value === tenantId
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[300px] justify-between", className)}
        >
          <p className="mr-2">{selectedTenant?.label || "Select tenant"}</p>
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search tenant..." />
            <CommandEmpty>No tenant found.</CommandEmpty>
            <CommandGroup>
              {tenantOptions?.map((tenant) => {
                return (
                  <CommandItem
                    key={tenant.value}
                    onSelect={() => {
                      setTenantId(tenant.value);
                      setTenantName(tenant.label);
                      setOpen(false);
                    }}
                    value={tenant.value}
                    className="text-sm"
                  >
                    {/* <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${team.value}.png`}
                      alt={team.label}
                      className="grayscale"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar> */}
                    {tenant.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        tenantId === tenant.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
