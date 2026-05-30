import { cn } from "@/lib/utils";

export default function NeedHelpArticle({
  className = "",
}: {
  className?: string;
}) {
  return (
    <section
      className={cn(
        className
      )}
    >
      <div className="bg-main rounded-3xl p-6">
        <h2 className="font-bold text-xl leading-normal text-white mb-3.5">
          Нужна помощь?
        </h2>

        <p className="font-normal text-[15px] leading-relaxed text-white/80 mb-6">
          Если нужно быстро найти такси, аптеку, интернет или сервис рядом —
          откройте раздел помощи.
        </p>

        <button
          className="
            flex items-center justify-center
            w-full
            rounded-xl
            py-3.5
            bg-accent
            font-semibold text-[15px] leading-normal text-white
            shadow-lg

            transition-all duration-300 ease-out
            hover:scale-[1.01]
            hover:shadow-2xl
            hover:brightness-110

            active:scale-[0.98]
          "
        >
          Найти помощь
        </button>
      </div>
    </section>
  );
}