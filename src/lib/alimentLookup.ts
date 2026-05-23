import { ALIMENTS, ALIMENTS_MAP } from "@/data/aliments";
import type { Aliment } from "./types";

let customList: Aliment[] = [];

export function setCustomAliments(list: Aliment[]) {
  for (const a of customList) delete (ALIMENTS_MAP as Record<string, Aliment>)[a.id];
  customList = list;
  for (const a of list) (ALIMENTS_MAP as Record<string, Aliment>)[a.id] = a;
}

export function getAliment(id: string): Aliment | undefined {
  return ALIMENTS_MAP[id];
}

export function getAllAliments(): Aliment[] {
  return [...ALIMENTS, ...customList];
}

export function getCustomAliments(): Aliment[] {
  return customList;
}