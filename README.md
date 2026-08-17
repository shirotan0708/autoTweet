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

1. **ログイン**
   `@reiruisoft0708` で https://x.com にログインした状態で、https://developer.twitter.com/ にアクセスする。

2. **Developer アカウントの申請 (Sign up)**
   - 右上などから "Sign up" / "Apply" を選ぶと、利用目的を聞くフォームが出る
   - アカウントの種類を聞かれたら **Free** プランを選ぶ
   - 用途の説明欄には、個人アカウントで自分のツイートを自動投稿する用途である旨を記入する(前の回答で渡した文面を使えばOK)
   - 電話番号認証を求められることがあるので、Xアカウントに電話番号を登録しておく
   - 承認は即時〜数分で完了することが多い

3. **Project と App を作成**
   - Developer Portal (https://developer.twitter.com/en/portal/dashboard) に入る
   - 初回は "Create Project" を促されるので、Project名(例: `reiruisoft-auto-tweet`)、Use case、App名(例: `reiruisoft-bot`)を適当に入力して作成する
   - App を作成すると API Key / API Key Secret が一度だけ表示されるので、メモしておく(後でも再生成は可能)

4. **App permissions を Read and Write に変更(最重要)**
   - 作成した App の設定画面 → **"User authentication settings"**(日本語表示では「ユーザー認証設定」)の **Set up** / **Edit**(「設定する」/「編集」)を開く
   - **App permissions**(「アプリの権限」): `Read and write`(「読み取りと書き込み」)を選択
     - デフォルトは Read only(「読み取りのみ」)になっており、これだと投稿できないので必ず変更する
   - **Type of App**(「アプリの種類」): `Web App, Automated App or Bot`(「ウェブアプリ、自動化されたアプリ、または Bot」)を選択
   - **App info**(「アプリ情報」):
     - Callback URI / Redirect URL(「コールバック URI / リダイレクト URL」): 使わないが必須項目なのでダミーで良い(例: `https://example.com/callback`)
     - Website URL(「ウェブサイトの URL」): 例: `https://example.com`
   - Save(「保存」)する

5. **Access Token / Access Token Secret を取得**
   - App の **"Keys and tokens"**(「キーとトークン」)タブを開く
   - "Access Token and Secret"(「アクセストークンとシークレット」)の欄で **Generate**(「生成」、発行済みなら「再生成」)する
   - **重要**: 手順4で App permissions を Read and Write に変更した**後**に生成/再生成しないと、古いトークンは Read only のままなので必ず変更後に(再)生成する
   - 表示された Access Token / Access Token Secret をメモする

6. **最終的に4つの値が揃う**
   - API Key
   - API Key Secret
   - Access Token
   - Access Token Secret

   これらを次のステップで GitHub Secrets に登録する。

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
