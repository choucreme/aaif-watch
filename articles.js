/* Editorial data. Add the newest entry first; each source must point to primary evidence. */
const ARTICLES = [
  {
    "date": "2026-10-26",
    "level": "MEDIUM",
    "tags": [
      "Operations",
      "Security"
    ],
    "title": "OpenEnvの運営拡大、通信・隔離境界を修正",
    "summary": "TC参加と、企業CA・CONNECT・DNS・隔離sessionの運用修正が進んだ。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>今日の差分は、Agent基盤が「接続できる」段階から、企業networkと長時間運用の例外を正しく扱う段階へ進んでいることを示す。</strong>gooseはVoice用WebSocketを通常のHTTP clientと同じTLS設定へ統合し、OSのtrust storeや構成済みcustom CAを利用できるようにした。agentgatewayはHTTP/2のCONNECT先を<code>:authority</code>から保持し、tunnel再入場後も要求されたportを失わないよう修正した。</p><p>OpenSandboxでは、DNS over TCPのforward、client切断後もisolated sessionを維持する実行model、同時Docker lifecycle操作の404／409への整理、metadata・resource名の末尾空白拒否など、productionで起きる境界条件がまとめて補強された。<strong>いずれも新機能の追加より、control planeとdata planeの間で意味を失わないことに重点がある。</strong></p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>OpenEnvのgovernance文書が更新され、BenchFlowがTechnical Committee参加組織として、PostTrain Arenaがcommunity initiativeとして追加された。</strong>これはOpenEnvを環境記述のinterfaceだけでなく、環境を使ったpost-trainingと評価のecosystemへ接続する動きである。確認できたのはgovernance文書への追加であり、AAIF全体のTC構成変更や新project加入を意味するものではない。</p><p>gooseのVoice WebSocketは、従来の個別WebSocket TLS stackから<code>reqwest</code>系clientへ寄せられた。provider APIで使うsystem trust、custom CA、client certificate設定をVoice接続にも適用し、未信頼証明書は拒否しつつ、明示的に構成したCAと正しいhostnameは受け入れるtestが追加された。企業proxyやprivate PKI下でVoiceだけ接続失敗する差を縮める変更だが、main上のcommitであり正式release収録は未確認である。</p><p>agentgatewayではSubstrate ingressのCONNECT targetをheaderの<code>Host</code>から推測せず、元のURI authorityとしてconnectionに保持する。HTTP/2ではCONNECT先が<code>:authority</code>に入り、従来は<code>application.example:9090</code>がport 80へ誤配送され得た。HTTP/1でHostが食い違う場合とHTTP/2の双方に回帰testが追加されている。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>OpenEnv — MEDIUM：</strong>BenchFlowをTechnical Committeeへ、PostTrain Arenaをcommunity initiativeへ追加。protocol実装と、環境を使ったtraining／held-out評価の接点がgovernance上に明示された。</li><li><strong>goose — MEDIUM：</strong>Voice WebSocketがsystem trustとprovider TLS設定を利用。custom CA、hostname検証、未信頼証明書拒否をtest。正式最新版v1.56.0より後のmain変更。</li><li><strong>agentgateway — MEDIUM：</strong>Substrate ingressでCONNECT authorityをtunnel再入場まで保持し、HTTP/2やHost不一致時のport誤配送を修正。</li><li><strong>OpenSandbox — MEDIUM：</strong>clientがTCPで送ったDNS queryをupstreamにもTCPでforward。isolated sessionではforeground runがcancel／disconnectされてもsessionを残し、後続runを可能にした。Docker同時操作は「対象消失」を404、「別操作中」を409へmapする。</li><li><strong>OpenSandbox — Security：</strong>JavaScript SDKはAPI key headerの大文字小文字にかかわらず利用者の明示値を優先。label、volume、PVC名はregexの部分一致ではなく全文一致とし、末尾改行・空白を拒否した。Fast Sandbox egressはOSEP-0023に沿いsubject再bind中のpolicy／credential vault遷移を収束させる大規模修正を取り込んだ。</li><li><strong>MCP／A2A／AGENTS.md／Agent Skills／Open Responses／Agent Router：</strong>前回以降、新しい重要commit、正式release、仕様変更は確認できなかった。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p><strong>確認できた事実：</strong>OpenEnvの<code>GOVERNANCE.md</code>は、BenchFlowをTCの参加組織一覧へ追加し、PostTrain ArenaをOpenEnv ecosystemのcommunity initiativeとして列挙した。AAIFのproject proposal repositoryとWorking Group proposal repositoryには、前回以降の新しいcommitは確認できず、新規加入・卒業project、Working Group採択、AAIF仕様変更も確認できなかった。</p><p><strong>分析：</strong>環境protocolのgovernanceにtraining／evaluation運営者が入ることで、API互換性だけでなく、taskの再現性、verifierの信頼性、held-out評価、compute quota、artifact provenanceが標準化議題になりやすい。PoCでは「OpenEnv互換」を接続成功だけで判定せず、同じtask snapshotとseedでscore・artifact・失敗分類が再現するかを見るべきである。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>第一は<strong>transport semanticsの保存</strong>である。CONNECTのauthority、DNSのUDP／TCP選択、WebSocketのtrust設定は、protocol層を跨ぐと失われやすい。Agent gatewayやsandboxは内部変換のたびにこれらを明示的なcontextとして保持する必要がある。</p><p>第二は<strong>sessionとrunの分離</strong>である。OpenSandboxはforeground runのcancelやclient切断をisolated session終了と同一視しなくなった。長時間Agentでは、network断をworkload停止へ直結させず、session lease、run ID、再接続、明示closeを別々に管理する方向が重要になる。</p><p>第三は<strong>入力境界の全文検証</strong>である。metadataやresource名をregexの先頭一致だけで受理すると、改行や余分なsuffixが後段のKubernetes名、監査log、policy照合で別の意味を持ち得る。正規化前後の値と、明示headerの優先順位まで含めたnegative testが必要である。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>企業CAを導入した環境で、gooseの通常API、MCP、Voice WebSocketが同じtrust policyを使うか確認する。未信頼CA、誤hostname、期限切れ、mTLS client certificateを分けてtestする。</li><li>agentgatewayでHTTP/1 CONNECT、HTTP/2 CONNECT、Hostとauthority不一致、非標準portを通し、宛先portとpolicy判定が一致するかtraceする。</li><li>DNS responseを512 byte超やDNSSEC付きにし、UDP truncation後のTCP、clientが最初からTCPを使う場合、egress deny時の挙動を確認する。</li><li>isolated session実行中にSDK processをkill、networkを切断、cancelを送信し、sessionが残るか、次のrunを受け付けるか、孤立sessionがlease／TTLで回収されるかを測る。</li><li>Docker create／start／stop／deleteを並行実行し、404と409をretry可能性の異なるstructured errorとしてAgentへ渡す。409はbackoff後に状態再取得、404はdesired stateと照合して停止する。</li><li>API key headerをcase違いで二重指定しない。明示値、環境fallback、metrics／diagnostic clientの全経路で同一credentialが選ばれるか監査logで確認する。</li><li>OpenEnv taskのPoCではtask snapshot、model、seed、verifier version、training artifact digestを保存し、PostTrain Arena型評価を再実行可能にする。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>gooseのsystem trust／custom CA修正を含む次回正式releaseと、Voice以外のWebSocket経路とのconformance。</li><li>agentgatewayのCONNECT authority修正が含まれるrelease、HTTP/3 CONNECTやextended CONNECTへの適用。</li><li>OpenSandbox 1.2.0正式版と、DNS TCP、isolated session keepalive、Docker conflict、Fast Sandbox subject遷移の収録状況。</li><li>isolated sessionのdisconnect後TTL、quota、課金、強制回収、observability指標。</li><li>OSEP-0023の実装収束後に公開されるsecurity review、credential vaultのfencing、rebind中の503契約。</li><li>OpenEnv TCでBenchFlowが担う範囲と、PostTrain Arenaのtask／verifier provenance・held-out評価規則。</li><li>AAIF Technical Committee、Working Groups、project proposals、新規加入・卒業projectの次の一次情報。</li><li>MCP、A2A、AGENTS.md、Agent Router、Agent Skills、Open Responsesの次の正式artifact。</li></ul>"
      }
    ],
    "sources": [
      [
        "OpenEnv — Add BenchFlow to Technical Committee and PostTrain Arena to community initiatives",
        "https://github.com/openenv/OpenEnv/commit/9b2c0bea348d0d0844e8ebef485a9f6ec3bce8b0"
      ],
      [
        "goose — Use system trust for Voice WebSockets",
        "https://github.com/aaif-goose/goose/commit/e45707d29730e7d8e90b318b3d1bf67520e70a97"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "agentgateway — Preserve CONNECT authority for Substrate ingress",
        "https://github.com/agentgateway/agentgateway/commit/cfa8d1b84996b0c4e3ce204a81a86bd64f257921"
      ],
      [
        "OpenSandbox — Forward DNS over TCP",
        "https://github.com/opensandbox-group/OpenSandbox/commit/98733555f51529a836d4b2c0761c4812044764b7"
      ],
      [
        "OpenSandbox — Keep isolated session alive after run cancellation or disconnect",
        "https://github.com/opensandbox-group/OpenSandbox/commit/707e2b639f4d946d28399e27ece3012cc0d7bcef"
      ],
      [
        "OpenSandbox — Map concurrent Docker lifecycle conflicts to 404/409",
        "https://github.com/opensandbox-group/OpenSandbox/commit/19c33747cc564281976aa965ad4a92a5b95c212f"
      ],
      [
        "OpenSandbox — Converge Fast Sandbox subject transitions for OSEP-0023",
        "https://github.com/opensandbox-group/OpenSandbox/commit/a224ca1c028e003ca2cb53c542713f038cd52c26"
      ],
      [
        "OpenSandbox — Honor JavaScript API key headers regardless of casing",
        "https://github.com/opensandbox-group/OpenSandbox/commit/1b25b8334a0826f9ad3ef9437cd56b58d31b65bf"
      ],
      [
        "OpenSandbox — Reject trailing newlines in labels and resource names",
        "https://github.com/opensandbox-group/OpenSandbox/commit/563da4b75918f14f207626be8612dff4d119bcad"
      ],
      [
        "OpenSandbox releases",
        "https://github.com/opensandbox-group/OpenSandbox/releases"
      ],
      [
        "AAIF project proposals",
        "https://github.com/aaif/project-proposals"
      ],
      [
        "AAIF working group proposals",
        "https://github.com/aaif/working-group-proposals"
      ],
      [
        "MCP releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AGENTS.md commits",
        "https://github.com/agentsmd/agents.md/commits/main"
      ]
    ]
  },
  {
    "date": "2026-10-25",
    "level": "HIGH",
    "tags": [
      "Security",
      "Operations",
      "MCP"
    ],
    "title": "gooseとOpenSandbox、外部実行をfail-closed化",
    "summary": "policy取得失敗と非冪等retryを安全側へ倒す修正が進んだ。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>今日の共通テーマは、外部から取得するpolicyと外部作用を伴うretryを「安全だと確認できない限り進めない」ことである。</strong>gooseは拡張機能allowlistをHTTPSでのみ取得し、redirect先も同じ条件で再検査するよう変更した。policyが取得・解析できない場合は拡張機能のinstallを停止し、設定済みallowlistが空ならdeny-allとして扱う。</p><p>OpenSandboxではGo SDKのretry規則をmethod別に変更した。GET等の冪等methodは一時的な429／502／503／504を再試行する一方、sandbox作成、command実行、file更新などを含み得るPOST／PATCHは、requestが送信前だったと証明できる接続・TLS失敗だけを既定のretry対象にする。<strong>Agentが判断を誤る前に、runtimeとSDKが危険な曖昧性を閉じる方向が明確になった。</strong></p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p>gooseの<code>GOOSE_ALLOWLIST</code>は、初期URLだけでなく最大10回のredirect先もHTTPSか検証し、全体を30秒でtimeoutする。HTTPへのdowngrade、壊れたURL、証明書・network error、HTTP error、形式不正を検知するとpolicyを利用不能としてinstallをblockする。従来、未設定と空listの区別が曖昧だったが、未設定はpolicyなし、空の<code>extensions: []</code>は明示的deny-allとなった。この変更はv1.56.0公開後のmainにあり、正式releaseには未収録である。</p><p>OpenSandboxのGo SDKは、非冪等writeのstatus-code retryをopt-inへ変更した。例外は<code>OpenSandbox-Wake: expired</code>付き503で、serverがrequestをsandboxへ転送していないことを示すためmethodを問わず安全に再送できる。SSE接続のbootstrapは部分実行やcommand送信済みの可能性があるためgeneric retryを使わない。これは「通信失敗」と「未実行」を同義にしない実装であり、deployや復旧操作を扱うAgentic Opsに直接関係する。</p><p>AAIFは初のAnnual Technical Excellence Awards受賞者も発表した。特にOpen Agentic AI Innovation Awardでは、MCP serverごとにAgentへ渡すtoolをscopeするSRE向けharness <strong>AURA</strong>、実行証跡を残すAgenTrust、AGENTS.mdとMCPを実案件へ組み込むVstormが選ばれた。標準化だけでなく、productionでの最小権限と監査可能性を評価軸に置いた点が重要である。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>goose — HIGH：</strong>allowlist URLをHTTPS限定にし、redirect、timeout、HTTP／network error、YAML構造を検証。policy取得失敗時はinstallをblockし、空allowlistをdeny-allとして扱う。GDKはv0.1.0-alpha.13を公開したが、goose本体の正式最新版はv1.56.0。</li><li><strong>OpenSandbox — HIGH：</strong>Go SDKでPOST／PATCHのstatus retryを既定無効化。Go／Kotlin SDKはcommandの<code>execution_complete.exit_code</code>を保持し、Python SDKはstream先頭のUTF-8 BOMで最初のSSE eventを失わないよう修正した。code interpreterは429等の構造化errorと<code>Retry-After</code>を保持する。</li><li><strong>OpenSandbox runtime — MEDIUM：</strong>Docker snapshotから復元する際にsystem labelを新sandboxへ継承せず、image labelを利用者指定metadataとして返さないよう修正。PTY takeover時は出力write中でも専用close codeを送る。stableは1.1.1、pre-releaseは1.2.0-rc.2で、今回のmain修正はその後の変更。</li><li><strong>AAIF project proposal：</strong>kernel-enforced sandbox、credential proxy、policy、監査log、Sigstoreによるinstruction検証を提供する<code>nono</code> proposal #61に更新があった。Sandbox stage希望だが、TC承認・GB投票・加入決定を示すlabelはまだ確認できないため、現時点ではAAIF傘下projectとして扱わない。</li><li><strong>MCP／A2A／AGENTS.md：</strong>前回以降の新しい仕様・正式release・重要commitなし。</li><li><strong>agentgateway／Agent Router：</strong>前回記事で扱ったMCP metadata、Bedrock Tool、session seed Secret化以降の新しい重要差分なし。</li><li><strong>Agent Skills／Open Responses／OpenEnv：</strong>前回記事以降の重要commit・正式releaseなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p><strong>確認できた事実：</strong>AAIF初のTechnical Excellence Awardsは、Governing BoardとTechnical Advisory Council、communityからなるvolunteer Selection Committeeが3部門を審査し、foundationが最高位のKeystone Awardを授与した。MCPの認可・Python SDK、MCP Meetup Tokyo、agentgatewayの普及、SRE harness、実行証跡など、仕様作成と現場実装の双方が評価された。</p><p><code>nono</code>はAAIF project proposalとして公開されているが、提案は加入決定ではない。proposal本文はApache-2.0、maintainer council、NEP、private disclosure、Sigstore attestation、外部security audit予定を示す一方、TC／GBによる正式承認は未確認である。</p><p><strong>分析：</strong>既存OpenSandboxがcontainer／Kubernetes単位の隔離を担うのに対し、nonoはhost上のAgent processへfilesystem、network、command、credential policyを適用する提案である。両者は競合だけでなく、local developer Agentとserver-side sandboxという異なるdeployment境界を補完する可能性がある。採択判断では、OSごとのenforcement差、fail-open経路、policy bypass、credential proxy、監査証跡を比較する必要がある。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>第一は<strong>fail-closed policy distribution</strong>である。中央policyは便利だが、取得失敗を「制限なし」と解釈するとcontrol plane障害がそのまま権限拡大になる。未設定、空policy、取得失敗、形式不正を別状態として扱う必要がある。</p><p>第二は<strong>effect-aware retry</strong>である。HTTP statusだけでretryを決めず、methodの冪等性、request送信前か、serverがbackendへforwardしたか、streamが部分配信済みかを判定材料にする。AAIFが前に示した<code>external_effect=unknown</code>のfailure modelと整合する。</p><p>第三は<strong>structured execution result</strong>である。exit code、rate-limit code、Retry-After、request ID、WebSocket close reasonをSDK間で保持すれば、Agentは曖昧な文字列から推測せず、retry、停止、承認要求を決められる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>gooseのallowlist serverを停止、証明書期限切れ、HTTP redirect、redirect loop、不正YAML、空listの各状態にし、拡張機能installが安全側へ停止することを確認する。</li><li>policy取得元はHTTPSだけでなく、管理下domain、固定path、署名またはdigestも検証する。今回の変更だけでは接続先の組織的信頼やcontent改ざんを完全には保証しない。</li><li>OpenSandboxで同じPOSTを503後に再実行し、sandbox、session、command、file mutationが二重作成されないことを確認する。</li><li>write retryを有効にする場合はidempotency key、operation ID、事後状態照会を必須にし、単なるHTTP methodだけで安全性を判断しない。</li><li>Alert triageからticket作成や復旧commandへ進むworkflowでは、<code>request_sent</code>、<code>external_effect</code>、<code>retryable</code>、<code>retry_after</code>、<code>exit_code</code>をtraceへ保存する。</li><li>snapshot復元後にsystem label、tenant metadata、credential、network policyが前sandboxから残らないことをnegative testに加える。</li><li>SDK言語別に同一commandを失敗させ、Go、Kotlin、Pythonでexit code・structured error・stream eventが一致するかconformance testを行う。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>goose allowlist hardeningを収録するv1.56.xまたはv1.57.0と、URL host／IP、response size、署名検証の追加。</li><li>OpenSandbox 1.2.0正式版と、今回のretry・exit code・snapshot修正が収録されるrelease。</li><li>OpenSandbox各SDKでの非冪等retry規則とidempotency keyの標準化。</li><li>nono proposal #61のTC review、lifecycle label、contribution agreement、公開security audit。</li><li>OpenSandboxとnonoの責任分界、共通policy・audit format・Sigstore連携。</li><li>AAIF Awardsで評価されたAURA／AgenTrustの運用patternがWorking Groupやconformance資料へ発展するか。</li><li>MCP、A2A、AGENTS.md、Agent Skills、Open Responses、OpenEnv、agentgateway、Agent Routerの次の正式artifact。</li></ul>"
      }
    ],
    "sources": [
      [
        "goose — Require HTTPS and validate allowlist redirects; fail closed on policy errors",
        "https://github.com/aaif-goose/goose/commit/0276d567aa00d426161c51e9c0f52baabe5958ea"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "OpenSandbox — Stop retrying non-idempotent writes by default",
        "https://github.com/opensandbox-group/OpenSandbox/commit/d0ee083a4e416db4cfa6932cbfebd6e3e3e3e74d"
      ],
      [
        "OpenSandbox — Surface execution_complete exit code in Go and Kotlin SDKs",
        "https://github.com/opensandbox-group/OpenSandbox/commit/c11b81b414e1d8619992b02da0b55ae023f5d4fd"
      ],
      [
        "OpenSandbox — Preserve first SSE event after UTF-8 BOM",
        "https://github.com/opensandbox-group/OpenSandbox/commit/3fb3d7fe55b4dcf1e89126cbe0eb86c433a706e2"
      ],
      [
        "OpenSandbox — Preserve structured code interpreter errors",
        "https://github.com/opensandbox-group/OpenSandbox/commit/1d03d6fbbbc89e47482e12b1de82e8dd6a51a7d7"
      ],
      [
        "OpenSandbox — Do not inherit system labels from snapshot images",
        "https://github.com/opensandbox-group/OpenSandbox/commit/830425a4abdacfdd313c85b1938c01a9226dfc07"
      ],
      [
        "OpenSandbox — Send PTY takeover close frame during output writes",
        "https://github.com/opensandbox-group/OpenSandbox/commit/9b94059a4fb2c123e6a81f4e9fd8b53c5378bef4"
      ],
      [
        "OpenSandbox releases",
        "https://github.com/opensandbox-group/OpenSandbox/releases"
      ],
      [
        "AAIF — First Annual Technical Excellence Awards winners",
        "https://aaif.io/blog/winners-of-the-first-aaif-annual-technical-excellence-awards"
      ],
      [
        "AAIF Project Proposal — nono",
        "https://github.com/aaif/project-proposals/issues/61"
      ],
      [
        "nono repository",
        "https://github.com/nolabs-ai/nono"
      ],
      [
        "nono releases",
        "https://github.com/nolabs-ai/nono/releases"
      ],
      [
        "MCP releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AGENTS.md commits",
        "https://github.com/agentsmd/agents.md/commits/main"
      ]
    ]
  },
  {
    "date": "2026-10-24",
    "level": "HIGH",
    "tags": [
      "Operations",
      "Security",
      "MCP"
    ],
    "title": "AAIFに4プロジェクト加入、agent stackを実行基盤まで拡張",
    "summary": "Skills・model API・RL環境・sandboxがAAIFの共通基盤へ加わった。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>AAIFはAgent Skills、Open Responses、OpenEnv、OpenSandboxの4プロジェクトを新たに受け入れ、傘下を10プロジェクトへ拡大した。</strong>従来のMCP、A2A、AGENTS.md、goose、Agent Router、agentgatewayが主に指示、接続、Agent間通信、実行・routingを担ってきたのに対し、今回の加入で能力package、model API互換、RL学習環境、隔離実行環境まで同じ中立的なgovernanceの対象になる。</p><p>同時にgoose v1.56.0が正式公開された。前日までmain上の未release変更として追っていたsubagent再開・同時実行上限、Bedrockの会話継続修正、context圧縮改善、provider別cache単価などが配布基準線へ入った。<strong>今日は「新しい構想」の発表だけでなく、実運用へ載せるrelease基準線も更新された日</strong>である。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p>4プロジェクトの役割は明確に分かれている。Agent Skillsは<code>SKILL.md</code>を中心に指示、script、reference、templateを持ち運ぶ形式。Open Responsesはproviderを越えてrequest、output item、streaming event、tool callを表現する共通model API。OpenEnvは<code>reset</code>、<code>step</code>、<code>state</code>を備えるcontainer化されたRL・評価環境。OpenSandboxはcoding／GUI Agent、評価、code実行、RL trainingを隔離するlifecycle・execution APIとDocker／Kubernetes runtimeを提供する。</p><p>これは単なるproject数の増加ではない。Skillに含まれるcodeをSandboxで実行し、Open Responses経由でmodelを切り替え、OpenEnvで同じtaskを反復評価し、MCPやA2Aで外部systemと接続する、というend-to-endの構成がAAIF内で成立する。一方、仕様が同じfoundationに入っただけで相互運用が自動的に保証されるわけではない。identity、artifact署名、network policy、trace context、cost、conformance testをプロジェクト間でどう接続するかが次の課題になる。</p><p>goose v1.56.0では、失敗・取消済みdelegate subagentの再開、親session単位の同時実行上限、automatic thinking level、Boa JavaScript runtimeによるcode mode、Bedrockへ内部確認blockを空文字送信しない修正などを正式収録した。更新判断では、機能追加だけでなく、subagent再開前の外部作用確認と<code>--dangerous-include-history</code>によるshell履歴送信範囲を確認する必要がある。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>Agent Skills — NEW：</strong>能力と手順をfolder単位で配布するopen format。scriptやresourceも同梱できるため、導入時はcode review、依存関係、署名、最小権限を監視対象にする。</li><li><strong>Open Responses — NEW：</strong>OpenAI Responses APIを基にしたmulti-provider仕様。streaming、tool invocation、item lifecycleとacceptance testを追跡する。10月22日にLF Projectsの最終Technical Charterを採用した。</li><li><strong>OpenEnv — NEW：</strong>container化したRL／評価環境を共通interfaceで利用するframework。正式最新版v0.10.0が10月22日に公開された。</li><li><strong>OpenSandbox — NEW：</strong>多言語SDK、sandbox protocol、Docker／Kubernetes runtimeを提供。正式最新版は1.1.1。filesystem identity、egress、snapshot、resource limitを重点監視する。</li><li><strong>goose — HIGH：</strong>v1.56.0を正式公開。release後のmainではcustom system promptのtemplate errorを一般promptへ黙ってfallbackせず利用者へ返す変更、Claudeへsummarized thinkingを要求する変更、caller指定session IDの検証と重複拒否も入った。</li><li><strong>agentgateway — MEDIUM：</strong>設定したpublic Authorization Server URLをMCP metadataのissuer／endpointへ反映。Bedrockの引数なしTool callを空文字でなく有効なJSON <code>{}</code>へ変換し、空のTool一覧はBedrockへ送らない。いずれもmain上で、stableはv1.6.0。</li><li><strong>Agent Router — MEDIUM：</strong>MCP session暗号化seedをprocess引数ではなくSecret由来のfilter configへ渡すよう変更し、旧seedをfallbackとして使うrotation経路を追加。stableはv1.2.0。</li><li><strong>MCP：</strong>maintainerのGitHub handleと所属情報を更新。仕様、SEP Final、releaseの変更ではない。</li><li><strong>A2A／AGENTS.md：</strong>前回以降の新しいprotocol／format変更、正式releaseなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p><strong>確認できた事実：</strong>AAIFの正式発表により4プロジェクトが加入し、傘下は10になった。Agent SkillsとOpen ResponsesはImpact、OpenEnvはGrowth、OpenSandboxはSandboxとしてproposalが提出され、いずれもTechnical Committee承認を示す記録がある。加えてAAIFは会員数が305組織に達し、直近四半期にGold 7、Silver 33、Associate 18の計58組織が加わったと発表した。</p><p><strong>分析：</strong>model API、skill packaging、training environment、runtime isolationを個別に標準化しても、安全性は境界の組合せで決まる。今後のgovernanceでは、各projectのcharterだけでなく、SkillからSandboxを起動する権限、OpenEnv trajectoryのprovenance、Open ResponsesとGateway間のerror／usage semanticsなど、project横断の責任分界が重要になる。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>第一は<strong>agentic stackの部品化</strong>である。能力、model interface、evaluation environment、sandboxを交換可能な契約へ分けることで、特定vendorのAgent runtimeだけに依存しない構成を目指している。</p><p>第二は<strong>実行可能artifactを信頼境界として扱う</strong>流れである。Skillは説明文だけでなくscriptやresourceを含み、OpenEnvとOpenSandboxはcontainerや実行APIを扱う。repositoryの知名度だけで信頼せず、digest、SBOM、署名、egress、secret mount、resource quota、監査logまで含めて採用判断する必要がある。</p><p>第三は<strong>stateとidentityの可搬性</strong>である。Open Responsesのitem、gooseのcaller指定session ID、MCP session、A2A taskを連携できれば追跡性が上がる一方、外部IDの衝突、tenant越境、再生、二重実行を防ぐnamespaceとbindingが不可欠になる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>新規4プロジェクトを監視台帳へ追加し、repository、正式release、charter、security advisory、conformance testを別々に記録する。</li><li>Agent Skillsは未知のscriptを含む前提で、取得元、commit SHA、署名、依存関係を固定し、read-only filesystemとnetwork denyで試験する。</li><li>Open Responsesは同じTool callを複数providerで再生し、stream event順序、引数JSON、usage、error、cancelの差をgolden test化する。</li><li>OpenEnvとOpenSandboxではcontainer image digest、CPU／memory／時間上限、egress allowlist、secret非注入、cleanup完了をrelease gateにする。</li><li>goose v1.56.0は失敗したsubagentの再開前に、ticket作成、deploy、支払等の外部作用が完了・未実行・不明のどれか確認する。</li><li><code>GOOSE_MAX_CONCURRENT_SUBAGENTS</code>を2、5、10で比較し、LLM rate limit、CPU、memory、完了時間、失敗率を計測する。</li><li>MCP metadataはinternal host名ではなく設定済みpublic issuerを返すこと、Bedrockの引数なしToolが<code>{}</code>として到達することをE2Eで確認する。</li><li>Agent Routerのcontroller／extprocのprocess list、pod spec、logにsession encryption seedが露出せず、旧seedで作成したsessionがrotation中だけ再開できることを確認する。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Agent Skills、Open Responses、OpenEnv、OpenSandboxのrepository移管、charter、maintainer、release署名、security policy。</li><li>4プロジェクトとMCP／A2A／Gateway群を結ぶ公式integrationおよびconformance suite。</li><li>goose v1.56.0のbreaking／behavior changeと、release後main修正を含む次期patch。</li><li>Open Responsesのdated specification releaseとprovider実装間のevent互換性。</li><li>OpenEnv v0.10.0とOpenSandbox 1.1.1のcontainer isolation、egress、snapshot、multi-tenant境界。</li><li>agentgatewayのMCP Authorization Server metadata修正とBedrock Tool修正のv1.7.0収録。</li><li>Agent Routerのsession seed Secret化を含む次期releaseとrotation手順。</li><li>MCP、A2A、AGENTS.md、AAIF TC／WGの新しい正式artifact。</li></ul>"
      }
    ],
    "sources": [
      [
        "Linux Foundation — AAIF announces Agent Skills, Open Responses, OpenEnv, and OpenSandbox",
        "https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-four-new-projects-agent-skills-open-responses-openenv-and-opensandbox"
      ],
      [
        "Linux Foundation — AAIF surpasses 300 members",
        "https://www.linuxfoundation.org/press/agentic-ai-foundation-surpasses-300-members-in-less-than-one-year"
      ],
      [
        "AAIF Project Proposal — Agent Skills",
        "https://github.com/aaif/project-proposals/issues/47"
      ],
      [
        "AAIF Project Proposal — Open Responses",
        "https://github.com/aaif/project-proposals/issues/41"
      ],
      [
        "AAIF Project Proposal — OpenEnv",
        "https://github.com/aaif/project-proposals/issues/50"
      ],
      [
        "AAIF Project Proposal — OpenSandbox",
        "https://github.com/aaif/project-proposals/issues/26"
      ],
      [
        "Agent Skills specification repository",
        "https://github.com/agentskills/agentskills"
      ],
      [
        "Open Responses specification repository",
        "https://github.com/openresponses/openresponses"
      ],
      [
        "Open Responses — Adopt final LF Projects technical charter",
        "https://github.com/openresponses/openresponses/commit/8907bc3b7c4300ff5c21fd647cfde9929243afa1"
      ],
      [
        "OpenEnv v0.10.0",
        "https://github.com/openenv/OpenEnv/releases/tag/v0.10.0"
      ],
      [
        "OpenSandbox 1.1.1",
        "https://github.com/opensandbox-group/OpenSandbox/releases/tag/release-1.1.1"
      ],
      [
        "goose v1.56.0",
        "https://github.com/aaif-goose/goose/releases/tag/v1.56.0"
      ],
      [
        "goose — Surface custom system prompt render errors",
        "https://github.com/aaif-goose/goose/commit/c3bfc5f7b0e230180ba3164ec1ee84fd951eaf0d"
      ],
      [
        "goose — Request summarized thinking from Claude",
        "https://github.com/aaif-goose/goose/commit/e970eea8ac23067eb5f3bbad767e51cfaf917a91"
      ],
      [
        "goose — Allow validated caller-supplied session IDs",
        "https://github.com/aaif-goose/goose/commit/3effaa5f15a641017ee8a4d8009b1bdd27e49c62"
      ],
      [
        "agentgateway — Honor configured Authorization Server URL in MCP metadata",
        "https://github.com/agentgateway/agentgateway/commit/eec642991defbcd76a1c6c06d89f0448268f677e"
      ],
      [
        "agentgateway — Fix empty Bedrock tool arguments",
        "https://github.com/agentgateway/agentgateway/commit/6f68f92f80fb20da04e16ef19464c3e03fd88f29"
      ],
      [
        "Agent Router — Pass MCP session seeds through Secret-backed filter config",
        "https://github.com/theagentrouter/agent-router/commit/6d63a4f71f56e9cc370ced2da862787d8d04f06c"
      ],
      [
        "MCP — Update maintainer handle and affiliation",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/dae694f61a31f7a3ec2af3aff709e11f70f61e48"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AGENTS.md commits",
        "https://github.com/agentsmd/agents.md/commits/main"
      ]
    ]
  },
  {
    "date": "2026-10-23",
    "level": "HIGH",
    "tags": [
      "Security",
      "MCP",
      "Operations"
    ],
    "title": "MCP sessionをrouteへ束縛、認可の迂回路を閉じる",
    "summary": "Agent Routerがcross-route session再利用とprompt selector迂回を修正した。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>今日の中心は、認証済みsessionを利用者だけでなく、実際に通過したsecurity routeへ束縛する変更である。</strong>Agent Routerは、OAuthで保護されたMCPRoute上で作成したsessionを、同じGateway上の別の非保護routeから再開できる経路を修正した。session IDに含まれるrouteと、現在のrequestにGateway内部headerとして付与されたrouteが一致しなければ、GET、POST、DELETEのいずれでもsessionを拒否する。</p><p>同時に、<code>prompts/list</code>ではselectorで非表示にしたpromptを、名前を知る利用者が<code>prompts/get</code>またはcompletion requestで直接取得できる不整合も閉じられた。<strong>Discoveryから隠すことと、実行時に拒否することは別のcontrolであり、両方が必要</strong>という典型例である。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>cross-route session再利用の問題では、元sessionがOAuth保護routeで作られていても、別route側でJWT検証が行われなければ、caller suppliedのsubjectやclaimが認可ruleの入力になり得た。</strong>修正では、frontendが上書きする内部route headerを信頼境界とし、session ID内のrouteと現在routeを比較する。同じsubjectでもrouteが異なれば<code>session ID was issued for a different route</code>として拒否され、元routeを通ったrequestだけがbackendへ到達する。</p><p>prompt selectorについても、一覧応答だけをfilterする従来動作から、個別の<code>prompts/get</code>と<code>completion/complete</code>で同じselectorを強制する形へ変わった。Tool selectorと同様に、直接参照を実行時に検査する。これらはmain上のcommitであり、正式最新版v1.2.0には未収録である。</p><p>Agent Routerにはさらに、Envoy dynamic metadataからrequest単位のquota limitとdurationを受け取る機能が追加された。静的値をbaselineとして残し、metadataが解決できない場合はfallbackする。認証・契約tier・tenant planの判定結果を、後段のrate limitへ渡す構成が取りやすくなる。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>Agent Router — HIGH：</strong>MCP sessionを作成routeへ束縛し、OAuth保護routeから非保護routeへのsession持出しを拒否。prompt selectorを<code>prompts/get</code>とcompletionにも適用した。QuotaPolicyはdynamic metadataからlimit／durationをoverride可能になり、短寿命credentialの事前rotation windowも既定5分からglobal設定で変更できる。正式最新版はv1.2.0で、今回の変更はmain上。</li><li><strong>agentgateway — MEDIUM：</strong>v1.7.0-alpha.1をpre-releaseとして公開。stableはv1.6.0のまま。mainではGemini tool callのthought signatureをAnthropic Messagesのthinking blockまたはOpenAI Responsesのreasoning itemで保持し、次turnへ戻す修正が入った。従来は変換でsignatureが落ち、tool結果を返す2turn目がHTTP 400になる場合があった。非Gemini providerにはsignatureを渡さない。</li><li><strong>goose — MEDIUM：</strong>Toolとして起動したshellをcancel／timeoutした際、親processだけでなく所有するprocess treeをUnix process groupまたはWindows Job Object単位で終了するよう変更。正常終了後に意図的にbackground化したprocessは維持する。利用不能なdefault providerでCLIを起動した場合は、即時終了ではなくprovider設定dialogへ誘導する。</li><li><strong>MCP：</strong>前回以降の新しい仕様commit、SEP Final、正式releaseなし。</li><li><strong>A2A：</strong>新しいprotocol commit・releaseなし。正式最新版はv1.0.1。</li><li><strong>AGENTS.md：</strong>新規commit・releaseなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p><strong>確認できた事実：</strong>AGNTCon + MCPCon North Americaは10月22〜23日に開催中で、Linux Foundationはagent trustを中心テーマの一つとして案内している。ただし、session発表やdemoを採択済み仕様、security advisory、AAIFの正式決定とはみなさない。AAIF Technical Committee、Working Groups、project proposal、新規加入・卒業project、認定制度について、前回以降の新しい規範的artifactは確認できなかった。</p><p><strong>分析：</strong>Agent Routerの修正は、session identityを<code>subject</code>だけで表現できないことを示す。実際の権限は、subject、route、そこで実施されたJWT検証、適用policy、backend集合の組合せで決まる。sessionを再開するときは、それらのsecurity contextも同じであることを確認しなければならない。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>第一の流れは<strong>session-bound authorization</strong>である。長寿命MCP sessionでは、初回接続時に選ばれたroute、backend、selector、認証方式がsession状態へ持ち越される。再開requestが別routeを通れると、最初のsecurity policyを迂回できるため、session IDの暗号化やsubject bindingだけでは不十分になる。</p><p>第二は<strong>enumeration controlとauthorization enforcementの分離</strong>である。listから項目を除外することは情報露出を減らすが、名前を推測・記録・別経路で取得したcallerを止めない。Tool、prompt、resourceは、listとget／callの双方で同じselectorを評価する必要がある。</p><p>第三は<strong>認証結果をquota controlへ接続する</strong>動きである。dynamic metadataによるlimit overrideを使えば、ext_authz等が判定したtenant planをrequest単位のrate limitへ渡せる。一方、metadata namespaceとkeyを信頼できるproducerだけが書けるようにしないと、利用者自身がlimitを引き上げる危険がある。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>同じGatewayへOAuth保護routeと非保護routeを作り、保護routeで発行したsession IDを別routeのGET、POST、DELETEへ送ってすべて拒否されるか確認する。</li><li>session ID検証ではsubjectだけでなく、route、tenant、audience、認証方式、policy versionをbinding候補として整理する。</li><li><code>prompts/list</code>で除外したprompt名を直接<code>prompts/get</code>と<code>completion/complete</code>へ渡し、backendへ到達しないことをnegative testする。Toolとresourceにも同じ試験を展開する。</li><li>dynamic quota metadataを欠損、型違い、未知unit、巨大値、0、static baseline未満／超過で試験し、解決不能時のfallbackとfail modeを記録する。</li><li>metadataを書けるfilter chainとnamespaceを固定し、client headerから直接quota overrideを生成しない。</li><li>短寿命credentialのrotation windowはtoken寿命、controller停止時間、API rate limitを基に設定し、expiry前に新credentialがdata planeへ収束した時刻をmetric化する。</li><li>GeminiをAnthropic Messages／OpenAI Responses経由で呼び、tool call→tool result→次応答までthought signatureが保持されるかE2Eで確認する。</li><li>gooseで孫processを生成するshellをcancelし、orphan、open port、残存file lockがないことをLinux／Windows双方で試験する。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Agent Routerのroute bindingとprompt selector修正を含むv1.2.x／次期release、およびsecurity advisoryの公開有無。</li><li>MCP sessionへbindingすべきroute、subject、tenant、policy revisionの標準的な表現。</li><li>dynamic quota metadataのproducer認証、上限値、shadow mode、service quota対応。</li><li>agentgateway v1.7.0正式版とalphaからのbreaking／behavior change。</li><li>Gemini thought signature修正のResponses、Messages、Vertex間conformance。</li><li>goose process-tree cleanupのcontainer、SSH、background taskへの影響と正式release収録。</li><li>AGNTCon + MCPConで公開されたslide、recording、proposalがAAIF WG、MCP SEP、A2A roadmapへ反映されるか。</li><li>MCP、A2A、AGENTS.md、AAIF TC／WGの正式更新。</li></ul>"
      }
    ],
    "sources": [
      [
        "Agent Router — Bind MCP sessions to the current route",
        "https://github.com/theagentrouter/agent-router/commit/ef5ce076b40a62d11bd82d5034afcf9080b2ff41"
      ],
      [
        "Agent Router — Enforce prompt selectors for prompts/get",
        "https://github.com/theagentrouter/agent-router/commit/178b957cc9f3fbf199ba4d9f901af7490187612f"
      ],
      [
        "Agent Router — Dynamic quota limits from metadata",
        "https://github.com/theagentrouter/agent-router/commit/52ddc244907cce94370a62d0824ba4aa1d6d3cec"
      ],
      [
        "Agent Router — Configurable credential pre-rotation window",
        "https://github.com/theagentrouter/agent-router/commit/c7c4bf0b4451663850f72ff430f6460e621961b4"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "agentgateway — Preserve Gemini tool-call thought signatures",
        "https://github.com/agentgateway/agentgateway/commit/ae33d8103ef08f66115ed388d2ae9bfcf06dd389"
      ],
      [
        "agentgateway v1.7.0-alpha.1 / releases",
        "https://github.com/agentgateway/agentgateway/releases/tag/v1.7.0-alpha.1"
      ],
      [
        "goose — Terminate owned shell process trees on cancellation",
        "https://github.com/aaif-goose/goose/commit/5be3f8d3db9a2c4dfd5162bc50c3a35c648b7706"
      ],
      [
        "goose — Configure unavailable default provider",
        "https://github.com/aaif-goose/goose/commit/8069dc4aa462bd3b00ad0287d1d42954d98011b8"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "MCP releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AGENTS.md commits",
        "https://github.com/agentsmd/agents.md/commits/main"
      ],
      [
        "AGNTCon + MCPCon North America schedule",
        "https://events.linuxfoundation.org/agntcon-mcpcon-north-america/"
      ],
      [
        "Linux Foundation Newsletter — October 2026",
        "https://www.linuxfoundation.org/blog/linux-foundation-newsletter-october-2026"
      ]
    ]
  },
  {
    "date": "2026-10-22",
    "level": "HIGH",
    "tags": [
      "Operations",
      "Security",
      "MCP"
    ],
    "title": "失敗を成功にせず、競合listenerをtrafficから外す",
    "summary": "gooseはACPのerror turnを失敗化。agentgatewayは競合listenerと認可ログを修正した。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>今日の中心は、Agent基盤の「実行結果」と「実際に流れたtraffic」を観測上の事実と一致させる修正である。</strong>gooseはACP経由のturnがerror messageで終わった場合、prompt requestを成功として返さず、<code>turn_failed</code>として失敗させるよう変更した。agentgatewayは同じport上でhostnameやprotocolが競合するlistenerについて、状態だけを残し、data planeへはprogramしないようにした。</p><p>どちらも新しいAgent能力ではないが、運用上は重要度が高い。上位orchestratorが失敗を成功と誤認すれば次工程へ進み、競合listenerがtrafficを受ければ意図しないrouteやpolicyが選ばれる。<strong>制御面のstatus、clientへ返す結果、data planeの実態を一致させること</strong>が、Agentic Opsの安全なretry、alert、rolloutの前提になる。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>gooseのACP修正では、turn streamの最後がerrorならsession prompt全体を失敗として返す。</strong>従来はstream内にerrorがあってもrequestが正常終了したように見える場合があり、呼び出し側が成功と誤判定できた。修正後はreasonを<code>turn_failed</code>として返し、失敗時にもsession使用量の更新を試みる。認証切れやcredit不足を安全に伝える既存経路も維持される。</p><p><strong>agentgatewayはGateway APIのlistener競合を検出し、敗者listenerをtrafficから除外する。</strong>競合側は<code>Accepted=False</code>、<code>Programmed=False</code>としてstatusに残るため、単に消すのではなく「設定は存在するが配信されない」状態を運用者が把握できる。同時に、MCP authorization拒否は内部logで<code>Authorization</code>理由として識別できるようにしつつ、clientには従来どおり<code>unknown resource</code>を返し、resource列挙を防ぐ。</p><p>またMCP upstream sessionの<code>DELETE</code>が404または405を返した場合、agentgatewayはcleanup成功として扱う。404は既にsessionがなく、405はserverがclient主導の終了を許さない状態であり、500等の実障害とは分離される。不要なwarningと再試行を減らすidempotentな終了処理である。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>goose — HIGH：</strong>ACP turn末尾のerrorを明示的な失敗へ変更。MCP tool名はOpenAI等のprovider制約に合う公開名へsanitizeし、元名のhashを付けて衝突を防ぐ。server呼出しでは元のtool名を維持する。<code>--dangerous-include-history</code>は最近のshell commandをmodel contextへ渡すopt-in機能で、command lineにcredentialや機密値が残る危険を明記している。versionはmain上で1.56.0へ更新されたが、正式releaseとしての公開は確認できず、最新版はv1.55.0として扱う。</li><li><strong>agentgateway — HIGH：</strong>競合listenerをprogrammed trafficから除外し、statusは保持。MCP認可拒否の内部分類、session DELETEの404／405成功扱い、TLS終端proxyでOrigin schemeが変わる場合のCSRF判定修正が入った。Anthropic、Vertex AI Anthropic、Bedrock向けprompt cacheの一貫化と、AWS Bedrock native Runtime endpointの初期対応もmainへ入った。正式最新版はv1.6.0で、今回の変更は未release。</li><li><strong>MCP：</strong>前回記事のTasks and Events WG／Agents IG変更以降、新しい仕様commit、SEP Final、正式releaseを確認できなかった。</li><li><strong>A2A：</strong>新しいprotocol releaseはなく、正式最新版はv1.0.1。前回のTSC拡大以降の正式ガバナンス変更も確認できなかった。</li><li><strong>Agent Router：</strong>前回扱ったOAuth metadata 1 MiB上限以降、独立した大型変更や新releaseは確認できず、正式最新版はv1.2.0。</li><li><strong>AGENTS.md：</strong>前回以降の新規commit・releaseなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p><strong>確認できた事実：</strong>AAIF公式blogは10月21日、Agentがuserの許可を持つことと、第三者serviceがそのAgentを受け入れることは別の判断だと整理した。Shopify UCPの例では、anonymous、署名済み、token付きの各Agentでrate limitや許可操作が異なり、購入や注文情報には適切なscopeが必要になる。本人性、委任、scope、user presenceを一つの「ログイン済み」へ潰さない考え方である。AAIF Technical Committee、Working Group、新規project proposal、加入・卒業project、認定には、前回以降の新しい正式決定を確認できなかった。</p><p><strong>分析：</strong>agentgatewayがclientへの<code>unknown resource</code>と内部の<code>Authorization</code>を分けた変更は、この考え方を運用へ落とす一例である。外部へresource存在を漏らさず、内部では認証失敗、認可拒否、存在しないresourceを区別できれば、securityを保ったまま正しいalertとremediationを選べる。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>第一の流れは<strong>failure semanticsの構造化</strong>である。HTTP statusやprocess exitだけでなく、turnがどのeventで終わったか、外部作用が発生したか、再試行可能かを上位orchestratorへ返す必要がある。gooseの<code>turn_failed</code>とagentgatewayのlistener conditionは、Agent runtimeとnetwork control planeの双方で「黙って成功にしない」設計へ寄せる。</p><p>第二は<strong>provider差を境界adapterで吸収する</strong>流れである。MCP tool名はprotocol上有効でもLLM providerに拒否され得る。公開名を安全な文字列へ変換しつつ、hashで一意性を保ち、server側には元名を送る設計により、tool実装をprovider都合で変更せずに済む。</p><p>第三は<strong>便利なcontext共有を明示的なdata exfiltration面として扱う</strong>ことだ。shell historyは復元力を高める一方、token、password、URL query、顧客名がcommand lineに残り得る。危険な機能を名前・flag・warningで明示し、既定offにすること自体がsecurity controlになる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>ACP clientのE2E testで、stream途中error、最終error、認証切れ、credit不足、usage更新失敗を分け、成功eventや次工程が発火しないことを確認する。</li><li>retry policyは<code>turn_failed</code>だけで即時再試行せず、外部Tool作用の有無、idempotency key、error classを併せて判定する。</li><li>Gateway APIへ同一port・重複hostname・異なるprotocolのlistenerを投入し、競合側が<code>Accepted=False</code>かつ実trafficを受けないことをconformance testへ加える。</li><li>MCP authorizationについて、client responseはresource存在を漏らさず、内部log／metricでは認証、認可、not foundを区別できるかを確認する。logへresource名やcredentialを過剰記録しない。</li><li>MCP session cleanupでは404／405を正常終了、5xxやtimeoutを失敗として扱い、warning rateとretry stormが減るかを観測する。</li><li>MCP tool名にdot、space、非ASCII、64文字超、sanitize後に同名となる組合せを与え、provider登録名の一意性と元toolへのroutingを試験する。</li><li><code>--dangerous-include-history</code>は共有端末、CI、production運用で無効を既定にし、利用時はshell historyへsecretを保存しない設定、redaction、短い保持期間、送信先providerのdata policyを確認する。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>goose v1.56.0の正式releaseと、ACP failure semantics／provider-safe tool名／history機能の収録範囲。</li><li>shell history contextのredaction、許可command、最大件数、audit表示の追加。</li><li>agentgatewayの競合listener修正、認可log、session DELETE処理、prompt cache、Bedrock Runtime対応を含む次期release。</li><li>listener競合時のpolicy attachment、status伝播、複数controller replicaでの一貫性。</li><li>MCP Tasks and Events WGのcallback／subscription SEPとconformance test。</li><li>A2A v1.1 roadmap、Agent Router次期release、AGENTS.mdの正式更新。</li><li>10月22〜23日のAGNTCon + MCPCon North Americaで公表される仕様、security、observability関連の一次資料。session発表と採択済み仕様は分けて扱う。</li></ul>"
      }
    ],
    "sources": [
      [
        "goose — Fail ACP prompt when turn ends on error",
        "https://github.com/aaif-goose/goose/commit/122834086b62ae39adf721de32ae59fcde904a8c"
      ],
      [
        "goose — Provider-safe MCP tool names",
        "https://github.com/aaif-goose/goose/commit/78f2ba90eabdb465e5add4482bf68c181574a4be"
      ],
      [
        "goose — Dangerous include history",
        "https://github.com/aaif-goose/goose/commit/497aa76c23b6aaa4b3d53a5372afa37645352501"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "agentgateway — Keep conflicted listeners out of traffic",
        "https://github.com/agentgateway/agentgateway/commit/2cd6624c814098ed191fcf99da9b52cd36ac128d"
      ],
      [
        "agentgateway — Distinguish authorization denials in logs",
        "https://github.com/agentgateway/agentgateway/commit/8ce0a28abaa3b358159cab5861ccd056e0117f83"
      ],
      [
        "agentgateway — Treat MCP session DELETE 404/405 as success",
        "https://github.com/agentgateway/agentgateway/commit/01ad985e80e4ffc93d964f2666aa67a10329d52b"
      ],
      [
        "agentgateway — CSRF Origin host comparison",
        "https://github.com/agentgateway/agentgateway/commit/21b793e7b9b93a698ef8f0ee1e477fca2369eb40"
      ],
      [
        "agentgateway — Consistent prompt caching",
        "https://github.com/agentgateway/agentgateway/commit/974e1a304cacbabde4b96b9635944f27584ade7f"
      ],
      [
        "agentgateway — Native AWS Bedrock endpoint support",
        "https://github.com/agentgateway/agentgateway/commit/ea7f5edf39036722ce9d1d3e06527da97a10dc42"
      ],
      [
        "agentgateway releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "AAIF — AI agents can't just walk in",
        "https://aaif.io/blog/ai-agents-can-t-just-walk-in"
      ],
      [
        "MCP releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "AGENTS.md commits",
        "https://github.com/agentsmd/agents.md/commits/main"
      ],
      [
        "AGNTCon + MCPCon North America",
        "https://events.linuxfoundation.org/agntcon-mcpcon-north-america/"
      ]
    ]
  },
  {
    "date": "2026-10-21",
    "level": "HIGH",
    "tags": [
      "MCP",
      "Operations",
      "Security",
      "A2A"
    ],
    "title": "MCP、TasksとEventsを正式WGへ集約",
    "summary": "MCPは長時間処理と通知を専任WGへ移管。A2AはTSCを9席へ拡大した。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>今日の中心は、Agent間連携を一枚岩の「Agent仕様」にせず、長時間処理・通知・Agent境界を別々に成熟させるガバナンス変更である。</strong>MCPはTasksの安定化とcore protocol昇格、callback、subscription lifecycle、delivery semantics、event orderingを「Tasks and Events Working Group」に集約した。一方、従来のAgents Working GroupはAgents Interest Groupへ変更され、agent-as-tool、remote agent、supervisor/sub-agentの実装事例を基に、専用Agents Extensionが本当に必要かを評価する役割へ絞られた。</p><p>これはAgent連携を止める決定ではない。<strong>確定した実装課題はWGで仕様化し、まだ境界が曖昧なAgent概念はIGで検証する</strong>という分離である。同じ日に、gooseは失敗・取消済みsubagentのresumeを実装し、Agent Routerとagentgatewayは外部入力で資源消費やpanic、UI注入が起きる経路を狭めた。標準化と実装の双方が、durable executionと安全な再開へ寄っている。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>MCPのTasks and Events WGは、Tasks extensionの安定化とcore昇格に加え、serverからclientへ状態変化を能動通知するcallback機構を担当する。</strong>現在のpollingやSSE接続維持だけに依存せず、webhook等を含む仕組み、subscription、配送、transport横断の順序保証を仕様化する。目標にはaccepted SEP、Tier-1 SDK 2件以上のreference implementation、conformance testが含まれる。</p><p>Agents IGは、専用extensionを前提とせず、既存MCP primitive、Tasksの拡張、Agents Extensionの三案をprototypeで比較する。planning、memory、model選択、orchestration内部は対象外である。この線引きにより、製品固有runtimeと相互運用境界を混同しにくくなる。</p><p>A2AではBloombergのVinay Ramesh氏がTSCへ加わり、席数が8から9へ増えた。protocol releaseではないが、金融・enterprise利用者の視点がtechnical governanceへ直接入る変更である。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>MCP — HIGH：</strong>Tasks and Events WGを設置し、旧Triggers and Events WGへTasksの責務とleadを統合。Agents WGはAgents IGへ移行した。新しいprotocol releaseそのものではなく、今後の仕様決定主体の変更である。</li><li><strong>goose — MEDIUM：</strong>失敗または取消済みdelegateをsubagent IDでresume可能にした。完了済みdelegateは再開不可で、親sessionに属するsubagentだけを再開できる。既定の再開指示は「中断地点から続ける」。正式releaseへの収録は未確認のmain変更である。</li><li><strong>agentgateway — MEDIUM：</strong>不正hostnameをTLS SNIへ変換した際のpanicをerrorへ変更。log Markdownはsanitized DOM fragmentとして描画し、<code>dangerouslySetInnerHTML</code>を除去した。LiteLLM importerは<code>default_fallbacks</code>と<code>max_fallbacks</code>を扱うが、unknown modelやconditional fallbackは意味差が残るためmanual findingを出す。正式最新版はv1.6.0で、これらはmain上の変更。</li><li><strong>Agent Router — MEDIUM：</strong>OAuth authorization server metadataを1 MiBで上限化し、超過documentをrejectする。user supplied URLからの無制限body readを防ぐhardeningである。Anthropic passthroughではquery string保持も修正された。正式最新版はv1.2.0。</li><li><strong>A2A — MEDIUM：</strong>BloombergをTSCへ追加。新しいprotocol releaseはなく、正式最新版はv1.0.1。</li><li><strong>AGENTS.md：</strong>前回以降の新規commit・releaseなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p><strong>確認できた事実：</strong>MCPでは「仕様を決めるWG」と「要否を調べるIG」の権限が分離された。Tasks and Events WGはSEP triage、技術設計、core maintainer承認を経た仕様変更を進める。Agents IGはuse case、PoC、推奨事項を出すが、一般的なAgent frameworkやruntimeを標準化しない。A2AはTSCを9席へ拡張した。AAIF公式news、Technical Committee、新規project proposal、加入・卒業project、認定制度については、前回以降の新しい正式発表を確認できなかった。</p><p><strong>分析：</strong>MCPとA2Aの競合を意味する変更ではない。MCP側はtool／resource境界でのdurable taskとevent deliveryを詰め、Agent同士の相互運用を専用extensionにするかは保留した。実装者は「agent」という名前ではなく、task lifecycle、callback認証、ordering、replay、capability discoveryごとに適用protocolを選ぶべきである。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>注目点は<strong>resumabilityをconversation機能ではなく、運用上の状態機械として扱う流れ</strong>である。gooseは失敗・取消済みsubagentへ同じsession IDで新しい指示を追加して継続する。MCPは長時間taskと通知を専任WGへ移し、polling以外の完了通知を標準化対象にした。両者に共通するのは、実行を一回のrequest/responseへ閉じず、停止・再接続・再開を通常系として設計する点である。</p><p>同時に、境界入力を有限化する変更も続く。Agent Routerの1 MiB上限、agentgatewayのinvalid SNI error化、sanitized DOM fragmentは、metadata、hostname、logという「制御情報」にも攻撃面と障害面があることを示す。Agentic Opsではmodel outputだけでなく、discovery document、routing metadata、observability UIまで信頼境界に含める必要がある。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>MCP TasksのPoCでは、polling、SSE切断、callback再送、順序逆転、duplicate deliveryを試験し、task IDとevent IDで冪等化する。</li><li>callback endpointは署名検証、audience固定、replay window、tenant bindingを持たせる。通知受信だけでtask結果を確定せず、必要ならauthoritative stateを再取得する。</li><li>gooseのresumeでは、subagentが中断前に外部作用を起こしたかを記録する。支払、deploy、ticket作成等はidempotency keyなしで自動resumeしない。</li><li>agentgateway移行時はLiteLLMのunknown model、default fallback、再帰fallback、content policy fallbackをgolden testで比較する。変換結果のmanual／approximate findingをrelease gateにする。</li><li>OAuth metadataへ1 MiB超、slow response、invalid JSON、redirect loopを与え、memory、timeout、alternate endpointへのfallbackを確認する。</li><li>log UIへ<code>&lt;script&gt;</code>、event handler、外部imageを含むTool outputを投入し、DOM生成とnetwork requestが発生しないことをE2Eで確認する。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Tasks and Events WGが出すcallback／subscription SEP、delivery ordering、認証方式、Tier-1 SDK実装。</li><li>Agents IGが専用Agents Extension、Tasks拡張、既存primitiveのどれを推奨するか。</li><li>MCP Tasks extensionのcore protocol昇格時期とconformance coverage。</li><li>goose resume機能の正式release、resume時の重複外部作用防止、background delegate対応。</li><li>agentgateway main変更の次期release収録とLiteLLM移行時のsemantic差。</li><li>A2A TSC拡大後のroadmap・投票結果、次期protocol release。</li><li>AGNTCon + MCPCon North America（10月22〜23日）の仕様・security・observability関連発表。開催予定と採択済み仕様は区別して追跡する。</li></ul>"
      }
    ],
    "sources": [
      [
        "MCP — Tasks and Events WG / Agents IG charter change",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/80041ab0a139a8f4fb3adbc99f7ae9113ea59671"
      ],
      [
        "A2A — Add Bloomberg to the TSC",
        "https://github.com/a2aproject/A2A/commit/98279d62316361ba8451eaef300f72b72e169185"
      ],
      [
        "goose — Resume failed or cancelled delegates",
        "https://github.com/aaif-goose/goose/commit/e0cf7a4ff74647eaa4f5060cc9fd97a4b07bc7e5"
      ],
      [
        "agentgateway — Error instead of panic on invalid SNI",
        "https://github.com/agentgateway/agentgateway/commit/f51a7fbca57dfe56bf639b8df21be49db76e9ebc"
      ],
      [
        "agentgateway — Sanitize log Markdown DOM",
        "https://github.com/agentgateway/agentgateway/commit/87c66ad02bbc33e96585bbcb3197607b00b3bd42"
      ],
      [
        "agentgateway — LiteLLM default fallbacks import",
        "https://github.com/agentgateway/agentgateway/commit/d8d1b8ecef961f610ca95642f541ade8b5f02075"
      ],
      [
        "agentgateway releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "Agent Router — Limit OAuth metadata response to 1 MiB",
        "https://github.com/theagentrouter/agent-router/commit/7bcb45477c51b2429f32a7bd895af6408fe4ed79"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "MCP releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AGENTS.md commits",
        "https://github.com/agentsmd/agents.md/commits/main"
      ],
      [
        "AAIF blog",
        "https://aaif.io/blog"
      ],
      [
        "AAIF news",
        "https://aaif.io/news"
      ],
      [
        "AGNTCon + MCPCon North America",
        "https://events.linuxfoundation.org/agntcon-mcpcon-north-america/"
      ]
    ]
  },
  {
    "date": "2026-10-20",
    "level": "HIGH",
    "tags": [
      "Security",
      "Operations",
      "MCP"
    ],
    "title": "動的接続先を閉じ、子Agentの暴走を抑える",
    "summary": "agentgatewayが内部宛て動的接続を既定拒否。gooseは子Agent同時実行を5に制限した。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>今日の中心は、Agentが動的に決める接続先・並列数・再試行を「無制限な自由」から明示的な境界へ戻す変更である。</strong>agentgatewayはrequestごとに選ばれるdynamic backendについて、DNS解決後のloopback／link-local宛て接続を既定で拒否し、Unix socket指定も受け付けないようにした。設定やCEL式から内部service、metadata endpoint、gateway自身へ到達する経路を狭めるsecurity hardeningである。</p><p>同時にgooseは、親sessionごとのsubagent同時実行数を既定5に制限した。追加taskはslotが空くまで待機する。AAIF公式blogも、Agentの失敗を単一の<code>failed</code>へ潰さず、発生箇所、外部作用、再試行可否、次に必要な情報・承認を保存すべきだと整理した。コードと運用指針の両方が、Agentic Opsを「境界と回復可能性の設計」として扱う方向へ揃っている。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>agentgatewayのdynamic backendが、DNS解決後にloopback、link-local、特定のunspecified addressへ到達する場合、既定で拒否される。</strong>文字列上のhostnameだけを確認するのではなく、実際の解決先socket addressで判定するため、内部addressへ解決される名前にも適用される。内部接続が必要な環境向けに<code>allow_dynamic_loopback</code>があるが、明示的なopt-inとなった。</p><p>さらにstandalone modeでは、MCP session IDを暗号化するsession keyを未設定のまま起動した場合、書込み可能なfile modeではconfigへ、database modeではDBへ自動生成・保存する変更が入った。安全な既定値への移行だが、旧session IDはupgrade後に拒否されるbreaking changeであり、新しいsessionの再確立が必要になる。<code>config.session.key=disabled</code>で無効化できるものの、session IDの秘匿性を下げるため例外運用として扱うべきである。</p><p>vendor guardrailにも検査scopeが導入され、既定scopeはsystem prompt、通常message、Tool outputとなった。Tool inputはopt-in、Webhook guardrailは従来どおりsystem promptとmessageを検査する。この変更もpolicyの適用面が変わるため、upgrade前に既存ruleの再評価が必要である。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>agentgateway — HIGH：</strong>dynamic backendからloopback／link-localへの接続を既定拒否し、Unix socket targetも拒否。MCPのhost／port／path形式ではhost欄にpath等を混在させた不正設定をload時に検出する。standaloneのsession key自動生成とvendor guardrail scopeはbreaking change。正式最新版はv1.6.0で、これらはmain上の未release変更である。</li><li><strong>goose — MEDIUM：</strong><code>GOOSE_MAX_CONCURRENT_SUBAGENTS</code>を追加し、親session当たりの同時実行を既定5に制限。超過taskはqueueで待機する。custom providerがcache read／write単価を宣言でき、推定costへ反映できるようになった。長大conversationのDesktop描画も先頭20件と直近200件を中心にwindow化した。正式最新版v1.55.0には未収録。</li><li><strong>Agent Router — MEDIUM：</strong>複数controller replicaが起動時に同じMutatingWebhookConfigurationのCA bundleを更新してConflictになり、敗者replicaが再起動する競合をretry-on-conflictで修正。報告では3 replicaのfresh install 15回中10回で再現していた。正式最新版v1.2.0には未収録。</li><li><strong>MCP：</strong>前回以降の新しい仕様・SEP Final・正式releaseなし。</li><li><strong>A2A：</strong>GitHub Actions dependency更新のみで、protocol変更やreleaseなし。正式最新版はv1.0.1。</li><li><strong>AGENTS.md：</strong>新規commitなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIF公式blogは10月19日、Agentの失敗記録について実務的な整理を公開した。規範仕様ではないが、failure recordが最低限答えるべき問いとして、①どこで失敗したか、②外部作用が発生・未発生・部分発生・不明のどれか、③再試行が適切か、④継続に情報・承認・停止の何が必要か、を提示している。承認待ちは障害ではなく、応答喪失後の外部作用不明は単純retryしてはいけないという区別が重要である。</p><p>AAIF Technical Committee、Working Groups、project proposal、新規加入・卒業project、認定制度には新しい正式決定を確認できなかった。10月22〜23日のAGNTCon + MCPCon North AmericaにはMCP、security、observability、cost、分散simulationのsessionが予定されているが、開催予定を採択済み仕様とは扱わない。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>共通テーマは<strong>bounded autonomyとrecoverable execution</strong>である。Agentへ動的routing、子Agent生成、Tool実行、retryを許すほど、従来の静的allowlistだけでは制御できない。必要なのは、名前ではなく解決後addressで接続先を評価し、並列数をresource budgetとして制限し、外部作用の確定状態を保存することである。</p><p>また、top-level statusだけでなく、<code>failure_location</code>、<code>effect_state</code>、<code>retry_class</code>、<code>required_action</code>を構造化すれば、自動retryと人間escalationを分離できる。これは単なるobservability改善ではなく、二重実行、内部network到達、承認の迂回、resource枯渇を防ぐcontrol planeの入力になる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>dynamic backendへ<code>127.0.0.1</code>、<code>::1</code>、link-local、内部IPへ解決されるDNS名、Unix socketを与え、すべて既定拒否されるかnegative testする。</li><li>cloud metadata endpointだけでなく、Prometheus、Alertmanager、管理API、Kubernetes APIなどgatewayから到達可能な内部serviceをasset inventory化する。</li><li><code>allow_dynamic_loopback</code>を使う場合はgateway単位で有効化せず、専用instance、network policy、egress proxyでblast radiusを限定する。</li><li>agentgateway upgrade前に既存MCP sessionをdrainし、session keyをSecret管理して全replicaで共有する。key rotation時のsession失効手順も決める。</li><li>guardrailのscopeごとにsystem prompt、message、Tool input、Tool outputへ同じsecret／禁止語を置き、想定した面だけが検査されるか確認する。</li><li>gooseの同時subagent数を2、5、10で比較し、CPU、memory、provider rate limit、Tool backend負荷、完了時間、失敗率を計測する。</li><li>失敗記録へ<code>location</code>、<code>external_effect</code>、<code>retryable</code>、<code>next_action</code>、idempotency keyを保存し、外部作用不明時は自動retryを止める。</li><li>Agent Routerを3 replica以上でfresh installし、CA bundle更新時のrestart countとConflict eventをrelease gateへ追加する。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>dynamic backend制限、session key、guardrail scopeを含むagentgateway次期release</li><li>dynamic DNSの再解決・DNS rebindingに対する継続的なaddress検査</li><li>session key生成失敗時に暗号化なしで継続するwarningの監視方法</li><li>guardrail scope変更による既存policyの互換性</li><li>gooseのsubagent queueに対するtimeout、cancel、公平性</li><li>cache read／write単価とprovider請求額の整合</li><li>Agent Router修正のrelease/v1.1 backportとv1.2.x収録</li><li>AAIF failure taxonomyがOpenTelemetry semantic conventionやconformance testへ発展するか</li><li>AGNTCon + MCPCon North Americaでの正式発表・新規project proposal</li><li>MCP、A2A、AGENTS.md、AAIF TC／WGの正式更新</li></ul>"
      }
    ],
    "sources": [
      [
        "agentgateway — Deny dynamic destinations resolving to loopback",
        "https://github.com/agentgateway/agentgateway/commit/9d677a3e74c6f0ebd36a6b127c0a63b829d4e047"
      ],
      [
        "agentgateway — Always use a standalone session key",
        "https://github.com/agentgateway/agentgateway/commit/20cfb34b57d5a75b710b5ccab5def9fb58138a22"
      ],
      [
        "agentgateway — Guardrail scope support",
        "https://github.com/agentgateway/agentgateway/commit/49e1f5b890b3beeb6ec95abfcb0b5e6c49bff469"
      ],
      [
        "agentgateway — Reject invalid MCP hosts",
        "https://github.com/agentgateway/agentgateway/commit/1cb1915f41021a9b7c14ebc8730a3da3b3cba619"
      ],
      [
        "agentgateway releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "goose — Limit concurrent subagents",
        "https://github.com/aaif-goose/goose/commit/62d35011344abe39997cd493613d147bb84a29c7"
      ],
      [
        "goose — Provider-defined cache prices",
        "https://github.com/aaif-goose/goose/commit/4ea7c2c6dc40cfea391df555afd7ad4eade5a659"
      ],
      [
        "goose — Bound long conversation rendering",
        "https://github.com/aaif-goose/goose/commit/cf3ce0ab545c74a35fcc35afd4e714d895647594"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "Agent Router — Retry admission webhook CA bundle conflicts",
        "https://github.com/theagentrouter/agent-router/commit/9d32e9c010e2f4620bc91c4c7dc2841661855f0d"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "AAIF — Why agent failed does not tell you enough",
        "https://aaif.io/blog/why-agent-failed-doesn-t-tell-you-enough"
      ],
      [
        "AGNTCon + MCPCon North America",
        "https://events.linuxfoundation.org/agntcon-mcpcon-north-america/"
      ],
      [
        "MCP releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AGENTS.md commits",
        "https://github.com/agentsmd/agents.md/commits/main"
      ]
    ]
  },
  {
    "date": "2026-10-19",
    "level": "HIGH",
    "tags": [
      "MCP",
      "Operations"
    ],
    "title": "BedrockでMCP確認後の全ターン失敗を修正",
    "summary": "gooseが内部確認blockの空文字変換を停止。MCPではSEP索引と参照リンクを修復した。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>gooseのBedrock経路で、MCP elicitationまたはTool確認を一度通ったsessionの後続turnがすべて失敗する問題が修正された。</strong>原因は、Agent内部の<code>ActionRequired</code>と<code>ToolConfirmationRequest</code>をBedrockへ渡す際、空文字の<code>ContentBlock::Text(\"\")</code>へ変換していたことにある。Bedrockはcontent list内の空text blockを拒否するため、確認処理自体が終わっていても履歴を再送する次turn以降が継続不能になっていた。</p><p>修正後は、この二種類のcontrol blockをprovider向けmessageへ変換する前に除外する。modelへ渡す会話と、人間承認・protocol制御の状態を分離する変更である。正式最新版v1.55.0公開後のmain変更であり、配布artifactには未収録である。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>事象：</strong>MCP Serverがelicitationを要求した場合、またはTool実行に利用者確認が必要な場合、gooseのsession履歴には<code>ActionRequired</code>／<code>ToolConfirmationRequest</code>が残る。Bedrock serializerはこれらを空文字へ変換していた。確認後の新しいpromptで履歴全体をBedrockへ送ると、空text fieldを含むrequestとして拒否され、以後のturnも同じ履歴を再送するため失敗が継続した。</p><p><strong>修正：</strong>control blockをfilterし、それだけで構成されたmessageは空content listとする。provider層に既存のempty-message skipがあるため、Bedrockへ不正なblockを送らない。OpenAI、Google、Databricks、Snowflakeでは既に同種のfilterを行っており、今回Bedrockの挙動を揃えた。</p><p><strong>影響：</strong>BedrockでMCP elicitationやTool approvalを使うAgentは、単発のAPI errorではなくsession継続不能になる可能性がある。v1.55.0利用時は該当flowを避ける、修正commitを限定的にbackportする、または次期releaseまで別providerで検証する判断が必要になる。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>goose — HIGH：</strong>Bedrock変換時に<code>ActionRequired</code>と<code>ToolConfirmationRequest</code>を空textへ変換せず除外するよう修正。実際のelicitation request／responseを使うregression testも追加された。正式最新版はv1.55.0で、この修正はmainのみ。</li><li><strong>MCP — LOW：</strong>SEP-2640 Skills Extension内のSEP-2133参照が404になるMarkdown記法を修正。あわせてSEP indexを再生成し、既にFinalだったSEP-2127 MCP Server Cardsのredirectを追加、Final件数を42から43へ補正した。新しいSEPが本日Finalになったわけではなく、generated documentationの同期修正である。</li><li><strong>agentgateway：</strong>前回以降の新規重要commit・releaseなし。正式最新版はv1.6.0。</li><li><strong>Agent Router：</strong>新規重要commit・releaseなし。正式最新版はv1.2.0。</li><li><strong>A2A：</strong>新規protocol変更・releaseなし。正式最新版はv1.0.1。</li><li><strong>AGENTS.md：</strong>新規commitなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>MCPの変更は仕様内容の改訂ではなく、参照リンク、redirect、generated indexの整合性修正である。SEP-2127 MCP Server Cardsは以前からFinalであり、Final件数が43へ増えた表示だけを見て新たな標準化決定と解釈してはいけない。</p><p>この事例は、規範文書のsource、生成済みdocs、redirect、index countが別々にdriftし得ることを示す。標準の監視ではcommit messageだけでなく、SEP status metadataと生成物を照合する必要がある。AAIF Technical Committee、Working Groups、project proposal、新規加入・卒業project、認定制度には、新しい正式決定を確認できなかった。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の共通テーマは<strong>control-plane messageとmodel transcriptの分離</strong>である。Agentのsessionには、利用者の発話、model出力、Tool resultだけでなく、承認要求、elicitation schema、UI状態、retry情報などが共存する。しかしproviderへ送るべきものはその一部であり、内部control eventを無理にtextへ変換すると、今回のようなvalidation failureや不要なtoken消費が生じる。</p><p>運用上はsession storeを一つに保っても、provider serializerで<code>model-visible</code>、<code>human-visible</code>、<code>control-only</code>、<code>audit-only</code>を分類する必要がある。さらにproviderごとに同じ分類規則を適用しなければ、OpenAIでは動くworkflowがBedrockでは壊れるという移植性問題になる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>MCP elicitationを要求するtest serverを用意し、accept／decline／cancel後に次の通常promptが成功するか確認する。</li><li>Tool approvalの承認・拒否後も同じsessionを継続し、Bedrock requestに空text blockが含まれないことをcaptureする。</li><li>同じ保存済みtranscriptをBedrock、OpenAI、Google系adapterへreplayし、provider間の成功率と送信message数を比較する。</li><li>control blockはmodel requestから除外しても、承認者、判断、対象Tool、policy hashをaudit logへ残す。</li><li>session failure時に新規sessionへ逃げるだけでなく、どの履歴blockがprovider validationを破ったかをdiagnosticへ記録する。</li><li>v1.55.0をproduction基準線にする場合、elicitation／approvalを含むworkflowをrelease gateへ追加する。</li><li>MCP docs監視ではSEP statusの変更と、index・redirectだけの再生成を区別する。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Bedrock control-block修正を含むgoose次期release</li><li>v1.55.0利用環境でのelicitation後session失敗報告</li><li>provider adapter間でのcontrol event filterの統一</li><li>elicitation内容を除外した後のaudit trail完全性</li><li>SEP-2640 Skills Extensionの進展とSEP-2133との関係</li><li>MCP SEP index生成を必須化するCI修正</li><li>agentgateway v1.6.x、Agent Router v1.2.x</li><li>A2A、AGENTS.md、AAIF TC／WGの正式更新</li></ul>"
      }
    ],
    "sources": [
      [
        "goose — Filter Bedrock ActionRequired and ToolConfirmationRequest blocks",
        "https://github.com/aaif-goose/goose/commit/34a222e3f2b95d8b4a43482b53c2cc957ecce26d"
      ],
      [
        "goose PR #12843 — Bedrock session failure details",
        "https://github.com/aaif-goose/goose/pull/12843"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "MCP — Fix SEP-2640 references and regenerate SEP index",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/1155ca460e5097019f32769b38dcba194432e2fb"
      ],
      [
        "MCP releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "agentgateway releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AGENTS.md commits",
        "https://github.com/agentsmd/agents.md/commits/main"
      ],
      [
        "AAIF Blog",
        "https://aaif.io/blog"
      ]
    ]
  },
  {
    "date": "2026-10-18",
    "level": "LOW",
    "tags": [
      "Operations",
      "MCP"
    ],
    "title": "gooseのmodel catalog更新、正式版は変化なし",
    "summary": "provider情報の更新が中心。仕様・release・Gateway群に新たな重要差分はなく、静穏な一日となった。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>本日は大きな仕様変更、security advisory、新しい正式releaseは確認できなかった。</strong>前回レポート以降の実質的な差分は、goose mainにおけるOpenCode Go／Zen向けmodel catalogの更新である。GLM、Kimi、Qwen、MiMoなどのmodel追加とcontext limit修正が行われた。</p><p>これはprotocolやAgent実行loopの変更ではない。しかしmodel catalogは、利用者が選べるmodel、長文contextの許容量、compaction開始位置、cost・latency試験の前提を決める運用データである。コード変更が小さくても、誤ったcontext limitはsession途中の失敗や想定外の圧縮につながるため、productionでは実行時のmodel metadataを証跡として残す価値がある。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>gooseのOpenCode provider定義を更新：</strong>OpenCode Goでは、GLM 5.2／5.3系、Kimi K3、Qwen 3.7／3.8系、MiMo 2.6系などを追加し、複数modelのcontext limitを修正した。OpenCode ZenでもGLM 5.2／5.3系を追加し、Kimi K3やMiniMax M3などの上限を見直している。これはgoose v1.55.0公開後のmain変更であり、v1.55.0配布artifactへ含まれる機能とは扱わない。</p><p><strong>評価：</strong>catalog値はproviderが実際に受け付ける上限と常に一致するとは限らない。gatewayやprovider側のmodel alias、account tier、reasoning token、Tool schema分の予約領域によって、有効contextは小さくなる場合がある。宣言値だけで長時間Agentの安全上限を決めず、実測とprovider errorを併用する必要がある。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>goose — LOW：</strong>OpenCode Go／Zenのmodel catalogへ不足modelを追加し、context limitを更新。正式最新版はv1.55.0のままで、今回のcatalog修正はmainのみ。あわせてCore MaintainerのAlex Hancock氏をEmeritusへ移し、issue assignment rosterから外す名簿更新が行われた。これはmaintainer構成の変更であり、projectの停止やtechnical policy変更を意味しない。</li><li><strong>agentgateway：</strong>新しい正式releaseなし。最新はv1.6.0。backend callの大きなasync stack frameを分離する内部refactorはあるが、公開APIやpolicy semanticsの変更としては評価しない。</li><li><strong>Agent Router：</strong>新規の重要commit・releaseなし。正式最新版はv1.2.0。前日までに確認したcross-namespace quota backendは引き続きmainのみ。</li><li><strong>MCP：</strong>新しい仕様、SEP Final、security advisory、releaseなし。正式仕様は<code>2026-07-28</code>。</li><li><strong>A2A：</strong>新規protocol変更・releaseなし。正式最新版はv1.0.1。</li><li><strong>AGENTS.md：</strong>新規commitなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>gooseではCore Maintainer一名がEmeritusへ移り、maintainer一覧と自動issue assignment用rosterが更新された。確認できる事実は役割変更までであり、後任選任、権限移譲、release承認手順の変更は示されていない。個人の異動をproject riskへ直結させず、CODEOWNERS、review分布、release signer、未処理issueの推移を継続して確認する。</p><p>AAIF Technical Committee、MCP Working Groups、project proposal、新規加入・卒業project、認定制度について、新しい正式決定は確認できなかった。会合予定やmain上の編集を採択済み標準とは扱わない。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の論点は<strong>model metadataをcontrol-plane stateとして扱うこと</strong>である。Agentは同じmodel名でも、provider、endpoint、account、catalog更新時点によってcontext limitや機能が変わる。静的な設定ファイルだけを正とすると、routingは成功してもcompaction、cost推定、fallback、再現試験がずれる。</p><p>実行ごとに<code>provider</code>、<code>requested_model</code>、<code>resolved_model</code>、catalog version、declared context limit、実際のinput／output token、provider request IDを記録すれば、model追加後の品質変化を説明しやすい。これはmodel inventoryを単なるUI候補一覧ではなく、Agentic Opsの構成管理対象へ引き上げる考え方である。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>goose v1.55.0のbundled catalogとmainのcatalogを分け、検証対象のcommit SHAを固定する。</li><li>PoC開始時にprovider、model ID、declared context limit、catalog hashをsnapshotとして保存する。</li><li>context上限の70％、90％、超過付近で同じAlert triage taskを再生し、compaction時点、回答品質、p95、error種別を比較する。</li><li>catalogにあるがprovider accountでは利用できないmodelを選び、明確なerrorと安全なfallbackになるか確認する。</li><li>providerが返すlive metadataとbundled値が異なる場合、どちらを優先したかをtraceへ記録する。</li><li>maintainer変更については、review待ち時間、release署名者、security issueの応答時間を観測し、名簿変更だけでリスクを断定しない。</li><li>更新が少ない日も正常系trace、Tool成功率、token実測値を保存し、release後の比較基準にする。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>OpenCode Go／Zen catalog修正を含むgoose次期release</li><li>declared context limitとprovider実測上限の差</li><li>live model catalogとbundled fallbackの優先順位</li><li>goose maintainer roster変更後のreview・release体制</li><li>Agent Router cross-namespace quotaを含むv1.2.x</li><li>agentgateway全LLM種別rate limitを含むv1.6.x</li><li>MCP、A2A、AGENTS.md、AAIF TC／WGの正式更新</li></ul>"
      }
    ],
    "sources": [
      [
        "goose — Update OpenCode Go and Zen model catalogs",
        "https://github.com/aaif-goose/goose/commit/bfcc6ee6f1ee18d0c4c852a65c49b25f87ee40dc"
      ],
      [
        "goose — Move a Core Maintainer to Emeritus",
        "https://github.com/aaif-goose/goose/commit/59e588dfd941ae129f2938deb7acf9f80b6edd02"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "agentgateway — Refactor backend call stack",
        "https://github.com/agentgateway/agentgateway/commit/955d56fae09b45f3cb8e85e797dbb1eb06134f77"
      ],
      [
        "agentgateway releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "MCP releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AGENTS.md commits",
        "https://github.com/agentsmd/agents.md/commits/main"
      ],
      [
        "AAIF Blog",
        "https://aaif.io/blog"
      ]
    ]
  },
  {
    "date": "2026-10-17",
    "level": "HIGH",
    "tags": [
      "Operations",
      "Security",
      "MCP"
    ],
    "title": "goose v1.55.0正式公開、quota境界を全経路へ",
    "summary": "trace・承認・subagent制御が正式版へ。Gateway群はnamespaceとLLM種別を越えるquota適用を補強した。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>goose v1.55.0が10月16日に正式公開された。</strong>前日までmain上の変更として追跡していた、ACPからMCP Tool callへのW3C trace context伝播、provider request IDの記録、Tool承認待ち中の推論停止、親Agentからsubagentへのhook・mode・approval継承、既定225k tokenのauto-compaction上限などが、tagと配布artifactを持つproduction基準線へ移った。</p><p>Gateway側では、Agent RouterがQuotaPolicyから別namespaceのAIServiceBackendを参照できるようにし、agentgatewayはchat以外のEmbeddings、Rerank、Decisions、SystemOneにもresponse tokenを使うrate-limit処理を広げた。共通する動きは、Agent実行の経路が増えてもquota、approval、traceを一部経路だけの機能にしないことである。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>goose v1.55.0：</strong>今回のreleaseは新機能の追加だけでなく、実行制御の一本化が中心である。Sessionが選んだextensionをleaseとして固定し、初回利用時に起動する。Tool承認待ちの間は次の推論やsteeringを進めず、subagentも親sessionのhooks、Goose mode、approval方針へbindする。これにより、承認画面で見たToolとdispatch対象のずれや、子Agentだけが監査・承認を外れる構成を減らす。</p><p>ObservabilityではACP promptの<code>traceparent</code>／<code>tracestate</code>をMCP Tool callへ伝播し、providerの<code>x-request-id</code>もresponse・errorへ公開する。運用者はAlert、Agent推論、Tool実行、provider問い合わせを同じincident timelineへ結び付けられる。ただしtrace属性へprompt、credential、個人情報を載せない設計は引き続き必要である。</p><p>配布assetにはhashが公開されている。main追従ではなくv1.55.0のtag、binary／package hash、session schema、rollback先を固定してupgrade testを行える段階になった。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>goose — HIGH：</strong>v1.55.0を正式公開。AIgateway provider、ACP→MCP trace伝播、provider request ID、225k token compaction上限、subagent policy継承、Tool承認中の推論停止、legacy agent loop削除を収録した。release後のmainでは、ACPがlive model catalogを読み込む修正、Skills discoveryのGDK移動、PCTX code modeのJavaScript runtimeをV8系からBoaへ置換する変更が進行中で、これらはv1.55.0には含まれない。</li><li><strong>Agent Router — HIGH：</strong>QuotaPolicyが別namespaceのAIServiceBackendをtargetにできるようになった。許可にはbackend側namespaceの<code>ReferenceGrant</code>が必要で、未許可時は<code>RefNotPermitted</code>として扱う。namespaced identityをcontroller、xDS descriptor、ext-proc metadataまで伝播し、policy削除時も影響routeを更新する。正式最新版v1.2.0には未収録。</li><li><strong>agentgateway — HIGH：</strong>response tokenに基づくrate limitをChatだけでなくEmbeddings、Rerank、Decisions、SystemOneへ拡大。Request policy段階で<code>llmRequest</code>と<code>llm.requestModel</code>をCELから参照でき、provider変換前のrequested modelで早期判定できる。Unknown model 404やmodel authorization 403など、upstreamへ到達しないlocal responseもrequest snapshotへ残す。正式最新版はv1.6.0で、変更はmainのみ。</li><li><strong>MCP：</strong>dependency更新のみ。新仕様、SEP Final、security advisory、正式releaseなし。正式仕様は<code>2026-07-28</code>。</li><li><strong>A2A：</strong>新規protocol commit・releaseなし。正式最新版はv1.0.1。</li><li><strong>AGENTS.md：</strong>新規commitなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIF Technical Committee、Working Groups、project proposal、加入・卒業project、認定制度について、新しい正式決定は確認できなかった。MCP、A2A、AGENTS.mdにも規範的な仕様変更はない。</p><p>goose v1.55.0はAAIF傘下repositoryから配布された正式artifactであり、main上の実験とrelease planeを分けて評価できる。一方、Agent Routerのcross-namespace quotaとagentgatewayの全LLM種別rate limitはmerge済みでも未releaseである。production導入では「mergeされた事実」「tagに収録された事実」「使用中image digest」の三つを別々に記録する。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の共通テーマは<strong>policy completeness</strong>である。Chat requestだけ、親Agentだけ、同一namespaceだけ、upstream成功時だけにpolicyを適用しても、別経路が無制限なら境界として成立しない。</p><p>Quotaは<code>namespace/name</code>で対象を一意にし、cross-namespace参照はReferenceGrantで明示的に許可する。LLM rate limitはChat、Embedding、Rerank、Decisionなどformatごとにtoken取得方法が違っても、最終的な利用量を同じ会計へ収束させる。Agent実行では親子Agentのapprovalとhookを継承し、traceはprotocol境界を越えて関連付ける。機能単位ではなく、すべてのexit pathとexecution pathを列挙してpolicy coverageを測る考え方が重要になる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>goose v1.54.0とv1.55.0で同じAlert triage taskを実行し、Tool集合、approval回数、trace接続率、p95、token使用量を比較する。</li><li>承認待ち中に追加promptやsteeringを送り、承認対象のTool callより先に次の推論が始まらないことを確認する。</li><li>親Agentとsubagentのhook set、mode、approval、effective Tool setを記録し、子が親より広い権限を持たないことをnegative testする。</li><li>ACP clientからtrace contextを注入し、goose spanとMCP Server spanが同じtraceへ接続されるか確認する。</li><li>225k token上限に達する長時間sessionで、compaction後もAlert evidence、実行済みTool、未完了actionが維持されるか試験する。</li><li>Agent Routerでは別namespace参照をReferenceGrantあり／なし／削除後で試し、status、xDS、quota descriptorが正しく収束するか確認する。</li><li>agentgatewayではChat、Embedding、Rerank、Decisionsごとに既知token量を流し、rate-limit counterと実請求を照合する。</li><li>Unknown model、authorization拒否、local rate-limit拒否もrequest IDとsnapshotを残し、upstream callなしの失敗を通常traceから欠落させない。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>goose v1.55.0のupgrade issue、artifact hash、session migration</li><li>trace contextとprovider request IDのtenant境界</li><li>225k token compaction後の長時間Agent精度</li><li>Skills discoveryのGDK移動とruntime別path／symlink安全性</li><li>Boa JavaScript runtimeへの置換に伴うcode mode互換性とsandbox境界</li><li>Agent Router cross-namespace quotaを含むv1.2.x</li><li>agentgateway全LLM種別rate limitを含むv1.6.x</li><li>MCP、A2A、AGENTS.md、AAIF TC／WGの正式更新</li></ul>"
      }
    ],
    "sources": [
      [
        "goose v1.55.0 release",
        "https://github.com/aaif-goose/goose/releases/tag/v1.55.0"
      ],
      [
        "goose — Load live model catalog in goose-acp",
        "https://github.com/aaif-goose/goose/commit/3df2d7b28c49621d3ba1eb0347f3ef1ce42592f2"
      ],
      [
        "goose — Move Skills discovery into GDK",
        "https://github.com/aaif-goose/goose/commit/435868bf20345dceaad0eccad3b8cc76dc816284"
      ],
      [
        "goose — Replace PCTX code mode with Boa JavaScript runtime",
        "https://github.com/aaif-goose/goose/commit/1de2f75742457e3cf6350426e20ab8d3a579d4a8"
      ],
      [
        "Agent Router — Support cross-namespace quota backends",
        "https://github.com/theagentrouter/agent-router/commit/12fef6422579f544e84be8167d0979527d3576d4"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "agentgateway — Apply rate limit to all LLM types",
        "https://github.com/agentgateway/agentgateway/commit/ef1c6a62b92d33167819be52ae8693a6400ed11a"
      ],
      [
        "agentgateway — Expose LLM request fields to early CEL policies",
        "https://github.com/agentgateway/agentgateway/commit/884c2e6ee060629efe0e25d137ebc81474afb206"
      ],
      [
        "agentgateway — Snapshot locally answered requests",
        "https://github.com/agentgateway/agentgateway/commit/a71f417aa729158d379bbac77d677ba758ed012a"
      ],
      [
        "agentgateway releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "MCP releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AAIF Blog",
        "https://aaif.io/blog"
      ]
    ]
  },
  {
    "date": "2026-10-16",
    "level": "HIGH",
    "tags": [
      "Security",
      "Operations",
      "MCP"
    ],
    "title": "即時応答の秘密をredact、mirrorにも認証policyを適用",
    "summary": "Agent Routerがerror経路のcredential露出を修正。agentgatewayはmirror・budget・MCP OpenAPI運用を整理した。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>本日の重要差分は、正常なupstream requestだけでなく、gatewayが途中で返すerror／deny responseも秘密情報の境界として扱うことである。</strong>Agent Router mainでは、ext-procの<code>ImmediateResponse</code>をdebug logへ出す際、header mutationに含まれるcredentialをredactするよう修正した。対象も従来の<code>authorization</code>、<code>x-api-key</code>に加え、Azureの<code>api-key</code>とAWS SigV4の<code>x-amz-security-token</code>へ拡張された。</p><p>同時にagentgatewayでは、backend mirrorをbackend authorization適用後に生成するよう順序を変更した。観測・検証用の複製trafficも本流と同じcredential policyを通すという原則が明確になった。いずれもmain上の変更で、正式releaseへの収録は未確認である。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>Agent Routerの即時応答ログをredact：</strong>malformed requestやpolicy拒否などでext-procがupstreamへ進まず即時応答を作る経路では、header mutationを含むresponse objectがdebug logへ記録されていた。今回の修正はlog用copyだけをredactし、Envoyへ返す実responseは変更しない。Azure API keyやAWS temporary credentialのsession tokenが診断ログへ残る範囲を狭める。</p><p>修正は過去ログを消さない。debug loggingを有効化していた環境では、対象headerと<code>x-aigw-*</code>を保管済みログから検索し、露出があればcredential rotation、閲覧権限、retentionを見直す必要がある。</p><p><strong>Mirrorのpolicy順序：</strong>agentgatewayはbackend mirrorをbackend authorization適用後、retry loopの外側で一度だけ生成する。authが注入・変換したheaderをmirror側にも反映しつつ、retry回数だけ複製requestが増えることを避ける。なおmirror bodyを送らないTODOが残り、payload同等性を前提にしたshadow validationには制約がある。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>Agent Router — HIGH：</strong>ext-procのImmediateResponseをlogへ出す前にsensitive header mutationをredact。Azure <code>api-key</code>とAWS <code>x-amz-security-token</code>も対象へ追加。正式最新版はv1.2.0で、修正はmainのみ。</li><li><strong>agentgateway — MEDIUM：</strong>backend mirrorをbackend authorization後へ移動し、retry時の重複mirrorを防止。LLM requestの既定32 MiB buffer limitをrequest policy評価より前に設定し、bodyを読むCEL policyにも同じ上限を適用。API key budgetはwindow省略時に生涯累積する固定上限を設定可能になった。Standalone MCPではOpenAPI schemaのserver pathを設定した非root pathで安全に上書きできる。正式最新版はv1.6.0で、いずれも未収録。</li><li><strong>goose — MEDIUM：</strong>compaction countdownをmodel promptから除外し、圧縮判断と利用者表示を分離。context freezeで保存されたkickoff messageを探索できるようにし、history置換時は対応clientへ「earlier messages archived」と通知する。Windows NSIS installerもmainへ追加されたが、公式Latestはv1.54.0。</li><li><strong>A2A — LOW：</strong>community integration／partner一覧を更新。protocol仕様変更や新releaseではなく、正式最新版はv1.0.1。</li><li><strong>MCP：</strong>dependency更新のみ。新しい仕様、SEP Final、security advisory、正式releaseなし。正式仕様は<code>2026-07-28</code>。</li><li><strong>AGENTS.md：</strong>新規commitなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIF Technical Committee、project proposal、加入・卒業project、認定制度について、新たな正式決定は確認できなかった。10月15日に複数Working Group会合が掲載されているが、開催予定や会合自体を採択済みartifactとは扱わない。</p><p>AAIF公式blogはAGNTCon + MCPCon EUのmaintainer roundtableを公開した。MCPとA2Aの相互運用、agent-native identity、token単価ではなく完了task当たりcost、Tool選択理由まで説明できるobservability、working implementationとconformance testを伴う標準化が論点になった。規範的仕様ではないが、今後のWG・SEPを評価する観点として有用である。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の共通テーマは<strong>secondary pathをfirst-class security boundaryとして扱うこと</strong>である。正常なbackend callだけを保護しても、error response、mirror、retry、compaction、budget resetなどの副経路が別のpolicy順序やlog処理を使えば、秘密漏えい・二重実行・会計ずれが起きる。</p><p>Mirrorは「観測用だから安全」ではない。本流のauthorization後に生成し、どのheaderが複製されたか、bodyが複製されないか、samplingとretryが何回のexternal callを生むかを記録する必要がある。Context compactionもmodelへ内部countdownを見せず、利用者向け通知とagent-visible stateを分離することで、model behaviorへの不要な影響を減らす方向である。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>Agent Routerでmalformed request、auth拒否、rate-limit拒否を発生させ、debug logにAzure key、AWS session token、override credentialが残らないことを確認する。</li><li>修正版導入前の集中log、backup、support bundleを検索し、秘密が見つかればrotationとaccess auditを実施する。</li><li>Mirror先を検証環境に固定し、backend auth適用後のheader、route、tenant identityが本流と一致するか確認する。</li><li>retryを意図的に発生させ、本流が複数attemptでもmirrorはrequest当たり一度だけ送られることをmetricで検証する。</li><li>mirror bodyが現時点で空である前提をrunbookへ記載し、payload比較型shadow testで誤判定しない。</li><li>32 MiB近傍と超過のLLM requestをrequest CEL policyへ送り、memory使用量、拒否status、log量を測る。</li><li>resetなしbudgetは生涯上限として扱い、超過時にRetry-Afterがない挙動と解除・増額手順を試験する。</li><li>MCP OpenAPI path overrideでは<code>//</code>、query、fragment、backslash、spaceを拒否し、authority／path rewriteをnegative testする。</li><li>goose compaction前後で利用者表示、agent-visible history、Tool resultの連続性を比較する。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Agent RouterのImmediateResponse redactionを含むv1.2.xとsecurity note</li><li>過去logにおけるAzure／AWS credential露出の報告</li><li>agentgateway mirror body対応とmirror専用credential policy</li><li>request policy前の32 MiB上限を含むv1.6.x</li><li>resetなしbudgetの管理API、audit trail、解除手順</li><li>MCP OpenAPI path overrideのKubernetes API対応</li><li>goose v1.55.0の正式releaseとcompaction回帰issue</li><li>A2A integration一覧のconformance情報</li><li>MCP、AGENTS.md、AAIF TC／WGの正式artifact</li></ul>"
      }
    ],
    "sources": [
      [
        "Agent Router — Redact sensitive information in ImmediateResponse logs",
        "https://github.com/theagentrouter/agent-router/commit/ca3e5166d9b6c491ea9acbcb9eaba2c6db1c4990"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "agentgateway — Apply backend authorization before backend mirrors",
        "https://github.com/agentgateway/agentgateway/commit/dcfd4e547473a30a10786884fe7d9bdc5aec6153"
      ],
      [
        "agentgateway — Set LLM buffer limit before request policies",
        "https://github.com/agentgateway/agentgateway/commit/777d6eadb6577ab8e479ccf84e7d324de5ad5621"
      ],
      [
        "agentgateway — Allow budgets with no refresh window",
        "https://github.com/agentgateway/agentgateway/commit/681c3ad39027baad31befbea9e881db8f197af69"
      ],
      [
        "agentgateway — Honor MCP OpenAPI path configuration",
        "https://github.com/agentgateway/agentgateway/commit/d6ccf98f2ffb0f6453e6567e15bf007969384b7f"
      ],
      [
        "agentgateway releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "goose — Preserve user-visible message across context freeze",
        "https://github.com/aaif-goose/goose/commit/716bb92ce7726090fa46ee360c38f783897f1beb"
      ],
      [
        "goose — Do not present compaction countdowns to models",
        "https://github.com/aaif-goose/goose/commit/7f57d5693f19d798093e87203aec6401bc879c50"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "A2A — Add CUGA to community integrations",
        "https://github.com/a2aproject/A2A/commit/6b66881f8d544363602fb146a4caf0f9940e6d53"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "MCP — Dependency update",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/86f6e0c675afea9a8f233e09b6faf566b126086c"
      ],
      [
        "AAIF — Maintainer roundtable at AGNTCon + MCPCon EU",
        "https://aaif.io/blog/maintainer-roundtable-at-agntcon-mcpdev-summit-eu-composability-identity-and-the-cost-of-agents"
      ]
    ]
  },
  {
    "date": "2026-10-15",
    "level": "HIGH",
    "tags": [
      "Security",
      "MCP",
      "Operations"
    ],
    "title": "Guardrailをfail closedへ、MCP session終了を全replicaで保証",
    "summary": "agentgatewayが未mask通過とMCP session残留を修正。gooseはsession単位のcacheとsubagent実行を整理した。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>本日の重要差分は、policyが理解できないresponseを「通してよい」と解釈しないことと、終了要求を受けたsessionを確実にupstreamまで閉じることである。</strong>agentgateway mainではWebhook guardrailのresponseに想定外fieldが含まれると、mask対象のmessageを正しくdeserializeできず、未mask contentが通過し得た経路をfail closedへ変更した。</p><p>同時にMCP <code>DELETE /mcp</code>は、再起動後や別replicaで受けてもencoded session IDから接続先を再構築し、upstream sessionへDELETEをfan-outするようになった。複数replica構成で「local memoryにsessionがない＝終了済み」と誤認する範囲を縮小する。どちらも正式最新版v1.6.0には未収録である。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>Guardrailのfail-closed化：</strong>Webhook guardrailの<code>PassAction</code>へ未知fieldの拒否を追加した。修正前は、MaskAction相当のresponseへ追加message fieldが含まれる場合、schema解釈の失敗がpassとして扱われ、maskされていない本文をbackendまたはclientへ流す可能性があった。修正後は未知fieldを含むresponseをerrorとして拒否する。</p><p>安全側へ倒れる一方で、既存Webhookがpass responseへ独自metadataを追加している場合は動作が変わる。release前にschema validationを行い、<code>reason</code>以外のfieldを返していないか確認が必要である。</p><p><strong>MCP session cleanup：</strong>従来のDELETEはgatewayのin-memory mapだけを確認していたため、pod再起動や別replicaへのrouting後は<code>202 Accepted</code>を返しながらupstream sessionを閉じないことがあった。新実装はPOSTと同じsession resume経路を使う。ただしupstream close失敗は引き続きbest effortで、idle timeoutまで残る可能性がある。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>agentgateway — HIGH：</strong>Webhook guardrailの未知fieldを拒否し、未mask contentのsilent passを防止。MCP DELETEではsession IDからtargetを再構築し、再起動後・別replica・再試行でもupstream closeを試みる。Anthropicの1時間cache writeを5分cacheとは別単価で計測する変更も入り、cost／budget精度を改善した。正式最新版はv1.6.0で、すべてmain上の差分。</li><li><strong>goose — MEDIUM：</strong>repository内versionを1.55.0へ更新したが、公式ReleasesのLatestはv1.54.0のままであり、正式releaseとは扱わない。OpenAI Responses requestへsession IDを<code>prompt_cache_key</code>として渡し、同一session内でのprovider-side prompt cache affinityを改善。foreground subagent実行もGDK側へ統合した。</li><li><strong>Agent Router — LOW：</strong>MCP data-plane benchmarkのflaky testを修正。caseごとにMCP client sessionを閉じ、前caseのbackground streamが次のproxyへ再接続する混線を防いだ。production data planeの仕様変更ではなく、test reliabilityの改善。正式最新版はv1.2.0。</li><li><strong>MCP：</strong>dependency更新のみ。新しい仕様、SEP Final、security advisory、正式releaseなし。正式仕様は<code>2026-07-28</code>。</li><li><strong>A2A：</strong>新規commit・releaseなし。正式最新版はv1.0.1。</li><li><strong>AGENTS.md：</strong>新規commitなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIF Technical Committee、project proposal、加入・卒業project、認定制度に関する新しい正式決定は確認できなかった。10月14日にはAgentic CommerceやObservability &amp; TraceabilityなどのWG会合が公式calendarへ掲載されているが、会合開催を仕様採択や成果物公開とは区別する。</p><p>AAIF公式blogでは、複数coding agentを長時間動かすsoftware factoryの実践例「Glass Town」が公開された。永続sandbox、session保存、細かなcheckpointによるpaper trailを重視する設計であり、規範的標準ではないが、Agentic Opsで再現性と事後説明を確保する実装例として参考になる。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の共通テーマは<strong>distributed lifecycle ownership</strong>である。request、session、policy evaluationが複数podやsubagentへ跨ると、local processのmemoryだけでは「誰が作成し、誰が終了し、どのpolicyが適用されたか」を判断できない。</p><p>Session IDは単なる相関IDではなく、target再構築とcleanupのためのcontrol-plane handleになる。一方、cache affinityへ同じIDを使う場合は、tenant間で共有されない十分なentropyとscopeが必要である。Guardrail responseも「parseできない＝許可」ではなく、schema version、action、reason、transformation結果を明示し、不明な状態を拒否する必要がある。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>Webhook guardrailへ未知field、欠損field、型違い、巨大payloadを返し、すべてfail closedになることをnegative testする。</li><li>MaskAction testでは、secretや個人情報を埋めた本文がbackend log、trace、client responseのどこにも残らないことを確認する。</li><li>MCP sessionを作成したpodを停止し、別replicaへDELETEを送り、全upstreamでsession／stream／resourceが解放されるか確認する。</li><li>DELETEの202だけを成功条件にせず、upstream active session数、open stream数、idle reaper件数を観測する。</li><li>upstream close失敗はbest effortのため、idle timeoutを無制限にせず、session leak用SLOとalertを設ける。</li><li><code>prompt_cache_key</code>にはraw user IDやcredentialを使わず、tenant内で安定しtenant間で衝突しないopaque session IDを用いる。</li><li>Anthropic cacheでは5分／1時間のwrite tokenを別metricで保存し、budget policyとchargebackが実請求に一致するか比較する。</li><li>Agent Routerのbenchmark同様、test終了時にsession、stream、port、child processを明示的に閉じ、次caseへの状態持越しを検査する。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Webhook guardrail fail-closed修正を含むagentgateway v1.6.x</li><li>独自metadataを返す既存guardrail webhookの互換性issue</li><li>MCP DELETEのupstream close失敗を可視化するmetric／trace</li><li>idle reaperがupstream DELETEを送らない設計の改善</li><li>goose v1.55.0の正式tag、release note、artifact digest</li><li>session IDをprompt cache keyへ使う際のtenant分離とcache hit率</li><li>5分／1時間cache write別のcost・quota整合性</li><li>MCP、A2A、AGENTS.md、AAIF TC／WGの正式artifact</li></ul>"
      }
    ],
    "sources": [
      [
        "agentgateway — Fail closed on unknown Webhook guardrail fields",
        "https://github.com/agentgateway/agentgateway/commit/af24457c63fa4c907b05c7a33a6c88abd395aecf"
      ],
      [
        "agentgateway — Resume MCP sessions on DELETE",
        "https://github.com/agentgateway/agentgateway/commit/f27afc68669f1feb6f5123f9134cc0c714fbfafa"
      ],
      [
        "agentgateway — Price one-hour cache writes separately",
        "https://github.com/agentgateway/agentgateway/commit/09ebfb8d0823103636203b60306fead6f555d32a"
      ],
      [
        "agentgateway releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "goose — Bump repository version to 1.55.0",
        "https://github.com/aaif-goose/goose/commit/9686d674000a5fbb8139214863289e4820714771"
      ],
      [
        "goose — Use session ID as OpenAI Responses prompt_cache_key",
        "https://github.com/aaif-goose/goose/commit/39c540b05bd9cde57f2dec232b3deeae5168c8d2"
      ],
      [
        "goose — Run foreground subagents in GDK",
        "https://github.com/aaif-goose/goose/commit/2116fed07a2a0e963e0aa2ff09b0f17e6fd23da0"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "Agent Router — Stabilize MCP data-plane benchmark lifecycle",
        "https://github.com/theagentrouter/agent-router/commit/5a9c6ef6354eeb77354f19b1a93a623d5ff50008"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AAIF — Welcome to Glass Town",
        "https://aaif.io/blog/welcome-to-glass-town-building-a-software-factory-with-a-paper-trail"
      ],
      [
        "AAIF Working Groups calendar",
        "https://aaif.io/working-groups/calendar"
      ]
    ]
  },
  {
    "date": "2026-10-14",
    "level": "MEDIUM",
    "tags": [
      "MCP",
      "Operations",
      "Security"
    ],
    "title": "Progressive Disclosure WG発足、子Agentの権限境界を継承",
    "summary": "MCPのTool群整理が正式WGへ。gooseとgateway群では権限・routing・request追跡の境界を補強した。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>本日の中心は、Agentが扱う選択肢を段階的に絞り込み、実行時の権限と経路を曖昧にしない設計である。</strong>MCPではPrimitive Grouping Interest Groupが<strong>Progressive Disclosure Working Group</strong>へ移行した。flatなTool／Resource／Prompt／Task一覧が長大化する問題を、単なるUI改善ではなく、相互運用可能な整理・開示方式として検討する正式なWorking Groupになった。</p><p>実装面では、gooseがsubagentへ親sessionのhooks、mode、approval方針を引き継ぐよう変更した。agentgatewayではOIDC permissive modeとmodel wildcardの優先順位修正が入り、複数の認証・routing規則を組み合わせる際の境界を明確にしている。いずれもmain上の差分であり、正式releaseへの収録は未確認である。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>MCP Progressive Disclosure WG：</strong>旧Primitive Grouping IGは、長大なprimitive一覧をどう整理し、必要なものだけを段階的に提示するかを調査してきた。今回のcharter更新ではWGへ昇格し、技術設計はWG consensus、additiveな仕様変更はCore Maintainer承認、breaking changeはさらに広いreviewを必要とするdecision rightsが明記された。WG自身が仕様変更を単独承認するわけではなく、最終的な規範変更はSEP processを通る。</p><p>重要なのは、Tool searchを単なる文字列検索として扱わず、grouping、namespace、metadata、権限、利用文脈を使って「最初にmodelへ見せる面積」を減らす方向が正式な検討対象になったことだ。Tool数が増えるほどprompt token、selection error、cache invalidation、権限過剰提示が増えるため、progressive disclosureは性能とsecurityの双方に関係する。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>MCP — MEDIUM：</strong>Primitive Grouping IGをProgressive Disclosure WGへ改称・昇格。週次meeting、leadership、decision rights、success metricsをcharterへ追加した。正式仕様は引き続き<code>2026-07-28</code>で、wire protocolの変更ではない。</li><li><strong>goose — MEDIUM：</strong>subagentを親Agentのhooks、Goose mode、Tool approvalへbindする変更をmerge。子Agentだけが監査hookを外れたり、親より緩い実行modeになる構成を避ける。Anthropicの<code>request-id</code>とOpenAI互換の<code>x-request-id</code>もresponse／error／trace属性へ記録し、provider問い合わせと内部traceを関連付けられるようにした。正式最新版はv1.54.0で、変更は未収録。</li><li><strong>agentgateway — MEDIUM：</strong>OIDCに<code>permissive</code> modeを追加。browser navigationはloginへ誘導しつつ、non-browser requestや認識できないcredentialは後続の認証policyへ渡せる。ただし単独利用は認証bypassになり得るため、公式commentも別のauthorization enforcementとの併用を警告している。model routingでは<code>openai/*</code>のようなwildcardが<code>openai/gpt-5.5</code>のようなexact ruleを上書きしないよう、specificity順へ統一した。正式最新版はv1.6.0。</li><li><strong>Agent Router — MEDIUM：</strong>Go toolchainを1.27.1から1.27.2へ更新し、標準libraryの複数CVE修正を取り込む準備を行った。これはmainのbuild基準線変更で、v1.2.0 artifactが自動的に更新されたことを意味しない。未使用の<code>GCPWorkloadIdentityProvider</code>型も削除されたが、CRD schemaには元から含まれず利用者向けAPI変更ではない。</li><li><strong>A2A：</strong>新しいcommit・releaseなし。正式最新版はv1.0.1。</li><li><strong>AGENTS.md：</strong>新規commitなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>Progressive Disclosure WGの発足はMCP governance上の正式な組織変更だが、特定のgrouping方式が標準化されたわけではない。charterは複数方式を実験し、Python／TypeScriptのend-to-end reference、導入手順、deployment feedbackを揃えたうえで、conventionかprotocol extensionかをSEPへ提案する方針を示す。</p><p>AAIF Technical Committee、新規project proposal、加入・卒業project、認定制度については、新たな正式決定を確認できなかった。AAIF公式calendarではAccuracy &amp; ReliabilityおよびSecurity &amp; Privacyの会合が10月13日に掲載されているが、会合予定そのものを採択済み成果物とは扱わない。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>共通テーマは<strong>least disclosureとinherited policy</strong>である。親Agentが許可されたToolだけを選び、そのsubsetを子Agentへ渡し、子Agentは親のapproval・hook・modeを引き継ぐ。Gatewayはexact routeをwildcardより優先し、複数認証方式を使う場合も「誰が最終的に拒否するか」を明示する。</p><p>progressive disclosureを導入すると、Tool catalogの取得回数や選択latencyは増える可能性がある。その代わり、modelへ渡すschema tokenと誤選択を減らせる。評価では単純なtoken削減だけでなく、選択精度、権限外Toolの露出率、catalog cacheの更新遅延、選択から実行までのpolicy driftを同時に測る必要がある。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>親sessionとsubagentで、effective Tool set、approval mode、hook set、policy hashを記録し、子が親より広い権限を持たないことを検証する。</li><li>subagent作成後に親policyを変更し、既存の子へ即時反映するのかsnapshotを維持するのかを仕様として固定する。</li><li>provider request IDはtraceへ保存するが、利用者へ返すerror messageやlogでtenantをまたいで露出しないようscopeとretentionを定める。</li><li>agentgatewayのOIDC permissive modeは、後続のJWT、MCP auth、ext-authzなどが必ず最終判定する構成に限定する。認証policyを一つずつ削除するnegative testでfail openにならないことを確認する。</li><li>exact model rule、prefix wildcard、global wildcardを同時に設定し、期待するbackend、credential、rate limit、cost policyが選ばれるか回帰試験する。</li><li>Agent RouterのbuildではGo versionだけでなく、container digest、SBOM、stdlib CVEの消込結果を保存し、正式patch releaseまでmain buildをproduction基準線と混同しない。</li><li>Progressive Disclosure PoCでは、全Tool一覧と段階開示を同一task setで比較し、prompt token、選択成功率、p95 latency、権限外候補数を測る。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Progressive Disclosure WGのapproaches、reference extensions、最初のSEP</li><li>grouping metadataとMCP Server Card／Registry／Skills extensionの役割分担</li><li>gooseのsubagent policy継承とprovider request IDを含む次期release</li><li>親・子Agent間でのapproval、hook、modeのdriftと権限昇格issue</li><li>agentgateway OIDC permissive modeの安全なconfiguration例と正式release収録</li><li>model wildcard precedence修正を含むv1.6.x</li><li>Agent RouterのGo 1.27.2 buildを含むv1.2.xとsecurity note</li><li>A2A、AGENTS.md、AAIF TC／WGの正式artifact</li></ul>"
      }
    ],
    "sources": [
      [
        "MCP — Promote Primitive Grouping IG to Progressive Disclosure WG",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/5ea996028df322ce97d1c906731cf8c05a6e268e"
      ],
      [
        "MCP — Progressive Disclosure meeting notes",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/3375"
      ],
      [
        "goose — Bind subagents to parent hooks, mode and approvals",
        "https://github.com/aaif-goose/goose/commit/6ead9cb60161cb5d436b6d8463e8266681166e7b"
      ],
      [
        "goose — Surface provider request IDs",
        "https://github.com/aaif-goose/goose/commit/4376f40526be2b113826dcc4b21f9402be9923c0"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "agentgateway — OIDC permissive mode",
        "https://github.com/agentgateway/agentgateway/commit/f02845731ab0c037781e11358824e51d9e5c34f0"
      ],
      [
        "agentgateway — Correct AgentgatewayModel wildcard precedence",
        "https://github.com/agentgateway/agentgateway/commit/3b37c922a9664a956ea5668e6f4e098b024bdf6c"
      ],
      [
        "agentgateway releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "Agent Router — Upgrade to Go 1.27.2",
        "https://github.com/theagentrouter/agent-router/commit/85c2d242670b2bdfb83828fa8532188fdd745e7b"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AAIF Working Groups calendar",
        "https://aaif.io/working-groups/calendar"
      ]
    ]
  },
  {
    "date": "2026-10-13",
    "level": "HIGH",
    "tags": [
      "Security",
      "Operations",
      "MCP",
      "A2A"
    ],
    "title": "Agent実行をtraceし、秘密・memory・quotaを境界内に戻す",
    "summary": "gooseがACPからMCPまでtraceを接続。Gateway群ではsecret、buffer、quota会計の境界を修正した。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>本日の差分は、Agent実行を「追えること」と、失敗時の影響を「境界内へ閉じ込めること」が同時に進んだ点にある。</strong>goose mainではACP promptで受けたW3C <code>traceparent</code>／<code>tracestate</code>をMCP Tool callまで伝播する変更が入り、利用者要求から推論、Tool実行までを一つのdistributed traceとして関連付けられるようになった。</p><p>一方、agentgatewayではdatabase URLのlog出力を全面redactし、stream中のreasoningやTool arguments、namespace展開、guardrail記録へbuffer上限を適用した。Agent Routerではtoken quotaのrequest-time checkが既定値の1 tokenを余分に消費していた問題を修正した。いずれもmainへmergeされた実装差分であり、正式releaseへの収録は未確認である。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>gooseのend-to-end trace：</strong>ACP promptから取り込んだW3C trace contextを、goose内部のspanだけでなくMCP request metadataへ渡す。これによりACP client、goose、MCP Serverが同じtrace treeへ接続できる。Prometheus／Alertmanager MCPのPoCでは、alert受信からTool call、結果の要約までを同一trace IDで追跡し、どの段階で遅延・失敗・再試行が発生したかを分離できる。</p><p><strong>agentgatewayのcredential保護：</strong>request-log databaseの接続URLがinfo levelのconfig logへそのままserializeされ、userinfoやquery parameterに含まれるpasswordが露出し得た。修正はURL全体をredactする。過去logからsecretが消えるわけではないため、該当構成ではlog保管先、転送先、backupを確認し、必要ならcredential rotationまで行う必要がある。</p><p><strong>resource exhaustion対策：</strong>streaming Tool argumentsの不要な全量保持、Bedrock redacted reasoningの無制限buffer、namespace Tool説明の展開増幅、realtime guardrail eventごとのlog entry蓄積が抑制された。単一の巨大requestだけでなく、小さな入力が変換処理で大きく膨らむ経路も対象である。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>goose — HIGH：</strong>ACPからMCP Tool callへW3C trace contextを伝播。別修正で、Tool approval待ちのturnに追加推論やsteeringを走らせないようにした。未承認Toolが残る間にconversationが進み、承認対象と実行contextがずれる競合を防ぐ。正式最新版はv1.54.0で、両修正はrelease未収録。</li><li><strong>agentgateway — HIGH：</strong>database URLをconfig serialization時にredact。複数のstream／conversion経路へbuffer limitを適用し、namespace説明はrequestあたり8 MiB超で<code>RequestTooLarge</code>にする。token推定も改善され、全model平均errorを36%から10%へ縮小したと報告されている。UIにはkey rotation時の新key自動生成も追加。正式最新版はv1.6.0。</li><li><strong>Agent Router — HIGH：</strong>QuotaPolicyのrequest-time checkへ<code>hits_addend=0</code>を明示。従来は省略時の既定値1とresponse完了時の実token数が両方加算され、28 tokenのrequestが29 tokenとして控除されていた。正式最新版v1.2.0には未収録。</li><li><strong>MCP — MEDIUM：</strong>TypeScript quickstartを<code>serveStdio(createServer)</code>へ変更。従来例は2025-era initializeだけを処理し、2026-07-28 clientとのversion negotiationに失敗し得た。仕様変更ではなく、公式sampleを現行仕様へ合わせる修正。正式仕様は2026-07-28。</li><li><strong>A2A — LOW：</strong>署名前canonicalization例を、有効なAgent Cardへ修正。required field不足や空のrequired arrayを解消したが、canonicalization rule本文は変更していない。正式最新版はv1.0.1。</li><li><strong>AGENTS.md：</strong>新規commitなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>MCP、A2Aともに本日の変更は、規範的なversion更新ではなく、公式documentation／exampleを既存仕様と一致させる修正である。sample codeやcanonicalization例は実装者がコピーするため、非規範的であってもinteroperabilityへ直接影響する。ただしexample修正を新しいprotocol要件として扱ってはいけない。</p><p>AAIF Technical Committee、Working Groups、新規project proposal、加入・卒業project、認定制度に関する新しい正式決定は確認できなかった。昨日扱ったMCP Governance WG charterの最終承認日も引き続きTBDである。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>共通する設計原則は、<strong>context propagationとbounded execution</strong>である。Trace contextはservice境界を越えて保持する一方、credential、memory、quota、approval stateは境界を越えて無制限に広げない。</p><p>Observabilityを追加するだけでは不十分で、traceやconfig log自体がsecretを漏らさないことが必要になる。またtoken推定の誤差は単なるdashboard品質ではなく、quota enforcement、chargeback、model routingの判断を変える。推定値、provider実測値、最終請求値を別metricとして保存し、混同しない構成が望ましい。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>ACP clientから<code>traceparent</code>を付与し、goose spanとMCP Server側spanが同じtraceへ接続されることを確認する。</li><li>Traceにはsession ID、Tool名、approval result、retry count、error classを載せるが、prompt本文、credential、Tool resultの機密値は既定で載せない。</li><li>agentgatewayのconfig log、集中log、backupからdatabase URL露出を検索し、passwordを含んでいた場合はrotationとaccess reviewを実施する。</li><li>巨大Tool arguments、reasoning stream、namespace Tool群を使った負荷試験で、上限超過が明示errorとなりmemoryが継続増加しないことを確認する。</li><li>QuotaPolicy testでは<code>request-time=0</code>、<code>stream-done=actual tokens</code>をtraceまたはRLS metadataで確認し、1 requestあたりの差分を集計する。</li><li>Tool approval待ちにsteeringや追加promptを送り、承認完了前に次の推論・Tool dispatchが始まらないことを回帰試験する。</li><li>MCP quickstart由来Serverをlegacy／modern双方のInspectorで接続し、version negotiationとTool一覧を確認する。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>gooseのtrace propagationとapproval競合修正を含む次期release</li><li>Trace contextにtenant／session境界を越える情報が混入しないか</li><li>agentgatewayのsecret redaction、buffer limit、token推定改善を含むv1.6.x</li><li>過去logへdatabase credentialが記録された環境向けadvisoryの有無</li><li>Agent Router v1.2.xへのquota二重消費修正収録</li><li>Token推定値とprovider実測値を使うquota／chargebackの整合性</li><li>MCP sample、A2A canonicalization exampleをSDK test／conformanceへ反映する動き</li><li>AGENTS.md、AAIF TC／WG、新規projectの正式更新</li></ul>"
      }
    ],
    "sources": [
      [
        "goose — Propagate W3C trace context from ACP prompts to MCP tool calls",
        "https://github.com/aaif-goose/goose/commit/1c3ac1ba1980426a2aad610aa01a9fe9a4e19aed"
      ],
      [
        "goose — Do not infer or steer while Tool approval is pending",
        "https://github.com/aaif-goose/goose/commit/29a1f73cdd974bd9d435c64d4c21eb9d7beaaf3f"
      ],
      [
        "agentgateway — Redact database URL in config logs",
        "https://github.com/agentgateway/agentgateway/commit/fec2a0cef0ac86e92bceaa55aca6db9f4c17d393"
      ],
      [
        "agentgateway — Respect buffer limits on LLM paths",
        "https://github.com/agentgateway/agentgateway/commit/781efcb0ed9915deb11673e089b614f0bc6e5d46"
      ],
      [
        "agentgateway — Better token counting",
        "https://github.com/agentgateway/agentgateway/commit/c5206d3899dea06a3432b17c782510cf0af1a998"
      ],
      [
        "agentgateway — Auto-generate key on replacement",
        "https://github.com/agentgateway/agentgateway/commit/461e4f9712b8d914043044bf1d68a98b60aa4578"
      ],
      [
        "Agent Router — Avoid charging request-time quota hit",
        "https://github.com/theagentrouter/agent-router/commit/81c3ccc41ada54fc8700b0f39ae864618abd47eb"
      ],
      [
        "MCP — Serve TypeScript quickstart with serveStdio",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/3778656b2e0ba6725035e816fe3085374cbaa736"
      ],
      [
        "A2A — Fix canonicalization example Agent Card",
        "https://github.com/a2aproject/A2A/commit/7c861a597b93208de3c19357cc0d66b9f6250e9b"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "agentgateway releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "MCP specification releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ]
    ]
  },
  {
    "date": "2026-10-12",
    "level": "MEDIUM",
    "tags": [
      "MCP",
      "Operations",
      "Security"
    ],
    "title": "MCP Governance WGを公開、gooseにAIgateway接続",
    "summary": "MCPの意思決定記録を担うWG charterがmainへ統合。gooseには外部model gateway接続が追加された。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>本日の主要差分は、protocol機能ではなく「誰が、何を、どの手続きで決めたか」を残すためのgovernance基盤である。</strong>MCP repositoryのmainへGovernance Working Group charterが統合され、governance文書、decision record、Code of Conduct本文、community values、contributor cultureを継続的に扱う窓口が明文化された。</p><p>同時にgoose mainへ、外部のOpenAI互換model gatewayであるAIgatewayを宣言的providerとして選択する定義が追加された。これはAAIFの<strong>agentgateway</strong>や<strong>Agent Router</strong>とは別サービスであり、名前が似ていても同一componentとして扱ってはいけない。MCPの新仕様、security advisory、主要projectの新しい正式releaseは確認されていない。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>MCP Governance Working Group charter：</strong>WGの対象は、<code>docs/community/</code>配下のgovernance文書、意思決定の定義・批准者・記録場所、Code of Conduct本文、community values、contributor ladderを支える文化である。軽微なeditorial変更はWG側で扱える一方、意味を変える変更、新しいgovernance policy、Code of Conduct本文、contributor ladderの構造変更にはWG consensusとCore Maintainer approvalが必要とされる。</p><p>重要な境界も明記された。protocol specificationの作成、maintainer選任、個別のCode of Conduct事件処理、SDK固有governance、対人紛争の解決は対象外である。つまりこのWGはprotocolを直接決める組織ではなく、<strong>決定手続きと記録の品質を整える組織</strong>である。</p><p><strong>確認上の留保：</strong>charterはmainの公式docsへmergeされ、WG一覧にも追加された。ただし文書末尾のchangelogは「charter approved by Core Maintainers」をTBDのまま残している。したがって、本稿では「charterが公開・統合された」と確認し、最終批准日が確定したとは断定しない。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>MCP — MEDIUM：</strong>Governance WG charterをmainへ統合。月次60分のworking session、3回連続で参加者・agendaがない場合のcadence見直し、decision-recording conventionなどのdeliverableが示された。別commitでClaude DesktopのLinux対応を各versionの接続・debug文書へ反映したが、wire protocolやsecurity要件の変更ではない。正式仕様は引き続き<code>2026-07-28</code>。</li><li><strong>goose — MEDIUM：</strong><code>aigateway</code> declarative providerをmainへ追加。OpenAI engine、<code>AIGATEWAY_API_KEY</code>、<code>https://api.aigateway.sh/v1/chat/completions</code>、dynamic model catalog、streaming対応を定義する。正式最新版はv1.54.0で、このprovider追加はまだrelease未収録。</li><li><strong>agentgateway：</strong>前回確認したOSS scanner用Dockerfile以後の新規commitなし。正式最新版はv1.6.0。</li><li><strong>Agent Router：</strong>新規commit・patch releaseなし。正式最新版はv1.2.0。QuotaPolicy live-update、InferencePool filter重複などの修正はmain上に留まる。</li><li><strong>A2A：</strong>新規commit・releaseなし。正式最新版はv1.0.1。</li><li><strong>AGENTS.md：</strong>新規commitなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>Governance WGの設計は、会議を増やすことより、<strong>decision provenance</strong>を揃える点に価値がある。何がproject decisionで、誰がratifyし、meeting notes・GitHub Discussions・SEPのどこへ残すかを標準化すれば、実装者はblogや会議発言を正式仕様と誤認しにくくなる。</p><p>計画上のdeliverableにはdecision-recording convention、community values、Code of Conduct reporting path、onboarding／mentorship文書が含まれる。ただしtargetは将来日付であり、現時点で成果物が完成したことを意味しない。AAIF全体のTechnical Committee、新規project proposal、加入・卒業project、認定制度については新しい正式決定を確認できなかった。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の二つの差分は、control planeの<strong>identityとprovenance</strong>へ収束する。governanceでは「誰が承認した文書か」を、model routingでは「どのgateway、catalog、model、credentialを使ったか」を識別する必要がある。</p><p><code>AIgateway</code>、<code>agentgateway</code>、<code>Agent Router</code>のように名称が近いcomponentを、表示名だけでdashboardやrunbookへ集約すると誤配線を招く。運用inventoryでは少なくともproject ID、repository、endpoint owner、artifact version、credential issuerを別fieldで保持し、human-readable labelから分離する。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>governance判断を取り込む際は、source URL、status、ratifier、approval date、対象version、supersedesを記録する。merge済み文書でもTBD fieldがあれば未確定として扱う。</li><li>gooseのAIgateway providerを試す場合、AAIF agentgateway／Agent Routerとは別のexternal upstreamとしてasset inventoryへ登録する。</li><li><code>AIGATEWAY_API_KEY</code>をgoose process全体の共通環境変数として配布せず、workspace・tenant・sessionの境界に合わせて最小scope化する。</li><li>dynamic model catalogの取得結果、model ID、価格metadata、context limitを実行時snapshotとして保存し、catalog更新によるdriftを検出する。</li><li>provider切替試験では同一promptを固定し、latency、TTFT、token、error分類、Tool-call互換性、data residencyを比較する。</li><li>正式tagとmainを別laneに保ち、AIgateway providerの検証結果をv1.54.0へ誤って帰属させない。</li><li>MCP governance文書はprotocol conformance testと別のchange-control対象にし、批准済み決定だけをpolicyへ反映する。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Governance WG charterのCore Maintainer approval日とchangelog更新</li><li>decision-recording convention、meeting notes、GitHub Discussions categoryの公開</li><li>gooseのAIgateway providerを含む次期正式releaseとcredential／catalog運用issue</li><li>類似名称のgateway間でのtelemetry・inventory識別方法</li><li>MCP次期仕様、SEP Final、SDK／conformance更新</li><li>Agent Router v1.2.x、agentgateway v1.6.xへのmain修正収録</li><li>A2A、AGENTS.md、AAIF Technical Committee／Working Groupsの正式artifact</li></ul>"
      }
    ],
    "sources": [
      [
        "MCP — Governance Working Group charter commit",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/1e837b3efc1ebba4b60881759ea6b2fb644bcaca"
      ],
      [
        "MCP — Merge Governance Working Group charter",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/4a04acdb151b8d3c6963fa566d9435cdfdc7bd43"
      ],
      [
        "MCP — Linux support documentation update",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/1f520964b295d58494d944f2aea8a5ab51c79f77"
      ],
      [
        "MCP specification releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "goose — Add AIgateway declarative provider",
        "https://github.com/aaif-goose/goose/commit/a7010404b10896880dfb16c4dc10c1c48498428a"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "agentgateway releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AAIF official site",
        "https://aaif.io/"
      ]
    ]
  },
  {
    "date": "2026-10-11",
    "level": "LOW",
    "tags": [
      "Operations",
      "Security"
    ],
    "title": "大きな変更なし、正式版とmainの境界を固定する",
    "summary": "runtime変更は確認されず。release基準線と未収録修正を分けて記録する。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>前回レポート以降、AAIFと主要6 projectに、正式仕様、runtime、security advisory、project加入・卒業へ該当する新しい重要変更は確認できなかった。</strong>週末の観測窓で確認できた新規commitは、agentgatewayへOSS scanner用Dockerfileを追加するbuild／security tooling差分だけである。scannerがCIやrelease gateへ組み込まれたこと、検出結果が公開されたこと、production data planeが変わったことは確認できない。</p><p>変更が少ない日は、main branchのcommit数をニュースとして膨らませず、productionで採用可能な正式artifactと、次期release候補の修正を分けて記録する。現在の正式基準線はMCP <code>2026-07-28</code>、A2A v1.0.1、goose v1.54.0、agentgateway v1.6.0、Agent Router v1.2.0である。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>本日は重要ニュースなし。</strong>MCPの新しいspecification release／SEP Final、A2A protocol release、gooseのv1.54.0後のrelease、agentgateway v1.6.x、Agent Router v1.2.xは確認できなかった。AAIF Technical CommitteeまたはWorking Groupによる採択済みartifactも新たに確認できていない。</p><p>昨日までに確認したAgent RouterのInferencePool filter重複修正とQuotaPolicy live-update修正、agentgatewayのcredential非転送・MCPInfo cache・xDS ordering修正は、依然として正式最新版より後のmain差分である。修正commitが存在しても、tagged imageやHelm chartへ含まれるまではproduction upgradeの根拠にしない。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>agentgateway：</strong>Anthropicの<code>oss-scanner</code>をbuildするDockerfileが追加された。現時点で確認できるのはscanner imageを作るための資材追加までで、CI必須化、scan policy、結果の公開、v1.6.0 artifactへの反映ではない。正式最新版はv1.6.0。</li><li><strong>Agent Router：</strong>新規commit・patch releaseなし。正式最新版はv1.2.0。QuotaPolicy変更のlive反映、InferencePool filter deduplication、Gemini 3 Proのreasoning修正などはmain上に留まる。</li><li><strong>goose：</strong>新規commit・releaseなし。正式最新版はv1.54.0。release後のsession lease、lazy extension start、225k token compaction上限は次期release候補として分離して追跡する。</li><li><strong>MCP：</strong>新規commit・releaseなし。正式仕様は2026-07-28。Inspector security文書とServer Cards SEP-2127 Final以後の新しい規範的変更は確認できなかった。</li><li><strong>A2A：</strong>新規commit・releaseなし。正式最新版はv1.0.1。</li><li><strong>AGENTS.md：</strong>新規commitなし。Technical Charter追加以後の実質的な変更は確認できなかった。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIFのproject一覧はMCP、AGENTS.md、goose、agentgateway、A2A、Agent Routerの6件を維持している。Technical Committee、Working Groups、project proposal、新規加入・卒業、認定制度に関する新しい正式決定は確認できなかった。</p><p><strong>事実と推論の分離：</strong>repositoryへsecurity scanner用Dockerfileが入ったことは事実だが、foundation全体のsecurity policy変更や、SBOM／provenance要件の標準化を意味しない。今後workflow、branch protection、release attestation、公開scan reportまで揃った場合に、初めてsupply-chain governanceの変更として評価する。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の差分が小さいこと自体より、<strong>release planeとdevelopment planeを別のinventoryとして管理する</strong>ことが重要である。mainには運用上重要な修正が複数存在する一方、正式artifactは一日前と変わっていない。脆弱性対応や障害回避でmain commitを先行利用する場合も、任意の最新mainではなく検証済みcommit SHA、build provenance、rollback先を固定する必要がある。</p><p>security scannerについても、導入の有無より、対象artifact、rule version、severity threshold、false-positive処理、例外期限、releaseを止める条件を観測できることが重要になる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>PoC compatibility matrixをMCP <code>2026-07-28</code>、A2A v1.0.1、goose v1.54.0、agentgateway v1.6.0、Agent Router v1.2.0へ固定する。</li><li>正式tagとmainを別test laneにし、main側はcommit SHAとcontainer digestを必ず保存する。</li><li>Agent Router mainでは、1 requestあたりのEPP call数とQuotaPolicy変更後のdata-plane反映を継続試験する。</li><li>agentgateway mainでは、playground credential非転送、MCPInfo更新、xDS generation安定性をnegative／idempotency testへ追加する。</li><li>goose v1.54.0では、承認時とdispatch時のTool集合、lease ID、schema hashをbaselineとして採取する。</li><li>scannerをrelease gateへ導入する場合、image内tool version、rule set digest、scan対象、例外、結果保存期間を明示する。</li><li>変更がない日も正常系trace、p95、Tool error率、policy decision数を保存し、次のupgrade比較点にする。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>agentgatewayのOSS scannerがCI／release gateへ接続されるか、scan結果やpolicyが公開されるか</li><li>Agent Router v1.2.xへInferencePool、QuotaPolicy、ReferenceGrant関連修正が収録されるか</li><li>agentgateway v1.6.xへcredential非転送、MCPInfo cache、xDS ordering修正が収録されるか</li><li>goose v1.54.0の初期issueと次期release</li><li>MCP次期仕様、SDK、conformance、Server Card実装</li><li>A2A、AGENTS.md、AAIF TC／WGの正式artifact</li></ul>"
      }
    ],
    "sources": [
      [
        "agentgateway — Add dockerfile for oss-scanner",
        "https://github.com/agentgateway/agentgateway/commit/f112c57e16980a1f09b51039e1c4731db3942963"
      ],
      [
        "agentgateway releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "Agent Router releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "goose releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "MCP specification releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "AAIF official site",
        "https://aaif.io/"
      ]
    ]
  },
  {
    "date": "2026-10-10",
    "level": "HIGH",
    "tags": [
      "Operations",
      "Security",
      "MCP"
    ],
    "title": "goose v1.54.0、Tool選択とpolicy反映を固定する",
    "summary": "実行対象をleaseで固定し、QuotaPolicyの変更を再起動なしでdata planeへ収束させる。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>「設定を受理した」と「その設定で実行された」は別の状態である。</strong>goose v1.54.0が正式公開され、clientが選んだextension集合をsessionの正確な集合として扱い、extension操作をlease経由へ統一する変更がreleaseされた。一方Agent Routerのmainでは、QuotaPolicyを更新してもcontrollerとEnvoyを再起動するまで新しい制限がdata planeへ反映されない不具合が修正された。</p><p>共通する問題は、control planeで選択・更新した内容と、実際の推論・Tool実行・request処理で使われるsnapshotの不一致である。gooseは実行中にTool集合がずれないよう固定し、Agent Routerはpolicy変更をEnvoy Gatewayの再変換へ確実に伝える。Agentic OpsではAPIの更新成功だけでなく、<strong>どのversionのTool／policyが各requestへ適用されたか</strong>を確認する必要がある。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>goose v1.54.0：</strong>10月8日に正式releaseされた。主な運用上の変更は、client extension selectionをsessionの完全な集合として扱うこと、すべてのextension操作をlease経由へ通すこと、推論ごとにextensionを解決して固定すること、subagentをstate machine loopのforegroundで扱うことである。これによりprompt生成時に提示したTool、承認対象、実際のdispatch先が処理途中で食い違う範囲を小さくする。</p><p>releaseにはClaude Sonnet／Haiku 5.5のadaptive thinking、HTML session export、GitHub Copilot tokenの一度だけのrefresh、Bedrock cache token集計、initializeでの実装protocol version明示も含まれる。昨日までmain差分として追跡していたlease関連変更が正式artifactになったため、PoCの検証対象をmainではなくv1.54.0へ固定できる。</p><p><strong>Agent Router：</strong>QuotaPolicyはrate-limit service設定とEnvoy filter／route設定の二つのconfig planeへ影響する。しかし従来はpolicy更新後に再生成されるHTTPRouteが同一内容となり、Envoy Gatewayの再変換が起きなかった。修正は適用対象QuotaPolicy specのhashを生成HTTPRouteのannotationへ記録し、作成・更新・削除でrouteを確実に変化させる。これにより再起動なしで新しいquotaを反映する。削除時のcross-namespace通知と、削除中policyをhash対象から外す処理も含まれる。</p><p>この修正はv1.2.0後のmain差分であり、v1.2.0正式artifactには未収録である。quota引き上げが反映されない可用性問題だけでなく、quota引き下げ・policy削除が反映されないsecurity／cost control問題として扱う必要がある。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>goose — HIGH：</strong>v1.54.0を正式公開。extension selection、per-inference lease、state machineへのsubagent統合が中心。release後のmainでは、session選択をleaseし、extensionを初回利用時に起動する変更、auto-compactionを既定225k tokenで上限化する変更が続いている。</li><li><strong>Agent Router — HIGH：</strong>QuotaPolicyのlive update／deleteをHTTPRouteのpolicy hashでdata planeへ伝播。週・月・年のquota windowも追加されたが、<code>1w</code>、<code>1mo</code>、<code>1y</code>はEnvoy Rate Limit Serviceの固定unitであり、請求月のcalendar境界を表すものではない。Gemini 3 Proで<code>reasoning_effort: high</code>を受理する修正も入った。正式最新版はv1.2.0のまま。</li><li><strong>agentgateway — HIGH：</strong>MCP／LLM playgroundへlogin sessionのcookieやBasic認証情報を暗黙転送しないよう修正。変換後に更新されたMCPInfoへ古いcacheを使わない修正、OIDCでdirect bearer tokenを利用する経路、refresh token flowをcacheしない指示も追加された。controller statusの並び順とxDS policy順を安定させ、内容が同じなのにresourceVersionやconfig generationが変化して不要な再接続を招く挙動も抑制した。正式最新版はv1.6.0。</li><li><strong>MCP：</strong>前回のInspector security／<code>mcpdo</code>文書以降、新しいcore specification、SEP Final、正式releaseは確認できなかった。正式仕様は2026-07-28。</li><li><strong>A2A：</strong>新規commit・releaseなし。正式最新版はv1.0.1。</li><li><strong>AGENTS.md：</strong>新規commitなし。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIF Technical Committee、Working Groups、project proposal、新規加入・卒業projectについて、新しい公開決定は確認できなかった。公式project構成もMCP、AGENTS.md、goose、agentgateway、A2A、Agent Routerの6件から変わっていない。</p><p>goose v1.54.0はAAIF移管後のrepositoryから配布された正式releaseである。一方、Agent Routerとagentgatewayの本日扱う修正はmainへmergeされた実装差分であり、release済み仕様とは区別する。Working Groupの会合、blog、main commit、tagged releaseを同じ成熟度として扱わず、production採用条件にはtag、artifact digest、release note、rollback手順を要求する。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>注目点は<strong>configuration convergenceとexecution snapshot</strong>である。宣言型systemでは、desired stateを保存できてもdata planeが同じstateへ収束したとは限らない。逆に動的なTool catalogでは、最新状態を常に参照するとprompt、承認、dispatchの間で対象が変わる。</p><p>必要なのは、変更前後の役割を分けることだ。policyは更新後に全対象へ収束させ、個々の実行は開始時点のsnapshotへ固定する。各requestへ<code>policy hash</code>、<code>tool set hash</code>、<code>lease ID</code>、<code>config generation</code>を付ければ、「新設定が届いていない」のか「実行途中で設定が変わった」のかをtraceから区別できる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>QuotaPolicyの値を変更し、controller／Envoyを再起動せずにrate-limit挙動とxDS configが変わることを確認する。Kubernetes API上のgenerationだけで合格にしない。</li><li>quotaの作成・引き下げ・引き上げ・削除を別testにし、cross-namespace routeでもpolicy削除後に制限が残留しないことを確認する。</li><li>HTTPRouteの<code>quota-policy-hash</code>、Envoy config generation、実requestへ適用されたlimitを同じ時系列へ記録する。</li><li>goose v1.54.0でsession開始後にextension設定を変更し、既存sessionのTool集合がleaseどおり固定され、新sessionだけが新しい集合を使うか検証する。</li><li>Tool承認画面に表示したname／schemaのhashとdispatch時のhashを比較し、TOCTOUを検出する。</li><li>agentgateway playgroundからMCP／LLM backendへcookie、Authorization、Basic認証が暗黙転送されないことをnegative testする。</li><li>同一policyを繰り返しreconcileしてもxDS generationとconnection churnが増えないことを監視する。</li><li>月次quotaを費用管理へ使う場合、<code>1mo</code>のwindow開始点とreset semanticsを確認し、calendar請求月と同一だと仮定しない。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Agent RouterのQuotaPolicy live-update修正と昨日のInferencePool filter重複修正を含むv1.2.x patch release</li><li>policy hashをstatus、metric、traceへ公開する仕組み</li><li>goose v1.54.0のextension lease、subagent state machine、session exportに関するupgrade issue</li><li>goose mainの225k token compaction上限とlazy extension startを含む次期release</li><li>agentgatewayのcredential非転送、MCPInfo cache、stable xDS orderingを含むv1.6.x</li><li>MCP、A2A、AGENTS.md、AAIF TC／WGの新しい正式artifact</li></ul>"
      }
    ],
    "sources": [
      [
        "goose v1.54.0 release",
        "https://github.com/aaif-goose/goose/releases/tag/v1.54.0"
      ],
      [
        "goose — session selection lease and lazy extension start",
        "https://github.com/aaif-goose/goose/commit/903743ee066bc4d38892f6d617e18015805b0f9f"
      ],
      [
        "goose — cap auto-compaction at 225k tokens",
        "https://github.com/aaif-goose/goose/commit/cd1da62ac539451948cb38d9e4f245ddd03a3a50"
      ],
      [
        "Agent Router — apply QuotaPolicy changes without restart",
        "https://github.com/theagentrouter/agent-router/commit/ffdb12eade70a84d5839b5b2e13ff76c8782140c"
      ],
      [
        "Agent Router — weekly, monthly and yearly quota windows",
        "https://github.com/theagentrouter/agent-router/commit/0569b7e733fcbb601c9eaa84e115957329a3933a"
      ],
      [
        "agentgateway — avoid implicit credentials in playground",
        "https://github.com/agentgateway/agentgateway/commit/b4bb0e8925fe763349303adeb2eb5148a4ba4c5d"
      ],
      [
        "agentgateway — avoid stale cached MCPInfo",
        "https://github.com/agentgateway/agentgateway/commit/e60d2230a43a197930e4836aaf75102a14efc9ee"
      ],
      [
        "agentgateway — stable controller status ordering",
        "https://github.com/agentgateway/agentgateway/commit/31c124b3af7c7065966cc19cacd14dda03c2272a"
      ],
      [
        "agentgateway — stable xDS policy ordering",
        "https://github.com/agentgateway/agentgateway/commit/bc5b1ce74edb631fc169baebcbc5a76c0fee8394"
      ]
    ]
  },
  {
    "date": "2026-10-09",
    "level": "HIGH",
    "tags": [
      "Operations",
      "Security",
      "MCP"
    ],
    "title": "1 requestが16回scheduleされた、InferencePool filter重複",
    "summary": "Agent RouterのEPP負荷増幅とscheduler状態破壊を修正。route matchと実行filterを分離する。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>設定上のroute match数が、実行時のpolicy・scheduler呼び出し回数へ漏れ出してはいけない。</strong>Agent Routerでは、同じInferencePoolを参照するroute matchごとに同名のexternal processing filterを追加し、1件のclient requestに対してEPP（Endpoint Picker）を繰り返し呼ぶ不具合が修正された。報告された再現環境では、2個のInferencePoolに各16個のmatchを設定すると、listener chainへ32個のfilterが入り、1 requestが同じEPPを16回通過した。</p><p>これは単なるCPUやlatencyの増加ではない。各passがscheduler状態を更新するため、no-hit LRUのようなstateful pluginでは1 requestを16件の需要として数え、cold requestの分散やprefix-cache affinityの会計まで崩れる。修正は2026年10月8日のmain branchに入り、10月7日公開のv1.2.0 tagより後である。したがって、現時点では<strong>修正済みmainと正式releaseを区別し、v1.2.0利用者は自環境で再現テストを行い、patch releaseの包含を確認する</strong>のが安全である。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>事実：</strong>原因は、生成済みlistener filterとの重複だけを確認し、同じ変換処理の途中で追加予定になったfilterを局所的に記録していなかったことにある。複数のHTTPRoute matchが同一InferencePoolを指すと、namespace/nameが同じpoolでもfilterが積み重なった。修正はpoolのnamespace/name単位でdeduplicateし、1 listener・1 poolにつきexternal processing filterを1個だけ生成する。</p><p>修正PRの検証では、EPPへの呼び出しが16回から1回へ減り、cold promptのendpoint分散が回復しつつ、cache affinityも維持された。運用上の重要点は「最終応答が200なら正常」と判定できないことだ。重複passがすべて成功すれば外形監視は通る一方、内部ではlatency、EPP load、scheduler stateが悪化する。release upgrade testには、status codeだけでなく<strong>1 client requestあたりのEPP stream数、policy評価回数、scheduler mutation回数</strong>を含める必要がある。</p><p><strong>分析：</strong>route ruleを宣言面、ext_procを実行面と捉えると、今回の教訓は「宣言の多重度を実行の多重度へ暗黙に写像しない」である。Gateway APIを生成するcontrollerでは、xDS出力の構造テストと実際のcall-count testを対にするべきだ。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<ul><li><strong>Agent Router：</strong>InferencePool filter重複を修正。v1.2.0後のmain差分であり、正式なv1.2.x patch releaseへの収録は未確認。影響判定は、同じpoolを複数matchから参照するroute構成で行う。</li><li><strong>agentgateway：</strong>SubstrateのResumeActorにoutbound gRPC spanと<code>traceparent</code>伝播を追加した。さらにext_procのlocal接続失敗・timeout・有効backendなしを<code>UNKNOWN</code>ではなく<code>UNAVAILABLE</code>として扱い、誤った403/500ではなく503、park中のretry枯渇では504へ写像する修正が入った。Detect/Passthrough providerで<code>/v1/v1/...</code>となるpath joinも修正された。いずれもv1.6.0後のmain差分で、次のrelease包含は未確認。</li><li><strong>MCP：</strong>core specificationの新版は確認できず、現行は2026-07-28。Inspector文書にsecurity pageと実験的な<code>mcpdo</code> clientが追加された。OAuth token、client secret、stdioの環境変数はOS keychainを優先するが、headless Linux、SSH、container等でkeychainが使えない場合は<code>~/.mcp-inspector/secrets.json</code>へfallbackし、鍵を指定しなければ平文になる。この実装条件をdeployment checklistへ明記すべきである。</li><li><strong>goose：</strong>legacy agent loopを削除し、state machineを唯一のloopへ移すmain差分が入った。空応答retryやfallback markerの処理も同じ経路へ集約される。Claude Sonnet/Haiku 5.5向けadaptive thinkingも追加されたが、最新の正式releaseは引き続きv1.53.0である。</li><li><strong>A2A：</strong>v1.0.1以降の新release・重要仕様変更は確認できなかった。</li><li><strong>AGENTS.md：</strong>前回以降の実質的な更新は確認できなかった。</li></ul>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIFは10月8日付で「The Agent Gets a Body」を公開した。physical agentでは「tool callが200を返した」だけでは不十分で、どのdeviceへ、commandが届いたか、実世界で何が起きたかまで確かめる必要があると論じる。Device Connectによるcapability advertisementとnetwork RPC、browser・CLI・MCPから同じprimitiveを扱うPorthole、offline edgeでのidentityとobservabilityが紹介された。</p><p><strong>事実と位置づけ：</strong>これはAAIFの公式blogで示された設計論であり、MCP/A2Aの規範的仕様変更やTechnical Committeeの採択決定ではない。10月8日にはObservability/Tracing、Identity/Trust関連の会合日程もあるが、公開された採択文書を確認できないため、meeting開催を標準化決定として扱わない。新規project加入・卒業、project proposalの承認、既存6 projectの構成変更も確認できなかった。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>今日の差分は、agentic systemの信頼性が「成功応答」から<strong>実行回数と状態遷移の整合性</strong>へ移っていることを示す。Agent Routerの重複scheduler pass、agentgatewayのtrace伝播とgRPC status修正、AAIFのphysical-agent論は同じ方向を指す。intention、dispatch、policy/schedule、deviceまたはtoolでのexecution、確認されたoutcomeを別々に観測し、1 requestから何回の副作用が生じたかを追跡する必要がある。</p><p>特にretry、fail-open、park/resume、route fan-outが共存する環境では、at-least-once deliveryと意図しない重複実行を区別できなければならない。request IDだけでなく、attempt ID、policy evaluation ID、scheduler decision ID、tool/device operation IDをtrace上で関係づける設計が重要になる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<ol><li>同一InferencePoolを複数path/header matchから参照するHTTPRouteをfixture化し、生成listener内のext_proc filterがpoolごとに1個であることをassertする。</li><li><code>EPP calls / external client requests</code>をrateまたはtrace metricで可視化し、通常経路で1を超えたらalertする。retryが正当な場合はattempt属性で分離する。</li><li>cold promptのendpoint分散、prefix-cache hit、LRU state更新数をupgrade前後で比較する。p95 latencyだけではscheduler stateの破壊を見逃す。</li><li>xDS config dumpを保存し、同名filterや同一clusterへの重複calloutをrelease差分として検査する。</li><li>agentgatewayではconnection failureを503、park中retry枯渇を504としてSLOとretry policyへ反映し、ResumeActorを跨いでtraceが連続するかを確認する。</li><li>MCP Inspectorをheadless/containerで使う場合、keychain利用可否を起動時に検査し、memory-only、暗号化済みfile、短命credentialのいずれかを選ぶ。fallback fileの権限だけでsecret-at-restを満たしたと誤認しない。</li></ol>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Agent Router v1.2.x patchにInferencePool deduplication修正が含まれるか、release noteとtag commitを照合する。</li><li>複数route match・複数pool・複数listenerを組み合わせたconformance/load testが追加されるか。</li><li>agentgateway次期releaseにResumeActor trace、ext_proc status、provider path join修正が収録されるか。</li><li>MCP Inspectorがheadless環境のsecret fallbackをUIや起動logで明示し、memory-only/encryption設定を安定化するか。</li><li>goose v1.54系releaseでstate machine一本化後のempty response、tool retry、resume挙動がどう記載されるか。</li><li>AAIFのphysical agent議論がObservability/TraceabilityまたはIdentity/Trust WGの公開artifactへ発展するか。</li></ul>"
      }
    ],
    "sources": [
      [
        "Agent Router — fix: add one InferencePool ext proc filter per pool, not per route match",
        "https://github.com/theagentrouter/agent-router/commit/31ee356f6dc02a83a2630e774064f31284fef509"
      ],
      [
        "agentgateway — Fix Substrate resume trace propagation",
        "https://github.com/agentgateway/agentgateway/commit/73b52e38244eda5dd10edd71f49b048caa6a978e"
      ],
      [
        "agentgateway — ext_proc local gRPC errors preserve gRPC status",
        "https://github.com/agentgateway/agentgateway/commit/0c62b5a3afb8a8a50aad5b33b8485d8427b5651d"
      ],
      [
        "agentgateway — Fix Detect/Passthrough provider path joining",
        "https://github.com/agentgateway/agentgateway/commit/2eaccafc467abb32d4b5a13f271de8e73cada71e"
      ],
      [
        "MCP — Inspector security documentation and mcpdo client",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/c518f7a927cff918bce35d3522fcdb046d264d7c"
      ],
      [
        "goose — Delete legacy agent loop",
        "https://github.com/block/goose/commit/3b094d7afe681f78db63f3ce0b95d5124fc3341c"
      ],
      [
        "goose — Adaptive thinking for Claude Sonnet/Haiku 5.5",
        "https://github.com/block/goose/commit/a4189ec8c7c09a66ce300c8aca528385bdc13ff0"
      ],
      [
        "AAIF — The Agent Gets a Body",
        "https://aaif.io/blog/the-agent-gets-a-body"
      ],
      [
        "AAIF — Stateless MCP changes your security model",
        "https://aaif.io/blog/stateless-mcp-changes-your-security-model-how-to-harden-your-mcp-servers"
      ]
    ]
  },
  {
    "date": "2026-10-08",
    "level": "HIGH",
    "tags": [
      "MCP",
      "Security",
      "Operations"
    ],
    "title": "Agent Router v1.2.0、MCP認証境界を強化",
    "summary": "正式releaseのbreaking changeを、session・issuer・policy・cross-namespaceの観点で整理する。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>Agent Router v1.2.0が正式公開された。</strong>旧称Envoy AI Gatewayから改称後、初の正式releaseである。project名とrepositoryは変わったが、<code>aigateway.envoyproxy.io</code> API group、CRD、Helm chart、container image、<code>aigw</code> CLIは維持されるため、rename自体によるmanifest移行は不要である。</p><p>一方で、MCPの認証とsession境界にはupgrade時の挙動変更がある。既知の固定session暗号化seedを廃止し、installごとのrandom seedをSecretへ保存する。OAuth tokenの<code>iss</code>は設定したissuerと完全一致が必要になり、JWT claimをCELで参照するrouteには検証済みJWTを作る<code>securityPolicy.oauth</code>が必須になった。新機能よりも、これらのbreaking changeを事前検証することが本日の重要signalである。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>Agent Router v1.2.0 — 10月7日正式公開</strong><br>MCP Gatewayには、Tool／Prompt名のprefixを外す<code>prefixMode: Never</code>、利用者が渡したupstream credentialを優先する<code>injectionPolicy: IfNotPresent</code>、Gateway／Listener policyをMCPRoute側へmergeする<code>mergeType</code>、独自pathのOAuth metadata URLが追加された。</p><p><strong>安全側の制約：</strong><code>prefixMode: Never</code>では公開Toolを<code>toolSelector.include</code>へ明示し、複数backendで同名Toolが衝突するとrouteを<code>NotAccepted</code>にする。JWT claim参照はOAuth検証なしでは拒否され、ReferenceGrantは対象object名まで照合する。機能を柔軟にする一方、曖昧な名前・未検証claim・広すぎるnamespace許可を許さない構成である。</p><p><strong>upgrade影響：</strong>新しいrandom session seedへ切り替えると既存MCP sessionは終了し、clientは再初期化が必要になる。旧seedをfallbackに残せば移行中のsessionを維持できるが、公開済みの<code>default-insecure-seed</code>を長期間残すべきではない。GitOpsで<code>helm template</code>を使う場合は、renderごとにseedが変わらないよう<code>existingSecret</code>または明示seedを用意する。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>Agent Router — HIGH</strong><br>v1.2.0を正式公開した。MCP initializeではclientとbackendのprotocol versionをnegotiationし、merged list responseへ<code>ttlMs</code>と<code>cacheScope</code>を付ける。ただしstatelessなMCP <code>2026-07-28</code>対応は進行中で、v1.2.0ではまだ有効化されていない。per-backendの<code>gen_ai.*</code> metric、controller cache同期後のReady、AWSOpenAI／TypeSafe backend schemaも追加された。</p><p><strong>agentgateway — HIGH</strong><br>mainで、OAuth Token Exchange／Cross App Accessの設定変換に失敗した場合、壊れた設定を部分的に適用せずdata planeでrequestを拒否するfail-closed修正が入った。またharness由来のsession IDをheuristicで検出し、logとCEL contextへ記録する変更、HTTP/1 connectionをgraceful drainする修正、standalone Helmでsession keyを明示設定する変更もmergeされた。いずれも最新正式版v1.6.0より後のmain上の差分である。</p><p><strong>goose — MEDIUM</strong><br>正式最新版は10月2日公開のv1.53.0である。mainでは、max turnsへ到達しても未完了Toolを先に完了させる修正、session providerをProviderManager経由へ統一する変更が入った。一方、background subagentとorchestratorを削除しDoctorをsession内限定にする変更もmergeされており、v1.54系での機能境界を確認する必要がある。</p><p><strong>MCP — WATCH</strong><br>SEP-2127 Final以後、新しいcore specification releaseはなく、正式版は<code>2026-07-28</code>のままである。</p><p><strong>A2A / AGENTS.md — WATCH</strong><br>A2Aは古いtutorial API名の修正、community PHP SDKとpartner一覧の追加で、protocol変更ではない。AGENTS.mdに新規commitは確認できなかった。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>Agent Router v1.2.0は、AAIF projectとしての新名称で公開された最初のreleaseである。名称とgovernance上の所属を変えながら、既存API groupやartifact名を維持することで、community移管と利用者の互換性を分離している。</p><p>MCP protocol version negotiationとcache hintは実装されたが、MCP <code>2026-07-28</code>完全対応とは明記されていない。release noteも「support is in progress and not yet enabled」としており、version番号や一部fieldの存在だけでconformance済みと判断してはならない。</p><p>AAIF Technical Committee、Working Groups、project proposal、新規加入・卒業projectについて、本日追加の正式決定は確認できなかった。公式project一覧はMCP、goose、AGENTS.md、agentgateway、A2A、Agent Routerの6projectを維持している。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の更新は、<strong>control planeで設定を受理できることと、data planeで安全に実行できることを分けない</strong>方向を示す。Agent Routerは未検証JWT claim、Tool名衝突、未許可cross-namespace参照を設定段階で拒否する。agentgatewayはOAuth設定のtranslation errorをdata planeまで運び、そのrouteのrequestをfail closedにする。</p><p>長寿命sessionでは、identityだけでなく鍵のlifecycleも運用対象になる。固定seedは再接続を減らすが全install共通の攻撃面を作り、無計画なrandom化は全sessionを切断する。安全な既定値、Secretの永続化、rotation window、再初期化手順を一つの設計として扱う必要がある。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>Prometheus／Alertmanager MCPをAgent Router配下へ置くPoCでは、v1.1.0からv1.2.0のcanary upgradeに次を追加する。</p><ul><li>upgrade直後に既存MCP sessionが終了し、clientが再初期化して復旧できることを確認する</li><li>GitOps renderを複数回行ってもsession seed Secretが意図せず変わらない構成にする</li><li>移行用fallback seedには撤去期限を設定し、利用中session数を監視する</li><li>OAuth issuerの末尾slashを含む完全一致、欠損<code>iss</code>、別issuer tokenをnegative testする</li><li><code>auth.jwt</code>を参照するCEL routeがOAuth未設定ならapply時に拒否されることを確認する</li><li>bare Tool名の衝突を作り、routeが<code>NotAccepted</code>となって誤配送しないことを確認する</li><li>Gateway-levelのrate limit／ext-authがMCPRoute policy merge後も維持されるか比較する</li><li>ReferenceGrant削除後、cross-namespace Secretとbackendがdata plane設定から消えることを確認する</li><li>backend別のlatency、TTFT、token metricへ<code>gen_ai_backend</code>が付き、同一modelのprovider比較ができることを確認する</li><li>invalid OAuth設定を投入し、credentialなしでupstreamへ通過せずrequestが拒否されることを確認する</li></ul><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>v1.2.0はrename releaseではない。session鍵、issuer、JWT policy、ReferenceGrantの境界が変わるsecurity releaseとして、再接続とrollbackを含めて検証する。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Agent Router v1.2.0のupgrade issueとpatch release</li><li>MCP <code>2026-07-28</code> stateless対応の正式有効化とconformance結果</li><li>session seed fallbackを安全に撤去するmigration guidance</li><li>bare Tool名と複数backend fan-outのcollision／audit behavior</li><li>agentgatewayのOAuth fail-closed修正を含むv1.6.x release</li><li>agentgatewayのsession ID検出が各harnessで誤結合を起こさないか</li><li>goose v1.54.0の正式releaseとbackground subagent削除のmigration note</li><li>A2A、AGENTS.md、AAIF TC／WGの新しい正式artifact</li></ul>"
      }
    ],
    "sources": [
      [
        "Agent Router v1.2.0 release",
        "https://github.com/theagentrouter/agent-router/releases/tag/v1.2.0"
      ],
      [
        "Agent Router v1.2 release notes",
        "https://theagentrouter.ai/release-notes/v1.2"
      ],
      [
        "agentgateway: fail closed on invalid OAuth xDS configuration",
        "https://github.com/agentgateway/agentgateway/commit/cf61ae8f80caef4f00b4aa16975cedb76abce82e"
      ],
      [
        "agentgateway: detect and report session identifiers",
        "https://github.com/agentgateway/agentgateway/commit/63f23ae53b21dd3f5b116e1e47dae3e92dac2fb8"
      ],
      [
        "agentgateway: gracefully drain HTTP/1 connections",
        "https://github.com/agentgateway/agentgateway/commit/196b269af28b4e3d83b22589f1ecd043e38a0772"
      ],
      [
        "agentgateway: configure standalone session key",
        "https://github.com/agentgateway/agentgateway/commit/a19ed941c4c9c883193c8e87c59b77461e38db5f"
      ],
      [
        "goose v1.53.0 release",
        "https://github.com/aaif-goose/goose/releases/tag/v1.53.0"
      ],
      [
        "goose: finish pending tools before max turns",
        "https://github.com/aaif-goose/goose/commit/968dc4bdb223e65c32670a251c0187576b4e0ae7"
      ],
      [
        "goose: route session providers through ProviderManager",
        "https://github.com/aaif-goose/goose/commit/723a825fb9ff1f744dbed49d4516319e2b4e1c15"
      ],
      [
        "goose: remove background subagents and orchestrator",
        "https://github.com/aaif-goose/goose/commit/8f72d2d3055ba3818b88c259830995004653e39d"
      ],
      [
        "A2A: update streaming tutorial APIs",
        "https://github.com/a2aproject/A2A/commit/12e9d2fbb9badfe98f8ab4f660697870eeb1940b"
      ],
      [
        "MCP official releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "AAIF official project list",
        "https://aaif.io/projects"
      ],
      [
        "AAIF Technical Committee",
        "https://aaif.io/tc"
      ],
      [
        "AAIF Working Groups",
        "https://aaif.io/working-groups"
      ]
    ]
  },
  {
    "date": "2026-10-07",
    "level": "HIGH",
    "tags": [
      "MCP",
      "Security",
      "Operations"
    ],
    "title": "MCP Server CardsがFinal、接続前Discoveryを標準化",
    "summary": "remote MCP Serverの所在と接続条件を事前発見。静的metadataとruntime権限を分離する。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>MCP Server Cardsを定義するSEP-2127がFinalになり、remote MCP Serverを接続前に発見するための標準的な枠組みが成立した。</strong>Server Cardはserverのidentity、endpoint、transport、対応protocol versionなどを公開する静的metadataである。domain単位では<code>/.well-known/ai-catalog.json</code>からCardをlinkまたはembedでき、Card自体は任意のURIまたは推奨位置<code>&lt;streamable-http-url&gt;/server-card</code>で提供できる。</p><p>重要なのは、Server CardがTool一覧やpermissionを保証するmanifestではない点である。tools、resources、prompts、negotiated capabilitiesは利用者、session、設定、deployment状態で変わるためCardから意図的に除外され、接続後のruntime listingとnegotiationが正とされた。静的な発見面と、認証後の実行・権限面を分離する設計が本日の中心signalである。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>SEP-2127 — MCP Server Cards / Status: Final</strong><br>Extensions Trackとしてextension identifier <code>io.modelcontextprotocol/server-card</code>を確定した。既存MCP Serverへの実装はoptionalで、core protocol messageや接続flowを変更しないため後方互換である。Server CardがないServerも従来どおり接続できる。</p><p><strong>何が変わったか：</strong>従来はclientが接続先URLを事前設定するか、接続後の<code>server/discover</code>に頼る必要があった。今後はdomainや公開catalogから、接続前にendpointと対応versionを機械的に取得できる。<strong>ただし信頼境界は変わらない。</strong>Cardとliveな<code>server/discover</code>が矛盾する場合、clientはlive値を優先するべきとされる。Cardは公開・read-onlyの案内情報であり、credential、内部network topology、user固有情報を含めてはならない。</p><p><strong>分析：</strong>これはMCPを手作業の接続設定からservice discoveryへ進める変更だが、Cardをallowlistやauthorizationの代替にすると危険である。発見できること、接続できること、Toolを実行してよいことは別の判定として実装する必要がある。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>MCP — HIGH</strong><br>SEP-2127がFinalとなった。normativeなwire formatはextension repositoryのTypeScript schemaをsource of truthとし、互換性を保ちながら独立して更新できる。breaking changeには新しいextension identifierが必要である。Python SDKとGo SDKにはexperimentalなreference implementationがあり、正式SDK releaseへの収録は今後確認する。</p><p><strong>Agent Router — HIGH</strong><br>Kubernetes ReferenceGrantの<code>to.name</code>を正しく評価する修正が入った。従来は特定nameへの許可が、同じnamespace内の同group／kind全体を許可し得たが、今後は指定されたobjectだけを許可する。Grant削除時のreconcileも追加され、許可取消をdata planeへ反映する。mainにはv1.2 release noteも追加されたが、公式Releasesの最新版は観測時点でv1.1.0であり、v1.2はまだ正式releaseとして扱わない。</p><p><strong>agentgateway — HIGH</strong><br>MCP request／responseへlocal CEL guardrailを適用し、Tool名による拒否やresponse textのmaskを行うprocessorが追加された。reasoning／thinking blockもprompt guardの検査対象となり、FIPS buildではJWT algorithmをRSA／ECDSAへ制限し、EdDSAやHMACをfail closedで拒否する変更も入った。いずれもmain上の変更で、正式releaseへの収録は未確認である。</p><p><strong>goose — MEDIUM</strong><br>extension操作をlease経由へ統一し、ACP clientがsessionごとに選択したextension集合を厳密に使う変更が続いた。mainのversionは1.54.0へ更新されたが、tagged releaseの公開とは分けて扱う。推論途中でTool集合が変わるraceを減らす方向は前日のper-inference leaseを補強する。</p><p><strong>A2A / AGENTS.md — WATCH</strong><br>A2AはAgent readinessに関するdocumentation改善、AGENTS.mdは新規commitなし。protocol、format、security advisoryとしての実質差分は確認できなかった。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>SEP-2127はServer Card Working GroupによるExtensions Trackの成果である。MCP coreへ巨大な静的schemaを固定するのではなく、extension repositoryをnormative sourceとして独立進化させ、protocol本体はextension identifierと互換性規則を管理する。</p><p>Server CardはMCP Registryの<code>server.json</code>とも役割が異なる。Registryはlocal install packageやruntime設定を含む配布情報、Server Cardはremote接続情報を表す。重なるidentityやendpointは互換的に扱えるが、片方をもう片方の完全な代替にはしない。</p><p>AAIF Technical Committee、Working Groups、project proposal、新規加入・卒業projectについて、本日これ以外の新しい正式決定は確認できなかった。Summit発表ではなく、Final SEP、merged commit、tagged releaseを導入判断の根拠とする。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>Agentic infrastructureでは、<strong>discovery planeとexecution planeの分離</strong>が明確になっている。AI Catalogはdomain上のartifactを見つけ、Server CardはMCP endpointと対応versionを伝え、MCP runtimeは認証済み利用者に見えるTool／Resource／Promptを返す。Gateway policyはその実行を許可・監査する。</p><p>この分離によりcatalogをcache・crawlできる一方、静的metadataのstale化や偽装をruntimeで検出できる。Agent RouterのReferenceGrant name制約とagentgatewayのCEL guardrailも同じ方向で、発見されたrouteやToolをそのまま信頼せず、実行直前のidentity、object、request、responseへpolicyを適用する。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>社内MCP catalogとGatewayを構築するPoCには、次を追加する。</p><ul><li>domainごとに<code>/.well-known/ai-catalog.json</code>を公開し、Card owner、更新時刻、expiry、検証結果をinventoryへ保存する</li><li>Card取得はHTTPS、redirect上限、size上限、timeout、cache／ETag、rate limitを設定する</li><li>Cardへcredential、private hostname、cluster内部address、user固有metadataを載せない</li><li>Cardのendpointとprotocol versionを接続後の<code>server/discover</code>およびinitialization結果と照合し、不一致をalertする</li><li>CardにTool一覧を独自追加してもauthorization根拠にせず、runtimeの<code>tools/list</code>とGateway policyを正とする</li><li>MCP Registry entry、Server Card、Gateway routeを同一service IDで関連付け、install情報とremote接続情報を混同しない</li><li>ReferenceGrantは<code>to.name</code>を明示し、Grant削除後にroute／Secret accessが確実に失効することをtestする</li><li>CEL guardrailは拒否・mask・error時のfail modeを回帰testし、reasoning blockと通常contentの両方を検査する</li><li>FIPS環境では許可JWT algorithmとkey typeのmatrixをCIで固定する</li></ul><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>Server Cardは名刺であって入館証ではない。Cardで所在を知り、TLSと認証で相手を確認し、runtime listingとpolicyで実行可能な操作を決める。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>extension repositoryの<code>experimental-ext-server-card</code>から<code>ext-server-card</code>へのgraduation</li><li>Python／Go／TypeScript SDKでのServer Card正式releaseと相互運用test</li><li>AI CatalogとMCP Registryを横断するidentity、署名、provenanceの扱い</li><li>Cardと<code>server/discover</code>の不一致を検出するconformance test</li><li>Agent Router v1.2の正式tagとsecurity／breaking change migration note</li><li>agentgatewayのMCP CEL guardrail・reasoning scan・FIPS JWT変更を含む正式release</li><li>goose v1.54.0の正式releaseとlease設計のstability</li><li>A2A・AGENTS.md・AAIF TC／WGの新しい正式artifact</li></ul>"
      }
    ],
    "sources": [
      [
        "MCP: merge SEP-2127 Server Cards as Final",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/0a11bf68c7ec4473526ec15589f592afcd12d1e8"
      ],
      [
        "SEP-2127: MCP Server Cards",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2127-mcp-server-cards.md"
      ],
      [
        "MCP Server Card extension repository",
        "https://github.com/modelcontextprotocol/ext-server-card"
      ],
      [
        "Agent Router: enforce ReferenceGrant to.name and reconcile revocation",
        "https://github.com/theagentrouter/agent-router/commit/f9766f2574a64f230f8ad03935dcfa68ac3991e1"
      ],
      [
        "Agent Router: prepare v1.2 release notes",
        "https://github.com/theagentrouter/agent-router/commit/757aa0803a068394bef681cbb84484ae49685035"
      ],
      [
        "Agent Router official releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "agentgateway: add MCP CEL guardrail processor",
        "https://github.com/agentgateway/agentgateway/commit/276f10dc68430762674d6d64f3baecead963ac78"
      ],
      [
        "agentgateway: scan reasoning blocks in prompt guards",
        "https://github.com/agentgateway/agentgateway/commit/dc0a4053126f334560d9b54c03e7fe95fcb6aa4b"
      ],
      [
        "agentgateway: enforce FIPS JWT algorithm policy",
        "https://github.com/agentgateway/agentgateway/commit/cf1e2ab16ceff62ac3463253e7d752483ce5ab42"
      ],
      [
        "goose: route extension operations through leases",
        "https://github.com/aaif-goose/goose/commit/d26a422c240a09755c394b141ce022b5ced975c8"
      ],
      [
        "goose: use exact ACP session extension set",
        "https://github.com/aaif-goose/goose/commit/540df77c30e3c1f3b51915cb18ae081931c96851"
      ],
      [
        "A2A: improve agent-readiness documentation",
        "https://github.com/a2aproject/A2A/commit/84c1e394482a279c089a50b7fc18caf991c857b4"
      ],
      [
        "AAIF Technical Committee",
        "https://aaif.io/tc"
      ],
      [
        "AAIF Working Groups",
        "https://aaif.io/working-groups"
      ]
    ]
  },
  {
    "date": "2026-10-06",
    "level": "HIGH",
    "tags": [
      "Security",
      "MCP",
      "Operations"
    ],
    "title": "Local MCP Serverは、信頼済みプラグインではない",
    "summary": "MCP公式security guideと、鍵・Secret・Tool状態を守る実装更新を運用目線で整理する。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>MCP公式documentationにLocal Server Security guideが追加され、local MCP Serverを「protocolがsandbox化するplugin」ではなく、利用者権限で動く通常の未信頼processとして扱う原則が明文化された。</strong>stdioで起動したServerはenvironment variable、SSH／cloud credential、browser profile、filesystem、outbound networkへ、OS権限の範囲で到達できる。MCP transport自体はclientとlocal Serverの間にsecurity boundaryを作らない。</p><p>同じ観測期間に、agentgatewayではMCP session鍵の競合上書きを防ぐ修正、Agent Routerではcross-namespace SecretのReferenceGrant強制、gooseでは一回の推論中に利用するextension／tool集合をleaseとして固定する変更が入った。共通点は、Agent実行中に変化するcredential・Tool・workspaceを暗黙に信頼しないことである。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>MCP Local Server Security guide — 公式documentation</strong><br>guideは、不要なlocal実行を避けてremote Streamable HTTPを優先する、publisherとpackage名を確認する、versionやcontainer digestを固定する、Tool descriptionを未信頼入力として読む、container／VM／別userで隔離する、SecretをServerごとに分離する、filesystemとnetwork egressを最小化する、という実務的なdefaultを示した。</p><p><strong>事実：</strong>これはprotocol schemaの変更ではなく、正式版<code>2026-07-28</code>とdraftの両方へ追加されたsecurity運用guideである。<strong>分析：</strong>PrometheusやAlertmanagerのlocal MCP Serverを同じoperator accountで直接起動すると、監視用tokenだけでなく、そのaccountが読めるSSH keyやcloud credentialまで障害半径に入る。Toolのallowlistだけでは悪意あるprocessを止められず、OS／container側の強制境界が必要になる。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>MCP — HIGH</strong><br>Local Server Security guideを追加した。特に、top-level packageのversion pinはtransitive dependencyまで固定しない一方、container imageのdigest pinはdependency tree全体を固定できるという違いを明記している。Tool definitionのpoisoningや後日変更されるrug pullも対象で、MCP InspectorによるTool一覧確認と、definition変更時に再承認するclientが推奨される。</p><p><strong>agentgateway — HIGH</strong><br>deployerがsession key Secretをreconcileごとにapplyせず、初回だけ作成して既存鍵を再利用するようになった。stale cacheを持つreconcileが鍵を上書きし、既存MCP sessionを無効化するraceを防ぐ。鍵変更後にdecodeできないsession IDは400ではなく404を返し、clientが新sessionを開始できるようにした。別々の<code>Accept</code> header行で<code>application/json</code>と<code>text/event-stream</code>を送るclientが誤って406になる問題も修正した。</p><p><strong>Agent Router — HIGH</strong><br>APIKey、Azure API key、Anthropic API key、AWS credentials fileのstatic credentialで、<code>secretRef.namespace</code>を正しく解決し、別namespaceのSecretを読む前にReferenceGrantを必須化した。従来はnamespace指定を無視し、policy側namespaceの同名Secretを誤って使う可能性があった。未許可時はpolicyを<code>NotAccepted</code>とし、credentialをfilter configへ公開しない。</p><p><strong>goose — MEDIUM</strong><br>extensionとTool catalogを推論単位のleaseへ解決する大規模な内部変更をmergeした。一回のprovider callでpromptに提示したTool、承認対象、実際のdispatch先を同じsnapshotへ結び付け、途中の<code>tools/list_changed</code>、workspace移動、extension追加・削除による食い違いを減らす。正式releaseへの収録は未確認である。</p><p><strong>A2A / AGENTS.md — WATCH</strong><br>A2Aはdaily link checker修正のみ、AGENTS.mdには新規commitがない。protocol・instruction format・security advisoryの実質差分は確認できなかった。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>MCP Dev Summit Torontoは2日目を迎え、公式scheduleにはproduction運用、registryとgateway、authorization、Tool filtering、human approval、MCP Serverをinsider threatとして扱うsessionが並ぶ。ただしsession説明は採択済み標準ではない。本日の正式なartifactはrepositoryへmergeされたLocal Server Security guideと各実装commitである。</p><p>AAIF Technical Committee、Working Groups、project proposal、新規加入・卒業projectに新しい正式決定は確認できなかった。Summit終了後はslidesやrecordingだけでなく、SEP、meeting notes、repository merge、conformance要件へ変換された内容を追跡する。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の更新は<strong>time-of-checkとtime-of-useを一致させる</strong>流れとして読める。Local Serverはinstall時の承認後もTool definitionやdependencyが変わる。gooseは推論開始時のTool集合をleaseへ固定し、Agent RouterはSecretを読む直前にReferenceGrantを検査し、agentgatewayはreconcileのたびにsession鍵を再生成しない。</p><p>Agentic infrastructureでは、permissionを設定した事実だけでなく、「どのartifact、Tool catalog、workspace、identity、key versionを評価し、その同じ対象を実行したか」をtraceできる必要がある。これは一般的なTOCTOU対策を、AgentのTool選択と長寿命sessionへ拡張する考え方である。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>ホスティング運用でPrometheus MCPやAlertmanager MCPを導入するPoCには、次を追加する。</p><ul><li>local Serverをoperatorのlogin shellから直接起動せず、専用userまたはrootless containerへ隔離する</li><li>home、<code>~/.ssh</code>、cloud credentialをmountせず、必要な設定とsocketだけをread-onlyで渡す</li><li>Serverごとに最小scopeの短期credentialを発行し、environment全体を継承させない</li><li>network不要のServerはegressを禁止し、必要なServerは宛先allowlistと通信logを持つ</li><li>package versionだけでなくimage digest、SBOM、署名、取得元をinventoryへ保存する</li><li>Tool descriptionとschemaの初回snapshotを保存し、変更時に差分reviewを要求する</li><li>session key SecretのresourceVersionとhashを監視し、意図しないrotationを検出する</li><li>ReferenceGrant削除後、cross-namespace credentialがdata plane設定から消えることを試験する</li><li>Tool承認待ち中にworkspaceやextensionを変更し、承認したToolと実行対象がずれないことを確認する</li></ul><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>MCP Serverの設定画面で許可した範囲は、悪意あるprocessへの強制境界ではない。実際の境界はOS権限、mount、network policy、Secret scopeで作る。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Local Server Security guideをclient／registryの必須要件へ反映するSEP</li><li>Tool definition変更時の再承認・署名・差分監査</li><li>local MCP Server artifactのSBOM、provenance、digest検証</li><li>agentgateway session key修正を含むv1.6.x patch release</li><li>Agent RouterのReferenceGrant修正を含む正式releaseとmigration note</li><li>gooseのper-inference leaseを含む正式releaseとtool-list raceの検証</li><li>Summitのsecurity／authorization／human approval sessionから生まれる正式proposal</li><li>A2A・AGENTS.mdの仕様またはgovernance更新</li></ul>"
      }
    ],
    "sources": [
      [
        "MCP: add Local Server Security guide",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/8e12bf3c8f01f374146acfa19b8ece0018bfc86c"
      ],
      [
        "agentgateway: create session key Secrets once",
        "https://github.com/agentgateway/agentgateway/commit/33d1259902df8433a92d4b82734cfcf9a6617960"
      ],
      [
        "agentgateway: accept separate Accept header fields",
        "https://github.com/agentgateway/agentgateway/commit/289b04170b5c142b4c50f0c5affdb73fb9bfd677"
      ],
      [
        "agentgateway: preserve upstream JSON-RPC error codes",
        "https://github.com/agentgateway/agentgateway/commit/ca03525dc6cdc30a148833ebcea813b93dd37837"
      ],
      [
        "Agent Router: enforce ReferenceGrant for static credentials",
        "https://github.com/theagentrouter/agent-router/commit/01142d5739fd599b5a7d273cef9efe105d2adbdb"
      ],
      [
        "goose: resolve extensions into a per-inference lease",
        "https://github.com/aaif-goose/goose/pull/12161"
      ],
      [
        "MCP Dev Summit Toronto",
        "https://events.linuxfoundation.org/mcp-dev-summit-toronto/"
      ],
      [
        "MCP Dev Summit Toronto official schedule",
        "https://events.linuxfoundation.org/mcp-dev-summit-toronto/program/schedule/"
      ],
      [
        "MCP official releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A official releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "agentgateway official releases",
        "https://github.com/agentgateway/agentgateway/releases"
      ],
      [
        "Agent Router official releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "goose official releases",
        "https://github.com/aaif-goose/goose/releases"
      ]
    ]
  },
  {
    "date": "2026-10-05",
    "level": "LOW",
    "tags": [
      "MCP",
      "Operations",
      "Security"
    ],
    "title": "MCP Dev Summit開幕、発表を検証可能な変更へ落とす",
    "summary": "正式仕様・releaseの差分はなし。Summit発表を運用判断へ変える証拠の段階を整理する。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>MCP Dev Summit Torontoが本日開幕する一方、観測時点ではMCP、A2A、goose、agentgateway、Agent Router、AGENTS.mdに前回記事後の新規commit、正式release、security advisoryは確認できなかった。</strong>AAIF Technical CommitteeやWorking Groupsからも、新しい採択事項、project proposal、加入・卒業projectの正式発表はない。</p><p>今日は「eventが始まった」という事実と「仕様・実装が変わった」という事実を分ける日である。sessionの主張は重要な先行signalだが、productionの互換性やsecurity境界を変える根拠になるのは、公開資料、SEP status、merged commit、tagged release、conformance testなど検証可能なartifactである。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>MCP Dev Summit Toronto — 10月5〜6日開催</strong><br>Linux Foundation公式scheduleでは、Torontoで2日間開催され、初日は9時30分EDTのopening remarksから始まる。40以上のsessionが予定され、MCP protocol、SDKと拡張、security・identity・trust、enterprise adoptionなどが議題である。</p><p><strong>事実：</strong>event開催とagendaは公式に確認できるが、開幕時点で新しいMCP仕様releaseやAAIF governance決定は公開されていない。<strong>分析：</strong>登壇内容をそのまま「標準化済み」として実装へ持ち込むのではなく、どのrepository、proposal、versionへ結び付くかを確認してから評価する必要がある。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>MCP — WATCH</strong><br>前回観測後の新規commitと正式releaseは確認できない。最新正式仕様は引き続き<code>2026-07-28</code>である。Summitで示される可能性のある方向性と、現在の互換性baselineを混同しない。</p><p><strong>A2A — WATCH</strong><br>新規commit・releaseはなく、最新specification releaseはv1.0.1のままである。MCPとの役割分担や相互運用に関する発表があっても、A2A version、SDK、TCK／ITKへの反映を別途確認する。</p><p><strong>agentgateway — WATCH</strong><br>v1.6.0以後の追加commitは観測期間内にない。routing、OIDC／JWT、cost tracking、MCP compatibility、graceful drainingはv1.6.0を評価基準とする。</p><p><strong>Agent Router — WATCH</strong><br>新規commit・releaseはなく、正式版はv1.1.0。main上のJSON Schema 5万node budgetなどが次のreleaseへ収録されるか継続確認する。</p><p><strong>goose — WATCH</strong><br>新規commitと正式releaseはなく、正式版はv1.52.0。AAIF公式project pageには10月2日付のGoose紹介が掲載されているが、release artifactの変更ではない。</p><p><strong>AGENTS.md — WATCH</strong><br>新規commitは確認できない。instruction formatやgovernanceの変更もない。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>Summitの情報を標準化の証拠として扱う際は、次の段階を区別する。<strong>①sessionでの問題提起、②公開proposal／SEP、③maintainer reviewとstatus変更、④specificationへのmerge、⑤tagged releaseとSDK反映、⑥conformance testとmigration guidance</strong>である。前半は方向性、後半は導入判断の根拠になる。</p><p>AAIFのWorking Groupsは共同作業の場だが、meeting予定や登壇者の見解だけでは採択済みpolicyにならない。議事録、charter、deliverable、Technical Committeeの正式決定へ到達した時点で、governance差分として記事へ反映する。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>注目点は、Agent protocolの議論が「接続できる」から<strong>trust、security、interoperability、observabilityを証明できる</strong>へ移っていることである。protocol proposalだけでなく、SDKのversion、Gatewayのpolicy、trace属性、conformance suiteが同じ変更を表現できなければ、本番運用では採用しにくい。</p><p>event起点の情報収集では、発表数を追うより、発表からartifactまでのtraceabilityを持つ方が価値が高い。各signalへsource、status、target version、reference implementation、test、security impactを付ければ、将来のrelease時に「何が正式化されたか」を機械的に照合できる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>Summit後のPoC更新は、発表内容を直接production設定へ反映せず、change intakeを通す。</p><ul><li>発表ごとに公式資料、repository、issue／SEP、ownerを記録する</li><li>採択状況とtarget protocol／SDK versionを確認する</li><li>MCP client、server、gatewayのcompatibility matrixへ影響範囲を追加する</li><li>認証・委譲・tool permission・schema validationへのsecurity影響をnegative testへ変換する</li><li>latency、token、tool error、policy decision、delegation hopに必要なtrace項目を定義する</li><li>reference implementationとconformance testが揃うまでexperimental laneで評価する</li><li>upgrade、rollback、旧version併存の手順をcanaryで検証する</li></ul><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>conferenceの価値は発表の多さではなく、翌日の設計・試験・監視へ変換できるかで決まる。正式artifactへ結び付かない情報は「仮説」として保持する。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>10月5〜6日の公式slides、session recording、発表資料</li><li>MCP Steering Committeeやmaintainerが示す次期specification timeline</li><li>新しいSEP、extension、SDK release、conformance要件</li><li>security・identity・trust sessionから生まれる正式proposal</li><li>MCPとA2Aの相互運用に関するreference implementation</li><li>agentgateway／Agent Routerへのprotocol変更の実装時期</li><li>AAIF Working Groupsの議事録、deliverable、Technical Committee決定</li><li>goose v1.53.0とAgent Router次期releaseの正式公開</li></ul>"
      }
    ],
    "sources": [
      [
        "MCP Dev Summit Toronto",
        "https://events.linuxfoundation.org/mcp-dev-summit-toronto/"
      ],
      [
        "MCP Dev Summit Toronto official schedule",
        "https://events.linuxfoundation.org/mcp-dev-summit-toronto/program/schedule/"
      ],
      [
        "MCP Dev Summit Toronto call for proposals and topic tracks",
        "https://events.linuxfoundation.org/mcp-dev-summit-toronto/program/cfp/"
      ],
      [
        "AAIF official site and events",
        "https://aaif.io/"
      ],
      [
        "AAIF Working Groups",
        "https://aaif.io/working-groups"
      ],
      [
        "AAIF Goose project page",
        "https://aaif.io/projects/goose"
      ],
      [
        "MCP official releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A official releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "agentgateway v1.6.0 release",
        "https://github.com/agentgateway/agentgateway/releases/tag/v1.6.0"
      ],
      [
        "Agent Router official releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "goose official releases",
        "https://github.com/aaif-goose/goose/releases"
      ]
    ]
  },
  {
    "date": "2026-10-04",
    "level": "LOW",
    "tags": [
      "Operations",
      "MCP",
      "A2A"
    ],
    "title": "大きな変更なし、Summit前の基準線を固定する",
    "summary": "仕様・release・securityの実質差分はなし。次の発表を正しく比較するため現状を記録する。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>前回レポート以降、AAIFと主要監視対象にruntime、正式仕様、governance、security advisoryとして報告すべき大きな変更は確認できなかった。</strong>変更があったのはMCP repositoryの開発dependency更新と、agentgatewayのCI／build cache周辺であり、production behaviorの変更とは扱わない。</p><p>ニュースが少ない日は、既知の最新版と未release変更を混ぜずに基準線を固定することが重要である。10月5〜6日のMCP Dev Summit Torontoを前に、現在の正式仕様・release・main上の差分を分けて記録しておけば、event後の発表を「新しい決定」「継続議論」「実装だけの先行変更」に分類できる。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>本日は重大ニュースなし。</strong>AAIF Technical Committeeの決定、新規project proposal、加入・卒業project、MCP／A2Aの新仕様release、追跡対象の新しいsecurity advisoryは確認できなかった。変更が少ないことを推測で補わず、前日のagentgateway v1.6.0とAgent RouterのJSON Schema node budgetを最新の重要差分として維持する。</p><p><strong>事実：</strong>MCPの最新正式仕様は<code>2026-07-28</code>、A2A specificationはv1.0.1、Agent Routerはv1.1.0、gooseはv1.52.0、agentgatewayはv1.6.0である。<strong>分析：</strong>週末に新規commitがないことは成熟度や停滞を意味しない。正式なartifactが変わっていない、という範囲に限定して判断する。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>MCP — LOW</strong><br>repositoryでは開発dependency groupとして<code>brace-expansion</code>と<code>markdown-it</code>が更新された。specification本文、schema、SEP process、conformance要件の変更ではないため、利用者向けprotocol updateには数えない。</p><p><strong>agentgateway — LOW</strong><br>Go dependencyの調整、CIでcache済みimageを強制利用する変更、GitHub Actions標準Go cacheを無効にして<code>GOCACHEPROG</code>へ寄せる変更が入った。いずれもbuild／CI効率に関する差分で、v1.6.0のrouting、authentication、MCP、rate limit、draining semanticsを変えるものではない。</p><p><strong>goose — WATCH</strong><br>前回レポート以降の新規commitは確認できなかった。repository mainでは1.53.0へ向けた変更が進んでいるが、最新正式GitHub Releaseは引き続きv1.52.0である。mainのversion表記だけを正式releaseとして扱わない。</p><p><strong>A2A — WATCH</strong><br>新規commitとreleaseは確認できず、最新正式specification releaseはv1.0.1のままである。前日のA2A CLI公式導線追加はdocumentation updateであり、protocol versionの更新ではない。</p><p><strong>Agent Router — WATCH</strong><br>新規commit・releaseは確認できなかった。前日確認したJSON Schema 5万node budgetはmain上の変更で、最新正式release v1.1.0への収録は未確認である。</p><p><strong>AGENTS.md — WATCH</strong><br>新規commitは確認できなかった。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIFのWorking Groups calendarには継続的なmeetingが掲載されているが、meeting予定と採択済みの標準・policyは区別する。本日の確認では、公開された議事録や正式決定として記事へ追加すべき差分はなかった。</p><p>MCP Dev Summit Torontoは10月5〜6日に開催予定である。eventのsessionや登壇者の発言を、そのまま仕様変更とみなしてはいけない。記事へ反映する基準は、公式release、SEP status、maintainer meeting notes、repositoryへのmerge、AAIF／Linux Foundationの正式発表である。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の技術的な示唆は、<strong>変更量と重要度を分離すること</strong>である。dependencyやCI cacheのcommit数が多くてもdata planeの挙動は変わらない。一方、前日のschema node budgetのような一つの小さなcommitがresource exhaustionへの防御境界を変えることがある。</p><p>Agentic Opsのwatchでは、commit数をactivity scoreとして扱わず、変更を「protocol」「control plane」「data plane」「security」「observability」「build／docs」に分類し、productionへの影響範囲を評価する必要がある。この分類を自動化すれば、ニュースの多さではなく運用判断に必要な差分へ集中できる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>大きな更新がない日を、PoCのbaseline取得に使う。</p><ul><li>agentgateway v1.6.0のimage digest、Helm chart version、CRD、既定値を保存する</li><li>Agent Router v1.1.0とmainを分け、JSON Schema負荷試験の結果を比較する</li><li>MCP <code>2026-07-28</code>とA2A v1.0.1を現在のcompatibility matrixへ固定する</li><li>gooseは正式v1.52.0とmain上の1.53系変更を別test laneにする</li><li>Prometheus／Alertmanager MCPの正常系trace、p95、token、tool error率を取得する</li><li>Summit後に同じtestを再実行し、protocol／SDK／Gatewayのどの層で差が出たか比較する</li><li>commitをruntime影響とbuild／docs変更へ自動分類し、後者だけの日はalert severityを下げる</li></ul><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>「変更なし」は空欄ではなく、比較可能なbaselineである。event前後で同じ試験を行える状態を作る。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>MCP Dev Summit Torontoで公開されるslides、meeting notes、SEP、release</li><li>MCP次期specificationの正式timelineとconformance要件</li><li>agentgateway v1.6.0の初期upgrade issueとpatch release</li><li>Agent RouterのJSON Schema budget修正を含む正式release</li><li>goose v1.53.0の正式releaseと収録change一覧</li><li>A2A CLIからSDK native実装へ移る公式adoption pattern</li><li>AAIF Working Groupsの公開議事録と採択済みdeliverable</li></ul>"
      }
    ],
    "sources": [
      [
        "MCP: update development dependencies",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/75db1e987cbbba6d170315dc99d0dfc440754aef"
      ],
      [
        "agentgateway: adjust Go dependency for CI cache",
        "https://github.com/agentgateway/agentgateway/commit/61dd06b4cdece2f73c056c85076a38f36e4d14c9"
      ],
      [
        "agentgateway: force cached images in CI",
        "https://github.com/agentgateway/agentgateway/commit/3f13ff3e6fa30f544e565e0817e70fd654f23aad"
      ],
      [
        "agentgateway: use GOCACHEPROG instead of GHA Go cache",
        "https://github.com/agentgateway/agentgateway/commit/a4a3ebb014fa27cf0309331b4bc45e4d1c9c5663"
      ],
      [
        "MCP official releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ],
      [
        "A2A official releases",
        "https://github.com/a2aproject/A2A/releases"
      ],
      [
        "Agent Router official releases",
        "https://github.com/theagentrouter/agent-router/releases"
      ],
      [
        "goose official releases",
        "https://github.com/aaif-goose/goose/releases"
      ],
      [
        "agentgateway v1.6.0 release",
        "https://github.com/agentgateway/agentgateway/releases/tag/v1.6.0"
      ],
      [
        "MCP Dev Summit Toronto",
        "https://events.linuxfoundation.org/mcp-dev-summit-toronto/"
      ]
    ]
  },
  {
    "date": "2026-10-03",
    "level": "HIGH",
    "tags": [
      "Operations",
      "Security",
      "MCP",
      "A2A"
    ],
    "title": "agentgateway v1.6.0、AI Gatewayを本番運用の部品へ",
    "summary": "正式版のrouting・認証・cost・drainingと、JSON Schema展開制限を運用目線で整理する。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>agentgateway v1.6.0が正式公開され、AI Gatewayの評価軸が「modelへ接続できるか」から「障害・認証・費用・更新を継続運用できるか」へ広がった。</strong>今回のreleaseはresilientなLLM routing、Kubernetesの<code>AgentgatewayModel</code> API既定有効化、主要modelのcost tracking、OIDC／JWT改善、MCP互換性、session affinity、API key単位のlocal rate limit、graceful draining、OpenTelemetry強化をまとめている。</p><p>同時にAgent Routerは、tool schemaの<code>$ref</code>を指数的に展開させる入力へ総node数の上限を追加した。Agentが生成するschemaも未信頼入力であり、深さ制限だけではCPUとmemoryの消費を抑えられないことが実装上明確になった。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>agentgateway v1.6.0 — 正式release</strong><br>2026年10月2日にDocker image、controller image、Helm chart、standalone chart、binaryが公開された。RCで予告されていた機能が正式版になったため、昨日までの「収録確認待ち」からupgrade評価へ段階が進んだ。</p><p>upgrade時にはbehavior changeへ注意する。Anthropic Messages requestはOpenAI Chat CompletionsではなくResponses形式を優先し、pathを含まないprovider base URLは<code>/</code>を使う。routingの変換先やupstream URLを固定的に想定したtest、cache hit率、tool call semantics、WAF ruleは再検証が必要である。</p><p><strong>事実：</strong>release noteはauthentication、MCP compatibility、cost tracking、draining、telemetryを正式機能として列挙している。<strong>分析：</strong>本番導入の判断はfeature有無ではなく、既存trafficをshadow／canaryで流し、認証継続、usage、cache、drain時の未完了taskを比較して行うべきである。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>agentgateway — HIGH</strong><br>正式版公開後もmainでは、Geminiのreasoning tokenをoutputと整合する形で計上する修正、Bedrock Converseで途中のsystem messageをcache prefixを壊さずuser reminderへ変換する修正、未知のcache-control blockを捨てない変更が入った。Helmには<code>rbac.create=false</code>が追加され、既存RBACを組織側で管理するclusterにも導入しやすくなった。これらrelease後のcommitは、v1.6.0へ含まれるとは限らない。</p><p><strong>Agent Router — HIGH</strong><br>JSON Schema変換には従来100階層のdepth limitがあったが、同じ定義への兄弟<code>$ref</code>は浅いschemaでも指数的に展開できた。修正ではdereferenceの二つの処理を通算して5万nodeのbudgetを共有し、超過時は500ではなくinvalid requestの422を返す。tool schemaはAgentや外部MCP Serverから到来し得るため、Gatewayのresource exhaustion防御として重要である。</p><p><strong>goose — MEDIUM</strong><br>Bedrockのcache input tokenをusageへ畳み込む際、serviceが返したtotalを保持する修正が入った。GitHub Copilot tokenが失効している場合、model一覧取得とAPI requestで一度だけrefreshする修正も行われた。AAIF公式ブログはGoose内蔵OpenTelemetryをJaegerへ送り、ClickHouseで永続化する手順を公開している。</p><p><strong>A2A — MEDIUM</strong><br>A2A CLIを公式siteの導入blogとhome pageから案内する変更が入った。A2A非対応AgentからCLIをtoolとして呼び出すbridge用途が公式導線になった。また<code>llms.txt</code>を再構成し、diagramのtext代替と詳細referenceを追加した。protocol仕様変更ではない。</p><p><strong>MCP / AGENTS.md — WATCH</strong><br>MCP coreは開発dependencyの更新のみで、正式仕様・governance・securityに新しい実質差分は確認できなかった。AGENTS.mdにも変更はない。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIF Technical Committee、project proposal、新規加入・卒業projectに新しい正式決定は確認できなかった。AAIF公式blogでは、shared service accountだけでは利用者のauthorization contextが失われるため、各hopのprincipal、delegationのscope、end-to-end auditを分けて考えるidentity modelが解説された。</p><p>これは採択済み標準ではなく、MCPを使う実装へ向けた設計指針である。Agent AからAgent B、MCP Server、GitHubや監視基盤へ処理が移るたびに、元の利用者、現在のactor、委譲された権限、判断したpolicyをtraceへ残せるかが論点になる。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の差分には、Agentic infrastructureをproductionへ移す三つの方向がある。第一は<strong>control plane化</strong>で、model catalog、routing、rate limit、session affinityを宣言的に管理する。第二は<strong>resource budget化</strong>で、request bodyやdepthだけでなく、schema展開node、token、connection、drain時間へ上限を持たせる。第三は<strong>end-to-end observability</strong>で、Agent内部のmodel callとtool callをGateway、downstream serviceまで同じtraceへ結ぶ。</p><p>AAIFのGoose例では、単に応答が遅いという事象をmodel、network、Agent処理へ分解し、traceを再起動後も残す。ホスティング運用では、Alertmanager通知からAgent判断、MCP tool、対象serverへの照会までを同じtrace IDで追える構成が実用上の目標になる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>Prometheus MCP、Alertmanager MCP、運用AgentをGateway配下へ置くPoCでは次を確認する。</p><ul><li>v1.5系とv1.6.0へ同じrequestをshadow送信し、provider選択、tool call、usage、error変換の差を比較する</li><li>pod終了時に新規requestを止め、streaming応答と長時間taskを規定時間内にdrainできる</li><li>session affinityが必要なtrafficとstateless trafficを分離し、replica障害時の再接続を確認する</li><li>Anthropic MessagesからResponsesへの変換後もcache hit率、reasoning token、原価がprovider請求と一致する</li><li>指数展開する<code>$ref</code>、巨大な兄弟properties、深いschemaを送り、422で終了しCPU・memoryが収束する</li><li>各delegation hopでuser、actor Agent、scope、policy decision、trace IDを記録する</li><li>Goose、Gateway、MCP Server、監視backendのspanをJaeger等で一本のtraceとして検索する</li><li><code>rbac.create=false</code>利用時、必要権限を事前定義し、chart upgradeで権限が暗黙追加されないことを検査する</li></ul><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>v1.6.0は正式版だが、無条件に置き換える合図ではない。behavior changeを含むため、protocol変換・cost・drainingを観測できるcanaryを先に作る。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>agentgateway v1.6.0のupgrade issue、patch release、既知のbreaking behavior</li><li>RC後／release後commitがv1.6.1へ収録される範囲</li><li><code>AgentgatewayModel</code> APIのproduction事例とmodel catalog更新運用</li><li>JSON Schema 5万node上限を含むAgent Router正式release</li><li>schema budgetの設定可能化とMCP tool schemaへの適用範囲</li><li>AAIF Identity &amp; Trust WGでのdelegation token・principal表現の具体化</li><li>GooseのOpenTelemetry semantic conventionsとcross-system trace correlation</li><li>10月5〜6日のMCP Dev Summit Torontoで公開される正式資料</li></ul>"
      }
    ],
    "sources": [
      [
        "agentgateway v1.6.0 release",
        "https://github.com/agentgateway/agentgateway/releases/tag/v1.6.0"
      ],
      [
        "Agent Router: limit JSON Schema nodes processed",
        "https://github.com/theagentrouter/agent-router/commit/06dd32cbf100c6bfa40aaa515db8f9eb9a10c314"
      ],
      [
        "agentgateway: count Gemini reasoning tokens",
        "https://github.com/agentgateway/agentgateway/commit/30623ac39f0694a10acd5fee3e572096da9139f7"
      ],
      [
        "agentgateway: preserve mid-stream system messages for Bedrock",
        "https://github.com/agentgateway/agentgateway/commit/4b90e79a3c488908e861aacb655787c346eec516"
      ],
      [
        "agentgateway: allow Helm installs without chart-created RBAC",
        "https://github.com/agentgateway/agentgateway/commit/fcc4fe921ee45ebf319efb4e773a133f03927672"
      ],
      [
        "goose: preserve Bedrock service total for cache input tokens",
        "https://github.com/aaif-goose/goose/commit/aa294302fe501b5c2bf6a196288530c3384f6b26"
      ],
      [
        "goose: refresh revoked Copilot token",
        "https://github.com/aaif-goose/goose/commit/b9db895a771dbed15d854b241c4cf77e6f89a538"
      ],
      [
        "AAIF: Trace and analyze Goose sessions with OpenTelemetry, Jaeger and ClickHouse",
        "https://aaif.io/blog/trace-and-analyze-goose-sessions-with-opentelemetry-jaeger-and-clickhouse"
      ],
      [
        "AAIF: Agent identity and delegated access in MCP systems",
        "https://aaif.io/blog/agent-identity-and-delegated-access-in-mcp-systems"
      ],
      [
        "A2A: introduce the A2A CLI on the official site",
        "https://github.com/a2aproject/A2A/commit/27860f6444aea9b27961fdf51a00a567ea59068f"
      ],
      [
        "A2A: improve llms.txt and text alternatives",
        "https://github.com/a2aproject/A2A/commit/65dadbd9b900fe2d970e05416eb432a91347cd2a"
      ]
    ]
  },
  {
    "date": "2026-10-02",
    "level": "HIGH",
    "tags": [
      "Security",
      "Operations",
      "MCP"
    ],
    "title": "長寿命Agent接続で、Identityを古くしない",
    "summary": "agentgateway v1.6 RCのOIDC更新、policy rotation、guardrail監査を運用視点で読む。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>Agentの接続が長く生きるほど、接続開始時の認証・policy・certificateを固定したままにしない設計が重要になる。</strong>agentgatewayは<code>v1.6.0-rc.1</code>を公開し、その直後のmainではOIDC refresh token、長寿命tunnel中のpolicy/certificate再読込、MCP guardrail判定のaccess log出力が進んだ。</p><p>これは単なるlogin UXの改善ではない。数時間から数日動くAgentで、失効済みidentityや古いegress policyを使い続ける時間を短くし、どのguardrailが通信を許可したかを事後検証できるようにする変更である。ただし現時点はRCとmain上の変更を含むため、production導入では正式版への収録を確認する。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>agentgateway v1.6.0-rc.1 — 最終RC</strong><br>公式releaseはv1.6系列の最後のpre-releaseとされ、Docker image、Helm chart、binaryが公開された。release noteでは翌日のv1.6.0を予定しているが、予定と公開済みreleaseは区別する。観測時点で正式v1.6.0は確認できない。</p><p><strong>OIDC sessionの自動更新</strong><br>browser sessionとは別に暗号化したrefresh cookieを保存し、同じpolicyとsubjectへ結び付けてaccess／ID tokenを更新する。並行requestによるrefreshはreplica内でまとめ、成功結果を30秒再利用する。複数replicaでrefresh tokenをrotationする場合、identity provider側にreuse grace periodがないと、遅いrequestが新しいcookieまで消す競合が起こり得る。<code>offline_access</code> scopeや、更新応答に新しい<code>id_token</code>が含まれることも前提になる。</p><p><strong>事実：</strong>token debug出力はID／refresh tokenをredactする。<strong>分析：</strong>HA環境では「refreshできる」だけでなく、rotation競合、logout、cookie鍵rotationまで障害試験へ含める必要がある。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>agentgateway — HIGH</strong><br>長寿命のsubstrate egress tunnelは、接続確立時に捕捉したfrontend policyを使い続けず、requestごとに最新policyを読むようになった。certificateやauthorization policyをrotationしてもtunnel再接続を待たず反映でき、policy／credential gRPC callへtrace contextも伝播する。</p><p>MCP guardrailが生成したdynamic metadataはaccess-log CELから参照できるようになり、たとえば<code>decision: allow</code>を監査logへ残せる。LLM usageはOpenAI／Anthropicなど呼出元APIの意味へ変換して返す一方、内部の正規化値とcost計算を維持する。OpenAPI backendが画像を返した場合はUTF-8文字列化せずMCP image contentとして返す修正も入った。</p><p><strong>Agent Router — HIGH</strong><br>高速JSON parserが返すmodel名は元のrequest／response bufferを参照するsubstringだった。metric attributeがその文字列を保持すると、大きなcontext本文全体が累積histogramに残り得るため、model名だけをcloneする修正が入った。さらに未対応endpointとbackend schemaの組合せは500ではなく422を返す。client設定不一致をserver障害SLOから分離できる一方、5xxだけをfallback条件にする構成は再確認が必要である。</p><p><strong>goose — MEDIUM</strong><br>ACP initialize応答へ実装済みprotocol versionを正しく記録する修正と、sessionを対話型HTML viewerへexportするCLI機能が入った。前者はclientとの互換性判定、後者は実行履歴の共有・reviewに効く。</p><p><strong>MCP — MEDIUM</strong><br>conformance repositoryのmaintainerが公式<code>MAINTAINERS.md</code>へ追加された。protocol wire changeではないが、SEPのobservable behaviorにconformance scenarioを要求する運用を担う責任主体が明確になった。</p><p><strong>A2A — LOW / AGENTS.md — WATCH</strong><br>A2Aはdocumentationのendpoint例を現在のAgent Card interfaceとmessage endpoint名へ合わせた。protocol変更や新releaseではない。AGENTS.mdには前回以降の実質的な変更を確認できなかった。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIF Technical Committee、Working Groups、project proposal、新規加入・卒業projectに新しい正式決定は確認できなかった。MCPではconformance maintainerの明文化が本日のガバナンス差分である。</p><p>既存のSEP guidelineでは、observableなprotocol behaviorを追加・変更するStandards Track SEPがFinalになる前に、SEP番号付きscenario、規範要件とcheckを対応付けるtraceability file、reference implementationでの合格が必要とされる。maintainer追加は、この制度を継続運用するreview ownershipの整備として読むべきで、仕様そのものの変更と混同しない。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>Agent infrastructureの状態管理は、短命HTTP request中心から<strong>継続的な再検証</strong>へ移っている。identityはrefreshし、policyとcertificateは長寿命connection中にも読み直し、guardrail decisionは監査可能なmetadataとして残す。usage metricもprovider固有のcache token semanticsを吸収しつつ、利用者向け表示と内部原価を分ける。</p><p>同時に、observability自身の資源消費が問題になる。model labelのような小さな値が巨大bufferを参照したままmetricへ保持されると、context長の拡大がGateway memoryへ直結する。trace・log・metricは可視化機能であると同時に、memory、機密情報、cardinalityを管理するdata planeである。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>MCP Gatewayと運用AgentのPoCでは、次を受け入れ条件へ加える。</p><ul><li>ID token expiryを短く設定し、sessionを切らずにrefreshできることと、subject／policy不一致を拒否すること</li><li>複数replicaへ同時requestを送り、refresh token rotationとreuse grace periodの競合を再現すること</li><li>長寿命HTTP/2 tunnelを維持したままcertificateとegress policyをrotationし、新しいrequestへ反映されること</li><li>MCP guardrailのallow／deny、rule名、trace IDをaccess logで相関できること</li><li>OpenAI／Anthropic形式のusage表示とprovider請求、内部cost metricを照合すること</li><li>最大context requestを連続送信し、metric labelが本文bufferを保持せずmemoryが収束すること</li><li>未対応backend schemaの422をclient error budgetへ分類し、必要なら明示的fallback ruleを設定すること</li></ul><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>長寿命接続の健全性は接続成立時だけでは判定できない。identity・policy・certificateが運用中に更新され、監査証跡へ残るところまでをSLOにする。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>agentgateway v1.6.0正式releaseとRC後の変更収録範囲</li><li>複数replicaでのrefresh token reuse grace period推奨値とlogout semantics</li><li>refresh cookie暗号鍵のrotation、旧鍵猶予、incident時の一括失効</li><li>long-lived tunnelでpolicy／certificate変更が反映される最大遅延</li><li>MCP guardrail metadataの標準field、機密情報redaction、SIEM連携</li><li>Agent Routerのmodel文字列clone修正を含む正式releaseと大規模context時のmemory profile</li><li>MCP conformance maintainer体制下でのscenario coverageとSEP traceability</li></ul>"
      }
    ],
    "sources": [
      [
        "agentgateway v1.6.0-rc.1 release",
        "https://github.com/agentgateway/agentgateway/releases/tag/v1.6.0-rc.1"
      ],
      [
        "agentgateway: add initial OIDC refresh flow",
        "https://github.com/agentgateway/agentgateway/commit/e951d942e638326bef679fd0132884fb4169820e"
      ],
      [
        "agentgateway: rotate egress policy and certificate on long-lived tunnels",
        "https://github.com/agentgateway/agentgateway/commit/5bc6301f737848c206f9f50e6a47386b44f04e90"
      ],
      [
        "agentgateway: expose MCP guardrail metadata to access logs",
        "https://github.com/agentgateway/agentgateway/commit/82d1fdfb85e183b758e83316825de4cfa7c84d35"
      ],
      [
        "agentgateway: translate token usage to caller API semantics",
        "https://github.com/agentgateway/agentgateway/commit/978ec2ca17b315eee2f54f16ae474d371655fe49"
      ],
      [
        "agentgateway: return OpenAPI image responses as MCP image content",
        "https://github.com/agentgateway/agentgateway/commit/910c29fe8a1d650cf0b02707c30796a09f93bccf"
      ],
      [
        "Agent Router: clone model names retained by metrics",
        "https://github.com/theagentrouter/agent-router/commit/b363db01624e2398e7979677d4afd02582c7a241"
      ],
      [
        "Agent Router: return 422 for unsupported endpoint and backend schema",
        "https://github.com/theagentrouter/agent-router/commit/97f56090bdbb5a57e40374a5d78099005cb78ab9"
      ],
      [
        "goose: report implemented ACP protocol version",
        "https://github.com/aaif-goose/goose/commit/920313e4ee26418258b07de124f23d10d9368b2a"
      ],
      [
        "goose: export sessions as interactive HTML",
        "https://github.com/aaif-goose/goose/commit/9012eac3b54d049d5065a3279579f39ec6c69a42"
      ],
      [
        "MCP: add conformance maintainers",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/81d3cb7353658591a4997a4eeadabb051ed322b0"
      ],
      [
        "MCP SEP guidelines: conformance test requirement",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/community/sep-guidelines.mdx"
      ],
      [
        "A2A: update endpoint examples to current interface",
        "https://github.com/a2aproject/A2A/commit/8d5f578fff525fbb57c50a1b53d7642a2c3b0c30"
      ]
    ]
  },
  {
    "date": "2026-10-01",
    "level": "HIGH",
    "tags": [
      "Security",
      "Operations",
      "MCP"
    ],
    "title": "AI Gatewayの予算制御は、既定では止めない",
    "summary": "ReferenceGrant失効時のcredential除去と、quota fail-open・原価計測の実装差分を追う。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>AI Gatewayの制御は、設定resourceが存在するだけでは成立しない。</strong>Agent Routerではcross-namespace backendへのReferenceGrantが失効しても、共有filter-config Secretに古いbackend・credential情報が残り得た経路が修正された。一方、QuotaPolicyは専用rate-limit serviceが到達不能な場合、既定ではfail-openとなりrequestを継続することが公式文書に明記された。</p><p>本日の焦点は新しいprotocol機能ではなく、認可変更をdata planeへ確実に伝播することと、予算制御が故障した際に通信を止めるか継続するかを運用者が明示的に選ぶことである。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>Agent Router — cross-namespace認可の伝播を修正</strong><br>GatewayControllerは従来、別namespaceの<code>AIServiceBackend</code>または<code>InferencePool</code>と、その<code>BackendSecurityPolicy</code> credentialを共有extproc filter-config Secretへ解決する際、ReferenceGrantを確認していなかった。HTTPRoute生成側には検査があったため、control plane内で認可判定が不一致だった。</p><p>修正後は両backend種別を同じReferenceGrant検査へ通す。grantを削除した場合は、AIGatewayRouteを<code>NotAccepted</code>にするだけでなく、HTTPRouteから未認可backendを除去し、Gatewayを再同期してfilter-config Secretから古いcredentialを落とす。別namespace Secretを参照するBackendSecurityPolicyもgrant変更時に再reconcileされる。</p><p><strong>事実：</strong>これはmain上の修正で、新しいsecurity advisoryや正式releaseは確認できない。<strong>分析：</strong>認可の安全性は作成時検査だけでなく、grant失効後にdata planeから権限情報が消えるまでの時間で評価すべきである。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>Agent Router — HIGH</strong><br>QuotaPolicyとusage-based rate limitingの役割が整理された。QuotaPolicyはbackend・model単位のplatform予算を全route・consumer横断で守る。usage-based rate limitingはroute上のclient allowanceを管理し、input/output別costや月・年windowも利用できる。QuotaPolicyにはRedisと専用AI Gateway rate-limit serviceが必要で、Helm chartは現時点で専用serviceを自動deployしない。<code>controller.quotaRateLimitFailureModeDeny</code>の既定値はfalseで、service障害時はquota enforcementを迂回してrequestを継続する。</p><p><strong>agentgateway — MEDIUM</strong><br>GCP Vertex AIのGemini model名は<code>google/</code>、<code>models/</code>、<code>publishers/google/models/</code>などのprefixを含むことがある一方、cost catalogはbare IDを使う。この差で価格を引けなかった問題を修正し、Vertexの場合だけprefixを除いて再検索する。正確なmodel名正規化は、token metricがあっても金額換算できない観測欠損を防ぐ。</p><p><strong>goose — MEDIUM</strong><br>Responses APIのusageからcache write tokenを読み取り、cache readと分けて記録する修正が入った。Ollamaでは<code>/api/show</code>からvision対応を検出し、非対応modelへ画像を誤送信しない。coreからNostr session共有機能と関連dependencyも削除された。repository上では1.53.0へのversion bumpがあるが、観測時点で正式GitHub Releaseは公開されていないため、いずれもmain上の変更として扱う。</p><p><strong>MCP / A2A / AGENTS.md — WATCH</strong><br>正式仕様、重大release、security advisoryに相当する新規差分は確認できなかった。MCPの最新正式仕様は引き続き2026-07-28である。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIF Technical Committee、project proposal、新規加入・卒業projectに新しい正式決定は確認できなかった。AAIFでは10月1日にIdentity &amp; Trust、Workflows &amp; Process Integration、Governance/Risk/Regulatory Alignment、Observability &amp; Tracing関連の会合が予定されているが、会合予定と採択済み決定は区別する。</p><p>10月5〜6日にはMCP Dev Summit Torontoが予定されている。仕様発表を先取りせず、meeting notes、SEP、正式releaseとして公開された変更だけを次回以降の記事へ反映する。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の差分は、Agentic Opsに必要な三つの会計を示す。第一は<strong>authorization accounting</strong>で、誰がどのnamespace resourceを参照できるかと、失効がdata planeへ反映されたかを追う。第二は<strong>budget accounting</strong>で、provider全体の予算とclient別allowanceを分離する。第三は<strong>token accounting</strong>で、input/outputだけでなくcache read/writeとmodel別単価を記録する。</p><p>この三つが分断されると、権限を失ったbackendが残る、quota service停止中に費用が増える、model名の差で原価がゼロに見える、といった運用事故になる。policy resource、enforcement service、metric pipelineを一つの制御系として検証する必要がある。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>Prometheus MCP、Alertmanager MCP、LLM backendをGateway配下へ置くPoCでは次を確認する。</p><ul><li>ReferenceGrantを削除後、HTTPRouteとfilter-config Secretから対象backend・credentialが規定時間内に消える</li><li>grant変更でBackendSecurityPolicyが自動再評価され、別のresource更新を待たない</li><li>quota専用serviceとRedisを停止し、fail-open／fail-closedの両方を意図どおり観測できる</li><li>予算保護を優先する経路では<code>quotaRateLimitFailureModeDeny=true</code>を検討し、可用性とのtrade-offをrunbook化する</li><li>provider予算とtenant allowanceを別dashboard・別alertとして管理する</li><li>Vertex model名のprefix違いでも単価が解決され、未知modelはゼロ円ではなく観測不能としてalertする</li><li>cache read/write tokenを分離し、cache導入前後の実原価を比較する</li></ul><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>quota objectがAcceptedでも予算が守られているとは限らない。enforcement service停止試験と、課金metricの照合までを受け入れ条件にする。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>cross-namespace ReferenceGrant修正を含むAgent Router正式release</li><li>grant失効からfilter-config更新までのlatencyと監査event</li><li>QuotaPolicy専用serviceのHelm統合、HA構成、Redis障害時の挙動</li><li>fail-openからfail-closedへ変更する際の既存traffic影響</li><li>Gemini以外のproviderでもmodel alias・prefixを跨いで正しく原価計算できるか</li><li>goose 1.53.0の正式releaseとcache write token計測の収録</li><li>10月5〜6日のMCP Dev Summit後に公開されるmeeting notes・SEP・release</li></ul>"
      }
    ],
    "sources": [
      [
        "Agent Router: require ReferenceGrant for cross-namespace backends in filter config",
        "https://github.com/theagentrouter/agent-router/commit/f8d9eec3318434e669f246e681c5496364bf6eda"
      ],
      [
        "Agent Router: clarify QuotaPolicy and token-based rate limiting",
        "https://github.com/theagentrouter/agent-router/commit/442b2ebd9fcf71956655e281f5086afa6a86b5e8"
      ],
      [
        "agentgateway: fix Gemini cost catalog lookup",
        "https://github.com/agentgateway/agentgateway/commit/dd7a4b32d352eed90a20f8719b4b3f0696513070"
      ],
      [
        "goose: read cache write tokens from Responses API usage",
        "https://github.com/aaif-goose/goose/commit/ff24a5e5f8addee526494d35c25665f4a09505c1"
      ],
      [
        "goose: detect Ollama vision support",
        "https://github.com/aaif-goose/goose/commit/ac15f938151bb8c0efd93ed9c2c1cf61298934bf"
      ],
      [
        "goose: remove Nostr session sharing from core",
        "https://github.com/aaif-goose/goose/commit/c2eb854c66b7d2f62677dde3284d0c6defadbfb4"
      ],
      [
        "goose: bump version to 1.53.0 on main",
        "https://github.com/aaif-goose/goose/commit/82b4398605d6c04d0011112e1e720ab16fcc8a63"
      ],
      [
        "AAIF Working Groups calendar",
        "https://aaif.io/working-groups/calendar"
      ],
      [
        "AAIF Events: MCP Dev Summit Toronto",
        "https://aaif.io/events"
      ],
      [
        "MCP official releases",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/releases"
      ]
    ]
  },
  {
    "date": "2026-09-30",
    "level": "HIGH",
    "tags": [
      "Security",
      "MCP",
      "Operations"
    ],
    "title": "MCP Gatewayの「安全な版」が判定できないとき",
    "summary": "新たなDoS advisoryの版情報矛盾と、無人Agentで顕在化した入力・秘密管理の境界を整理する。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>Agent Routerで、存在しないbackendや未初期化sessionを狙うMCP requestがExtProcをpanicさせる新しいsecurity advisoryが公開された。</strong>severityはMEDIUM、CVSS 5.3だが、認証不要・低難度で共有processを停止でき、同時接続をまとめて切断し得る。</p><p>さらに重要なのは、advisoryが影響範囲を<code>&lt;= 1.1.0</code>、修正版も<code>1.1.0</code>と記載している点である。両者は論理的に両立しない。最新releaseを使っているという事実だけで安全と判断せず、upstreamによるversion情報の訂正または修正commitの特定まで、入口側の緩和策を維持する必要がある。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>GHSA-76mr-h444-pcqq — MEDIUM / CVSS 5.3</strong><br><code>getCompositeSessionEntry</code>などのsession lookupが、未登録・削除済み・設定不備のbackendに対して<code>nil</code>を返す。二つのMCP handlerは戻り値を確認せずfieldへアクセスするため、Go runtimeのnil pointer panicが発生し、ExtProc service processが終了する。advisoryのPoCは、active sessionから存在しないbackendまたはrouteを指定するJSON-RPC requestを送る手順を示している。</p><p><strong>事実：</strong>2026年9月30日朝の確認時点でCVEは未割り当てで、advisory metadataのaffected rangeとpatched versionが矛盾している。また、前回以降にAgent Routerの正式releaseは確認できない。<strong>判断：</strong>v1.1.0を修正済みとも脆弱とも断定せず、MCP endpointの到達制御、未知backend名の早期拒否、ExtProcの再起動・分離を暫定対策とする。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>Agent Router — HIGH</strong><br>上記advisoryに加え、OpenAI streaming requestへ<code>stream_options.include_usage=true</code>を注入する処理が、重複した<code>stream_options</code> keyを残さないよう修正された。JSON parserごとに最初・最後のどちらのkeyを採用するかが異なる曖昧性をなくし、最後のobjectにある追加fieldを維持しながら一つのkeyへ正規化する。これは課金・usage観測の欠落や、解析結果とupstreamへ送るbodyの不一致を防ぐ変更である。</p><p><strong>goose — MEDIUM</strong><br>MCP elicitationはstdinがterminalでない場合に明示的に拒否し、pipeに待機している次の会話入力をform回答として誤消費しないようになった。ACPの無人実行では、macOS Keychainのauthorization promptが応答者不在で無期限blockし得ることも文書化され、<code>GOOSE_DISABLE_KEYRING=1</code>と環境変数credentialの利用が案内された。</p><p>Bedrock streamingでは<code>max_tokens</code>でtool call JSONが途中切断された場合、未完了tool blockを失敗requestとしてflushし、output token limit到達をmetadataとusageへ残す。黙って不完全なtool callを進めるのではなく、Agentが再試行・task分割・上限変更を判断できる。CIでは主要GitHub Actionsのtag指定がcommit SHA固定へ置き換えられた。</p><p><strong>agentgateway — MEDIUM</strong><br>JWKSを直接URLで指定する構成では<code>BackendRef</code>がnilになり得るが、ReferenceGrant確認が無条件に参照してpanicしていた。nil checkとpolicy/backend双方の回帰testが追加された。</p><p><strong>MCP / A2A / AGENTS.md — WATCH</strong><br>MCPとAGENTS.mdに正式仕様変更はなく、A2Aはlink checker修正のみでprotocol変更ではない。新規releaseやsecurity advisoryも確認できなかった。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIF Technical Committee、Working Groups、project proposal、新規加入・卒業projectに、新しい正式決定は確認できなかった。AAIFの公式project一覧もMCP、goose、AGENTS.mdの構成を維持している。</p><p><strong>分析：</strong>今回のadvisory metadataの矛盾は、security情報そのものをmachine-readableな運用入力として扱う難しさを示す。SBOM scannerやpolicy engineがaffected rangeだけを読む場合とpatched versionだけを読む場合で判定が分かれる。標準化ではprotocol conformanceだけでなく、advisory schemaの整合性検査、訂正履歴、修正commitとのtraceabilityも供給網の要件になる。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の変更は、<strong>境界で曖昧さを残さない</strong>という同じ方向を向いている。MCP session lookupのnil、JSONの重複key、pipeと対話入力の混在、未完了tool call、URL指定時のnil BackendRefはいずれも、正常系では隠れる曖昧な状態である。</p><p>Agentic systemはLLM出力、protocol変換、terminal、credential store、Kubernetes resourceを連結するため、一層の曖昧さが別層の命令や秘密情報として解釈されやすい。入口で型・存在・入力channelを確定し、失敗をrequest単位の構造化errorとして返し、process全体へ拡大させない設計が重要になる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>運用AgentやMCP GatewayのPoCでは、次を受け入れ条件へ加える。</p><ul><li>未知・削除済みbackend、期限切れsession、初期化途中sessionを送り、4xxまたはJSON-RPC errorで終わること</li><li>handler panicをprocess境界で回復し、tenantまたはrouteごとに障害半径を分離すること</li><li>advisoryのaffected rangeとpatched versionを自動比較し、矛盾時は安全側に倒して人手確認へ送ること</li><li>重複JSON keyを拒否または正規化し、policy評価bodyとupstream送信bodyを一致させること</li><li>非TTY実行でelicitationを開始せず、queued stdinを次の会話turnとして保持すること</li><li>無人ACPではKeychain promptを使わず、短命credentialまたは専用secret注入を使うこと</li><li>tool call切断を成功扱いせず、finish reasonと失敗tool requestをtraceへ残すこと</li><li>JWKS URL、BackendRef、ReferenceGrantの全組合せをcontroller testへ含めること</li></ul><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>version scannerの緑表示より一次advisoryの整合性を優先する。安全版が一意に決まらない間は、到達制御とprocess分離を解除しない。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>GHSA-76mr-h444-pcqqのversion range訂正、CVE割り当て、修正commitの公開</li><li>Agent Router次期releaseへのMCP nil checkと重複JSON key修正の収録</li><li>ExtProcのpanic recoveryとmulti-tenant障害分離</li><li>gooseの非TTY elicitation errorをACP clientがどう表示・回復するか</li><li>Keychainを使わない無人Agent向けcredential brokerの整備</li><li>Bedrock以外のproviderでも途中切断tool callを同じsemanticsで扱えるか</li><li>AAIF Security／Identity &amp; Trust WGでのadvisory整合性・credential運用指針</li></ul>"
      }
    ],
    "sources": [
      [
        "GHSA-76mr-h444-pcqq: nil session entry checks missing in MCP handlers",
        "https://github.com/theagentrouter/agent-router/security/advisories/GHSA-76mr-h444-pcqq"
      ],
      [
        "Agent Router: de-duplicate stream_options.include_usage",
        "https://github.com/theagentrouter/agent-router/commit/abe39a35f4b66a866eace751f644f9842beceff5"
      ],
      [
        "goose: require a terminal for elicitation input",
        "https://github.com/aaif-goose/goose/commit/a1097dc6a2f4223f2d5f5100ea0777a1180b99c1"
      ],
      [
        "goose: warn about keyring hang in unattended ACP environments",
        "https://github.com/aaif-goose/goose/commit/7b72e902a3a58014270af91165fef5f4dfa17c2c"
      ],
      [
        "goose: report Bedrock max_tokens truncation and flush tool calls",
        "https://github.com/aaif-goose/goose/commit/9d57bad41c1e49ce7852da0f266a1821f2cb075e"
      ],
      [
        "goose: pin remaining GitHub Actions to commit SHAs",
        "https://github.com/aaif-goose/goose/commit/8171db0c9dae3f846c3aab866519e8ce19f514a4"
      ],
      [
        "agentgateway: fix JWKS direct URI nil pointer",
        "https://github.com/agentgateway/agentgateway/commit/a99934fd313f1ba2162a2e48c2c98c78da827244"
      ],
      [
        "AAIF official project list",
        "https://aaif.io/projects"
      ]
    ]
  },
  {
    "date": "2026-09-29",
    "level": "HIGH",
    "tags": [
      "Security",
      "MCP",
      "Operations"
    ],
    "title": "MCP sessionを暗号化するだけでは、利用者境界は守れない",
    "summary": "subject bindingとランダムseed、未信頼repository対策から、Agent実行基盤のidentity境界を考える。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>MCP session tokenを暗号化していても、全環境が同じ公開seedを使えば利用者境界は成立しない。</strong>Agent Routerではsession再開時にrequest subjectを必ず照合する修正に加え、Helm chartが使っていた<code>default-insecure-seed</code>を廃止し、installごとに64文字のランダムseedを生成する修正がmainへ入った。</p><p>公開seedを知る者は、観測した<code>Mcp-Session-Id</code>を復号し、subjectを差し替えて再暗号化できるため、subject checkだけを追加しても迂回できる。identityをtokenへ結び付ける処理と、tokenを保護する鍵管理は一体で設計する必要がある。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>Agent Router — MCP sessionのsubject binding</strong><br>session再開時に、保存されたsessionのsubjectと現在のrequest subjectを照合するよう変更された。session IDを知っているだけで別利用者がsessionを再開する経路を閉じるための修正である。</p><p><strong>Helm chart — session encryption seedの安全化</strong><br>seed未指定時はinstall時にランダム値を生成し、専用Kubernetes Secretへ保存する。upgradeでは<code>lookup</code>により同じSecretを再利用し、controllerへはDeployment引数ではなく環境変数で渡す。GitOpsの<code>helm template</code>ではlookupが使えないため、利用者管理Secretを指定する<code>existingSecret</code>も追加された。</p><p>旧chartの既定seedから更新すると既存MCP sessionは一度失効する。可用性のために公開seedをfallbackへ残すことは可能だが、security上は短い移行期間に限定すべきである。これらはmain上の変更であり、次期正式releaseへの収録を確認する必要がある。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>goose — HIGH</strong><br>review機能がrepository設定の<code>diff.external</code>を実行しないよう、すべての<code>git diff</code>へ<code>--no-ext-diff</code>を追加した。未信頼repositoryをreviewしただけで外部commandが起動する経路を閉じるsecurity修正で、commitはGHSA-6mg9-3cvh-9939への対応と明記している。advisory本文は現時点で公開一覧から確認できないため、影響version・severityは未確認として扱う。</p><p>model metadataはmodels.devからlive取得し、失敗時はbundled catalogへfallbackする方式へ進んだ。15秒timeout、32 MiB上限、ETag、atomic cache、空catalog・重複ID検証を備える。GDK Provider APIにもmodel discoveryが追加された。</p><p><strong>MCP — MEDIUM</strong><br>Ruby SDKがTier 2からTier 1へ昇格した。2025-11-25と2026-07-28の要件セットに対しserver 67/67、client 50/50のconformance、issue triage、policy整備などが根拠として示されている。</p><p><strong>agentgateway — LOW</strong><br>CELによるbody変換結果がnullの場合、upstream bodyを消去せず元のbodyを維持する修正が入った。backend CEL contextからservice workload endpointを除外する整理も行われた。</p><p><strong>A2A / AGENTS.md — WATCH</strong><br>前回観測後、正式仕様・重大release・security advisoryに相当する新しい差分は確認できなかった。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p><strong>MCPのSEP提出プロセスが変更された。</strong>SEP pull requestを開く前に、関連WGまたはIGのDiscord、meeting notes、GitHub Discussionで提案を議論し、そのlinkをPRへ記載することが必須になった。事前議論のないSEPは受理されない。またrepositoryがSEP PRを受け付けるのはcollaboratorのみであることも明記された。</p><p>これは仕様案をPRへ直接持ち込む方式から、WG・IGで問題設定と支持を確認してからformal processへ進む方式への変更である。レビュー負荷と重複提案を減らす一方、外部提案者は適切なgroupとcollaboratorへ到達する導線が必要になる。</p><p>AAIF全体のTechnical Committee、新規project proposal、加入・卒業projectについて、これ以外の正式変更は確認できなかった。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>本日の差分には二つのtrust boundaryがある。一つはnetwork sessionで、token暗号化、鍵のentropy、subject binding、rotationが揃って初めてidentity境界になる。もう一つはlocal repositoryで、Agentが読むcodeだけでなく<code>.git/config</code>やhook、external diffもuntrusted inputとして扱う必要がある。</p><p>またmodel catalogのlive更新により、binaryを更新せず新model・価格・能力へ追随できる一方、remote metadataがAgentのmodel選択やcost計算へ影響する。size limit、schema validation、cache、bundled fallbackを備えた段階的な外部データ取り込みが標準パターンになりつつある。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>ホスティング運用のMCP Gateway・運用Agent PoCでは、次を確認する。</p><ul><li>異なる利用者のtokenで同一MCP sessionを再開できない</li><li>session seedを環境ごとに生成し、Secret managerまたはKubernetes Secretで管理する</li><li>seed rotation時のsession失効、rollback、監査手順をrunbook化する</li><li>GitOps renderごとにseedが変わらないよう既存Secretを明示する</li><li>未信頼repositoryでgit hook、fsmonitor、diff.external、textconvが実行されない</li><li>remote model catalogが取得不能・巨大・破損・空でもbundled dataで安全に継続する</li><li>model metadataの取得元、ETag、更新時刻を監査ログへ残す</li></ul><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>暗号化済みtokenという表示だけで安全と判断しない。誰が鍵を知り、どのidentityへ再利用でき、rotation時に何が止まるかまで確認する。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Agent Routerのsession修正を含む正式releaseとsecurity advisory</li><li>公開既定seedを拒否して起動失敗にするhardening</li><li>goose GHSA-6mg9-3cvh-9939の公開advisoryと影響version</li><li>models.dev live catalogの署名・provenance・rollback方法</li><li>MCP SEP事前議論ルールによるproposal throughputの変化</li><li>Ruby SDK Tier 1のrelease追随速度とproduction事例</li></ul>"
      }
    ],
    "sources": [
      [
        "Agent Router: bind resumed MCP sessions to request subject",
        "https://github.com/theagentrouter/agent-router/commit/0d1e73037076d72251342d0ea578a36ffb7002c7"
      ],
      [
        "Agent Router: generate random session encryption seed in Helm",
        "https://github.com/theagentrouter/agent-router/commit/994579660ae2a9f2feef3cb77766e155746858b4"
      ],
      [
        "goose: remediate external git diff security issue",
        "https://github.com/aaif-goose/goose/commit/3fbea00fd44f6496ee4afe2b8b2897c3c95d63e9"
      ],
      [
        "goose: live models.dev metadata with bundled fallback",
        "https://github.com/aaif-goose/goose/commit/4dea9b483efbd2541d43500b8ed3c044c65e6d2f"
      ],
      [
        "goose GDK: add model discovery to Provider API",
        "https://github.com/aaif-goose/goose/commit/c30c6d160e900e126d587a06875d764b99d0e377"
      ],
      [
        "MCP: require WG or IG discussion before SEP submission",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/b3e2cc7a137f9c7d4335399300ad576cc4a66b68"
      ],
      [
        "MCP: promote Ruby SDK to Tier 1",
        "https://github.com/modelcontextprotocol/modelcontextprotocol/commit/70480219e37e33ac0f7ec286779e24c4b58e1950"
      ],
      [
        "agentgateway: preserve upstream body on null CEL result",
        "https://github.com/agentgateway/agentgateway/commit/c9573ed1a2664b2415d6b60994e7fe0b966bdd76"
      ]
    ]
  },
  {
    "date": "2026-09-28",
    "level": "HIGH",
    "tags": [
      "Security",
      "MCP",
      "Operations"
    ],
    "title": "MCP GatewayでSecretをSecretのまま扱う",
    "summary": "HTTPRouteへのAPI key露出とToolCall起因の共有プロセス停止から、Agent Gatewayの秘密管理と障害分離を考える。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>Agent Gatewayの安全性は、Secretを受け取れるかではなく、受け取ったSecretを非機密resourceやログへ展開しないかで決まる。</strong>前回観測後、Agent Routerからさらに2件のsecurity advisoryが公開された。MCP backend用API keyを生成HTTPRouteへ平文で埋め込む問題と、tool call IDの欠損により共有extproc processをpanicさせられる問題である。</p><p>いずれも旧称Envoy AI Gatewayの0.4.0〜0.7.0が対象で、advisory上の修正版は1.0.0。最新正式release v1.1.0は修正済みの範囲だが、0.x imageが残る検証環境、manifest、private registryの棚卸しは引き続き必要である。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>GHSA-3x83-9r4x-q3px — MEDIUM / CVSS 6.5</strong><br><code>MCPRoute</code>がbackend API keyをSecret参照で受け取っても、controllerが値を解決し、生成する<code>HTTPRoute</code>のheader modifierまたはquery parameterへ平文で埋め込んでいた。HTTPRouteのread権限はSecretより広く付与されやすく、etcd暗号化の対象にも通常含まれない。query parameter方式ではEnvoyや中間proxyのaccess logにも残り得る。つまりSecret RBACを迂回してcredentialを参照できる経路が生まれる。</p><p><strong>GHSA-5gx6-2mh3-32v4 — HIGH / CVSS 7.5</strong><br>OpenAI形式のtool callにIDがないrequestをAnthropic、Bedrock-Anthropic、Gemini backendへ変換すると、pointerの未検証dereferenceでpanicする。gRPC recovery interceptorやprocess-level recoverがないため、攻撃対象requestだけでなくpod上の全tenantが利用するextproc processが停止する。境界入力の一項目欠損が共有data plane障害へ拡大する問題である。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>Agent Router — HIGH</strong><br>上記2件のadvisoryを確認した。前日に公開された4件と合わせ、0.x系について入力上限、SSE解析、credential配置、ログredaction、Kubernetes namespace境界、panic recoveryを一括で見直す必要がある。今回の観測期間に新しい正式releaseはなく、最新版はv1.1.0のままである。</p><p><strong>agentgateway — MEDIUM</strong><br>管理UIでvirtual API keyを作成する際、raw keyではなくSHA-256 hashを保存する方式が標準になった。raw keyは作成直後に一度だけ表示され、以後はhintのみを表示する。HTTPSまたはlocalhostでWeb Crypto APIが利用できない場合はraw保存へfallbackするため、UIを安全なoriginで提供することも要件になる。</p><p><strong>MCP / A2A / goose / AGENTS.md — WATCH</strong><br>前回観測後、正式仕様、重大release、security advisoryとして報告すべき追加差分は確認できなかった。agentgatewayではIstio依存関係の更新も行われたが、利用者向けの機能変更としては扱わない。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIF Technical Committee、Working Groups、project proposal、新規加入・卒業projectについて、新しい正式決定は確認できなかった。今回の問題はMCP protocolではなく、Gateway controllerがcredentialを別resourceへ変換する実装と、protocol translationの入力検証に属する。</p><p><strong>分析：</strong>MCPやA2Aの標準適合試験に加えて、SecretがどのKubernetes object、xDS config、log、metricへ複製されるかを追跡するcredential lineageが必要である。仕様上正しい通信でも、control plane内で秘密情報が広いread権限へ変換されれば安全とは言えない。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>二つの更新は、credentialの扱いに対照的な方向を示す。Agent Routerの旧実装はSecretを取得後にHTTPRouteへ平文展開した一方、agentgatewayは照合に必要なhashだけを保存し、raw keyを再表示できない設計へ進んだ。</p><p>理想は、Gateway controllerがcredential本体をresource specへ書かず、Secret参照、専用credential provider、短命token、workload identityをdata planeへ安全に解決させる構成である。またprotocol translatorは外部入力を完全とは仮定せず、required field validationとpanic recoveryを二重に持つ必要がある。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>ホスティング運用でMCP GatewayをPoCする場合、次の検査を追加する。</p><ul><li><code>kubectl get httproute -A -o yaml</code>等の生成resourceにtokenやAPI keyが含まれない</li><li>etcd backup、GitOps diff、Kubernetes audit event、proxy access logへcredentialが複製されない</li><li>API keyはhash保存または外部Secret store参照とし、作成時以外はraw値を表示しない</li><li>tool callのID、name、argumentsを欠損・null・異常型にしてもrequest単位の4xxで終了する</li><li>translator panicをprocess境界でrecoverし、一つのtenant入力が他tenantへ波及しない</li><li>旧0.x imageをregistry、Helm values、検証cluster、開発端末まで含めて検索する</li></ul><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>SecretをSecret objectへ置くだけでは不十分。controllerが生成する全resourceとlogを含め、平文credentialの到達先を実測する。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>追加2件へのCVE割り当てと詳細なupgrade guidance</li><li>Agent Routerのpanic recovery、required field validationの回帰試験</li><li>MCP backend credentialをHTTPRouteへ埋め込まない現行実装の設計</li><li>agentgatewayのhashed key管理がAPI・CLIでも一貫するか</li><li>短命credential、SPIFFE、workload identityによるstatic key削減</li><li>AAIFでのcredential lineageとmulti-tenant isolationの共通指針</li></ul>"
      }
    ],
    "sources": [
      [
        "GHSA-3x83-9r4x-q3px: MCP backend API key in HTTPRoute spec",
        "https://github.com/theagentrouter/agent-router/security/advisories/GHSA-3x83-9r4x-q3px"
      ],
      [
        "GHSA-5gx6-2mh3-32v4: ToolCall ID nil dereference DoS",
        "https://github.com/theagentrouter/agent-router/security/advisories/GHSA-5gx6-2mh3-32v4"
      ],
      [
        "agentgateway: support and default to hashed keys",
        "https://github.com/agentgateway/agentgateway/commit/7e47ceb576aa9d3300cb0d2c7c35848fb0af048f"
      ],
      [
        "agentgateway: bump Istio dependency",
        "https://github.com/agentgateway/agentgateway/commit/e10197ad4884a2971807ccc97763d46f813ea907"
      ]
    ]
  },
  {
    "date": "2026-09-27",
    "level": "HIGH",
    "tags": [
      "Security",
      "MCP",
      "Operations"
    ],
    "title": "Agent Routerの4件の脆弱性が示す、MCP Gatewayの防御境界",
    "summary": "MCPの巨大POST、Secret書き込み、SSE解析、APIキーログ露出から、Gateway運用で必要な多層防御を整理する。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>Agent Routerから4件のsecurity advisoryが2026年9月27日（日本時間）に公開された。</strong>対象は旧称Envoy AI Gatewayの0.3.0〜0.7.0で、修正版は1.0.0とされている。現在の最新正式releaseはv1.1.0のため、1.xへ更新済みなら各advisory上は修正済みだが、旧版を残す検証環境や固定imageは直ちに棚卸しが必要である。</p><p>内容はMCP POST bodyによるmemory exhaustion、Kubernetesのlabelを悪用したAPI-key Secretの別namespaceへの書き込み、Anthropic SSE indexによる巨大allocation、<code>aigw run</code>のログへの平文API key出力である。単一の実装不備ではなく、入力・identity・stream・secretというGatewayの四つの境界にまたがる。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>GHSA-43xg-mvg9-qwpq — HIGH / CVSS 7.5</strong><br>MCP proxyがPOST bodyを上限なしで<code>io.ReadAll</code>していた。ネットワークから到達できる攻撃者は巨大bodyでextproc sidecarをOOM killし、同じpodを共有するAI Gateway全体を停止させられる。認証前にbodyを読む経路であり、securityPolicy未設定のMCPRouteでは未認証攻撃が可能と説明されている。</p><p><strong>中程度の3件</strong><br>ラベルを偽装したPod・Deployment・DaemonSetのnamespaceがfilter-config Secretの書き込み先として使われ、API keyを含むSecretが攻撃者側namespaceへ生成され得る問題、悪意あるAnthropic互換upstreamがSSEの<code>index</code>を巨大値・負値にしてOOMまたはpanicを起こす問題、<code>aigw run</code>が平文API keyを含む全configをInfo logへ出す問題が公開された。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>Agent Router — HIGH</strong><br>正式advisoryとは別にmainではMCP認可が強化された。CEL式の評価エラーをrule不一致として後続Allowへ通すのではなく、対象source・targetが一致する場合はdenyするfail-closedへ変更された。また、CELで<code>request.auth.jwt</code>を参照するauthorization・backend selectionにはOAuthを必須とし、未検証JWTのclaimで認可や接続先を操作できないようにした。BackendSecurityPolicyが別namespaceのSecretを参照する場合にはReferenceGrantも必須化され、release noteでbreaking changeとして告知すべき変更と明記されている。</p><p>observabilityではGenAI metricsへ<code>gen_ai.backend</code>が追加された。同じOpenAI互換schemaを持つ複数backendでも、error rate・latency・token usageを<code>namespace/name</code>単位で区別できる。</p><p><strong>agentgateway — LOW</strong><br>Substrateのactor identity変更後に壊れていたegress認可とcredential injectionを、新しいSPIFFE URIへ追随させる修正を確認した。model catalogの自動更新も行われた。</p><p><strong>MCP / A2A / goose / AGENTS.md — WATCH</strong><br>前回記事以降、正式仕様・重大release・新規security advisoryとして扱う追加変更は確認できなかった。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIF Technical Committee、Working Groups、project proposal、新規加入・卒業projectについて、新しい正式決定は確認できなかった。今回のadvisoryはAgent Router実装のsecurity情報であり、MCP仕様そのものの脆弱性とは区別する。</p><p><strong>分析：</strong>一方で、MCP Gatewayを共通基盤として運用する際に必要な実装要件は明確になった。protocol準拠だけでは不十分で、HTTP body上限、stream fieldの範囲検証、JWT検証済み状態の伝播、Kubernetesのnamespace境界、secret redactionまでconformanceの外側で確認する必要がある。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>Agent Gatewayでは「認証を付けたから安全」では足りない。今回の事例を防御層へ対応させると、入口のrequest size・timeout、認可式のfail-closed、upstream responseをuntrustedとするparser制限、Kubernetes ReferenceGrantとnamespace-scoped RBAC、ログのsecret redactionが必要になる。</p><p>また、<code>gen_ai.provider.name</code>だけではOpenAI互換backendを識別できないため、実backendを示すmetric attributeが追加された。マルチbackend構成では、セキュリティイベントとSLOを同じbackend identityで追跡できることが重要になる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>Prometheus MCPやAlertmanager MCPをGateway経由で公開するPoCでは、次を受け入れ条件へ追加する。</p><ul><li>MCP POST body上限とrequest timeoutをGateway・sidecarの両方へ設定する</li><li>欠損fieldや型不一致でCEL評価を失敗させ、必ずdenyになることを試験する</li><li>JWT claimを使うrouteでは署名・issuer・audience検証なしに設定を受理しない</li><li>巨大・負のSSE index、途中切断、CRLF framingを含むhostile upstream試験を行う</li><li>controllerのListとSecret書き込みをnamespaceで制限し、cross-namespace参照にはReferenceGrantを要求する</li><li>CI artifact、support bundle、Info logにAPI keyが残らないことを自動検査する</li></ul><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>最初に確認すべきは、稼働・検証・手元環境を含め0.x imageが残っていないかである。1.x移行後も、同種の回帰を検出するnegative testを継続する。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>4件のadvisoryにCVEが割り当てられるか</li><li>main上のCEL・JWT・ReferenceGrant修正を含む次期正式release</li><li>MCP request body上限値とupgrade guidanceの公式文書化</li><li><code>gen_ai.backend</code>のOpenTelemetry semantic conventionsへの扱い</li><li>agentgateway v1.6.0の正式releaseとidentity・catalog互換性</li><li>AAIF SecurityまたはIdentity & Trust WGでの共通ガイドライン化</li></ul>"
      }
    ],
    "sources": [
      [
        "GHSA-43xg-mvg9-qwpq: Unbounded MCP POST Body Memory Exhaustion",
        "https://github.com/theagentrouter/agent-router/security/advisories/GHSA-43xg-mvg9-qwpq"
      ],
      [
        "GHSA-4mj2-4v82-3m96: Cross-namespace API-key Secret write",
        "https://github.com/theagentrouter/agent-router/security/advisories/GHSA-4mj2-4v82-3m96"
      ],
      [
        "GHSA-vgp6-h389-r473: Unbounded SSE index allocation",
        "https://github.com/theagentrouter/agent-router/security/advisories/GHSA-vgp6-h389-r473"
      ],
      [
        "GHSA-qv6v-2357-v3gm: API keys exposed in logs",
        "https://github.com/theagentrouter/agent-router/security/advisories/GHSA-qv6v-2357-v3gm"
      ],
      [
        "Agent Router: CEL evaluation errors fail closed",
        "https://github.com/theagentrouter/agent-router/commit/ec0f9817114f4927331a1e3b2e4af2c2c1627495"
      ],
      [
        "Agent Router: require OAuth for JWT-dependent CEL",
        "https://github.com/theagentrouter/agent-router/commit/32add09382ed7e6cbdd0c20b278b1a1c128a578a"
      ],
      [
        "Agent Router: require ReferenceGrant for cross-namespace Secrets",
        "https://github.com/theagentrouter/agent-router/commit/780fcf46b2a39a42b2c4cf67c987b318a86b77b6"
      ],
      [
        "Agent Router: add gen_ai.backend metric attribute",
        "https://github.com/theagentrouter/agent-router/commit/00883b5859dbcca374d7561a3bff117fca18563f"
      ],
      [
        "agentgateway: fix Substrate egress identity handling",
        "https://github.com/agentgateway/agentgateway/commit/9e78d1da3286dbca730b33e243cd8e153c773751"
      ]
    ]
  },
  {
    "date": "2026-09-26",
    "level": "HIGH",
    "tags": [
      "Operations",
      "Security",
      "MCP"
    ],
    "title": "Agent Routerで露呈した、AI Gatewayの障害半径",
    "summary": "異種リスナー混在時の制御面障害とストリーム処理のメモリ改善から、Agent Gatewayの本番運用設計を考える。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>AI Gatewayの成熟度は、対応モデル数よりも「一つの異常を制御面全体へ波及させないか」で測る段階に入った。</strong>Agent Routerでは、HTTP Connection Managerを持たないTCP・UDP用filter chainを正常な構成として読み飛ばさず、変換エラーとして扱っていた問題が修正された。</p><p>HTTP推論GatewayとTCP・UDP Gatewayを同じcontrol planeで扱う構成では、この問題によりxDS変換全体が失敗し、すべてのGatewayが<code>Programmed=False</code>となり、dataplaneが不正な設定を拒否して再起動を繰り返す可能性があった。修正後はHTTP filterを挿入できないchainだけをskipし、HTTP chainへの処理を継続する。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p><strong>Agent Router — 制御面の障害分離</strong><br>修正は、HCMが存在しないことを示すsentinelだけをskip条件とし、将来発生し得る本物のエラーは握りつぶさない。TCP proxy chainとHCM chainが混在するlistenerを使った回帰テストも追加された。単なるnil-checkではなく、正常な異種構成と異常を区別する変更である。</p><p><strong>Anthropic streaming — メモリ使用量の改善</strong><br>stream chunkをfoldする処理が、増え続けるtext・thinking・tool argumentsを毎回連結し、長い応答で二次的にallocationを増やしていた。<code>strings.Builder</code>を使う修正では、1 MiB・8,192 deltaの計測で累積allocationが約4.33 GB/opから約8.05 MB/opへ減少したと報告されている。これはmaintainerの限定的なbenchmarkであり一般性能を保証しないが、長時間streamをtraceするgatewayには重要な改善である。</p><p>同時に、Anthropicのusage情報を参照共有したまま更新し、元chunkや先に返したresponseのtoken数まで変えてしまう問題も修正された。observabilityと課金・quota判断の基礎データを守るcorrectness修正として重要である。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>Agent Router — HIGH</strong><br>異種listenerによるcontrol plane障害、Anthropic streamの二次allocation、usageのmutationを修正した。GCP/Gemini経路では、vLLM v0.12.0の新しい<code>structured_outputs</code>形式への対応も追加され、OpenRouterを実providerとして試験するdata-plane coverageも入った。最新正式releaseはv1.1.0のため、これらのmain上の修正がどのreleaseへ含まれるかは今後の確認が必要である。</p><p><strong>goose — MEDIUM</strong><br>modelごとのvision対応可否をprovider別の分岐ではなくcanonical catalogから解決する修正が入った。複数providerを切り替えるAgentでは、能力判定の一元化が誤った画像入力やprovider依存挙動を減らす。</p><p><strong>agentgateway — MEDIUM</strong><br>古いbinaryがmain上の新しいmodel catalogを取得した際、未知fieldでrefreshが壊れないようdeserializationを寛容にする修正が入った。v1.6.0で先に互換処理を配布し、その後にcatalog fieldを追加する方針がcommitに明記されている。</p><p><strong>A2A — LOW</strong><br>x402支払いendpointをAgentが発見・検証するdirectoryがpartners一覧へ追加された。ただしdocumentation上のecosystem追加であり、A2A protocol自体の変更ではない。</p><p><strong>MCP / AGENTS.md — WATCH</strong><br>前回観測後に、記事の中心に据える新しい正式仕様、重大release、Technical Charter変更は確認できなかった。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIF Technical Committee、Working Groups、project proposal、新規加入・卒業projectについて、この観測期間に新しい正式決定は確認できなかった。Agent Routerは2026年9月9日にAAIFへ加入済みであり、本日の変更はその後の通常開発である。</p><p><strong>分析：</strong>foundationの価値は名称やproject数だけでなく、異なるprovider・protocol・runtimeを跨ぐ不具合が公開され、回帰テストとrelease lifecycleへ取り込まれることにある。個別commitと正式な標準変更は分けて記録する必要がある。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>今回の差分は、Agentic infrastructureで重要になる三つの境界を示す。</p><ul><li><strong>障害境界</strong>：一つの非HTTP chainがcontrol plane全体を止めない</li><li><strong>資源境界</strong>：長いstreamやtool argumentsがmemoryを二次的に消費しない</li><li><strong>schema境界</strong>：新しいcatalog fieldを古いbinaryが安全に無視できる</li></ul><p>ModelやToolを増やすほど、gatewayは単なる中継器ではなく、互換性と障害半径を管理するcontrol planeになる。MCP・A2A・LLM APIを一つのgatewayへ集約するなら、protocol別の機能試験に加え、共存時のfailure isolationを確認しなければならない。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>ホスティング運用のPoCで、Incident Agent、Prometheus MCP、Alertmanager MCP、将来のA2A Agentを同一gateway配下へ置く場合、次を受け入れ条件へ加える。</p><ul><li>HTTP、TCP、UDP listenerを混在させても、無関係なrouteの設定反映が止まらない</li><li><code>Programmed</code> condition、xDS rejection、dataplane再起動回数を監視する</li><li>1 MiB級のstream、数千delta、長いthinking・tool argumentsでheapとGCを測る</li><li>token usageが途中集計やtrace処理で書き換わらないことを検証する</li><li>catalog更新をcanary環境で先行取得し、旧binaryのforward compatibilityを確認する</li></ul><p><strong>分析：</strong>Agentの回答品質試験だけでは、今回の障害は見つからない。control plane、data plane、protocol adapter、Agent業務E2Eを分離して試験し、どの層の失敗かを判定できるtraceを残す必要がある。</p><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>「一つの壊れた設定が、無関係なAgentやToolの通信を止めない」をgateway PoCの最重要SLOとして扱う。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>Agent Routerの各修正を含む次期正式releaseとupgrade guidance</li><li>Anthropic stream改善の実環境memory・latency検証</li><li>Agent RouterでのMCP・LLM・TCP/UDP混在構成の回帰試験</li><li>agentgateway v1.6.0の正式releaseとcatalog互換性</li><li>gooseのcanonical model catalogを使った能力判定</li><li>A2Aとx402を組み合わせる場合のidentity、支払い承認、監査</li></ul>"
      }
    ],
    "sources": [
      [
        "Agent Router: skip non-HCM filter chains",
        "https://github.com/theagentrouter/agent-router/commit/2b59b939bc12d1b21d51fbdb80d8d3d529da54cb"
      ],
      [
        "Agent Router: avoid quadratic stream folding allocation",
        "https://github.com/theagentrouter/agent-router/commit/0a62cda2de54563ffab18e8a3c15a83088078096"
      ],
      [
        "Agent Router: avoid mutating stream chunk usage",
        "https://github.com/theagentrouter/agent-router/commit/e04c86ae6a8d87a51febff8b69198700c74563cf"
      ],
      [
        "goose: canonical catalog for vision support",
        "https://github.com/aaif-goose/goose/commit/04ed836c8cde23e540cc77d256992e00be99298b"
      ],
      [
        "agentgateway: tolerate unknown catalog fields",
        "https://github.com/agentgateway/agentgateway/commit/dc376ec75483292f45a1fa4ec58405319845561e"
      ],
      [
        "A2A: add x402-list partner",
        "https://github.com/a2aproject/A2A/commit/72b3761bd84c59291da694dcd97cdfc2c010df39"
      ]
    ]
  },
  {
    "date": "2026-09-25",
    "level": "HIGH",
    "tags": [
      "A2A",
      "MCP",
      "Operations"
    ],
    "title": "A2AとMCPで始まる、プロトコルのバージョン運用",
    "summary": "A2A JavaScript SDK v1.2.1の修正とMCP Skills拡張から、Agentic AI基盤に必要になる互換性管理と能力配布を考える。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p><strong>A2Aでも、プロトコルのバージョンを本番環境で正しく扱うことが主要課題になってきた。</strong>JavaScript SDK v1.2.1は新しい仕様を追加するリリースではなく、<code>A2A-Version</code>を使った振り分けとレスポンス検証を修正するリリースだった。</p><p>MCPで進むprotocol negotiationと並べると、Agentic AI基盤は仕様を決める段階から、複数の仕様・SDKバージョンを安全に共存させる段階へ進み始めている。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p>A2A JavaScript SDK <strong>v1.2.1（2026年9月24日）</strong>では、JSON-RPCエラーをHTTP 200で返す修正、<code>A2A-Version</code>に基づくJSON-RPC dispatch、JSON-RPCレスポンスのバージョン検証が入った。</p><p>ほかにも、task status・artifact eventのmetadata伝播、RESTでpush notification設定を作る際のtask ID、Agentの<code>defaultInputModes</code>に対するmedia type検証が修正されている。個々には小さな修正だが、異なる実装間で通信するプロトコルでは、この種のcorrectnessが相互運用性を左右する。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>A2A — HIGH</strong><br>公式プロジェクトには複数言語のSDK、CLI、Inspector、TCK、Integration Testing Kitが揃いつつある。SDKの修正とテスト基盤を組み合わせ、仕様から実装互換性まで確認する構造が見えてきた。</p><p><strong>MCP — MEDIUM</strong><br><code>ext-skills</code>は、MCP primitivesを使ってSkillsを発見・配布する公式拡張を管理している。SEP-2640を基礎とし、2026-07-28のbase protocolに対して定義されている。MCPがtools・resources・promptsに加え、Agentが利用する能力の配布にも広がる可能性がある。</p><p><strong>Agent Router / agentgateway / goose / AGENTS.md — WATCH</strong><br>この日の確認範囲では、記事の中心に据える大型リリースは確認できなかった。既存のgateway、identity、policy、observabilityの実装動向を継続して追う。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIFのHosted ProjectsとWorking Groupsについて、この日はfoundation全体の構造を変える正式発表を確認していない。個別リポジトリの更新だけを新しい標準やガバナンス変更とは扱わない。</p><p>Skills over MCPは公式拡張として文書化が進む一方、配布されるSkillの信頼性、必要権限、依存関係、ホスト側の検証は運用上の論点として残る。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>MCPとA2Aは別の役割を持つが、運用面では同じ課題へ到達している。</p><ul><li>MCP：AgentとToolの間でprotocol versionを扱う</li><li>A2A：Agent間通信で<code>A2A-Version</code>を扱う</li><li>各SDK：仕様を実装し、旧版との互換性を管理する</li><li>TCK / ITK / Conformance：実装間の差異を検出する</li></ul><p>ここから、<strong>Protocol Version Lifecycle Management</strong>が独立した運用領域になる。Kubernetes APIやTLSと同様に、対応版の一覧、段階的な更新、廃止時期、互換性試験が必要になる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>Incident AgentがA2AでDiagnostic Agentを呼び、Diagnostic AgentがMCP経由でPrometheusやAlertmanagerへ接続する構成では、<strong>A2A version × A2A SDK version × MCP version × MCP SDK version</strong>の組み合わせが生まれる。</p><p>PoCの試験は次の3層に分けると、失敗の場所を特定しやすい。</p><ul><li><strong>A2A TCK / ITK</strong>：Agent間通信とSDK相互運用性</li><li><strong>MCP Conformance</strong>：Tool接続とprotocol correctness</li><li><strong>業務E2Eテスト</strong>：障害調査の正しさ、権限、timeout、監査ログ</li></ul><p><code>ext-skills</code>が成熟すると、運用AgentがSkill registryから必要な手順を取得し、MCP Toolを通じてインフラを調査する構造も考えられる。ただし、外部から得たSkillを実行可能な指示として扱うため、署名、許可された権限、配布元の信頼性を同時に設計する必要がある。</p><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>PoCの段階から利用バージョンを記録し、更新時には同じ障害シナリオを再実行する。互換性試験をAgentの回答評価と分けて管理する。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>A2A v1.xの次期変更と各SDKへの反映</li><li>A2A TCK / ITKによる実装間テスト</li><li>MCP 2026-07-28の各言語SDKとconformance</li><li>MCP Skills拡張のtrust modelと実装事例</li><li>Agent Routerとagentgatewayの責務境界</li><li>Identity & Trust、Observability & Traceabilityの各WG</li></ul>"
      }
    ],
    "sources": [
      [
        "A2A JavaScript SDK v1.2.1 release",
        "https://github.com/a2aproject/a2a-js/releases/tag/v1.2.1"
      ],
      [
        "A2A Integration Testing Kit",
        "https://github.com/a2aproject/a2a-itk"
      ],
      [
        "MCP Skills extension",
        "https://github.com/modelcontextprotocol/ext-skills"
      ]
    ]
  },
  {
    "date": "2026-09-24",
    "level": "MEDIUM",
    "tags": [
      "A2A",
      "Operations"
    ],
    "title": "A2A CLIが作る、既存Agentから標準プロトコルへの移行路",
    "summary": "既存の運用Agentを全面改修せず、CLIを橋渡しとしてA2A Agentへ仕事を委譲する段階的な導入方法を考える。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p>A2A CLIの役割は、人間がAgentを試すためのコマンドだけではない。<strong>A2A layerを持たないmodel、Agent、coding harnessからA2A Agentへ仕事を渡すbridge</strong>として設計されている。</p><p>既存のAgent runtimeをすぐにA2A SDKへ移行しなくても、shellやtool callを使えるAgentならA2A ecosystemへ接続できる。導入時の改修範囲を小さくできる点が実務上の価値になる。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p>公式A2A CLIはAgent Cardの取得、message送信、streaming、protocol-nativeなJSON出力、予測可能なexit codeを提供する。A2Aに対応していないAgentからも、CLIをtoolとして呼び出すことでremote A2A Agentへtaskを渡せる。</p><p>この日のA2A関連リポジトリでは複数SDKとCLIの更新が続いた。一方、正式仕様の最新版とリポジトリの更新日時は区別する必要がある。SDKの更新だけを新しいprotocol releaseとは扱わない。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>A2A — MEDIUM</strong><br>Go SDKはclient/serverとgRPC、REST、JSON-RPCの各transportを提供する。CLIを含む周辺ツールの整備により、仕様を読むだけでなく、Agentを発見・接続・検証する導線が形成されている。</p><p><strong>MCP — WATCH</strong><br>A2Aで呼ばれたremote AgentがMCP Toolを利用する構成が自然になる。A2AとMCPのどちらか一方だけを評価しても、実際の運用経路全体は確認できない。</p><p><strong>Agent Router / agentgateway — WATCH</strong><br>Agent間・Tool間の通信が増えるほど、identity、policy、routing、quota、traceを集約するgateway層の役割が大きくなる。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>現実的な導入経路は、すべてのAgentを最初からA2A nativeにする方法だけではない。</p><ol><li>既存AgentにA2A CLIをtoolとして与える</li><li>remote Agentとの相互運用性と業務価値を確認する</li><li>常時利用する経路だけSDKによるnative実装へ移す</li></ol><p>これはREST APIをまず<code>curl</code>で試し、安定した利用箇所をclient libraryへ移す流れに近い。CLIは移行期のadapterと、障害時の診断ツールを兼ねられる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>ホスティング運用であれば、既存のIncident AgentからA2A CLIを呼び、Diagnostic Agentへ調査を委譲する小さなPoCを組める。Diagnostic AgentはMCP経由でPrometheusやAlertmanagerを読み取る。</p><p>評価項目には回答精度だけでなく、Agent Cardの発見、認証情報の受け渡し、stream切断、timeout、exit code、JSON schema、trace IDの引き継ぎを含める。CLIを使うことで、運用チームが既に持つshell・scriptの知識を活用できる。</p><div class=\"insight\"><span class=\"dialog-kicker\">ADOPTION PATH</span><p>Phase 1: CLI bridge → Phase 2: A2A interoperability → Phase 3: 必要な経路だけnative A2A化。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>A2A CLIの認証、streaming、JSON出力の成熟</li><li>CLIをcoding harnessへ組み込む公式パターン</li><li>A2A SDK間の互換性とIntegration Testing Kit</li><li>A2AからMCP Toolへ至るend-to-end trace</li></ul>"
      }
    ],
    "sources": [
      [
        "A2A CLI repository",
        "https://github.com/a2aproject/a2a-cli"
      ],
      [
        "A2A Go SDK",
        "https://github.com/a2aproject/a2a-go"
      ],
      [
        "A2A project",
        "https://github.com/a2aproject/A2A"
      ]
    ]
  },
  {
    "date": "2026-09-23",
    "level": "MEDIUM",
    "tags": [
      "A2A",
      "Operations"
    ],
    "title": "A2Aは仕様書から、検証可能な実装ecosystemへ",
    "summary": "Specification、複数言語SDK、CLI、Inspector、TCK・ITKが揃うことで、Agent間通信をCIで確認できる段階へ進んでいる。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p>A2Aの価値を判断する材料が、protocol specificationだけではなくなってきた。複数言語のSDK、CLI、Inspector、TCK、Integration Testing Kitが揃い、<strong>実装して接続し、互換性を試験する一連の道具</strong>が形成されている。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p>A2A projectではSpecificationと複数SDK、CLI、テスト関連リポジトリが活発に更新された。個々のcommitを正式な仕様変更とみなすことはできないが、protocolと実装・検証ツールが並行して整備されていることは確認できる。</p><p>Integration Testing Kitは、異なるSDK実装とversionをまたいだ互換性を確認することを目的としている。JSON-RPC、gRPC、HTTP+JSON/REST、streamingを含む経路を対象にしており、異種Agentの接続試験に使える。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>A2A — HIGH</strong><br>Specification → SDK → CLI / Inspector → TCK / ITKという開発・検証チェーンが見えてきた。A2Aを単なる通信仕様ではなく、実装ecosystemとして評価できる材料が増えている。</p><p><strong>MCP — MEDIUM</strong><br>A2AがAgent間の接続を扱い、MCPがAgentとToolの接続を扱う構成では、それぞれのconformanceを別に確認する必要がある。</p><p><strong>agentgateway / Agent Router — WATCH</strong><br>A2AとMCPの通信をgatewayへ集約する場合、protocolごとの認証・policy・traceをどう統一するかが次の論点になる。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>AAIFのHosted ProjectsやWorking Groupsについて、この日の観測では新規加入や卒業に相当する正式変更を確認していない。Technical Committeeやproject proposalsの正式な更新と、個別repositoryの活動は分けて記録する。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>A2A ecosystemをKubernetesにたとえるなら、APIだけでなくclient libraries、操作用CLI、inspection、conformanceが揃う過程にある。成熟度は異なるが、productionで相互運用性を維持するには同じ種類の道具が必要になる。</p><p>Agent systemの品質は、LLMの回答だけでは決まらない。通信が仕様に適合し、異なるSDKでも同じtaskやeventを扱い、失敗時の状態が一貫していることが前提になる。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>Incident Agent → Diagnostic Agent → MCP Gateway → Infrastructureという構成なら、テストを次の3層へ分ける。</p><ul><li><strong>A2A protocol test</strong>：Agent Card、task、message、streaming、error model</li><li><strong>MCP protocol test</strong>：tool discovery、tool call、authorization、result</li><li><strong>業務E2E test</strong>：実際のアラートから正しい調査結果へ到達できるか</li></ul><p>この分割により、protocol不整合とAgentの推論ミスを混同しにくくなる。CIではTCK・ITKとconformanceを回し、定期的な業務シナリオでend-to-endを確認する構成が現実的だ。</p><div class=\"insight\"><span class=\"dialog-kicker\">OPERATOR NOTE</span><p>「回答が合っていた」だけでPoCを完了させず、異なるSDK、timeout、再接続、途中失敗も試験対象にする。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>A2Aの次期正式仕様とrelease notes</li><li>各SDKが同じ仕様へ追随するまでの時間差</li><li>TCKとITKのcoverage、CIへの組み込み例</li><li>MCP Conformanceとの組み合わせ</li><li>Identity & Trust、Observability & Traceabilityの設計</li></ul>"
      }
    ],
    "sources": [
      [
        "A2A specification",
        "https://github.com/a2aproject/A2A"
      ],
      [
        "A2A Integration Testing Kit",
        "https://github.com/a2aproject/a2a-itk"
      ],
      [
        "A2A CLI",
        "https://github.com/a2aproject/a2a-cli"
      ]
    ]
  },
  {
    "date": "2026-09-22",
    "level": "HIGH",
    "tags": [
      "MCP",
      "Security",
      "Operations"
    ],
    "title": "MCPは「接続する技術」から「壊さず運用する基盤」へ",
    "summary": "Go SDKのresource exhaustion対策とprotocol version制御から、多数のMCP Serverを安全に運用するControl Planeを考える。",
    "sections": [
      {
        "heading": "今日のシグナル",
        "html": "<p>MCP Go SDKの更新は、新機能の追加よりも<strong>大量接続されたMCPを壊さず、安全に運用するためのhardening</strong>が中心になった。MCPの開発重心がprotocol designだけでなくproduction engineeringへ移っている。</p>"
      },
      {
        "heading": "重要ニュース",
        "html": "<p>Go SDKではsession leak、deadlock、teardown時のhang、resource exhaustionに関する修正が進んだ。JSONのnesting、SSE event、stdio JSON-RPC frame、OAuth dynamic client registration responseに上限を設け、異常または巨大な入力がserver resourceを使い切るリスクを抑えている。</p><p><code>ServerOptions.SupportedProtocolVersions</code>により、serverがadvertise・negotiationするMCP versionを明示的に制限できる。最新版を一斉に有効化せず、stagingとproductionで対応versionを変える段階的なrolloutに利用できる。</p>"
      },
      {
        "heading": "OSS別アップデート",
        "html": "<p><strong>MCP — HIGH</strong><br>2026-07-28がSDKの最新対応revisionとして維持され、その運用安定化が進んでいる。Conformance suiteをclient/server双方へ適用する動きも、実装差異を検出するうえで重要になる。</p><p><strong>A2A — MEDIUM</strong><br>Specificationと複数SDK、Integration Testing Kitの更新が続いている。MCPと同様に、protocolだけでなく実装とconformanceへ投資する流れが見える。</p><p><strong>Agent Router / agentgateway — WATCH</strong><br>数十から数百のMCP Serverを扱う場合、個別接続ではなくgatewayやrouterでversion、identity、authorization、quota、observabilityを管理する必要が出てくる。</p>"
      },
      {
        "heading": "ガバナンスと標準化",
        "html": "<p>この日の確認範囲では、AAIFへの新しいHosted Project追加やfoundation全体の正式なガバナンス変更、重大なsecurity advisoryを確認していない。大型発表がない日でも、SDKのhardeningは実運用への成熟を示すため追跡対象になる。</p>"
      },
      {
        "heading": "技術トレンド",
        "html": "<p>Agentic infrastructureの通信経路は、Agent → MCP Server → Toolという単純な形から、次のようなControl Planeを含む形へ進む。</p><ul><li>Gateway / Routerによる接続先の管理</li><li>Protocol version negotiation</li><li>Identityとauthorization</li><li>入力上限、timeout、quota</li><li>Conformanceと互換性試験</li><li>OpenTelemetryによるtraceと監査</li></ul><p>MCPのversion lifecycleはKubernetes APIやTLS versionと同様に、対応版の明示、canary、廃止計画を必要とする。</p>"
      },
      {
        "heading": "Agentic Opsへの示唆",
        "html": "<p>Prometheus、Alertmanager、CMDB、SSH automationなどをMCP化すると、将来的には多数のMCP Serverが存在する。Agentが生成するJSONやSSEを信頼済みの内部通信とみなすと、誤動作がMCP ServerのOOMやControl Plane障害へ波及する可能性がある。</p><p>したがって、<strong>Agentが生成するtrafficもuntrusted inputとして制限・検証する</strong>。Productionでは安定版だけ、Stagingでは安定版と次期版を許可するなど、version制御をcanary rolloutに利用できる。</p><div class=\"insight\"><span class=\"dialog-kicker\">POC CHECKLIST</span><p>巨大JSON、深いnesting、長大なSSE、切断、session終了、timeout、旧versionとの接続を再現し、MCP Serverとgatewayのresource使用量を確認する。</p></div>"
      },
      {
        "heading": "要ウォッチ項目",
        "html": "<ul><li>MCP Go SDKのhardeningが他言語SDKへ波及するか</li><li>2026-07-28対応とconformanceの進捗</li><li>Server側のprotocol version制御事例</li><li>Agent RouterのMCP backendとauthorization</li><li>agentgatewayとの責務境界</li><li>Identity & Trust、Observability & Traceabilityの各WG</li></ul>"
      }
    ],
    "sources": [
      [
        "MCP Go SDK releases",
        "https://github.com/modelcontextprotocol/go-sdk/releases"
      ],
      [
        "MCP specification 2026-07-28",
        "https://modelcontextprotocol.io/specification/2026-07-28"
      ],
      [
        "A2A project",
        "https://github.com/a2aproject/A2A"
      ],
      [
        "A2A Integration Testing Kit",
        "https://github.com/a2aproject/a2a-itk"
      ]
    ]
  }
];
