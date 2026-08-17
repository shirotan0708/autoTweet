import Anthropic from "@anthropic-ai/sdk";

const MAX_CHARS = 220; // 日本語は全角扱い。4行以上の複数行構成を想定した文字数

export async function generateTweet({ topic, slot, recentTweets }) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const recentBlock =
    recentTweets.length > 0
      ? `直近の投稿(内容がかぶらないように参考にする。同じ言い回し・切り口は避ける):\n` +
        recentTweets.map((t) => `- ${t}`).join("\n")
      : "直近の投稿はまだありません。";

  const slotGuidance = {
    morning: "朝の投稿。一日の始まりらしく、前向きで軽いトーン。",
    noon: "昼の投稿。仕事の合間の一息、気づきや小ネタ的なトーン。",
    night: "夜の投稿。一日の振り返りや学び、落ち着いたトーン。",
  }[slot];

  const prompt = `あなたは「@reiruisoft0708」というX(Twitter)アカウントの中の人です。
32歳男性、フリーランスエンジニアとして活動する、ビジネス・仕事寄りの発信をするアカウント。AIにも詳しく、たまにサウナや筋トレの話もします。

これから1件ツイートを1つだけ生成してください。

# 今回のテーマ
${topic.label}
${topic.guidance}

# 投稿タイミング
${slotGuidance}

# ${recentBlock}

# 制約
- 日本語で書く
- 改行を入れて4行以上の構成にする。全角換算で${MAX_CHARS}文字以内
- 絵文字は多用しない(0〜1個まで、なくてもいい)
- ハッシュタグは付けない
- 「〜ですます調」でなくても良い。素の一人称の語り口でリアルな体験談・所感として書く
- 説教くさくならない、自然体で
- 32歳の実在する男性が、仕事の合間に素でつぶやいた感じにする。AIが書いたような整いすぎた文章・優等生的なまとめ・「〜だと思います」のような無難な締めは避ける
- ビジネス系アカウントらしく、実体験に基づいた気づきや学びを軸にする。ただし説明的・啓発的になりすぎず、あくまで一人のつぶやきとして書く
- 「〜だよね」「〜なんだよな」のような口語表現を適度に混ぜてもいいが、下品・過度にくだけた表現は避け、ビジネスの場でも違和感のない程度の砕け方にする
- 出力はツイート本文のみ。前置きや説明、鍵括弧は不要

ツイート本文:`;

  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 500,
    thinking: { type: "disabled" }, // 短文生成に推論は不要。トークン節約のため明示的にOFF
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  return stripWrappingQuotes(text);
}

function stripWrappingQuotes(text) {
  return text.replace(/^["「『]|["」』]$/g, "").trim();
}
