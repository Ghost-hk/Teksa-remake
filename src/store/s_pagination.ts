import { create } from "zustand";

interface PageState {
  currPage: number | undefined;
  nextPage: number | undefined;
  prevPage: number | undefined;
  numberOfPages: number | undefined;
  setCurrPage: (page: number | undefined) => void;
  setNextPage: (page: number | undefined) => void;
  setPrevPage: (page: number | undefined) => void;
  setNumberOfPages: (page: number | undefined) => void;
}

export const usePageStore = create<PageState>()((set) => ({
  currPage: undefined,
  nextPage: undefined,
  prevPage: undefined,
  numberOfPages: undefined,
  setCurrPage: (page: number | undefined) =>
    set((state) => ({ ...state, currPage: page })),
  setNextPage: (page: number | undefined) =>
    set((state) => ({ ...state, nextPage: page })),
  setPrevPage: (page: number | undefined) =>
    set((state) => ({ ...state, prevPage: page })),

  setNumberOfPages: (numberOfPages: number | undefined) =>
    set((state) => ({
      ...state,
      numberOfPages: numberOfPages,
    })),
}));
