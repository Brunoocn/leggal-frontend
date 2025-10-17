import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="my-[20px] h-[50px] w-full" />

      <Skeleton className="my-[20px] h-[50px] w-full" />

      <Skeleton className="my-[20px] h-[50px] w-full" />

      <Skeleton className="my-[20px] h-[50px] w-full" />
    </div>
  );
}
