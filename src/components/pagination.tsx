"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";

export interface PaginationProps {
  totalCount: number;
}

export function Pagination({ totalCount }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());

    return `${pathname}?${params.toString()}`;
  };

  const allPages = Math.ceil(totalCount / 10);

  return (
    <div className="mt-4 sm:mt-6 flex items-center justify-center px-2">
      <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <Link href={createPageURL(1)}>
            <Button className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center p-0 border border-neutral-700 text-white hover:bg-neutral-700 hover:text-neutral-300">
              <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sr-only">Primeira página</span>
            </Button>
          </Link>

          <Link
            href={createPageURL(currentPage - 1 <= 0 ? 1 : currentPage - 1)}
          >
            <Button className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center p-0 border border-neutral-700 text-white hover:bg-neutral-700 hover:text-neutral-300">
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sr-only">Próxima página</span>
            </Button>
          </Link>

          <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[60px] sm:min-w-[70px] text-center">
            {currentPage} / {allPages}
          </span>

          <Link
            href={createPageURL(
              currentPage + 1 >= allPages ? allPages : currentPage + 1
            )}
          >
            <Button className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center p-0 border border-neutral-700 text-white hover:bg-neutral-700 hover:text-neutral-300">
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
          </Link>

          <Link href={createPageURL(allPages)}>
            <Button className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center p-0 border border-neutral-700 text-white hover:bg-neutral-700 hover:text-neutral-300">
              <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sr-only">Última página</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
