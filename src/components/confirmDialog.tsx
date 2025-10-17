import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type IDialog = {
  showDialog: boolean;
  handleDialog: () => void;
  functionConfirm: () => void;
  message: string;
  title: string;
  messageCancel?: string;
  messageConfirm?: string;
};

export default function ConfirmDialog({
  showDialog,
  handleDialog,
  functionConfirm,
  message,
  title,
  messageCancel,
  messageConfirm,
}: IDialog) {
  return (
    <Dialog open={showDialog} onOpenChange={handleDialog}>
      <DialogContent>
        <DialogHeader className="w-full items-center p-[20px]">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            className="w-full bg-white text-orange-500 hover:border-gray-100 hover:bg-gray-100"
            onClick={handleDialog}
          >
            {messageCancel || 'Cancelar'}
          </Button>
          <Button
            type="button"
            className="mr-[3px] w-full bg-orange-500 text-white hover:border hover:border-gray-10 hover:bg-orange-600"
            onClick={functionConfirm}
          >
            {messageConfirm || "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
