import Link from "next/link";
import { cn } from '@/lib/utils';
import { PopularCards } from "@/components/ui/InfoCard";

export default function Popular({
    containerClass = "" 
}: {
    containerClass?: string 
} ) {

  return (
    <section className={cn("", containerClass)}>
      <h2 className="title">Популярные</h2>
      <PopularCards/>
    </section>
  );
}