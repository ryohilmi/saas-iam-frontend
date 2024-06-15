/* eslint-disable react/no-children-prop */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

interface Props {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  action: () => void;
  description: string;
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<Props> = ({
  showDialog,
  setShowDialog,
  description,
  action,
  isLoading,
}) => {
  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {description}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={action} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  );
};

export default ConfirmationDialog;
