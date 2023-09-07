import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

// export const webScrapeAtom = atomWithStorage("webScrapeAtom", {

export const webScrapeAtom = atomWithStorage<webScrapes>("url", {});
export type webScrapes = {
  [key: string]: {
    url: string;
  };
};

export const headerAtom = atom(false);
