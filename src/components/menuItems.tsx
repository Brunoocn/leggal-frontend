"use client";
import { cn } from "@/lib/utils";
import { deleteCookie } from "cookies-next";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";

export default function MenuItems() {
  const router = useRouter();
  const pathSegments = useSelectedLayoutSegments();
  const Logout = () => {
    deleteCookie("LEGGAL::TOKEN");
    deleteCookie("LEGGAL::USER");
    router.push("/auth/signin");
  };

  const menuItems = [
    {
      label: "Clientes",
      href: "/clientes",
    },
    {
      label: "Clientes Selecionados",
      href: "/clientes/clientes-selecionados",
    },
  ];

  return (
    <div className="flex gap-10">
      {menuItems.map((item) => {
        const isActive = "/" + pathSegments.join("/") === item.href;

        return (
          <span
            key={item.label}
            className={cn(
              `text-black cursor-pointer hover:text-orange-500`,
              isActive && "text-orange-500 underline"
            )}
            onClick={() => router.push(item.href)}
          >
            {item.label}
          </span>
        );
      })}

      <span
        className="text-black cursor-pointer hover:text-orange-500"
        onClick={Logout}
      >
        Sair
      </span>
    </div>
  );
}
