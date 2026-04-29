// MVP: 랜딩 페이지 + 글로벌 nav 만 번역.
// 앱 내부(/feed, /study, /stocks)는 ko 만 유지 — Phase 2 에서 ja 콘텐츠 풀 번역.

export type Locale = "ko" | "ja";

export interface Messages {
  brand: {
    name1: string; // "엄니" / "おかん"
    name2: string; // "머니" / "マネー"
    tagline: string;
  };
  nav: {
    cta: string;
    ctaForLogged: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2a: string;
    titleLine2b: string;
    titleLine3: string;
    sub: string;
    primaryCta: string;
    secondaryCta: string;
  };
  how: {
    label: string;
    title: string;
    steps: Array<{ title: string; desc: string }>;
  };
  speakers: {
    label: string;
    title: string;
    sub: string;
    cards: Array<{ emoji: string; name: string; tone: string; sample: string }>;
  };
  features: {
    label: string;
    title: string;
    items: Array<{ icon: string; title: string; desc: string }>;
  };
  pricing: {
    label: string;
    title: string;
    sub: string;
    earlyBirdNote: string;
    free: {
      name: string;
      price: string;
      unit: string;
      desc: string;
      perks: string[];
      cta: string;
    };
    monthly: {
      name: string;
      price: string;
      unit: string;
      desc: string;
      perks: string[];
      badge: string;
      cta: string;
    };
    lifetime: {
      name: string;
      price: string;
      unit: string;
      originalPrice: string;
      desc: string;
      perks: string[];
      badge: string;
      cta: string;
      ctaSub: string;
    };
  };
  referral: {
    label: string;
    title: string;
    sub: string;
    inviterTitle: string;
    inviterDesc: string;
    inviterReward: string;
    inviteeTitle: string;
    inviteeDesc: string;
    inviteeReward: string;
  };
  finalCta: {
    title: string;
    sub: string;
    button: string;
  };
  footer: {
    line: string;
  };
  authError: string;
  langSwitch: {
    ko: string;
    ja: string;
  };
}

const ko: Messages = {
  brand: {
    name1: "엄니",
    name2: "머니",
    tagline: "엄마의 첫 번째 머니 앱",
  },
  nav: {
    cta: "카카오로 시작하기",
    ctaForLogged: "내 피드로 가기 →",
  },
  hero: {
    badge: "👦 아들딸이 직접 설명해드려요",
    titleLine1: "엄마도 이제",
    titleLine2a: "주식 뉴스",
    titleLine2b: "가",
    titleLine3: "쉬워져요",
    sub: "어려운 금융 뉴스를 아들, 딸, 며느리, 사위가\n엄마한테 설명해주듯 바꿔드려요.\n초등학교 3학년도 이해하는 수준으로요!",
    primaryCta: "카카오로 시작하기",
    secondaryCta: "서비스 둘러보기 ↓",
  },
  how: {
    label: "어떻게 작동하나요",
    title: "딱 3단계면 끝이에요",
    steps: [
      {
        title: "화자를 선택해요",
        desc: "아들, 딸, 며느리, 사위 중에 골라요. 엄마 이름도 넣으면 더 따뜻해요.",
      },
      {
        title: "오늘 뉴스를 봐요",
        desc: "어려운 금융 뉴스가 가족 말투 말풍선으로 변환돼요. 용어는 하나도 없어요.",
      },
      {
        title: "궁금하면 눌러요",
        desc: '"어려워요" 또는 "더 알고 싶어요"를 누르면 수준에 맞게 다시 설명해줘요.',
      },
    ],
  },
  speakers: {
    label: "화자 선택",
    title: "말투가 완전히 달라져요",
    sub: "같은 뉴스도 아들이 말하는 것과 며느리가 말하는 게 느낌이 달라야죠.",
    cards: [
      {
        emoji: "👦",
        name: "아들",
        tone: "친근하고 편안하게",
        sample: '"엄마~ 이게 뭐냐면, 쉽게 말하면 이자가 그대로래. 걱정 마!"',
      },
      {
        emoji: "👧",
        name: "딸",
        tone: "다정하고 수다스럽게",
        sample: '"엄마~! 있잖아, 오늘 진짜 중요한 뉴스 있어. 이거 꼭 알아야 해!"',
      },
      {
        emoji: "👩",
        name: "며느리",
        tone: "공손하고 따뜻하게",
        sample: '"어머니, 제가 쉽게 설명드릴게요. 오늘 좋은 소식이 있었어요!"',
      },
      {
        emoji: "👨",
        name: "사위",
        tone: "정중하고 깔끔하게",
        sample: '"어머니, 말씀드리자면 오늘 시장에 좋은 흐름이 있었습니다."',
      },
    ],
  },
  features: {
    label: "주요 기능",
    title: "엄마를 위해 만든\n모든 것",
    items: [
      {
        icon: "📰",
        title: "매일 아침 뉴스 말풍선",
        desc: "미국 주요 뉴스를 매일 새벽 정리해서 가족 말투로 바꿔드려요. 어려운 용어는 하나도 없어요.",
      },
      {
        icon: "🤔",
        title: "왜 싸졌어? 왜 비싸졌어?",
        desc: "회사 주가가 왜 올랐는지 내렸는지, 관련 뉴스를 연결해서 이유를 설명해드려요.",
      },
      {
        icon: "🛒",
        title: "컬리처럼 쉬운 종목 화면",
        desc: '"지금 저렴해요", "요즘 뜨는 중" 배지로 한눈에 확인. 찜하기도 장바구니처럼 쉬워요.',
      },
      {
        icon: "📚",
        title: "단계별 공부방",
        desc: "회사 조각이 뭔지부터 차근차근. 두올링고처럼 하루 하나씩 배워가요.",
      },
    ],
  },
  pricing: {
    label: "요금제",
    title: "부담 없이 시작해요",
    sub: "처음엔 무료로 충분히 써보세요.",
    earlyBirdNote: "⚡ 얼리버드 한정 — 나중엔 79,900원으로 올라요",
    free: {
      name: "무료",
      price: "0",
      unit: "원",
      desc: "일단 써보세요",
      perks: ["하루 뉴스 5개", "화자 1명 선택", "공부방 2단계", "찜 종목 3개"],
      cta: "무료로 시작",
    },
    monthly: {
      name: "월 구독",
      price: "4,900",
      unit: "원/월",
      desc: "커피 한 잔 값으로",
      perks: [
        "뉴스 무제한",
        "화자 전체 선택",
        "공부방 전체 오픈",
        "찜 종목 무제한",
        "더 알고싶어요 무제한",
      ],
      badge: "가장 인기",
      cta: "구독 시작하기",
    },
    lifetime: {
      name: "평생 이용권",
      price: "49,900",
      unit: "원",
      originalPrice: "정가 79,900원",
      desc: "한 번만 내고 평생 써요",
      perks: [
        "구독 혜택 전부 포함",
        "추후 기능도 무료",
        "월 구독 대비 50% 절약",
        "얼리버드 전용 배지",
      ],
      badge: "⚡ 얼리버드",
      cta: "얼리버드로 시작하기",
      ctaSub: "🔥 선착순 100명 한정",
    },
  },
  referral: {
    label: "친구 초대",
    title: "3명만 초대하면\n1개월 무료예요",
    sub: "초대한 사람도, 초대받은 사람도 둘 다 혜택이 있어요.",
    inviterTitle: "초대한 나",
    inviterDesc: "친구 3명이 가입하면\n구독 1개월 무료!",
    inviterReward: "3명 → +1개월 무료\n6명 → +2개월 무료\n계속 쌓여요 ♾️",
    inviteeTitle: "초대받은 친구",
    inviteeDesc: "초대 링크로 가입하면\n첫 달 50% 할인!",
    inviteeReward: "첫 달 4,900원 →\n2,450원",
  },
  finalCta: {
    title: "엄마한테 지금\n보내드리세요 💜",
    sub: "어려운 주식, 이제 아들딸이 설명해드려요.\n엄마도 할 수 있어요.",
    button: "카카오로 시작하기",
  },
  footer: {
    line: "© 2026 엄니머니. 엄마의 첫 번째 머니 앱.",
  },
  authError: "로그인 실패",
  langSwitch: { ko: "한국어", ja: "日本語" },
};

const ja: Messages = {
  brand: {
    name1: "おかん",
    name2: "マネー",
    tagline: "お母さんのはじめてのマネーアプリ",
  },
  nav: {
    cta: "LINEではじめる",
    ctaForLogged: "マイフィードへ →",
  },
  hero: {
    badge: "👦 息子・娘が直接説明します",
    titleLine1: "お母さんも今日から",
    titleLine2a: "株のニュース",
    titleLine2b: "が",
    titleLine3: "やさしくなる",
    sub: "むずかしい経済ニュースを、息子・娘・嫁・婿が\nお母さんに話しかけるようにやさしく変えてお届け。\n小学3年生でもわかる言葉で!",
    primaryCta: "LINEではじめる",
    secondaryCta: "サービスを見てみる ↓",
  },
  how: {
    label: "つかい方",
    title: "たった3ステップ",
    steps: [
      {
        title: "話し手を選ぶ",
        desc: "息子・娘・嫁・婿から選びます。お母さんの名前も入れるともっと温かい雰囲気に。",
      },
      {
        title: "今日のニュースを見る",
        desc: "むずかしい経済ニュースが、家族の話し方の吹き出しに変身。専門用語ゼロ。",
      },
      {
        title: "気になったら押すだけ",
        desc: "「むずかしい」「もっと知りたい」を押すと、レベルに合わせて言い直してくれます。",
      },
    ],
  },
  speakers: {
    label: "話し手の選択",
    title: "しゃべり方が\nまるっと変わる",
    sub: "同じニュースでも、息子と嫁では伝わり方が違うはず。",
    cards: [
      {
        emoji: "👦",
        name: "息子",
        tone: "気さくに、やさしく",
        sample:
          '"お母さん、これはね、簡単に言うと金利が今のままなんだって。心配しないで!"',
      },
      {
        emoji: "👧",
        name: "娘",
        tone: "明るく、おしゃべり風に",
        sample:
          '"ねえお母さん!今日めっちゃ大事なニュースあるよ。これだけは知っといて!"',
      },
      {
        emoji: "👩",
        name: "嫁",
        tone: "丁寧で、あたたかく",
        sample:
          '"お義母さん、わかりやすくご説明しますね。今日はうれしい話がありました。"',
      },
      {
        emoji: "👨",
        name: "婿",
        tone: "礼儀正しく、すっきりと",
        sample:
          '"お義母さん、申し上げますと、本日は市場に良い流れが見られました。"',
      },
    ],
  },
  features: {
    label: "主な機能",
    title: "お母さんのために\n作ったぜんぶ",
    items: [
      {
        icon: "📰",
        title: "毎朝のニュース吹き出し",
        desc: "アメリカの主要ニュースを毎朝まとめて、家族の話し方に変えてお届け。専門用語はゼロ。",
      },
      {
        icon: "🤔",
        title: "なぜ下がった?なぜ上がった?",
        desc: "株価が動いた理由を、関連ニュースとつなげてやさしく解説します。",
      },
      {
        icon: "🛒",
        title: "ネットスーパー風の銘柄画面",
        desc: '"今お買い得"、"いま人気" のバッジでひと目でわかる。お気に入りもカゴ感覚で。',
      },
      {
        icon: "📚",
        title: "ステップ式の学び部屋",
        desc: "「会社のかけらって何?」から、ゆっくりと。Duolingo のように毎日ひとつずつ。",
      },
    ],
  },
  pricing: {
    label: "料金プラン",
    title: "気軽にスタート",
    sub: "まずは無料でじっくり試してください。",
    earlyBirdNote: "⚡ アーリーバード限定 — 後で 7,900 円に上がります",
    free: {
      name: "無料",
      price: "0",
      unit: "円",
      desc: "とりあえず使ってみる",
      perks: [
        "1日にニュース 5本",
        "話し手 1名",
        "学び部屋 ステップ2まで",
        "お気に入り銘柄 3つ",
      ],
      cta: "無料ではじめる",
    },
    monthly: {
      name: "月額プラン",
      price: "490",
      unit: "円/月",
      desc: "コーヒー1杯のお値段で",
      perks: [
        "ニュース無制限",
        "話し手すべて選択可",
        "学び部屋すべて開放",
        "お気に入り銘柄無制限",
        "もっと知りたい無制限",
      ],
      badge: "人気No.1",
      cta: "サブスクをはじめる",
    },
    lifetime: {
      name: "永久ライセンス",
      price: "4,900",
      unit: "円",
      originalPrice: "通常 7,900 円",
      desc: "1回払いでずっと使える",
      perks: [
        "サブスク特典をすべて含む",
        "今後の新機能も無料",
        "月額換算で 50% お得",
        "アーリーバード限定バッジ",
      ],
      badge: "⚡ アーリーバード",
      cta: "アーリーバードではじめる",
      ctaSub: "🔥 先着 100 名様限定",
    },
  },
  referral: {
    label: "ご紹介",
    title: "3人ご紹介で\n1か月無料",
    sub: "招待した方も、招待された方も、両方にうれしい特典。",
    inviterTitle: "ご紹介した方",
    inviterDesc: "お友だち3人が登録すると\nサブスク1か月無料!",
    inviterReward:
      "3人 → +1か月無料\n6人 → +2か月無料\nどんどん貯まります ♾️",
    inviteeTitle: "ご紹介された方",
    inviteeDesc: "招待リンク経由のご登録で\n初月 50% オフ!",
    inviteeReward: "初月 490 円 →\n245 円",
  },
  finalCta: {
    title: "今日、お母さんに\n送ってあげましょう 💜",
    sub: "むずかしかった株、これからは息子・娘がご案内。\nお母さんもきっとできる。",
    button: "LINEではじめる",
  },
  footer: {
    line: "© 2026 おかんマネー. お母さんのはじめてのマネーアプリ.",
  },
  authError: "ログインに失敗しました",
  langSwitch: { ko: "한국어", ja: "日本語" },
};

export const MESSAGES: Record<Locale, Messages> = { ko, ja };
