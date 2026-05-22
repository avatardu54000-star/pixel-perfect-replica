import { RECETTES_MAP } from "@/data/recettes";
import type { Recette } from "./types";

let customMap: Record<string, Recette> = {};

export function setCustomRecettes(list: Recette[]) {
  customMap = Object.fromEntries(list.map((r) => [r.id, r]));
}

export function getRecette(id: string): Recette | undefined {
  return customMap[id] ?? RECETTES_MAP[id];
}