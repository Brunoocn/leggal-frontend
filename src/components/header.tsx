"use client";
import Image from "next/image";

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import MenuItems from "./menuItems";

type User = {
  name: string;
};

export default function PageHeader() {
  const [user, setUser] = useState<User>();

  const fetchUser = async () => {
    const userCookie = await getCookie("LEGGAL::USER");
    setUser(JSON.parse(userCookie ?? "{}"));
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
      <MenuItems />
      <div className="flex flex-row">
        <div className="flex flex-row divide-x-[1px]">
          <div className="flex flex-row items-center px-[24px]">
            <span className="mr-[10px] flex text-black">
              Olá,{" "}
              <span className="font-semibold ml-[5px]"> {user?.name}!</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
