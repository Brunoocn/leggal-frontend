
import PageHeader from "@/components/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leggal - Manager",
  description: "Leggal Manager",
};

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader />
      <main className="mx-0 sm:mx-4 md:mx-8 lg:mx-16 xl:mx-[100px] mt-[24px]">{children}</main>
    </>
  );
}
