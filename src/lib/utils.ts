import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Função utilitária para combinar classes CSS com Tailwind.
 * Combina classes do clsx com tailwind-merge para evitar conflitos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

