import { create } from "zustand";

interface SpeechState {
  isHearing: boolean;
  isSpeaking: boolean;
  results: string[];
  handleLoadResults: (newResults: string[]) => void;
  changeHearing: (newState: boolean) => void;
  changeSpeaking: (newState: boolean) => void;
}

const useSpeechStore = create<SpeechState>()((set) => ({
  isHearing: false,
  isSpeaking: false,
  results: [""],
  handleLoadResults: (newResults) =>
    set((state) => ({ ...state, results: newResults })),
  changeHearing: (newState) =>
    set((state) => ({ ...state, isHearing: newState })),
  changeSpeaking: (newState) =>
    set((state) => ({ ...state, isSpeaking: newState })),
}));

export default useSpeechStore;
