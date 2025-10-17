"use client";
import Image from "next/image";

import { deleteCookie, getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

type User = {
  name: string;
};

export default function PageHeader() {
  const [user, setUser] = useState<User>();
  const router = useRouter();

  const fetchUser = async () => {
    const userCookie = await getCookie("LEGGAL::USER");
    setUser(JSON.parse(userCookie ?? "{}"));
  };

  const handleLogout = () => {
    deleteCookie("LEGGAL::TOKEN");
    deleteCookie("LEGGAL::USER");
    router.push("/auth/signin");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <header className="flex h-[80px] items-center justify-between bg-white px-[100px] py-[20px]">
      <div>
        <Image
          src="/assets/logo_leggal.svg"
          alt="logo"
          width={50}
          height={20}
          priority
        />
      </div>
  
      <div className="flex flex-row">
        <div className="flex flex-row divide-x-[1px]">
          <div className="flex flex-row items-center px-[24px]">
            <span className="mr-[10px] flex text-black">
              Olá,{" "}
              <span className="font-semibold ml-[5px]"> {user?.name}!</span>
            </span>
            <button
              onClick={handleLogout}
              className="ml-[10px] text-gray-600 hover:text-red-600 transition-colors"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
