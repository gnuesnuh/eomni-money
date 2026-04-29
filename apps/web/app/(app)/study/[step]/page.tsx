"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLesson, pickPraise, pickTease } from "@/lib/lessons";
import { useProfile } from "@/lib/profile";
import { useStudy } from "@/lib/study";
import { StepExplain } from "@/components/study/StepExplain";
import { StepOX } from "@/components/study/StepOX";
import { StepMulti } from "@/components/study/StepMulti";
import { StepBlank } from "@/components/study/StepBlank";
import { StepComplete } from "@/components/study/StepComplete";

export default function StudyStepPage() {
  const router = useRouter();
  const params = useParams<{ step: string }>();
  const lessonId = Number(params.step);
  const lesson = useMemo(() => getLesson(lessonId), [lessonId]);

  const { profile, loaded: profileLoaded } = useProfile();
  const study = useStudy();

  const [cur, setCur] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [touched, setTouched] = useState(false);

  const stepType = lesson?.steps[cur]?.type;

  // 첫 렌더 시 스트릭 한 번만 갱신
  useEffect(() => {
    if (study.loaded && !touched) {
      study.touchStreak();
      setTouched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [study.loaded]);

  // complete step 진입 시 1회만 레슨 완료 기록
  useEffect(() => {
    if (stepType === "complete" && lesson) {
      const perfect = correct === 3;
      const badge = perfect ? "trophy" : "sprout";
      study.completeLesson(lesson.id, perfect, badge);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepType]);

  if (!profileLoaded || !study.loaded) {
    return <div className="p-8 text-gray-400">불러오는 중...</div>;
  }

  if (!lesson) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-gray-500 mb-4">아직 준비 중인 레슨이에요.</p>
        <button
          onClick={() => router.push("/study")}
          className="rounded-xl bg-purple-700 text-white px-6 py-3 text-sm font-semibold"
        >
          공부방으로 돌아가기
        </button>
      </main>
    );
  }

  const speaker = profile?.speakerType ?? "son";
  const step = lesson.steps[cur]!;
  const totalSteps = lesson.steps.length - 1; // complete 제외
  const pct = Math.min(100, Math.round((cur / totalSteps) * 100));

  function next() {
    setCur((c) => Math.min(c + 1, lesson!.steps.length - 1));
  }

  function recordAnswer(ok: boolean) {
    if (ok) {
      setScore((s) => s + 10);
      setCorrect((c) => c + 1);
      study.addScore(10);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 pb-6">
      {/* 보라 헤더 + 진행률 */}
      <header className="bg-purple-700 text-white px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">
            레슨 {lesson.id} · {lesson.title}
          </span>
          <button
            onClick={() => {
              if (step.type === "complete") router.push("/study");
              else if (confirm("나가면 진행이 저장 안 돼요. 계속할까요?"))
                router.push("/study");
            }}
            className="text-white/70 text-lg leading-none w-8 h-8 flex items-center justify-center"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-2 rounded-full bg-white/25 overflow-hidden">
            <div
              className="h-full bg-yellow-300 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-white/80 whitespace-nowrap">
            {Math.min(cur, totalSteps)} / {totalSteps}
          </span>
        </div>
      </header>

      {/* 점수/스트릭 */}
      {step.type !== "complete" && (
        <div className="bg-purple-50 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-purple-700 font-medium">
            <span>🔥</span>
            <span>{study.state.streakDays}일 연속</span>
          </div>
          <div className="text-xs text-purple-700 font-medium">
            <span className="font-bold">{score}</span>점 쌓는 중!
          </div>
        </div>
      )}

      {/* 단계별 콘텐츠 */}
      <div>
        {step.type === "explain" && (
          <StepExplain step={step} onNext={next} />
        )}
        {step.type === "ox" && (
          <StepOX
            step={step}
            family={{
              ok: pickPraise(speaker, 0),
              ng: pickTease(speaker, 0),
            }}
            onAnswer={recordAnswer}
            onNext={next}
          />
        )}
        {step.type === "multi" && (
          <StepMulti
            step={step}
            family={{
              ok: pickPraise(speaker, 1),
              ng: pickTease(speaker, 1),
            }}
            onAnswer={recordAnswer}
            onNext={next}
          />
        )}
        {step.type === "blank" && (
          <StepBlank
            step={step}
            family={{
              ok: pickPraise(speaker, 2),
              ng: pickTease(speaker, 2),
            }}
            onAnswer={recordAnswer}
            onNext={next}
          />
        )}
        {step.type === "complete" && (
          <StepComplete
            lesson={lesson}
            totalScore={score}
            correctCount={correct}
            perfect={correct === 3}
            onShareReward={(days) => study.recordShareReward(days)}
          />
        )}
      </div>
    </main>
  );
}
