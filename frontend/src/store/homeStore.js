import { create } from "zustand";

const useHomeStore = create()((set) => ({
  cursorImage: 'spatula',
  isNavbarOpen: false,
  menuItemClicked: false,
  setCursorImage: (curImage) =>
    set(() => ({
      cursorImage: curImage,
    })),
  toggleNavbarOpen: () =>
    set((state) => ({
      isNavbarOpen: !state.isNavbarOpen,
    })),
  setMenuIconClicked: (val) =>
    set(() => ({
      menuItemClicked: val,
    })),
}));

export default useHomeStore;
