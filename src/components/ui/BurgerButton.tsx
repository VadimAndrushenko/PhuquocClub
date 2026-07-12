import { cn } from "@/lib/utils";
import type { Dispatch, SetStateAction, RefObject } from "react";

type MobileMenuProps = {
  burgerRef: RefObject<HTMLButtonElement | null>;
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export default function MobileMenu({
  burgerRef,
  isMenuOpen,
  setIsMenuOpen,
}: MobileMenuProps) {
  return (
    <button
      ref={burgerRef}
      type="button"
      aria-label="Open menu"
      aria-expanded={isMenuOpen}
      aria-controls="mobile-menu"
      title="Open menu"
      onClick={() => setIsMenuOpen((prev) => !prev)}
      className={cn(
        `
          xl:hidden
          relative inline-flex h-[34px] w-[34px]
          flex-col justify-between
          border-none bg-transparent
          px-[4.25px] py-[8.5px]
          text-black transition-all duration-300
          hover:text-accent
        `,
        isMenuOpen && "is-active"
      )}
    >
      <span
        className={cn(
          `
            h-[2px] w-full rounded-full
            bg-current transition-all duration-300
          `,
          isMenuOpen &&
            "origin-left translate-x-[0.25em] translate-y-[-0.1em] rotate-45"
        )}
      />

      <span
        className={cn(
          `
            h-[2px] w-full rounded-full
            bg-current transition-all duration-300
          `,
          isMenuOpen && "-rotate-45"
        )}
      />

      <span
        className={cn(
          `
            h-[2px] w-[55%] self-end rounded-full
            bg-current transition-all duration-300
          `,
          isMenuOpen && "w-0"
        )}
      />
    </button>
  );
}