import { create } from "zustand";

const useChatStore = create()((set) => ({
  activeChatRoomID: null,

  setActiveChatRoomID: (chatRoomID) =>
    set(() => ({
      activeChatRoomID: chatRoomID,
    })),
}));

export default useChatStore;
