import { atomWithStorage } from "jotai/utils";

// export const webScrapeAtom = atomWithStorage("webScrapeAtom", {

export const webScrapeAtom = atomWithStorage<webScrapes>("url", {});
export type webScrapes = {
  [key: string]: {
    url: string;
  };
};
