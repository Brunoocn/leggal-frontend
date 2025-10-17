"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Todo, TodoUrgency } from "@/types/Todo";

interface TodosTableProps {
  todos: Todo[];
}

const urgencyLabels: Record<TodoUrgency, string> = {
  [TodoUrgency.LOW]: "Baixa",
  [TodoUrgency.MEDIUM]: "Média",
  [TodoUrgency.HIGH]: "Alta",
  [TodoUrgency.URGENT]: "Urgente",
};

const urgencyColors: Record<TodoUrgency, string> = {
  [TodoUrgency.LOW]: "bg-green-100 text-green-800",
  [TodoUrgency.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [TodoUrgency.HIGH]: "bg-orange-100 text-orange-800",
  [TodoUrgency.URGENT]: "bg-red-100 text-red-800",
};

function formatDate(date: Date | null | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function TodosTable({ todos }: TodosTableProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum todo encontrado.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Urgência</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead>Atualizado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos.map((todo) => (
          <TableRow key={todo.id}>
            <TableCell className="font-medium">{todo.title}</TableCell>
            <TableCell className="max-w-md truncate">
              {todo.description}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  urgencyColors[todo.urgency]
                }`}
              >
                {urgencyLabels[todo.urgency]}
              </span>
            </TableCell>
            <TableCell>{formatDate(todo.createdAt)}</TableCell>
            <TableCell>{formatDate(todo.updatedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
