"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchWrapper } from "@/utils/fetchWrapper";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { ManualTodoForm } from "@/components/forms/manualTodoForm";
import { AiTodoForm } from "@/components/forms/aiTodoForm";

export function CreateTodoDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");
  const router = useRouter();
  const { toast } = useToast();

  const handleManualSubmit = async (data: {
    title: string;
    description?: string;
    urgency: string;
  }) => {
    try {
      setIsSubmitting(true);
      await fetchWrapper("todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      toast({
        title: "Sucesso",
        description: "Todo criado com sucesso!",
        variant: "sucess",
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao criar todo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiSubmit = async (data: { userMessage: string }) => {
    try {
      setIsSubmitting(true);
      await fetchWrapper("todos/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      toast({
        title: "Sucesso",
        description: "Todo criado com IA com sucesso!",
        variant: "sucess",
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao criar todo com IA",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 h-9 px-4 text-sm">
          <Plus className="h-4 w-4" />
          Criar Todo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Todo</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="ia">IA</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <ManualTodoForm
              onSubmit={handleManualSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </TabsContent>

          <TabsContent value="ia" className="space-y-4 mt-4">
            <AiTodoForm
              onSubmit={handleAiSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
