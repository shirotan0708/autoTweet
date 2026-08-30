import Anthropic from "@anthropic-ai/sdk";

// X(Twitter)は全角文字を加重2としてカウントし、非Premiumアカウントは加重280文字が上限。
// 全角前提でも安全マージンを持たせて130文字(加重約260)を目安にする。
const MAX_CHARS = 115;

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

  const todayLabel = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());

  const prompt = `あなたは「@reiruisoft0708」というX(Twitter)アカウントの中の人です。
32歳男性、Webエンジニア(フリーランス)として活動する、AIナレッジ専門の発信をするアカウント。Claude, ChatGPT, Gemini, Copilotなど様々なAIツールを実務で使い倒していて、実体験ベースの気づき・Tips・所感を発信する。

これから1件ツイートを1つだけ生成してください。

# 今日の日付
${todayLabel}(日本時間)

# 今回のテーマ
${topic.label}
${topic.guidance}

# 投稿タイミング
${slotGuidance}

# ${recentBlock}

# 制約
- 日本語で書く
- 改行を入れて4行以上の構成にする。全角換算で${MAX_CHARS}文字以内
- 上記の「今日の日付」の時期に合わない話題は書かない(例: 確定申告は1〜3月、忘年会は12月、花見は3〜4月の話。今が違う時期ならその話題は選ばない)
- 曜日に言及する場合は、必ず上記の「今日の日付」の実際の曜日と一致させる(例: 実際は火曜日なのに「日曜の朝」のように書かない)。曜日が分からなくても成立する内容なら、無理に曜日を書かなくてよい
- 絵文字は多用しない(0〜1個まで、なくてもいい)
- ハッシュタグは付けない
- 「〜ですます調」でなくても良い。素の一人称の語り口でリアルな体験談・所感として書く
- 説教くさくならない、自然体で
- 32歳の実在する男性が、仕事の合間に素でつぶやいた感じにする。AIが書いたような整いすぎた文章・優等生的なまとめ・「〜だと思います」のような無難な締めは避ける
- ビジネス系アカウントらしく、実体験に基づいた気づきや学びを軸にする。ただし説明的・啓発的になりすぎず、あくまで一人のつぶやきとして書く
- 「〜だよね」「〜なんだよな」のような口語表現を適度に混ぜてもいいが、下品・過度にくだけた表現は避け、ビジネスの場でも違和感のない程度の砕け方にする
- 出力はツイート本文のみ。前置きや説明、鍵括弧は不要
- 書き出しの1文目で曜日や時間帯(朝/昼/夜/深夜/早朝/週末など)に一切触れない。「水曜の朝、」「夜、」のような形はもちろん、文中のどこであっても曜日・時間帯の言及から書き始めるのは禁止。本題の出来事や気づきから書き始める
- 「今週はこれを試してみる」「今日はこれだった」「コーヒー淹れながらそんな朝の気づき」のような、話をまとめて締めるテンプレ的な結びも使わない。特に最後の一文で曜日・時間帯・シチュエーション(朝の/コーヒー淹れながら等)を持ち出して出来事にラベルを貼るような締め方は禁止。余韻を残す一言や具体的な気づきで終える
- 全角換算で${MAX_CHARS}文字は厳守の上限。書いてから文字数を数え、超えていたら削って収める

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
