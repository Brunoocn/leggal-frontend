"use client";
import { fetchWrapper } from "@/utils/fetchWrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { KeyboardEvent } from "react";
import Link from "next/link";


type Inputs = {
  email: string;
  password: string;
};

export default function Signin() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const request: any = await fetchWrapper("authentication/login", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });

      setCookie("LEGGAL::TOKEN", request.token);
      setCookie("LEGGAL::USER", JSON.stringify(request.user));

      router.refresh();
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Ops!",
        description: (
          <div className="text-destructive-foreground">{error?.message}</div>
        ),
      });
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.code;
    if (key === "Enter") {
      handleSubmit(onSubmit);
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white">
        <div className="m-auto w-full rounded-md bg-white p-6  lg:max-w-xl">
          <h1 className="text-center text-2xl font-medium text-black">
            Olá, seja bem vindo!
          </h1>
          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Digite seu email"
                className="mt-2 block w-full rounded-md border bg-white px-4 py-2 text-gray-500 focus:border-gray-400 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="mt-2 text-red-100">Campo Obrigatório</span>
              )}
            </div>
            <div className="mb-2">
              <input
                type="password"
                placeholder="Digite sua senha"
                className="mt-2 block w-full rounded-md border bg-white px-4 py-2 text-gray-500 focus:border-gray-400 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                {...register("password", { required: true })}
                onKeyDown={handleKeyPress}
              />
              {errors.password && (
                <span className="mt-2 text-red-100">Campo Obrigatório</span>
              )}
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                className="w-full transform rounded-sm bg-green-400 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-green-500 focus:bg-green-500 focus:outline-none"
              >
                Entrar
              </Button>
            </div>
            <div className="mt-[15px] flex justify-center">
              <p className="text-gray-500">
                Não tem uma conta?{" "}
                <Link href="/auth/signup">
                  <span className="text-green-400">Cadastra-se</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
