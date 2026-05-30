"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
  Children,
  isValidElement,
} from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type EmblaApi = UseEmblaCarouselType[1];

// Тип поддерживает именованные брейкпоинты и произвольные числа (px)
type ColsConfig = {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  [px: number]: number | undefined;
};

interface SliderProps {
  children: ReactNode;
  className?: string;
  cols?: number | ColsConfig;
  gap?: string | number;
}

const NAMED_BREAKPOINTS: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export default function Slider({
  children,
  className = "",
  cols = 1,
  gap = "2rem",
}: SliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const slideClass = `sld-${useId().replace(/:/g, "")}`;

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    emblaApi.on("resize", update);

    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
      emblaApi.off("resize", update);
    };
  }, [emblaApi]);

  const gapValue = typeof gap === "number" ? `${gap}px` : gap;
  const colsMap: ColsConfig = typeof cols === "number" ? { base: cols } : cols;

  const css = useMemo(() => {
    const getFlex = (n: number) => {
      const totalGap = n === 1 ? "0px" : `calc(${gapValue} * ${n - 1})`;
      return `1 0 calc((100% - ${totalGap}) / ${n})`;
    };

    let result = `.${slideClass}{flex:${getFlex(colsMap.base ?? 1)};min-width:0;}`;

    const queries: { px: number; n: number }[] = [];

    Object.entries(colsMap).forEach(([key, value]) => {
      if (key === "base" || value === undefined) return;

      const px = NAMED_BREAKPOINTS[key] ?? Number(key);
      if (!Number.isNaN(px)) {
        queries.push({ px, n: value });
      }
    });

    queries.sort((a, b) => a.px - b.px);

    queries.forEach(({ px, n }) => {
      if (n !== (colsMap.base ?? 1)) {
        result += `@media(min-width:${px}px){.${slideClass}{flex:${getFlex(n)};}}`;
      }
    });

    return result;
  }, [slideClass, colsMap, gapValue]);

  const slides = useMemo(() => {
    return Children.map(children, (child, index) => {
      return (
        <div key={index} className={slideClass}>
          {child}
        </div>
      );
    });
  }, [children, slideClass]);

  const showArrows = canScrollPrev || canScrollNext;

  return (
    <div className={`relative ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div ref={emblaRef} className="overflow-hidden px-4 -mx-4">
        <div className="flex py-6" style={{ gap: gapValue }}>
          {slides}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Предыдущий слайд"
            className="z-20 absolute top-1/2 -translate-y-1/2 -left-3 flex aspect-square w-8 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur transition-all hover:bg-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed "
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Следующий слайд"
            className="z-20 absolute top-1/2 -translate-y-1/2 -right-3 flex aspect-square w-8 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur transition-all hover:bg-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed "
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </>
      )}
    </div>
  );
}