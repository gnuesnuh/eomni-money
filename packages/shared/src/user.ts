import type { LearningLevel, SpeakerType, TargetType } from "./speaker";

export interface User {
  id: string;
  kakaoId: string | null;
  speakerType: SpeakerType;
  speakerName: string;
  targetName: string;
  targetType: TargetType;
  level: LearningLevel;
  isSubscribed: boolean;
  createdAt: string;
}

export interface OnboardingPayload {
  speakerType: SpeakerType;
  targetType: TargetType;
  targetName: string;
  level: LearningLevel;
}
