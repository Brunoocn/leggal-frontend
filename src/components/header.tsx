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
    <header className="flex h-[70px] sm:h-[80px] items-center justify-between bg-white px-3 sm:px-8 md:px-16 lg:px-[100px] py-3 sm:py-[20px]">
      <div className="flex-shrink-0">
        <Image
          src="/assets/logo_leggal.svg"
          alt="logo"
          width={40}
          height={16}
          priority
          className="sm:w-[50px] sm:h-[20px]"
        />
      </div>

      <div className="flex flex-row">
        <div className="flex flex-row">
          <div className="flex flex-row items-center px-0 sm:px-4 md:px-[24px]">
            <span className="mr-2 sm:mr-[10px] flex text-black text-xs sm:text-sm md:text-base">
              <span className="hidden sm:inline">Olá,{" "}</span>
              <span className="font-semibold ml-0 sm:ml-[5px] truncate max-w-[120px] sm:max-w-none">{user?.name}!</span>
            </span>
            <button
              onClick={handleLogout}
              className="ml-2 sm:ml-[10px] text-gray-600 hover:text-red-600 transition-colors flex-shrink-0"
              title="Sair"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
