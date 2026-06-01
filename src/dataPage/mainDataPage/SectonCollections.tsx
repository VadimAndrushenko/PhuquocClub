import { CollectionsCard } from '@/components/ui/InfoCard';
import { cn } from '@/lib/utils';



export default function Collections({
    containerClass = "" 
}: {
    containerClass?: string 
} ) {

  return (
    <section className={cn("rounded-3xl ", containerClass)}>
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