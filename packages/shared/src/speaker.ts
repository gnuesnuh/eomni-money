export type SpeakerType = "son" | "daughter" | "daughter_in_law" | "son_in_law";

export type TargetType = "mother" | "father";

export type LearningLevel = "beginner" | "intermediate" | "advanced";

export const SPEAKER_LABELS: Record<SpeakerType, string> = {
  son: "아들",
  daughter: "딸",
  daughter_in_law: "며느리",
  son_in_law: "사위",
};

export const TARGET_LABELS: Record<TargetType, string> = {
  mother: "어머니",
  father: "아버지",
};

export const LEVEL_LABELS: Record<LearningLevel, string> = {
  beginner: "완전 처음",
  intermediate: "조금 알아",
  advanced: "어느 정도 해봤어",
};
