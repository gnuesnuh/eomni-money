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

const BUBBLE_BG: Record<SpeakerType, string> = {
  son: "bg-bubble-son",
  daughter: "bg-bubble-daughter",
  daughter_in_law: "bg-bubble-dil",
  son_in_law: "bg-bubble-sil",
};

interface BubbleAreaProps {
  speakerType: SpeakerType;
  text: string;
  badge?: string;
}

export function BubbleArea({ speakerType, text, badge }: BubbleAreaProps) {
  return (
    <div className={`rounded-2xl p-4 ${BUBBLE_BG[speakerType]}`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <span className="text-xl">{SPEAKER_EMOJI[speakerType]}</span>
        <span>{SPEAKER_INTRO[speakerType]}</span>
        {badge && (
          <span className="ml-auto text-xs font-medium bg-white/80 text-gray-600 rounded-full px-2 py-0.5">
            {badge}
          </span>
        )}
      </div>
      <p className="text-lg leading-relaxed text-gray-900 whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}
