# auto-tweet

`@reiruisoft0708` 用の自動ツイートボット。GitHub Actions で毎日 **朝7時・昼12時・夜21時(JST)** に、
Claude でその都度ツイート文を生成して X に投稿します。

話題は以下の重み付けでランダムに選ばれます([src/topics.js](src/topics.js) で調整可能)。

- フリーランスエンジニアとしての仕事・学び (45%)
- AI・生成AI関連 (35%)
- サウナ (10%)
- 筋トレ (10%)

直近の投稿内容(`data/tweet-log.json`)をプロンプトに含めることで、内容の重複を避けています。

## セットアップ

### 1. X (Twitter) API の認証情報を取得する

投稿だけであれば無料(Free)プランの範囲内で可能です(月1,500件までの投稿上限。今回は月90件程度なので余裕あり)。

1. https://developer.twitter.com/ にアクセスし、投稿に使う `@reiruisoft0708` でログインして Developer アカウントを作成する
2. Developer Portal でアプリ (Project + App) を作成する
3. アプリの **User authentication settings** を編集し、
   - App permissions: **Read and Write** に設定(これをしないと投稿できません)
   - Type of App: `Web App, Automated App or Bot` などでOK
   - Callback URL / Website URL は適当なダミーで可(例: `https://example.com`)
4. **Keys and tokens** タブから以下4つを取得する
   - API Key / API Key Secret
   - Access Token / Access Token Secret
     - ※ App permissions を Read and Write に変更した後に **再生成** しないと、古いトークンは Read-only のままなので注意

### 2. Anthropic API キーを取得する

https://console.anthropic.com/ でアカウントを作成し、API キーを発行する。

### 3. GitHub Secrets に登録する

このリポジトリの `Settings > Secrets and variables > Actions` から以下を登録:

| Secret名 | 内容 |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic の API キー |
| `TWITTER_API_KEY` | X API Key |
| `TWITTER_API_SECRET` | X API Key Secret |
| `TWITTER_ACCESS_TOKEN` | X Access Token |
| `TWITTER_ACCESS_SECRET` | X Access Token Secret |

### 4. 動作確認

GitHub の `Actions > Auto Tweet > Run workflow` から手動実行できます。
`dry_run` を `true` にすると、実際には投稿せず生成結果だけログに出力して確認できます。

ローカルで試す場合:

```bash
npm install
cp .env.example .env  # キーを埋める
# .env を読み込む環境(例: dotenv-cli)経由か、環境変数を直接セットして実行
SLOT=morning DRY_RUN=true node --env-file=.env src/postTweet.js
```

## スケジュールの変更

[.github/workflows/tweet.yml](.github/workflows/tweet.yml) の `cron` を編集してください。
GitHub Actions の cron は UTC 基準なので、JST の場合は **9時間引いた時刻** を指定します。

## 話題やトーンの調整

- 話題の種類・出現比率: [src/topics.js](src/topics.js)
- プロンプトの内容(文体、文字数上限など): [src/generateTweet.js](src/generateTweet.js)
