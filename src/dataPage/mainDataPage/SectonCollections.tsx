import { CollectionsCard } from '@/components/ui/InfoCard';
import { cn } from '@/lib/utils';



export default function Collections({
    className = "" 
}: {
    className?: string 
} ) {

  return (
    <section className={cn("rounded-3xl py-20 max-sm:py-10", className)}>
      <div className="">
        <div className="flex items-center gap-2">
          <h2 className="title">Подборки</h2>
        </div>

        <CollectionsCard 
          heightInPx={250}
        />
      </div>
    </section>
  );
}