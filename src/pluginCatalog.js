// Claude Code公式プラグイン一覧
// https://github.com/anthropics/claude-code/tree/main/plugins
// ツイートで少しずつ紹介するため、1件ずつ順番に取り上げられるように配列で管理する。
export const CLAUDE_CODE_PLUGINS = [
  {
    id: "agent-sdk-dev",
    name: "agent-sdk-dev",
    description:
      "Claude Agent SDKでの開発を支援するキット。対話的なセットアップコマンドと、SDKアプリケーションを検証するエージェントを提供する。",
  },
  {
    id: "claude-opus-4-5-migration",
    name: "claude-opus-4-5-migration",
    description:
      "Sonnet 4.x/Opus 4.1からOpus 4.5へコードやプロンプトを移行する。モデル文字列やプロンプトの調整を自動化する。",
  },
  {
    id: "code-review",
    name: "code-review",
    description:
      "複数の専門エージェントによるPRの自動コードレビュー。確信度スコアで誤検知(false positive)を絞り込む。",
  },
  {
    id: "commit-commands",
    name: "commit-commands",
    description:
      "コミット・プッシュ・プルリク作成などGitワークフローを自動化するコマンド集。",
  },
  {
    id: "explanatory-output-style",
    name: "explanatory-output-style",
    description:
      "実装上の選択やコードベースのパターンについて教育的な解説を加える出力スタイル。",
  },
  {
    id: "feature-dev",
    name: "feature-dev",
    description:
      "コードベース分析・設計・品質レビューまでを含む、7フェーズ構成の機能開発ワークフロー。",
  },
  {
    id: "frontend-design",
    name: "frontend-design",
    description:
      "ありがちなAIっぽさを避けた、独自性のあるプロダクション品質のフロントエンドUIを作るためのガイダンス。",
  },
  {
    id: "hookify",
    name: "hookify",
    description:
      "会話のパターンを分析し、望まない挙動を防ぐカスタムフック(hooks)を簡単に作成できる。",
  },
  {
    id: "learning-output-style",
    name: "learning-output-style",
    description:
      "意思決定のポイントで意味のあるコード貢献を求めるインタラクティブな学習モード。",
  },
  {
    id: "plugin-dev",
    name: "plugin-dev",
    description:
      "Claude Codeのプラグイン開発のための総合ツールキット。専門スキルとAI支援での作成を提供する。",
  },
  {
    id: "pr-review-toolkit",
    name: "pr-review-toolkit",
    description:
      "コメント・テスト・エラー処理・型設計・コード品質に特化した、PRレビュー用エージェント群。",
  },
  {
    id: "ralph-wiggum",
    name: "ralph-wiggum",
    description:
      "タスクが完了するまで繰り返し取り組む、自己参照的なAIループを実現するインタラクティブな仕組み。",
  },
  {
    id: "security-guidance",
    name: "security-guidance",
    description:
      "9種類のセキュリティパターンを監視し、ファイル編集時に潜在的な問題を警告するフック。",
  },
];
