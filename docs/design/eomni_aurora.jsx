import { useState } from "react";

const PERSONA = {
  son: { e: "👦", n: "아들", sfx: "이", av: "rgba(162,92,222,0.15)", nameColor: "#7B2FBE",
    hl: ["엄마, 오늘 삼성 많이 빠졌어. 나도 보다가 좀 놀랐어.", "엄마~ 카카오 오늘 완전 좋은 날이야! 진짜 깜짝 놀랐어.", "엄마, 현대차가 오늘 억울한 날이에요. 잘못한 게 아닌데."] },
  dau: { e: "👧", n: "딸", sfx: "이", av: "rgba(236,100,150,0.15)", nameColor: "#C4406A",
    hl: ["엄마~ 삼성 오늘 꽤 빠졌어. 나도 보다가 걱정됐어.", "엄마~ 카카오 오늘 진짜 좋은 날이야! 나도 설렜어.", "엄마, 현대차 오늘 억울한 날이야. 회사 잘못이 아닌데."] },
  sil: { e: "🧑", n: "사위", sfx: "가", av: "rgba(29,158,117,0.15)", nameColor: "#0F8060",
    hl: ["장모님, 삼성이 오늘 꽤 많이 빠졌습니다.", "장모님, 카카오가 오늘 좋은 소식이 있었어요.", "장모님, 현대차가 오늘 좀 억울한 상황이에요."] },
  dil: { e: "👩", n: "며느리", sfx: "가", av: "rgba(55,138,221,0.15)", nameColor: "#1A60B0",
    hl: ["어머니, 삼성이 오늘 많이 빠졌어요.", "어머니, 카카오가 오늘 좋은 뉴스가 있었어요.", "어머니, 현대차가 오늘 억울한 상황이 생겼어요."] },
};

const NEWS = [
  {
    company: "삼성전자", src: "한국경제 · 1시간 전", dir: "dn", dirTag: "▼ 하락",
    blobA: "#7B2FBE", blobB: "#C4406A",
    headline: '"반도체 재고 과잉… 삼성전자 2분기 실적 쇼크 우려"',
    sub: "창고에 물건만 쌓이는 상황이야 — 자세한 얘기 들어볼래?",
    tags: ["삼성전자", "반도체"],
    bubbles: ["반도체를 엄청 많이 만들어놨는데 사는 사람이 없는 거야. 창고에 물건만 쌓이는 상황이야.", "이게 단기간에 해결될 문제가 아니라서 당분간은 지켜봐야 할 것 같아. 엄마 잘못 아니야."],
    life: "💡 마트 창고에 재고가 쌓이면 할인 행사 해야 하잖아 — 지금 삼성이 딱 그 상황이야.",
    easy: ["삼성이 TV 100개 만들었는데 50개밖에 못 판 거야. 나머지는 창고에 쌓여있어.", "사는 사람이 없으니 가격도 낮춰야 해. 그러면 돈을 덜 버는 거야."],
    deep: ["미국·중국 경기가 동시에 안 좋아지면서 스마트폰·서버 주문이 뚝 끊겼어.", "삼성 반도체 재고가 작년 대비 두 배 넘게 쌓였는데, 다 소화하려면 2~3분기는 걸린대.", "SK하이닉스도 같은 상황. 삼성만의 문제가 아니야."],
    mapU: "TSMC, 재고 적은 업체", mapD: "SK하이닉스, 반도체 장비사", mapN: "애플 (부품 협상 중), IT 세트 업체들",
  },
  {
    company: "카카오", src: "이데일리 · 3시간 전", dir: "up", dirTag: "▲ 상승",
    blobA: "#1D9E75", blobB: "#378ADD", noImg: true,
    headline: '"카카오 AI 구독 출시 2주 만에 MAU 50만 돌파"',
    sub: "새로 만든 AI 서비스에 사람들이 예상보다 훨씬 빠르게 몰리고 있대.",
    tags: ["카카오", "AI"],
    bubbles: ["새로 만든 AI 서비스에 사람들이 생각보다 훨씬 빠르게 몰리고 있대. 출시 2주 만에 목표치를 다 채웠어.", "이게 계속 이어지면 진짜 재밌어질 것 같아. 엄마 카카오 있지 않아?"],
    life: "💡 새로 연 분식집에 줄이 엄청 길게 선 거야 — 장사 잘 될 것 같다는 기대감에 주가가 오른 거지.",
    easy: ["카카오가 새 앱 하나 만들었는데, 사람들이 엄청 빠르게 쓰기 시작한 거야.", "사람이 많이 쓰면 돈을 더 많이 벌 수 있잖아. 그래서 주가가 오른 거야!"],
    deep: ["카카오 AI 구독 서비스가 출시 2주 만에 MAU 50만을 넘겼어. 업계 예상치의 3배 수준이래.", "월 2,900원 구독 모델이라 해지율이 낮을 가능성이 높아. 고정 수익이 생기는 거야.", "광고 매출 의존 구조에서 벗어날 수 있다는 기대감이 주가에 선반영된 거야."],
    mapU: "카카오페이, 카카오뱅크", mapD: "네이버 (AI 구독 경쟁)", mapN: "AI 스타트업들, 구독 지속률 나와봐야 알아",
  },
  {
    company: "현대차", src: "연합뉴스 · 5시간 전", dir: "dn", dirTag: "▼ 하락",
    blobA: "#BA7517", blobB: "#C4406A",
    headline: '"미국, 한국산 자동차에 25% 관세 부과 확정"',
    sub: "미국이 갑자기 우리나라 차에 세금을 많이 붙이기로 했거든요.",
    tags: ["현대차", "관세"],
    bubbles: ["미국이 갑자기 우리나라 차에 세금을 많이 붙이기로 했어. 그래서 미국에서 현대차가 갑자기 비싸진 거야.", "현대차가 뭘 잘못한 게 아니야. 미국 정부가 갑자기 룰을 바꾼 거거든."],
    life: "💡 마트에 물건 갖다 주는데 갑자기 통행료가 두 배 된 거야 — 현대차 잘못이 아니라 도로 주인이 바꾼 거지.",
    easy: ["미국 사람이 현대차 사려고 2천만 원 모았는데, 갑자기 세금 때문에 2천4백만 원이 된 거야.", "비싸지면 사는 사람이 줄잖아. 그러면 현대차가 돈을 덜 버는 거야."],
    deep: ["미국이 한국산 자동차에 25% 관세를 부과하기로 했어. 현대차 미국 판매 비중이 약 30%라 타격이 작지 않아.", "조지아 공장 생산 차는 적용 안 되는데, 아직 생산량이 전체의 20% 수준이라 단기 대응에 한계가 있어.", "기아·쌍용도 같은 상황. 미국 현지 생산 설비를 더 빨리 늘리는 게 유일한 해법이래."],
    mapU: "GM·포드, 조지아 부품사", mapD: "기아·쌍용, 한국 부품사", mapN: "협상 결과에 따라 달라짐",
  },
];

/* 오로라 블롭 SVG 배경 */
function AuroraBg({ w = 300, h = 130, blobA, blobB, dim = false }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0, display: "block" }}>
      <defs>
        <radialGradient id={`rg-a-${blobA}`} cx="30%" cy="40%" r="60%">
          <stop offset="0%" stopColor={blobA} stopOpacity="0.9" />
          <stop offset="100%" stopColor={blobA} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`rg-b-${blobB}`} cx="75%" cy="60%" r="55%">
          <stop offset="0%" stopColor={blobB} stopOpacity="0.75" />
          <stop offset="100%" stopColor={blobB} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`rg-c-${blobA}`} cx="55%" cy="20%" r="40%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill="#0D0520" />
      <rect width={w} height={h} fill={`url(#rg-a-${blobA})`} />
      <rect width={w} height={h} fill={`url(#rg-b-${blobB})`} />
      <rect width={w} height={h} fill={`url(#rg-c-${blobA})`} />
      {dim && <rect width={w} height={h} fill="rgba(0,0,0,0.15)" />}
    </svg>
  );
}

function CardImage({ news }) {
  return (
    <div style={{ width: "100%", height: 130, position: "relative", overflow: "hidden" }}>
      <AuroraBg w={300} h={130} blobA={news.blobA} blobB={news.blobB} />
      {/* 하단 텍스트 오버레이 */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 12px 10px", background: "linear-gradient(to top, rgba(5,2,15,0.82) 0%, transparent 100%)" }}>
        <div style={{ fontSize: 10, color: "rgba(200,180,240,0.7)", marginBottom: 2 }}>{news.src}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.82)", lineHeight: 1.4, fontWeight: 500 }}>{news.headline}</div>
      </div>
      <div style={{ position: "absolute", top: 10, right: 10, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: news.dir === "up" ? "rgba(29,200,140,0.22)" : "rgba(226,75,74,0.22)", color: news.dir === "up" ? "#5DCAA5" : "#F09595", border: `1px solid ${news.dir === "up" ? "rgba(93,202,165,0.4)" : "rgba(240,149,149,0.4)"}` }}>
        {news.dirTag}
      </div>
    </div>
  );
}

/* 글래스 카드 말풍선 */
function Bubble({ text, alt }) {
  return (
    <div style={{
      background: alt ? "rgba(255,255,255,0.6)" : "rgba(162,92,222,0.1)",
      border: `1px solid ${alt ? "rgba(220,210,240,0.5)" : "rgba(162,92,222,0.18)"}`,
      borderRadius: alt ? 14 : "4px 14px 14px 14px",
      padding: "10px 13px", fontSize: 13, lineHeight: 1.65,
      color: alt ? "#3A2856" : "#2A1040", marginBottom: 6,
    }}>{text}</div>
  );
}
function DkBubble({ text }) {
  return <div style={{ background: "rgba(42,16,64,0.9)", border: "1px solid rgba(162,92,222,0.2)", borderRadius: "4px 14px 14px 14px", padding: "10px 13px", fontSize: 12, lineHeight: 1.65, color: "#E8D8FF", marginBottom: 5 }}>{text}</div>;
}
function WmBubble({ text }) {
  return <div style={{ background: "rgba(255,245,200,0.7)", border: "1px solid rgba(250,200,100,0.4)", borderRadius: "4px 14px 14px 14px", padding: "10px 13px", fontSize: 12, lineHeight: 1.65, color: "#3D2800", marginBottom: 5 }}>{text}</div>;
}

function BottomSheet({ news, persona, onClose }) {
  const [mode, setMode] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const pd = PERSONA[persona];
  const idx = NEWS.indexOf(news);

  const toggleMode = (m) => {
    if (mode === m) { setMode(null); if (m === "deep") setMapOpen(false); }
    else { setMode(m); if (m !== "deep") setMapOpen(false); }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 20, background: "rgba(10,5,25,0.55)" }} />
      <div onClick={e => e.stopPropagation()} style={{
        position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 21,
        background: "rgba(255,255,255,0.97)",
        borderRadius: "22px 22px 0 0",
        display: "flex", flexDirection: "column", maxHeight: "80%",
        borderTop: "1px solid rgba(162,92,222,0.15)",
      }}>
        {/* 손잡이 — 오로라 틴트 */}
        <div onClick={onClose} style={{ padding: "10px 0 4px", display: "flex", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "linear-gradient(90deg, #7B2FBE, #C4406A, #1D9E75)", opacity: 0.5 }} />
        </div>

        {/* 시트 헤더 */}
        <div style={{ padding: "0 16px 12px", borderBottom: "1px solid rgba(162,92,222,0.1)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: pd.av, border: `1px solid ${pd.nameColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{pd.e}</div>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: pd.nameColor }}>{pd.n}</span>
              <span style={{ fontSize: 12, color: "#B0A0CC" }}>{pd.sfx} 설명해줘요</span>
              <div style={{ fontSize: 10, color: "#C4A8E0" }}>{news.src}</div>
            </div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1A0A2E", lineHeight: 1.5 }}>{pd.hl[idx]}</div>
        </div>

        {/* 스크롤 본문 */}
        <div style={{ overflowY: "auto", padding: "14px 16px 24px", flex: 1 }}>
          {news.bubbles.map((b, i) => <Bubble key={i} text={b} alt={i > 0} />)}
          <div style={{ padding: "8px 12px", borderLeft: "2px solid", borderImage: "linear-gradient(to bottom, #7B2FBE, #C4406A) 1", margin: "10px 0 14px", fontSize: 12, color: "#8B6AAC", lineHeight: 1.55 }}>{news.life}</div>

          <div style={{ display: "flex", gap: 7 }}>
            <button onClick={() => toggleMode("easy")} style={{
              flex: 1, padding: "10px 6px", borderRadius: 10, fontSize: 12, fontWeight: 600,
              cursor: "pointer", textAlign: "center", border: `1px solid ${mode === "easy" ? "#7B2FBE" : "rgba(162,92,222,0.25)"}`,
              background: mode === "easy" ? "rgba(162,92,222,0.1)" : "#fff", color: "#7B2FBE",
            }}>😅 어려워요</button>
            <button onClick={() => toggleMode("deep")} style={{
              flex: 1, padding: "10px 6px", borderRadius: 10, fontSize: 12, fontWeight: 600,
              cursor: "pointer", textAlign: "center", border: "none",
              background: mode === "deep" ? "linear-gradient(135deg,#3C0A5E,#1A2060)" : "linear-gradient(135deg,#7B2FBE,#4060D0)",
              color: "#fff",
            }}>🤔 더 알고 싶어요</button>
          </div>

          {mode === "easy" && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, color: "#B09FCC", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 7 }}>더 쉽게 설명할게</div>
              {news.easy.map((t, i) => <WmBubble key={i} text={t} />)}
            </div>
          )}
          {mode === "deep" && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, color: "#B09FCC", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 7 }}>조금 더 깊이</div>
              {news.deep.map((t, i) => <DkBubble key={i} text={t} />)}
            </div>
          )}
          {mode === "deep" && (
            <button onClick={() => setMapOpen(o => !o)} style={{
              width: "100%", marginTop: 8, padding: 10, borderRadius: 10, fontSize: 12, fontWeight: 600,
              cursor: "pointer", border: "1px solid rgba(29,158,117,0.35)",
              background: mapOpen ? "rgba(29,158,117,0.08)" : "#fff", color: "#0F8060", textAlign: "center",
            }}>📊 누가 이득 봐?</button>
          )}
          {mapOpen && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 10, color: "#B09FCC", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 7 }}>수혜·피해 지도</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  { bg: "rgba(29,158,117,0.08)", border: "rgba(29,158,117,0.2)", lc: "#0F8060", label: "✓ 이득", text: news.mapU },
                  { bg: "rgba(226,75,74,0.08)", border: "rgba(226,75,74,0.2)", lc: "#A32D2D", label: "✗ 피해", text: news.mapD },
                ].map(m => (
                  <div key={m.label} style={{ background: m.bg, border: `1px solid ${m.border}`, borderRadius: 10, padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: m.lc, marginBottom: 3 }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: "#555", lineHeight: 1.4 }}>{m.text}</div>
                  </div>
                ))}
                <div style={{ background: "rgba(162,92,222,0.06)", border: "1px solid rgba(162,92,222,0.18)", borderRadius: 10, padding: "8px 10px", gridColumn: "span 2" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#7B2FBE", marginBottom: 3 }}>? 지켜봐야 해</div>
                  <div style={{ fontSize: 11, color: "#555", lineHeight: 1.4 }}>{news.mapN}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function NewsCard({ news, persona, onOpen }) {
  const pd = PERSONA[persona];
  const idx = NEWS.indexOf(news);
  return (
    <div style={{ background: "rgba(255,255,255,0.82)", borderRadius: 20, border: "1px solid rgba(162,92,222,0.12)", overflow: "hidden", marginBottom: 12, backdropFilter: "blur(8px)" }}>
      {!news.noImg && <CardImage news={news} />}
      <div style={{ padding: news.noImg ? "13px 14px 0" : "12px 14px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: pd.av, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{pd.e}</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: pd.nameColor }}>{pd.n}</span>
          <span style={{ fontSize: 11, color: "#B0A0CC" }}>{pd.sfx} 설명해줘요</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#C4A8E0", whiteSpace: "nowrap" }}>{news.src}</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1A0A2E", lineHeight: 1.5, letterSpacing: "-0.3px", marginBottom: 4 }}>{pd.hl[idx]}</div>
        <div style={{ fontSize: 12, color: "#AAA", lineHeight: 1.45 }}>{news.sub}</div>
      </div>
      <div style={{ padding: "9px 14px", display: "flex", alignItems: "center", gap: 5, borderTop: "1px solid rgba(162,92,222,0.08)", marginTop: 10 }}>
        {news.tags.map(t => (
          <span key={t} style={{ fontSize: 10, color: "#9B6ACC", background: "rgba(162,92,222,0.08)", padding: "2px 8px", borderRadius: 20, border: "1px solid rgba(162,92,222,0.15)" }}>{t}</span>
        ))}
        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: news.dir === "up" ? "rgba(29,158,117,0.1)" : "rgba(226,75,74,0.1)", color: news.dir === "up" ? "#0F8060" : "#A32D2D", border: `1px solid ${news.dir === "up" ? "rgba(29,158,117,0.25)" : "rgba(226,75,74,0.25)"}` }}>{news.dirTag}</span>
        <button onClick={onOpen} style={{
          marginLeft: "auto", fontSize: 11, fontWeight: 700, cursor: "pointer",
          padding: "5px 13px", borderRadius: 20, border: "none",
          background: "linear-gradient(135deg, #7B2FBE, #C4406A)",
          color: "#fff",
        }}>설명 보기</button>
      </div>
    </div>
  );
}

export default function App() {
  const [persona, setPersona] = useState("son");
  const [openIdx, setOpenIdx] = useState(-1);
  const pKeys = ["son", "dau", "sil", "dil"];
  const pLabels = ["👦 아들", "👧 딸", "🧑 사위", "👩 며느리"];

  return (
    <div style={{ background: "#EAE3F5", borderRadius: 12, padding: "16px 12px 24px", display: "flex", justifyContent: "center" }}>
      <div style={{
        width: 300, height: 640, borderRadius: 32,
        border: "1.5px solid rgba(162,92,222,0.3)",
        overflow: "hidden", display: "flex", flexDirection: "column",
        position: "relative",
        fontFamily: "-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif",
        background: "#F8F4FF",
      }}>

        {/* 상태바 */}
        <div style={{ background: "#fff", padding: "10px 18px 6px", display: "flex", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: "#BBB" }}>9:41</span>
          <span style={{ fontSize: 10, color: "#BBB" }}>100%</span>
        </div>

        {/* 헤더 — 오로라 그라데이션 */}
        <div style={{ position: "relative", flexShrink: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,47,190,0.55) 0%, transparent 70%)", top: -80, left: -30 }} />
            <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,64,106,0.45) 0%, transparent 70%)", top: -50, left: 120 }} />
            <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,158,117,0.3) 0%, transparent 70%)", top: -20, right: -20 }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.1)" }} />
          </div>
          <div style={{ position: "relative", padding: "14px 16px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", textShadow: "0 1px 12px rgba(123,47,190,0.4)" }}>엄니머니</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>가족이 써주는 뉴스</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>

        {/* 페르소나 선택 */}
        <div style={{ background: "rgba(255,255,255,0.92)", padding: "8px 14px 9px", borderBottom: "1px solid rgba(162,92,222,0.1)", flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: "#C4A8E0", fontWeight: 600, marginBottom: 6, letterSpacing: "0.3px" }}>누가 설명해줄까요?</div>
          <div style={{ display: "flex", gap: 6 }}>
            {pKeys.map((k, i) => (
              <button key={k} onClick={() => setPersona(k)} style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "5px 11px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: "pointer", whiteSpace: "nowrap",
                border: persona === k ? "none" : "1px solid rgba(162,92,222,0.2)",
                background: persona === k ? "linear-gradient(135deg, #7B2FBE, #C4406A)" : "#fff",
                color: persona === k ? "#fff" : "#9B7CC0",
              }}>{pLabels[i]}</button>
            ))}
          </div>
        </div>

        {/* 피드 */}
        <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
          {NEWS.map((news, i) => (
            <NewsCard key={i} news={news} persona={persona} onOpen={() => setOpenIdx(i)} />
          ))}
        </div>

        {/* 바텀시트 오버레이 */}
        {openIdx >= 0 && (
          <BottomSheet key={openIdx + persona} news={NEWS[openIdx]} persona={persona} onClose={() => setOpenIdx(-1)} />
        )}

        {/* GNB */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderTop: "1px solid rgba(162,92,222,0.1)", padding: "9px 0 8px", display: "flex", justifyContent: "space-around", flexShrink: 0 }}>
          {[["홈", true], ["탐색", false], ["저장", false], ["나", false]].map(([label, on]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: on ? "linear-gradient(135deg,#7B2FBE,#C4406A)" : "rgba(200,180,240,0.3)" }} />
              <span style={{ fontSize: 9, fontWeight: on ? 700 : 400, background: on ? "linear-gradient(135deg,#7B2FBE,#C4406A)" : "none", WebkitBackgroundClip: on ? "text" : "unset", WebkitTextFillColor: on ? "transparent" : "#C4B3D8" }}>{label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
