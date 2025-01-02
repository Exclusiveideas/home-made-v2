import { updatedUser } from "@/utils/constants";
import { create } from "zustand";
import { persist } from "zustand/middleware";


const useAuthStore = create()(
  persist(
    (set) => ({
      user: updatedUser,
      logOut: () =>
        set(() => ({
          user: null,
        })),
      updateUser: (userDet) =>
        set(() => ({
          user: userDet,
        })),
    }),
    {
      name: "user-authenticated",
    }
  )
);

export default useAuthStore;
