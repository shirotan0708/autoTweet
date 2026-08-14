import { TwitterApi } from "twitter-api-v2";
import { generateTweet } from "./generateTweet.js";
import { pickTopic } from "./topics.js";
import { readLog, appendLog, recentTexts } from "./log.js";

const VALID_SLOTS = ["morning", "noon", "night"];

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
  console.log(`[${slot}] topic=${topic.id}\n${text}\n(length: ${text.length})`);

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
    const result = await client.v2.tweet(text);
    tweetId = result.data.id;
    console.log(`投稿しました: https://x.com/reiruisoft0708/status/${tweetId}`);
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
