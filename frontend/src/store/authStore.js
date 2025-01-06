import { create } from "zustand";
import { persist } from "zustand/middleware";


const useAuthStore = create()(
  persist(
    (set) => ({
      user: {},
      deletedDishID: null,
      deletedExperienceID: null,
      deletedCertificationID: null,
      logOut: () =>
        set(() => ({
          user: null,
        })),
      updateUser: (userDet) =>
        set(() => ({
          user: userDet,
        })),
      setDeletedDishID: (dishID) =>
        set(() => ({
          deletedDishID: dishID,
        })),
      setDeletedExperienceID: (experienceID) =>
        set(() => ({
          deletedExperienceID: experienceID,
        })),
      setDeletedCertificationID: (certificationID) =>
        set(() => ({
          deletedCertificationID: certificationID,
        })),
    }),
    {
      name: "user-authenticated",
    }
  )
);

export default useAuthStore;
