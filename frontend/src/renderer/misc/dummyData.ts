export interface KanjiInfo {
  kanji: string;
  meanings: string[];
  onYomi: string[];
  kunYomi: string[];
  strokeCount: number;
  jlptLevel: string;
  frequency: number;
  examples: {
    word: string;
    reading: string;
    meaning: string;
  }[];
  sentences: {
    japanese: string;
    reading: string;
    english: string;
  }[];
  similar: {
    kanji: string;
    reason: string;
    similarity: string;
  }[];
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
    examples: [
      { word: "私立", reading: "しりつ", meaning: "private (institution)" },
      { word: "私生活", reading: "しせいかつ", meaning: "private life" },
    ],
    sentences: [
      {
        japanese: "私の名前は田中です。",
        reading: "わたしの なまえは たなかです。",
        english: "My name is Tanaka.",
      },
    ],
    similar: [
      { kanji: "僕", reason: "Pronoun", similarity: "I (male)" },
      { kanji: "俺", reason: "Pronoun", similarity: "I (informal male)" },
    ],
  },
  日: {
    kanji: "日",
    meanings: ["day", "sun", "Japan"],
    onYomi: ["ニチ", "ジツ"],
    kunYomi: ["ひ", "か"],
    strokeCount: 4,
    jlptLevel: "N5",
    frequency: 1,
    examples: [
      { word: "今日", reading: "きょう", meaning: "today" },
      { word: "日本", reading: "にほん", meaning: "Japan" },
      { word: "毎日", reading: "まいにち", meaning: "every day" },
      { word: "日曜日", reading: "にちようび", meaning: "Sunday" },
    ],
    sentences: [
      {
        japanese: "今日はいい天気ですね。",
        reading: "きょうは いい てんきですね。",
        english: "The weather is nice today, isn't it?",
      },
      {
        japanese: "日本の文化は面白いです。",
        reading: "にほんの ぶんかは おもしろいです。",
        english: "Japanese culture is interesting.",
      },
    ],
    similar: [
      { kanji: "月", reason: "Time period", similarity: "calendar" },
      { kanji: "年", reason: "Time unit", similarity: "time" },
      { kanji: "時", reason: "Time concept", similarity: "time" },
    ],
  },
  本: {
    kanji: "本",
    meanings: ["book", "origin", "main"],
    onYomi: ["ホン"],
    kunYomi: ["もと"],
    strokeCount: 5,
    jlptLevel: "N5",
    frequency: 10,
    examples: [
      { word: "本", reading: "ほん", meaning: "book" },
      { word: "日本", reading: "にほん", meaning: "Japan" },
      { word: "本当", reading: "ほんとう", meaning: "truth, really" },
      { word: "基本", reading: "きほん", meaning: "basics, foundation" },
    ],
    sentences: [
      {
        japanese: "この本はとても面白いです。",
        reading: "この ほんは とても おもしろいです。",
        english: "This book is very interesting.",
      },
      {
        japanese: "本当にありがとうございます。",
        reading: "ほんとうに ありがとうございます。",
        english: "Thank you very much.",
      },
    ],
    similar: [
      { kanji: "書", reason: "Related to books", similarity: "writing" },
      { kanji: "読", reason: "Book activity", similarity: "reading" },
      { kanji: "文", reason: "Text/writing", similarity: "literature" },
    ],
  },
  語: {
    kanji: "語",
    meanings: ["language", "word", "speech"],
    onYomi: ["ゴ"],
    kunYomi: ["かた.る", "かた.らう"],
    strokeCount: 14,
    jlptLevel: "N5",
    frequency: 301,
    examples: [
      { word: "言語", reading: "げんご", meaning: "language" },
      { word: "単語", reading: "たんご", meaning: "word, vocabulary" },
    ],
    sentences: [
      {
        japanese: "英語を話せますか。",
        reading: "えいごを はなせますか。",
        english: "Can you speak English?",
      },
    ],
    similar: [
      { kanji: "話", reason: "Related to speech", similarity: "speak" },
      { kanji: "言", reason: "Related to words", similarity: "say" },
    ],
  },
  勉: {
    kanji: "勉",
    meanings: ["exertion", "endeavour", "encourage"],
    onYomi: ["ベン"],
    kunYomi: ["つと.める"],
    strokeCount: 10,
    jlptLevel: "N4",
    frequency: 1156,
    examples: [
      { word: "勉強", reading: "べんきょう", meaning: "study" },
      { word: "勤勉", reading: "きんべん", meaning: "diligence" },
    ],
    sentences: [
      {
        japanese: "毎日、日本語を勉強しています。",
        reading: "まいにち、にほんごを べんきょうしています。",
        english: "I study Japanese every day.",
      },
    ],
    similar: [
      { kanji: "強", reason: "Related to effort", similarity: "strong" },
      { kanji: "学", reason: "Related to study", similarity: "learn" },
    ],
  },
  強: {
    kanji: "強",
    meanings: ["strong", "force", "strain"],
    onYomi: ["キョウ", "ゴウ"],
    kunYomi: ["つよ.い", "つよ.まる", "つよ.める"],
    strokeCount: 12,
    jlptLevel: "N5",
    frequency: 517,
    examples: [
      { word: "強力", reading: "きょうりょく", meaning: "powerful" },
      { word: "強風", reading: "きょうふう", meaning: "strong wind" },
    ],
    sentences: [
      {
        japanese: "彼は強いです。",
        reading: "かれは つよいです。",
        english: "He is strong.",
      },
    ],
    similar: [
      { kanji: "力", reason: "Related to strength", similarity: "power" },
      { kanji: "勉", reason: "Related to effort", similarity: "exertion" },
    ],
  },
  学: {
    kanji: "学",
    meanings: ["study", "learning", "science"],
    onYomi: ["ガク"],
    kunYomi: ["まな.ぶ"],
    strokeCount: 8,
    jlptLevel: "N5",
    frequency: 86,
    examples: [
      { word: "学校", reading: "がっこう", meaning: "school" },
      { word: "学生", reading: "がくせい", meaning: "student" },
      { word: "大学", reading: "だいがく", meaning: "university" },
      { word: "学習", reading: "がくしゅう", meaning: "learning" },
    ],
    sentences: [
      {
        japanese: "私は日本語を学んでいます。",
        reading: "わたしは にほんごを まなんでいます。",
        english: "I am studying Japanese.",
      },
      {
        japanese: "彼は東京大学の学生です。",
        reading: "かれは とうきょうだいがくの がくせいです。",
        english: "He is a student at Tokyo University.",
      },
    ],
    similar: [
      { kanji: "校", reason: "Same meaning field", similarity: "education" },
      { kanji: "習", reason: "Related meaning", similarity: "learning" },
      { kanji: "教", reason: "Education context", similarity: "teaching" },
    ],
  },
  漢: {
    kanji: "漢",
    meanings: ["Sino-", "China", "man"],
    onYomi: ["カン"],
    kunYomi: ["おとこ"],
    strokeCount: 13,
    jlptLevel: "N3",
    frequency: 1580,
    examples: [
      { word: "漢字", reading: "かんじ", meaning: "Kanji" },
      { word: "漢方薬", reading: "かんぽうやく", meaning: "Chinese herbal medicine" },
    ],
    sentences: [
      {
        japanese: "漢字を読むのは難しいです。",
        reading: "かんじを よむのは むずかしいです。",
        english: "Reading Kanji is difficult.",
      },
    ],
    similar: [
      { kanji: "字", reason: "Related to characters", similarity: "character" },
      { kanji: "人", reason: "Related to man", similarity: "person" },
    ],
  },
  字: {
    kanji: "字",
    meanings: ["character", "letter", "word"],
    onYomi: ["ジ"],
    kunYomi: ["あざ", "あざな"],
    strokeCount: 6,
    jlptLevel: "N4",
    frequency: 755,
    examples: [
      { word: "文字", reading: "もじ", meaning: "letter, character" },
      { word: "数字", reading: "すうじ", meaning: "number, digit" },
    ],
    sentences: [
      {
        japanese: "この字は何ですか。",
        reading: "この じは なんですか。",
        english: "What is this character?",
      },
    ],
    similar: [
      { kanji: "漢", reason: "Related to characters", similarity: "kanji" },
      { kanji: "文", reason: "Related to text", similarity: "sentence" },
    ],
  },
  難: {
    kanji: "難",
    meanings: ["difficult", "impossible", "trouble"],
    onYomi: ["ナン"],
    kunYomi: ["かた.い", "むずか.しい"],
    strokeCount: 18,
    jlptLevel: "N3",
    frequency: 1089,
    examples: [
      { word: "困難", reading: "こんなん", meaning: "difficulty, hardship" },
      { word: "避難", reading: "ひなん", meaning: "evacuation" },
    ],
    sentences: [
      {
        japanese: "この問題は難しいです。",
        reading: "この もんだいは むずかしいです。",
        english: "This problem is difficult.",
      },
    ],
    similar: [
      { kanji: "困", reason: "Related to difficulty", similarity: "trouble" },
      { kanji: "苦", reason: "Related to hardship", similarity: "suffering" },
    ],
  },
  面: {
    kanji: "面",
    meanings: ["mask", "face", "features", "surface"],
    onYomi: ["メン", "ベン"],
    kunYomi: ["おも", "おもて", "つら"],
    strokeCount: 9,
    jlptLevel: "N3",
    frequency: 398,
    examples: [
      { word: "顔面", reading: "がんめん", meaning: "face" },
      { word: "面白い", reading: "おもしろい", meaning: "interesting, funny" },
    ],
    sentences: [
      {
        japanese: "彼の顔は面白いです。",
        reading: "かれの かおは おもしろいです。",
        english: "His face is funny.",
      },
    ],
    similar: [
      { kanji: "顔", reason: "Related to face", similarity: "face" },
      { kanji: "表", reason: "Related to surface", similarity: "surface" },
    ],
  },
  白: {
    kanji: "白",
    meanings: ["white"],
    onYomi: ["ハク", "ビャク"],
    kunYomi: ["しろ", "しら-", "しろ.い"],
    strokeCount: 5,
    jlptLevel: "N5",
    frequency: 349,
    examples: [
      { word: "白黒", reading: "しろくろ", meaning: "black and white" },
      { word: "面白い", reading: "おもしろい", meaning: "interesting" },
    ],
    sentences: [
      {
        japanese: "白い猫が好きです。",
        reading: "しろい ねこが すきです。",
        english: "I like white cats.",
      },
    ],
    similar: [
      { kanji: "黒", reason: "Opposite color", similarity: "black" },
      { kanji: "色", reason: "Related to color", similarity: "color" },
    ],
  },
  今: {
    kanji: "今",
    meanings: ["now"],
    onYomi: ["コン", "キン"],
    kunYomi: ["いま"],
    strokeCount: 4,
    jlptLevel: "N5",
    frequency: 41,
    examples: [
      { word: "今日", reading: "きょう", meaning: "today" },
      { word: "今週", reading: "こんしゅう", meaning: "this week" },
    ],
    sentences: [
      {
        japanese: "今、何をしていますか。",
        reading: "いま、なにを していますか。",
        english: "What are you doing now?",
      },
    ],
    similar: [
      { kanji: "現", reason: "Related to present", similarity: "present" },
      { kanji: "近", reason: "Related to near time", similarity: "near" },
    ],
  },
};
