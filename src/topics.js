// 投稿する話題のカテゴリと出現確率(重み)。
// 「たまに」の要望に合わせて sauna / training は控えめな重みにしてある。
export const TOPICS = [
  {
    id: "freelance",
    weight: 55,
    label: "フリーランスエンジニアとしての仕事・学び・気づき",
    guidance:
      "フリーランスエンジニアとしての日々の仕事、案件探し、技術選定、クライアントワーク、" +
      "働き方、収入や税務・確定申告あるある、モチベーション維持などから1つの切り口を選んで書く。",
  },
  {
    id: "ai",
    weight: 35,
    label: "AI・生成AI関連の話題",
    guidance:
      "AI/生成AI(LLM, Claude, ChatGPTなど)に関する最近のトレンド、開発への活用方法、" +
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
