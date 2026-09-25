/* Editorial data. Add the newest entry first; each source must point to primary evidence. */
const ARTICLES = [
  {
    date:'2026-09-25', level:'HIGH', tags:['A2A','MCP','Operations'],
    title:'A2Aのバージョン処理が、運用設計の論点になった',
    summary:'JavaScript SDK v1.2.1の修正を起点に、複数プロトコルとSDKを更新し続けるための設計を考える。',
    sections:[
      {heading:'確認した変化',html:'<p>A2A JavaScript SDK <strong>v1.2.1（9月24日）</strong>では、<code>A2A-Version</code>に基づくJSON-RPCの振り分け、レスポンスのバージョン検証、JSON-RPCエラーのHTTP 200応答などが修正された。taskのmetadata伝播、push notification設定時のtask ID、入力media typeの検証にも修正がある。</p><p>MCP側では、Skillsの発見と配布を扱う公式拡張の文書が公開されている。これは運用エージェントに能力を渡す仕組みを検討するうえで、継続観測したい領域だ。</p>'},
      {heading:'読み解き',html:'<p>今回のSDK更新は新しいA2A仕様の発表ではない。<strong>既存仕様を異なる実装やバージョンで正しく動かす</strong>ための修正だ。MCPとA2Aを組み合わせる環境では、Agentの挙動だけでなく通信の互換性を継続して確認する必要がある。</p>'},
      {heading:'Agentic Opsへの示唆',html:'<p>Incident Agent → Diagnostic Agent → MCP Gateway → Prometheusという経路なら、<strong>A2A protocol / SDK / MCP protocol</strong>の組み合わせを記録しておきたい。PoCではA2Aの相互運用試験、MCPのconformance、実際の障害調査シナリオを別々に確認すると、失敗箇所を切り分けやすい。</p><div class="insight"><span class="dialog-kicker">OPERATOR NOTE</span><p>まずは利用バージョンを一覧化し、更新時に同じ障害シナリオを再実行する。バージョン管理を早期に運用習慣へ入れる。</p></div>'}
    ],sources:[
      ['A2A JavaScript SDK v1.2.1 release','https://github.com/a2aproject/a2a-js/releases/tag/v1.2.1'],
      ['MCP Skills extension','https://github.com/modelcontextprotocol/ext-skills']
    ]
  },
  {
    date:'2026-09-24', level:'MEDIUM', tags:['A2A','Operations'],
    title:'既存の運用AgentからA2AへつなぐCLIという入口',
    summary:'A2A CLIを、既存のスクリプト文化とAgent間連携をつなぐアダプターとして捉える。',
    sections:[
      {heading:'確認した変化',html:'<p>A2Aの公式CLIは、Agent Cardの確認やA2A Agentへのメッセージ送信をコマンドラインから行う入口として公開されている。CLIを使える既存のAgentから、A2A対応Agentを呼び出す構成を検討できる。</p>'},
      {heading:'読み解き',html:'<p>既存の運用AgentをすべてA2A SDKに移行する前に、CLIによる接続を小さく試せる。まず実際の相互運用を確認し、長期運用が必要な箇所だけネイティブ実装へ進むという段階的な導入が考えられる。</p>'},
      {heading:'Agentic Opsへの示唆',html:'<p>診断専用AgentにPrometheusとAlertmanagerへの読み取り専用ツールを渡し、既存AgentからA2A CLI経由で問い合わせるPoCが最小構成になる。結果の正しさとともに、認証、タイムアウト、監査ログを確認したい。</p>'}
    ],sources:[['A2A CLI repository','https://github.com/a2aproject/a2a-cli'],['A2A project','https://github.com/a2aproject']]
  },
  {
    date:'2026-09-23', level:'MEDIUM', tags:['A2A','Operations'],
    title:'A2Aの開発・検証ツールが揃い始めた',
    summary:'SDK、CLI、Inspector、テストキットを、接続できることを検証する一連の道具として見る。',
    sections:[
      {heading:'確認した変化',html:'<p>A2Aプロジェクトは仕様だけでなく、複数言語のSDK、CLI、Inspector、テスト関連のリポジトリを公開している。実装をつなぎ、振る舞いを確かめるための道具が増えている。</p>'},
      {heading:'読み解き',html:'<p>リポジトリの更新日時だけで正式な仕様変更とは判断できない。ただ、独立したAgent同士を運用する際は、仕様書に加えて実装と互換性検証の仕組みが欠かせない。</p>'},
      {heading:'Agentic Opsへの示唆',html:'<p>Incident AgentとDiagnostic Agentを接続するなら、プロトコルの試験と業務の試験を分ける。通信が正しくても、誤ったアラートの解釈や過剰なツール利用は業務シナリオで別途見つける必要がある。</p>'}
    ],sources:[['A2A official organization','https://github.com/a2aproject'],['A2A specification','https://github.com/a2aproject/A2A']]
  },
  {
    date:'2026-09-22', level:'MEDIUM', tags:['MCP','Security','Operations'],
    title:'MCPを「つながる」から「壊れずに動く」へ',
    summary:'SDKの入力制限とバージョン対応から、運用Control Planeの耐障害性を考える。',
    sections:[
      {heading:'観測テーマ',html:'<p>MCPを多数のAgentやツールで運用すると、接続管理、入力サイズ、セッション終了処理、protocol versionの扱いが重要になる。SDKのリリースとconformanceの更新を継続して追う。</p>'},
      {heading:'Agentic Opsへの示唆',html:'<p>Prometheus / AlertmanagerなどのMCP ServerをAgentが利用するなら、Agentからの通信を入力検証と上限設定の対象にする。サーバーを守る制限と、アップグレード時の互換性試験は、回答品質とは別の運用要件になる。</p><div class="insight"><span class="dialog-kicker">OPERATOR NOTE</span><p>読み取り専用の小さなPoCで、巨大入力、タイムアウト、サーバー切断、旧版との組み合わせを試す。</p></div>'}
    ],sources:[['MCP Go SDK releases','https://github.com/modelcontextprotocol/go-sdk/releases'],['MCP specification','https://modelcontextprotocol.io/specification/2026-07-28']]
  }
];
