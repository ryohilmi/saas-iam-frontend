"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import CreateDialog from "@/app/users/components/CreateDialog";
import CreateOrganizationDialog from "./CreateOrganizationDialog";
import { useEffect } from "react";
import { useSWRConfig } from "swr";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface OrganizationSwitcherProps extends PopoverTriggerProps {}

export default function OrganizationSwitcher({
  className,
}: OrganizationSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewOrgDialog, setShowNewOrgDialog] = React.useState(false);

  const { organizations, selectedOrganization, setSelectedOrganization } =
    React.useContext(OrganizationContext);

  const organizationOptions = organizations.map((org) => ({
    value: org.organizationId,
    label: org.name,
  }));

  return (
    <CreateOrganizationDialog
      showDialog={showNewOrgDialog}
      setShowDialog={setShowNewOrgDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-[300px] justify-between", className)}
          >
            <p className="mr-2">
              {selectedOrganization?.name || "Select organization"}
            </p>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search organization..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup>
                {organizationOptions?.map((org) => (
                  <CommandItem
                    key={org.value}
                    onSelect={() => {
                      setSelectedOrganization({
                        name: org.label,
                        organizationId: org.value,
                      });
                      setOpen(false);
                    }}
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
                    {org.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedOrganization?.organizationId == org.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewOrgDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Organization
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </CreateOrganizationDialog>
  );
}
