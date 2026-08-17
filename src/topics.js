// 投稿する話題のカテゴリと出現確率(重み)。
// 「たまに」の要望に合わせて sauna / training は控えめな重みにしてある。
// フリーランス色は薄め、Webエンジニアとしての技術寄りの話題を中心に。
export const TOPICS = [
  {
    id: "webdev",
    weight: 45,
    label: "Webエンジニアとしての技術的な仕事・学び・気づき",
    guidance:
      "Webエンジニアとしての日々の開発、フロントエンド/バックエンドの技術選定、設計判断、" +
      "コードレビュー、パフォーマンス改善、ハマったバグや解決したこと、便利なツール・ライブラリ、" +
      "開発ワークフローの工夫などから1つの切り口を選んで書く。",
  },
  {
    id: "freelance",
    weight: 15,
    label: "フリーランスとしての働き方",
    guidance:
      "フリーランスエンジニアとしての働き方、案件探し、クライアントワーク、モチベーション維持などから" +
      "1つの切り口を選んで書く。税務・確定申告など特定の時期に強く依存する話題は避ける。",
  },
  {
    id: "ai",
    weight: 30,
    label: "AI・生成AI関連の話題",
    guidance:
      "AI/生成AI(LLM, Claude, ChatGPTなど)に関する最近のトレンド、Web開発への活用方法、" +
      "便利なツールやワークフロー、AIを使った開発体験について、実務目線で書く。",
  },
  {
    id: "sauna",
    weight: 5,
    label: "サウナ",
    guidance:
      "サウナに行った感想、ととのい体験、サウナと仕事のオンオフの切り替えについて、" +
      "リラックスした軽いトーンで書く。",
  },
  {
    id: "training",
    weight: 5,
    label: "筋トレ",
    guidance:
      "筋トレの記録、継続のコツ、デスクワークと運動の両立、体調管理について、" +
      "前向きなトーンで書く。",
  },
];

export function pickTopic(random = Math.random) {
  const total = TOPICS.reduce((sum, t) => sum + t.weight, 0);
  let r = random() * total;
  for (const topic of TOPICS) {
    if (r < topic.weight) return topic;
    r -= topic.weight;
  }
  return TOPICS[0];
}
