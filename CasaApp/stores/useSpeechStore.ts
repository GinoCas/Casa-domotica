import { create } from "zustand";

interface SpeechState {
  isHearing: boolean;
  isSpeaking: boolean;
  results: string[];
  voice: string;
  cmdVoice: string;
  handleLoadVoice: (newState: string) => void;
  handleLoadCmdVoice: (newState: string) => void;
  handleLoadResults: (newResults: string[]) => void;
  changeHearing: (newState: boolean) => void;
  changeSpeaking: (newState: boolean) => void;
}

const useSpeechStore = create<SpeechState>()((set) => ({
  isHearing: false,
  isSpeaking: false,
  results: [""],
  cmdParts: [""],
  voice: "",
  cmdVoice: "",
  handleLoadVoice: (newState) =>
    set((state) => ({ ...state, voice: newState })),
  handleLoadCmdVoice: (newState) =>
    set((state) => ({ ...state, cmdVoice: newState })),
  handleLoadResults: (newResults) =>
    set((state) => ({ ...state, results: newResults })),
  changeHearing: (newState) =>
    set((state) => ({ ...state, isHearing: newState })),
  changeSpeaking: (newState) =>
    set((state) => ({ ...state, isSpeaking: newState })),
}));

export default useSpeechStore;
