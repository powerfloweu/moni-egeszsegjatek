import { AppState } from "./storage";

const FILE_NAME = "moni-egeszseg-jatek-export.json";

const validateState = (data: any): AppState | null => {
  if (!data || typeof data !== "object") return null;
  if (data.version !== 1 || typeof data.entriesByDate !== "object") return null;
  return { version: 1, entriesByDate: data.entriesByDate };
};

export const exportStateToFile = (state: AppState) => {
  if (typeof window === "undefined") return;
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = FILE_NAME;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const importStateFromFile = async (file: File): Promise<AppState> => {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const valid = validateState(parsed);
  if (!valid) {
    throw new Error("Érvénytelen vagy ismeretlen formátumú fájl.");
  }
  return valid;
};
