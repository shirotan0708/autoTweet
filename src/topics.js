// 投稿する話題のカテゴリと出現確率(重み)。
// AIナレッジ専門アカウントとして、AI関連の話題のみを扱う。
// 同じ切り口に偏らないよう、AI内でも複数の角度を用意している。
export const TOPICS = [
  {
    id: "ai-tools",
    weight: 15,
    label: "色々なAIツール・サービスの使い方や特徴",
    guidance:
      "Claude, ChatGPT, Gemini, Copilot, Perplexity, Midjourneyなど様々なAIツール・サービスについて、" +
      "実際に使ってみた感想、それぞれの得意不得意、使い分け、便利な使い方Tipsなどから" +
      "1つの切り口を選んで書く。特定の1つのAIに偏りすぎないようにする。",
  },
  {
    id: "ai-dev",
    weight: 20,
    label: "AIを使った開発・仕事の実務ナレッジ",
    guidance:
      "AIコーディングツール(Claude Code, Cursor, Copilotなど)を使った開発体験、" +
      "プロンプトの工夫、AIとのペアプロで学んだこと、ハマったこと・失敗談、" +
      "業務での活用シーンなどから1つの切り口を選んで書く。",
  },
  {
    id: "claude-code-ext",
    weight: 15,
    label: "Claude Codeの拡張機能・エコシステム活用",
    guidance:
      "Claude Codeのカスタムスラッシュコマンド、サブエージェント、フック(hooks)、" +
      "MCPサーバー連携、カスタムスキル(Skills)、プラグイン、settings.jsonでのカスタマイズ、" +
      "CLAUDE.mdの書き方、CLI/IDE拡張機能などについて、実際に設定・活用してみた体験や" +
      "便利だった使い方、ハマったこと・工夫したことから1つの切り口を選んで書く。" +
      "毎回違う機能・角度を選び、同じ機能ばかり取り上げない。",
  },
  {
    id: "claude-code-plugins",
    weight: 25,
    label: "Claude Code公式プラグイン紹介",
    // guidanceは実際の投稿時にプラグイン1件分の情報で上書きされる(postTweet.js参照)。
    guidance:
      "Claude Codeの公式プラグイン一覧(https://github.com/anthropics/claude-code/tree/main/plugins)から" +
      "1つのプラグインを取り上げて、何ができるか・使うと何が嬉しいかを簡潔に紹介する。",
  },
  {
    id: "ai-trend",
    weight: 15,
    label: "AI・生成AI業界のトレンドや新しい動き",
    guidance:
      "最近のAIモデルのアップデート、新しいAIサービス・エージェント、AI業界のニュースや変化について、" +
      "一エンジニアとして感じたこと・所感を交えて1つの切り口を選んで書く。" +
      "具体的な日付や未確定の情報を断定的に書かない。",
  },
  {
    id: "ai-basics",
    weight: 10,
    label: "AIに関する豆知識・基礎的なナレッジ",
    guidance:
      "生成AIの仕組み、LLMの特性や限界、プロンプトエンジニアリングの考え方、" +
      "AIとの付き合い方などについて、実体験を交えたちょっとした気づき・豆知識として" +
      "1つの切り口を選んで書く。",
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
