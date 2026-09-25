/* Editorial data. Add the newest entry first; each source must point to primary evidence. */
const ARTICLES = [
  {
    date:'2026-09-25', level:'HIGH', tags:['A2A','MCP','Operations'],
    title:'A2AとMCPで始まる、プロトコルのバージョン運用',
    summary:'A2A JavaScript SDK v1.2.1の修正とMCP Skills拡張から、Agentic AI基盤に必要になる互換性管理と能力配布を考える。',
    sections:[
      {heading:'今日のシグナル',html:'<p><strong>A2Aでも、プロトコルのバージョンを本番環境で正しく扱うことが主要課題になってきた。</strong>JavaScript SDK v1.2.1は新しい仕様を追加するリリースではなく、<code>A2A-Version</code>を使った振り分けとレスポンス検証を修正するリリースだった。</p><p>MCPで進むprotocol negotiationと並べると、Agentic AI基盤は仕様を決める段階から、複数の仕様・SDKバージョンを安全に共存させる段階へ進み始めている。</p>'},
      {heading:'重要ニュース',html:'<p>A2A JavaScript SDK <strong>v1.2.1（2026年9月24日）</strong>では、JSON-RPCエラーをHTTP 200で返す修正、<code>A2A-Version</code>に基づくJSON-RPC dispatch、JSON-RPCレスポンスのバージョン検証が入った。</p><p>ほかにも、task status・artifact eventのmetadata伝播、RESTでpush notification設定を作る際のtask ID、Agentの<code>defaultInputModes</code>に対するmedia type検証が修正されている。個々には小さな修正だが、異なる実装間で通信するプロトコルでは、この種のcorrectnessが相互運用性を左右する。</p>'},
      {heading:'OSS別アップデート',html:'<p><strong>A2A — HIGH</strong><br>公式プロジェクトには複数言語のSDK、CLI、Inspector、TCK、Integration Testing Kitが揃いつつある。SDKの修正とテスト基盤を組み合わせ、仕様から実装互換性まで確認する構造が見えてきた。</p><p><strong>MCP — MEDIUM</strong><br><code>ext-skills</code>は、MCP primitivesを使ってSkillsを発見・配布する公式拡張を管理している。SEP-2640を基礎とし、2026-07-28のbase protocolに対して定義されている。MCPがtools・resources・promptsに加え、Agentが利用する能力の配布にも広がる可能性がある。</p><p><strong>Agent Router / agentgateway / goose / AGENTS.md — WATCH</strong><br>この日の確認範囲では、記事の中心に据える大型リリースは確認できなかった。既存のgateway、identity、policy、observabilityの実装動向を継続して追う。</p>'},
      {heading:'ガバナンスと標準化',html:'<p>AAIFのHosted ProjectsとWorking Groupsについて、この日はfoundation全体の構造を変える正式発表を確認していない。個別リポジトリの更新だけを新しい標準やガバナンス変更とは扱わない。</p><p>Skills over MCPは公式拡張として文書化が進む一方、配布されるSkillの信頼性、必要権限、依存関係、ホスト側の検証は運用上の論点として残る。</p>'},
      {heading:'技術トレンド',html:'<p>MCPとA2Aは別の役割を持つが、運用面では同じ課題へ到達している。</p><ul><li>MCP：AgentとToolの間でprotocol versionを扱う</li><li>A2A：Agent間通信で<code>A2A-Version</code>を扱う</li><li>各SDK：仕様を実装し、旧版との互換性を管理する</li><li>TCK / ITK / Conformance：実装間の差異を検出する</li></ul><p>ここから、<strong>Protocol Version Lifecycle Management</strong>が独立した運用領域になる。Kubernetes APIやTLSと同様に、対応版の一覧、段階的な更新、廃止時期、互換性試験が必要になる。</p>'},
      {heading:'Agentic Opsへの示唆',html:'<p>Incident AgentがA2AでDiagnostic Agentを呼び、Diagnostic AgentがMCP経由でPrometheusやAlertmanagerへ接続する構成では、<strong>A2A version × A2A SDK version × MCP version × MCP SDK version</strong>の組み合わせが生まれる。</p><p>PoCの試験は次の3層に分けると、失敗の場所を特定しやすい。</p><ul><li><strong>A2A TCK / ITK</strong>：Agent間通信とSDK相互運用性</li><li><strong>MCP Conformance</strong>：Tool接続とprotocol correctness</li><li><strong>業務E2Eテスト</strong>：障害調査の正しさ、権限、timeout、監査ログ</li></ul><p><code>ext-skills</code>が成熟すると、運用AgentがSkill registryから必要な手順を取得し、MCP Toolを通じてインフラを調査する構造も考えられる。ただし、外部から得たSkillを実行可能な指示として扱うため、署名、許可された権限、配布元の信頼性を同時に設計する必要がある。</p><div class="insight"><span class="dialog-kicker">OPERATOR NOTE</span><p>PoCの段階から利用バージョンを記録し、更新時には同じ障害シナリオを再実行する。互換性試験をAgentの回答評価と分けて管理する。</p></div>'},
      {heading:'要ウォッチ項目',html:'<ul><li>A2A v1.xの次期変更と各SDKへの反映</li><li>A2A TCK / ITKによる実装間テスト</li><li>MCP 2026-07-28の各言語SDKとconformance</li><li>MCP Skills拡張のtrust modelと実装事例</li><li>Agent Routerとagentgatewayの責務境界</li><li>Identity & Trust、Observability & Traceabilityの各WG</li></ul>'}
    ],sources:[
      ['A2A JavaScript SDK v1.2.1 release','https://github.com/a2aproject/a2a-js/releases/tag/v1.2.1'],
      ['A2A Integration Testing Kit','https://github.com/a2aproject/a2a-itk'],
      ['MCP Skills extension','https://github.com/modelcontextprotocol/ext-skills']
    ]
  },
  {
    date:'2026-09-24', level:'MEDIUM', tags:['A2A','Operations'],
    title:'A2A CLIが作る、既存Agentから標準プロトコルへの移行路',
    summary:'既存の運用Agentを全面改修せず、CLIを橋渡しとしてA2A Agentへ仕事を委譲する段階的な導入方法を考える。',
    sections:[
      {heading:'今日のシグナル',html:'<p>A2A CLIの役割は、人間がAgentを試すためのコマンドだけではない。<strong>A2A layerを持たないmodel、Agent、coding harnessからA2A Agentへ仕事を渡すbridge</strong>として設計されている。</p><p>既存のAgent runtimeをすぐにA2A SDKへ移行しなくても、shellやtool callを使えるAgentならA2A ecosystemへ接続できる。導入時の改修範囲を小さくできる点が実務上の価値になる。</p>'},
      {heading:'重要ニュース',html:'<p>公式A2A CLIはAgent Cardの取得、message送信、streaming、protocol-nativeなJSON出力、予測可能なexit codeを提供する。A2Aに対応していないAgentからも、CLIをtoolとして呼び出すことでremote A2A Agentへtaskを渡せる。</p><p>この日のA2A関連リポジトリでは複数SDKとCLIの更新が続いた。一方、正式仕様の最新版とリポジトリの更新日時は区別する必要がある。SDKの更新だけを新しいprotocol releaseとは扱わない。</p>'},
      {heading:'OSS別アップデート',html:'<p><strong>A2A — MEDIUM</strong><br>Go SDKはclient/serverとgRPC、REST、JSON-RPCの各transportを提供する。CLIを含む周辺ツールの整備により、仕様を読むだけでなく、Agentを発見・接続・検証する導線が形成されている。</p><p><strong>MCP — WATCH</strong><br>A2Aで呼ばれたremote AgentがMCP Toolを利用する構成が自然になる。A2AとMCPのどちらか一方だけを評価しても、実際の運用経路全体は確認できない。</p><p><strong>Agent Router / agentgateway — WATCH</strong><br>Agent間・Tool間の通信が増えるほど、identity、policy、routing、quota、traceを集約するgateway層の役割が大きくなる。</p>'},
      {heading:'技術トレンド',html:'<p>現実的な導入経路は、すべてのAgentを最初からA2A nativeにする方法だけではない。</p><ol><li>既存AgentにA2A CLIをtoolとして与える</li><li>remote Agentとの相互運用性と業務価値を確認する</li><li>常時利用する経路だけSDKによるnative実装へ移す</li></ol><p>これはREST APIをまず<code>curl</code>で試し、安定した利用箇所をclient libraryへ移す流れに近い。CLIは移行期のadapterと、障害時の診断ツールを兼ねられる。</p>'},
      {heading:'Agentic Opsへの示唆',html:'<p>ホスティング運用であれば、既存のIncident AgentからA2A CLIを呼び、Diagnostic Agentへ調査を委譲する小さなPoCを組める。Diagnostic AgentはMCP経由でPrometheusやAlertmanagerを読み取る。</p><p>評価項目には回答精度だけでなく、Agent Cardの発見、認証情報の受け渡し、stream切断、timeout、exit code、JSON schema、trace IDの引き継ぎを含める。CLIを使うことで、運用チームが既に持つshell・scriptの知識を活用できる。</p><div class="insight"><span class="dialog-kicker">ADOPTION PATH</span><p>Phase 1: CLI bridge → Phase 2: A2A interoperability → Phase 3: 必要な経路だけnative A2A化。</p></div>'},
      {heading:'要ウォッチ項目',html:'<ul><li>A2A CLIの認証、streaming、JSON出力の成熟</li><li>CLIをcoding harnessへ組み込む公式パターン</li><li>A2A SDK間の互換性とIntegration Testing Kit</li><li>A2AからMCP Toolへ至るend-to-end trace</li></ul>'}
    ],sources:[
      ['A2A CLI repository','https://github.com/a2aproject/a2a-cli'],
      ['A2A Go SDK','https://github.com/a2aproject/a2a-go'],
      ['A2A project','https://github.com/a2aproject/A2A']
    ]
  },
  {
    date:'2026-09-23', level:'MEDIUM', tags:['A2A','Operations'],
    title:'A2Aは仕様書から、検証可能な実装ecosystemへ',
    summary:'Specification、複数言語SDK、CLI、Inspector、TCK・ITKが揃うことで、Agent間通信をCIで確認できる段階へ進んでいる。',
    sections:[
      {heading:'今日のシグナル',html:'<p>A2Aの価値を判断する材料が、protocol specificationだけではなくなってきた。複数言語のSDK、CLI、Inspector、TCK、Integration Testing Kitが揃い、<strong>実装して接続し、互換性を試験する一連の道具</strong>が形成されている。</p>'},
      {heading:'重要ニュース',html:'<p>A2A projectではSpecificationと複数SDK、CLI、テスト関連リポジトリが活発に更新された。個々のcommitを正式な仕様変更とみなすことはできないが、protocolと実装・検証ツールが並行して整備されていることは確認できる。</p><p>Integration Testing Kitは、異なるSDK実装とversionをまたいだ互換性を確認することを目的としている。JSON-RPC、gRPC、HTTP+JSON/REST、streamingを含む経路を対象にしており、異種Agentの接続試験に使える。</p>'},
      {heading:'OSS別アップデート',html:'<p><strong>A2A — HIGH</strong><br>Specification → SDK → CLI / Inspector → TCK / ITKという開発・検証チェーンが見えてきた。A2Aを単なる通信仕様ではなく、実装ecosystemとして評価できる材料が増えている。</p><p><strong>MCP — MEDIUM</strong><br>A2AがAgent間の接続を扱い、MCPがAgentとToolの接続を扱う構成では、それぞれのconformanceを別に確認する必要がある。</p><p><strong>agentgateway / Agent Router — WATCH</strong><br>A2AとMCPの通信をgatewayへ集約する場合、protocolごとの認証・policy・traceをどう統一するかが次の論点になる。</p>'},
      {heading:'ガバナンスと標準化',html:'<p>AAIFのHosted ProjectsやWorking Groupsについて、この日の観測では新規加入や卒業に相当する正式変更を確認していない。Technical Committeeやproject proposalsの正式な更新と、個別repositoryの活動は分けて記録する。</p>'},
      {heading:'技術トレンド',html:'<p>A2A ecosystemをKubernetesにたとえるなら、APIだけでなくclient libraries、操作用CLI、inspection、conformanceが揃う過程にある。成熟度は異なるが、productionで相互運用性を維持するには同じ種類の道具が必要になる。</p><p>Agent systemの品質は、LLMの回答だけでは決まらない。通信が仕様に適合し、異なるSDKでも同じtaskやeventを扱い、失敗時の状態が一貫していることが前提になる。</p>'},
      {heading:'Agentic Opsへの示唆',html:'<p>Incident Agent → Diagnostic Agent → MCP Gateway → Infrastructureという構成なら、テストを次の3層へ分ける。</p><ul><li><strong>A2A protocol test</strong>：Agent Card、task、message、streaming、error model</li><li><strong>MCP protocol test</strong>：tool discovery、tool call、authorization、result</li><li><strong>業務E2E test</strong>：実際のアラートから正しい調査結果へ到達できるか</li></ul><p>この分割により、protocol不整合とAgentの推論ミスを混同しにくくなる。CIではTCK・ITKとconformanceを回し、定期的な業務シナリオでend-to-endを確認する構成が現実的だ。</p><div class="insight"><span class="dialog-kicker">OPERATOR NOTE</span><p>「回答が合っていた」だけでPoCを完了させず、異なるSDK、timeout、再接続、途中失敗も試験対象にする。</p></div>'},
      {heading:'要ウォッチ項目',html:'<ul><li>A2Aの次期正式仕様とrelease notes</li><li>各SDKが同じ仕様へ追随するまでの時間差</li><li>TCKとITKのcoverage、CIへの組み込み例</li><li>MCP Conformanceとの組み合わせ</li><li>Identity & Trust、Observability & Traceabilityの設計</li></ul>'}
    ],sources:[
      ['A2A specification','https://github.com/a2aproject/A2A'],
      ['A2A Integration Testing Kit','https://github.com/a2aproject/a2a-itk'],
      ['A2A CLI','https://github.com/a2aproject/a2a-cli']
    ]
  },
  {
    date:'2026-09-22', level:'HIGH', tags:['MCP','Security','Operations'],
    title:'MCPは「接続する技術」から「壊さず運用する基盤」へ',
    summary:'Go SDKのresource exhaustion対策とprotocol version制御から、多数のMCP Serverを安全に運用するControl Planeを考える。',
    sections:[
      {heading:'今日のシグナル',html:'<p>MCP Go SDKの更新は、新機能の追加よりも<strong>大量接続されたMCPを壊さず、安全に運用するためのhardening</strong>が中心になった。MCPの開発重心がprotocol designだけでなくproduction engineeringへ移っている。</p>'},
      {heading:'重要ニュース',html:'<p>Go SDKではsession leak、deadlock、teardown時のhang、resource exhaustionに関する修正が進んだ。JSONのnesting、SSE event、stdio JSON-RPC frame、OAuth dynamic client registration responseに上限を設け、異常または巨大な入力がserver resourceを使い切るリスクを抑えている。</p><p><code>ServerOptions.SupportedProtocolVersions</code>により、serverがadvertise・negotiationするMCP versionを明示的に制限できる。最新版を一斉に有効化せず、stagingとproductionで対応versionを変える段階的なrolloutに利用できる。</p>'},
      {heading:'OSS別アップデート',html:'<p><strong>MCP — HIGH</strong><br>2026-07-28がSDKの最新対応revisionとして維持され、その運用安定化が進んでいる。Conformance suiteをclient/server双方へ適用する動きも、実装差異を検出するうえで重要になる。</p><p><strong>A2A — MEDIUM</strong><br>Specificationと複数SDK、Integration Testing Kitの更新が続いている。MCPと同様に、protocolだけでなく実装とconformanceへ投資する流れが見える。</p><p><strong>Agent Router / agentgateway — WATCH</strong><br>数十から数百のMCP Serverを扱う場合、個別接続ではなくgatewayやrouterでversion、identity、authorization、quota、observabilityを管理する必要が出てくる。</p>'},
      {heading:'ガバナンスと標準化',html:'<p>この日の確認範囲では、AAIFへの新しいHosted Project追加やfoundation全体の正式なガバナンス変更、重大なsecurity advisoryを確認していない。大型発表がない日でも、SDKのhardeningは実運用への成熟を示すため追跡対象になる。</p>'},
      {heading:'技術トレンド',html:'<p>Agentic infrastructureの通信経路は、Agent → MCP Server → Toolという単純な形から、次のようなControl Planeを含む形へ進む。</p><ul><li>Gateway / Routerによる接続先の管理</li><li>Protocol version negotiation</li><li>Identityとauthorization</li><li>入力上限、timeout、quota</li><li>Conformanceと互換性試験</li><li>OpenTelemetryによるtraceと監査</li></ul><p>MCPのversion lifecycleはKubernetes APIやTLS versionと同様に、対応版の明示、canary、廃止計画を必要とする。</p>'},
      {heading:'Agentic Opsへの示唆',html:'<p>Prometheus、Alertmanager、CMDB、SSH automationなどをMCP化すると、将来的には多数のMCP Serverが存在する。Agentが生成するJSONやSSEを信頼済みの内部通信とみなすと、誤動作がMCP ServerのOOMやControl Plane障害へ波及する可能性がある。</p><p>したがって、<strong>Agentが生成するtrafficもuntrusted inputとして制限・検証する</strong>。Productionでは安定版だけ、Stagingでは安定版と次期版を許可するなど、version制御をcanary rolloutに利用できる。</p><div class="insight"><span class="dialog-kicker">POC CHECKLIST</span><p>巨大JSON、深いnesting、長大なSSE、切断、session終了、timeout、旧versionとの接続を再現し、MCP Serverとgatewayのresource使用量を確認する。</p></div>'},
      {heading:'要ウォッチ項目',html:'<ul><li>MCP Go SDKのhardeningが他言語SDKへ波及するか</li><li>2026-07-28対応とconformanceの進捗</li><li>Server側のprotocol version制御事例</li><li>Agent RouterのMCP backendとauthorization</li><li>agentgatewayとの責務境界</li><li>Identity & Trust、Observability & Traceabilityの各WG</li></ul>'}
    ],sources:[
      ['MCP Go SDK releases','https://github.com/modelcontextprotocol/go-sdk/releases'],
      ['MCP specification 2026-07-28','https://modelcontextprotocol.io/specification/2026-07-28'],
      ['A2A project','https://github.com/a2aproject/A2A'],
      ['A2A Integration Testing Kit','https://github.com/a2aproject/a2a-itk']
    ]
  }
];
