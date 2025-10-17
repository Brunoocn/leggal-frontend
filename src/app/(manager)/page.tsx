"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/todos");
  }, []);

  return (
    <div>
      <p className="text-[24px] font-semibold text-gray-500">Inicio</p>
    </div>
  );
}
