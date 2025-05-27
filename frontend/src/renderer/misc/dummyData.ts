export interface KanjiInfo {
  kanji: string;
  meanings: string[];
  onYomi: string[];
  kunYomi: string[];
  strokeCount: number;
  jlptLevel: string;
  frequency: number;
}

export const kanjiDatabase: Record<string, KanjiInfo> = {
  私: {
    kanji: "私",
    meanings: ["I", "me", "myself", "private"],
    onYomi: ["シ"],
    kunYomi: ["わたくし", "わたし"],
    strokeCount: 7,
    jlptLevel: "N5",
    frequency: 45,
  },
  日: {
    kanji: "日",
    meanings: ["day", "sun", "Japan"],
    onYomi: ["ニチ", "ジツ"],
    kunYomi: ["ひ", "か"],
    strokeCount: 4,
    jlptLevel: "N5",
    frequency: 1,
  },
  本: {
    kanji: "本",
    meanings: ["book", "origin", "main"],
    onYomi: ["ホン"],
    kunYomi: ["もと"],
    strokeCount: 5,
    jlptLevel: "N5",
    frequency: 10,
  },
  語: {
    kanji: "語",
    meanings: ["language", "word", "speech"],
    onYomi: ["ゴ"],
    kunYomi: ["かた.る", "かた.らう"],
    strokeCount: 14,
    jlptLevel: "N5",
    frequency: 301,
  },
  勉: {
    kanji: "勉",
    meanings: ["exertion", "endeavour", "encourage"],
    onYomi: ["ベン"],
    kunYomi: ["つと.める"],
    strokeCount: 10,
    jlptLevel: "N4",
    frequency: 1156,
  },
  強: {
    kanji: "強",
    meanings: ["strong", "force", "strain"],
    onYomi: ["キョウ", "ゴウ"],
    kunYomi: ["つよ.い", "つよ.まる", "つよ.める"],
    strokeCount: 12,
    jlptLevel: "N5",
    frequency: 517,
  },
  学: {
    kanji: "学",
    meanings: ["study", "learning", "science"],
    onYomi: ["ガク"],
    kunYomi: ["まな.ぶ"],
    strokeCount: 8,
    jlptLevel: "N5",
    frequency: 86,
  },
  漢: {
    kanji: "漢",
    meanings: ["Sino-", "China", "man"],
    onYomi: ["カン"],
    kunYomi: ["おとこ"],
    strokeCount: 13,
    jlptLevel: "N3",
    frequency: 1580,
  },
  字: {
    kanji: "字",
    meanings: ["character", "letter", "word"],
    onYomi: ["ジ"],
    kunYomi: ["あざ", "あざな"],
    strokeCount: 6,
    jlptLevel: "N4",
    frequency: 755,
  },
  難: {
    kanji: "難",
    meanings: ["difficult", "impossible", "trouble"],
    onYomi: ["ナン"],
    kunYomi: ["かた.い", "むずか.しい"],
    strokeCount: 18,
    jlptLevel: "N3",
    frequency: 1089,
  },
  面: {
    kanji: "面",
    meanings: ["mask", "face", "features", "surface"],
    onYomi: ["メン", "ベン"],
    kunYomi: ["おも", "おもて", "つら"],
    strokeCount: 9,
    jlptLevel: "N3",
    frequency: 398,
  },
  白: {
    kanji: "白",
    meanings: ["white"],
    onYomi: ["ハク", "ビャク"],
    kunYomi: ["しろ", "しら-", "しろ.い"],
    strokeCount: 5,
    jlptLevel: "N5",
    frequency: 349,
  },
  今: {
    kanji: "今",
    meanings: ["now"],
    onYomi: ["コン", "キン"],
    kunYomi: ["いま"],
    strokeCount: 4,
    jlptLevel: "N5",
    frequency: 41,
  },
}
