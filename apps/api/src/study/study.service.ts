import { Injectable } from "@nestjs/common";

const CURRICULUM = [
  { step: 1, title: "회사 조각이 뭔가요?", premium: false },
  { step: 2, title: "올랐다 내렸다, 왜 그래요?", premium: false },
  { step: 3, title: "좋은 회사 고르는 법", premium: true },
  { step: 4, title: "언제 사고 팔까요?", premium: true },
  { step: 5, title: "위험 줄이는 방법", premium: true },
];

@Injectable()
export class StudyService {
  listSteps() {
    return CURRICULUM;
  }

  getStep(step: number) {
    return CURRICULUM.find((s) => s.step === step) ?? null;
  }
}
