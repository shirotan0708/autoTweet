import { TwitterApi } from "twitter-api-v2";
import { generateTweet } from "./generateTweet.js";
import { pickTopic } from "./topics.js";
import { readLog, appendLog, recentTexts } from "./log.js";

const VALID_SLOTS = ["morning", "noon", "night"];
const MAX_WEIGHTED_CHARS = 280; // X非Premiumアカウントの上限

// Xの文字カウント仕様に準じた簡易実装(全角相当の文字は加重2、それ以外は1)
function weightedLength(text) {
  let length = 0;
  for (const ch of text) {
    length += ch.codePointAt(0) > 0x2e7f ? 2 : 1;
  }
  return length;
}

async function main() {
  const slot = process.env.SLOT;
  if (!VALID_SLOTS.includes(slot)) {
    throw new Error(
      `SLOT env var must be one of ${VALID_SLOTS.join(", ")} (got: ${slot})`
    );
  }

  const topic = pickTopic();
  const log = await readLog();
  const text = await generateTweet({
    topic,
    slot,
    recentTweets: recentTexts(log),
  });

  if (!text) {
    throw new Error("Generated tweet text was empty");
  }
  const weighted = weightedLength(text);
  console.log(
    `[${slot}] topic=${topic.id}\n${text}\n(length: ${text.length}, weighted: ${weighted})`
  );
  if (weighted > MAX_WEIGHTED_CHARS) {
    await appendLog(log, {
      text,
      topic: topic.id,
      slot,
      tweetId: null,
      dryRun: false,
      error: `weighted length ${weighted} exceeds ${MAX_WEIGHTED_CHARS}`,
      postedAt: new Date().toISOString(),
    });
    throw new Error(
      `Generated tweet exceeds weighted length limit (${weighted} > ${MAX_WEIGHTED_CHARS})`
    );
  }

  const dryRun = process.env.DRY_RUN === "true";
  let tweetId = null;

  if (dryRun) {
    console.log("DRY_RUN=true のため実際の投稿はスキップしました。");
  } else {
    const client = new TwitterApi({
      appKey: requireEnv("TWITTER_API_KEY"),
      appSecret: requireEnv("TWITTER_API_SECRET"),
      accessToken: requireEnv("TWITTER_ACCESS_TOKEN"),
      accessSecret: requireEnv("TWITTER_ACCESS_SECRET"),
    });
    try {
      const result = await client.v2.tweet(text);
      tweetId = result.data.id;
      console.log(`投稿しました: https://x.com/reiruisoft0708/status/${tweetId}`);
    } catch (err) {
      await appendLog(log, {
        text,
        topic: topic.id,
        slot,
        tweetId: null,
        dryRun: false,
        error: err?.data ? JSON.stringify(err.data) : String(err),
        postedAt: new Date().toISOString(),
      });
      throw err;
    }
  }

  await appendLog(log, {
    text,
    topic: topic.id,
    slot,
    tweetId,
    dryRun,
    postedAt: new Date().toISOString(),
  });
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
