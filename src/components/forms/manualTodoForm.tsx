"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TodoUrgency } from "@/types/Todo";

const manualTodoSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  urgency: z.enum([
    TodoUrgency.LOW,
    TodoUrgency.MEDIUM,
    TodoUrgency.HIGH,
    TodoUrgency.URGENT,
  ]),
});

type ManualTodoInputs = z.infer<typeof manualTodoSchema>;

interface ManualTodoFormProps {
  onSubmit: (data: ManualTodoInputs) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  defaultValues?: Partial<ManualTodoInputs>;
  submitLabel?: string;
  submittingLabel?: string;
}

export function ManualTodoForm({
  onSubmit,
  onCancel,
  isSubmitting,
  defaultValues,
  submitLabel = "Criar Todo",
  submittingLabel = "Criando...",
}: ManualTodoFormProps) {
  const form = useForm<ManualTodoInputs>({
    resolver: zodResolver(manualTodoSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      urgency: TodoUrgency.MEDIUM,
    },
  });

  const handleSubmit: SubmitHandler<ManualTodoInputs> = async (data) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <input
          id="title"
          type="text"
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Digite o título do todo"
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          placeholder="Digite a descrição do todo"
          {...form.register("description")}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="urgency">Urgência</Label>
        <Select
          value={form.watch("urgency")}
          onValueChange={(value) =>
            form.setValue("urgency", value as TodoUrgency)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a urgência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TodoUrgency.LOW}>Baixa</SelectItem>
            <SelectItem value={TodoUrgency.MEDIUM}>Média</SelectItem>
            <SelectItem value={TodoUrgency.HIGH}>Alta</SelectItem>
            <SelectItem value={TodoUrgency.URGENT}>Urgente</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.urgency && (
          <p className="text-sm text-destructive">
            {form.formState.errors.urgency.message}
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
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
