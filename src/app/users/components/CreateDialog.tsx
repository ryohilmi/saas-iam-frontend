/* eslint-disable react/no-children-prop */
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldApi, useForm } from "@tanstack/react-form";
import { validateEmail, validatePassword } from "@/lib/validators";
import { useContext } from "react";
import { OrganizationContext } from "@/providers/OrganizationProvider";
import { KeyedMutator } from "swr";
import type { User } from "@/types/user";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

type Props = {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  mutate: KeyedMutator<User[]>;
};

const CreateDialog: React.FC<Props> = ({
  showDialog,
  setShowDialog,
  mutate,
}) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>&nbsp;</DialogTitle>
          {/* <DialogDescription>
              Add existing user to your organization or create new one.
            </DialogDescription> */}
        </DialogHeader>

        <Tabs defaultValue="add" className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add user</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
          </TabsList>

          <AddUserTab
            setShowDialog={setShowDialog}
            submitCallback={() => {
              mutate();
              setShowDialog(false);
              toast("User has been added");
            }}
          />

          <CreateUserTab
            setShowDialog={setShowDialog}
            submitCallback={() => {
              mutate();
              setShowDialog(false);
              toast("User has been created");
            }}
          />
        </Tabs>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
};

type FormTabProps = {
  setShowDialog: (show: boolean) => void;
  submitCallback?: () => void;
};

const AddUserTab: React.FC<FormTabProps> = ({
  setShowDialog,
  submitCallback,
}) => {
  const { selectedOrganization } = useContext(OrganizationContext);

  const addForm = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value, selectedOrganization);

      if (!selectedOrganization) return;

      console.log(value, selectedOrganization);

      await fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/organization/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")} `,
        },
        body: JSON.stringify({
          email: value.email,
          organization_id: selectedOrganization.organizationId,
        }),
      });

      submitCallback && submitCallback();
      console.log("User added");
    },
  });

  return (
    <TabsContent value="add">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addForm.handleSubmit();
        }}
      >
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <addForm.Field
                name="email"
                validators={{
                  onChange: ({ value }) => validateEmail(value),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: async ({ value }) => {
                    const doesUserExist = await checkUserExists(value);

                    return (
                      !doesUserExist &&
                      "User does not exist. Please create the user instead."
                    );
                  },
                }}
                children={(field) => {
                  return (
                    <>
                      <Label>User email</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="user@email.example"
                      />
                      <FieldInfo field={field} />
                    </>
                  );
                }}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <addForm.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add
              </Button>
            )}
          />
        </DialogFooter>
      </form>
    </TabsContent>
  );
};

const CreateUserTab: React.FC<FormTabProps> = ({
  setShowDialog,
  submitCallback,
}) => {
  const { selectedOrganization } = useContext(OrganizationContext);

  const createForm = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      repeatPassword: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value, selectedOrganization);

      if (!selectedOrganization) return;

      console.log(value, selectedOrganization);

      await fetch(
        `${process.env.NEXT_PUBLIC_IAM_HOST}/organization/create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
          body: JSON.stringify({
            email: value.email,
            name: value.name,
            password: value.password,
            organization_id: selectedOrganization.organizationId,
          }),
        }
      );

      submitCallback && submitCallback();
    },
  });

  return (
    <TabsContent value="create">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          createForm.handleSubmit();
        }}
      >
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-1">
            <createForm.Field
              name="email"
              validators={{
                onChange: ({ value }) => validateEmail(value),
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async ({ value }) => {
                  const doesUserExist = await checkUserExists(value);

                  return (
                    doesUserExist &&
                    "User already exists. Please add the user instead."
                  );
                },
              }}
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <Label>User email</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="user@email.example"
                    />
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>

          <div className="space-y-1">
            <createForm.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "Name is required";
                  }

                  if (value.length < 3) {
                    return "Name must be at least 3 characters";
                  }
                },
              }}
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <Label>Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="User One"
                    />
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>

          <div className="space-y-1">
            <createForm.Field
              name="password"
              validators={{
                onChange: ({ value }) => validatePassword(value),
              }}
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <Label>Password</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="password"
                      placeholder="******"
                    />
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>

          <div className="space-y-1">
            <createForm.Field
              name="repeatPassword"
              validators={{
                onChange: ({ value }) => {
                  if (value !== createForm.getFieldValue("password")) {
                    return "Passwords do not match";
                  }
                },
              }}
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <Label>Password</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="password"
                      placeholder="******"
                    />
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <createForm.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            )}
          />
        </DialogFooter>
      </form>
    </TabsContent>
  );
};

const checkUserExists = async (email: string) => {
  let doesUserExist: boolean = false;

  await fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}/user?email=${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")} `,
    },
  }).then((res) => {
    if (res.ok) {
      doesUserExist = true;
    } else {
      doesUserExist = false;
    }
  });

  return doesUserExist;
};

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <div className="text-xs space-y-2 h-2">
      {field.state.meta.touchedErrors ? (
        <em className="text-red-700">{field.state.meta.touchedErrors}</em>
      ) : null}
    </div>
  );
}

export default CreateDialog;
