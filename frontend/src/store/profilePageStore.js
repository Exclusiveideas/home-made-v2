import { create } from "zustand";

const useProfilePageStore = create()((set) => ({
  editTitle: "",
  addSection: "",
  editEmploymentSect: {},
  confirmDelete: null,
  enlargeImage: "",
  expandedDishDetails: null,
  editDish: null,
  enqueueSnack: null,
  setEditTitle: (val) =>
    set(() => ({
      editTitle: val,
    })),
  setAddSection: (val) =>
    set(() => ({
      addSection: val,
    })),
  setEditEmploymentSect: (val) =>
    set(() => ({
      editEmploymentSect: val,
    })),
  setConfirmDelete: (val) =>
    set(() => ({
      confirmDelete: val,
    })),
  setEnlargeImage: (val) =>
    set(() => ({
      enlargeImage: val,
    })),
  setExpandedDishDetails: (val) =>
    set(() => ({
      expandedDishDetails: val,
    })),
  setEditDish: (val) =>
    set(() => ({
      editDish: val,
    })),
  setEnqueueSnack: (val) =>
    set(() => ({
      enqueueSnack: val,
    })),
}));

export default useProfilePageStore;
 