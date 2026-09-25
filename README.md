# AAIF Watch

AAIF ecosystemの変化を、Agentic Operationsとインフラ運用の視点で追う静的ブログです。Choucremeの independent technology project として公開します。

## 構成

- `index.html` — トップページと記事ビュー
- `style.css` — レスポンシブなデザイン
- `articles.js` — 記事データ、一次情報へのリンク
- `app.js` — フィルター、記事表示、日付別の共有URL

ビルドや依存パッケージは不要です。`index.html` を開くか、`python3 -m http.server 8000` でローカル表示できます。

## 更新方法

1. 一次情報を確認し、`articles.js` の `ARTICLES` 配列の先頭に新しい記事を追加します。
2. `date` は `YYYY-MM-DD`、`level` は `HIGH` / `MEDIUM` / `LOW`、`tags` は既存のフィルター名を使います。
3. `sections` で確認した事実と考察を分け、`sources` に一次情報のURLを入れます。
4. `main` にコミットすると、GitHub Pagesのブランチ公開設定により更新されます。

初期記事は2026年9月22〜25日のレポートを再構成したものです。情報を追加するときは、単なるコミット日時を正式リリースや仕様変更とみなさず、リリースノートと仕様本体を確認してください。

## GitHub Pages

リポジトリを公開した後、**Settings → Pages → Build and deployment → Deploy from a branch → main → /(root) → Save** を選びます。リポジトリのルートに `index.html` があり、外部ビルドなしで公開できます。

## 方針

事実と運用上の推論を分け、原則として一次情報を掲載します。記事はChoucremeの独立した技術ノートであり、AAIFの公式発表ではありません。
