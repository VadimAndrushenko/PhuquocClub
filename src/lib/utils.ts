import { SearchData, SearchItem } from "@/shared/types/componentsType/serchInput.type";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-а-яё]/gi, "");
}

function buildSearchText(title: string, description?: string | null): string {
  return `${title} ${description ?? ""}`.toLowerCase()
}