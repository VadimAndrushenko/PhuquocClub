import Link from "next/link";
import { cn } from '@/lib/utils';
import { ArticlesCollectionCard } from "@/components/ui/InfoCard";

export default function Popular({
    className = "" 
}: {
    className?: string 
} ) {

  return (
    <section className={cn("py-20 max-sm:py-10", className)}>
      <h2 className="title">Популярные</h2>
      <ArticlesCollectionCard/>
    </section>
  );
}