import type { SpeakerType } from "@eomni/shared";

const SPEAKER_EMOJI: Record<SpeakerType, string> = {
  son: "👦",
  daughter: "👧",
  daughter_in_law: "👩",
  son_in_law: "👨",
};

const SPEAKER_INTRO: Record<SpeakerType, string> = {
  son: "아들이 설명해줄게!",
  daughter: "딸이 설명해줄게!",
  daughter_in_law: "며느리가 설명드릴게요",
  son_in_law: "사위가 말씀드릴게요",
};

const SIMPLER_INTRO: Record<SpeakerType, string> = {
  son: "더 쉽게!",
  daughter: "더 쉽게!",
  daughter_in_law: "더 쉽게 설명드릴게요",
  son_in_law: "더 쉽게 말씀드리자면",
};

const DEEPER_INTRO: Record<SpeakerType, string> = {
  son: "더 자세히!",
  daughter: "더 자세히!",
  daughter_in_law: "조금 더 자세히 설명드릴게요",
  son_in_law: "조금 더 자세히 말씀드리자면",
};

export type BubbleVariant = "initial" | "simpler" | "deeper";

const VARIANT_BG: Record<BubbleVariant, string> = {
  initial: "bg-bubble-son",
  simpler: "bg-orange-50",
  deeper: "bg-purple-50",
};

const VARIANT_BORDER: Record<BubbleVariant, string> = {
  initial: "",
  simpler: "border-t border-orange-200",
  deeper: "border-t border-purple-200",
};

const VARIANT_WHO_COLOR: Record<BubbleVariant, string> = {
  initial: "text-gray-700",
  simpler: "text-orange-800",
  deeper: "text-purple-800",
};

interface BubbleAreaProps {
  speakerType: SpeakerType;
  text: string;
  variant?: BubbleVariant;
}

export function BubbleArea({
  speakerType,
  text,
  variant = "initial",
}: BubbleAreaProps) {
  const intro =
    variant === "simpler"
      ? SIMPLER_INTRO[speakerType]
      : variant === "deeper"
        ? DEEPER_INTRO[speakerType]
        : SPEAKER_INTRO[speakerType];

  return (
    <div className={`p-4 ${VARIANT_BG[variant]} ${VARIANT_BORDER[variant]}`}>
      <div
        className={`flex items-center gap-2 text-sm font-semibold mb-2 ${VARIANT_WHO_COLOR[variant]}`}
      >
        <span className="text-xl">{SPEAKER_EMOJI[speakerType]}</span>
        <span>{intro}</span>
      </div>
      <p className="text-lg leading-relaxed text-gray-900 whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}
