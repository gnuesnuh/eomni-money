import type { SVGProps } from "react";

/**
 * 자체 제작 아이콘 — 단순 X.
 *
 * Solar Icon Set의 `close-circle-bold` 내부 X path를 추출.
 * Solar에는 외곽선 없는 단순 X가 없어서, 톤 일관성을 위해 Solar의 X 부분만 따왔다.
 *
 * 사용처: 외부 배경(frosted glass 등)이 별도로 있는 닫기 버튼 안에 X만 필요할 때.
 *
 * 색은 currentColor — 부모의 text-color로 컨트롤.
 */
export function CloseX({
  size = 24,
  ...rest
}: { size?: number } & Omit<SVGProps<SVGSVGElement>, "width" | "height">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      // 원본 Solar viewBox 0 0 24 24 안에서 X path는 (8.5, 8.5)~(15.5, 15.5) 영역만 차지.
      // 그래서 viewBox를 X 영역에 맞게 트림해서 size prop이 곧 X 시각 크기와 같도록 함.
      viewBox="8 8 8 8"
      role="img"
      {...rest}
    >
      <path
        fill="currentColor"
        d="M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 0 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 0 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06"
      />
    </svg>
  );
}
