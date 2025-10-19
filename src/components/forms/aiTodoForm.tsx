"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const aiTodoSchema = z.object({
  userMessage: z.string().min(1, "Mensagem é obrigatória"),
});

type AiTodoInputs = z.infer<typeof aiTodoSchema>;

interface AiTodoFormProps {
  onSubmit: (data: AiTodoInputs) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function AiTodoForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: AiTodoFormProps) {
  const form = useForm<AiTodoInputs>({
    resolver: zodResolver(aiTodoSchema),
    defaultValues: {
      userMessage: "",
    },
  });

  const handleSubmit: SubmitHandler<AiTodoInputs> = async (data) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="userMessage">
          Descreva o que você precisa fazer
        </Label>
        <Textarea
          id="userMessage"
          placeholder="Ex: Preciso estudar React amanhã às 14h"
          className="min-h-32"
          {...form.register("userMessage")}
        />
        {form.formState.errors.userMessage && (
          <p className="text-sm text-destructive">
            {form.formState.errors.userMessage.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="default"
          onClick={onCancel}
          disabled={isSubmitting}
          size="sm"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} size="sm">
          {isSubmitting ? "Criando..." : "Criar com IA"}
        </Button>
      </div>
    </form>
  );
}
