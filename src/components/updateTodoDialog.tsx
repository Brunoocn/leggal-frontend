"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchWrapper } from "@/utils/fetchWrapper";
import { useToast } from "@/components/ui/use-toast";
import { ManualTodoForm } from "@/components/forms/manualTodoForm";
import { Todo } from "@/types/Todo";

interface UpdateTodoDialogProps {
  todoId: string;
  trigger: React.ReactNode;
}

export function UpdateTodoDialog({ todoId, trigger }: UpdateTodoDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [todoData, setTodoData] = useState<Todo | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (open && !todoData) {
      fetchTodoData();
    }
  }, [open]);

  const fetchTodoData = async () => {
    try {
      setIsLoading(true);
      const data: Todo = await fetchWrapper(`todos/${todoId}`, {
        method: "GET",
      });
      setTodoData(data);
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao carregar dados do todo",
        variant: "destructive",
      });
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: {
    title: string;
    description?: string;
    urgency: string;
  }) => {
    try {
      setIsSubmitting(true);
      await fetchWrapper(`todos/${todoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      toast({
        title: "Sucesso",
        description: "Todo atualizado com sucesso!",
        variant: "sucess",
      });

      setOpen(false);
      setTodoData(null);
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao atualizar todo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTodoData(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Todo</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : todoData ? (
          <ManualTodoForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            defaultValues={{
              title: todoData.title,
              description: todoData.description || "",
              urgency: todoData.urgency,
            }}
            submitLabel="Atualizar Todo"
            submittingLabel="Atualizando..."
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
