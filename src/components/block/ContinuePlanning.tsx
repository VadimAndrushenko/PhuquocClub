import { CollectionsCard } from '@/components/ui/InfoCard';
import { cn } from '@/lib/utils';



export default function ContinuePlanning({
    className = "" 
}: {
    className?: string 
} ) {

  return (
    <section className={cn("rounded-3xl py-20 max-sm:py-10", className)}>
      <div className="">
        <div className="flex items-center gap-2">
          <h2 className="title">Продолжить планирование</h2>
        </div>
        <CollectionsCard 
            bg='bg-[linear-gradient(0deg,_rgba(0,78,74,0.9)_0%,_rgba(0,78,74,0.3)_50%,_rgba(0,0,0,0)_100%)]'
            heightInPx={280}
        />
      </div>
    </section>
  );
}