/**
 * Content adapted from the main Erebus repository. See each section for its source.
 *
 *   docs/status.md ................... the tiebreaker for current state
 *   docs/privacy-model.md ............ the only source for privacy claims
 *   docs/metropolis-threat-model.md ............. the measured observer metrics
 *   docs/runs/2026-08-31-mainnet-060-040-canary.md
 *   docs/runs/v0.2-mainnet-canary.json
 *   agents/src/erebus_agents/demo.py . the replay
 *   README.md ........................ install and the MCP tool surface
 */

export const SOURCE = "https://github.com/PoulavBhowmick03/Erebus";
export const X_HANDLE = "https://x.com/Erebus_pvt";
export const doc = (p: string) => `${SOURCE}/blob/main/${p}`;
export const starkscan = (h: string) => `https://starkscan.co/tx/${h}`;

/* ── System map · README.md, docs/assets/erebus-overview.excalidraw.svg ──── */

export const SYSTEM_MAP_ALT =
  "Erebus system overview: the agent-to-pool call path, wire-v3 messages, settlement checks, disclosure, and key exposure";

/* ── Install · README.md ─────────────────────────────────────────────────── */

export const INSTALL = `uv tool install --python 3.12 \\
  --extra-index-url https://poulavbhowmick03.github.io/Erebus/simple \\
  erebus-mcp-server`;

/* ── Evidence manifest · the 0.6/0.4 canary, all fees are receipt amounts ── */

export const MANIFEST = [
  {
    action: "Allowance, A",
    hash: "0x2a3eef681ef7f602fad690161868479bfd186e9e179a05fb71cb5e7afd469cc",
    block: "14146609",
    utc: "11:29:54Z",
    fee: "0.053831",
  },
  {
    action: "Allowance, B",
    hash: "0x6d9c7764b1583eae8ff39b8e716c6062d3d62e4d6943110ce86b8629f8a1f3a",
    block: "14146616",
    utc: "11:30:09Z",
    fee: "0.054907",
  },
  {
    action: "Screened shield",
    hash: "0x273b0f97f1c0707a259bbe5cacc337df6876509adba09b7376a0501a0f028b7",
    block: "14146663",
    utc: "11:31:27Z",
    fee: "2.727291",
  },
  {
    action: "Buyer proposal, 0.48",
    hash: "0x51fa13c6d11c529208785af163f2d5bc1cc95451192e3265150e0067aadeda4",
    block: "14147302",
    utc: "11:49:15Z",
    fee: "2.769592",
  },
  {
    action: "Seller counter, 0.6",
    hash: "0x6e55194809fec58c1426a8178dcdb10270d5e8aecfcfd6db2b28f6284ce5467",
    block: "14147331",
    utc: "11:50:03Z",
    fee: "2.769592",
  },
  {
    action: "Atomic settlement",
    hash: "0x79167f213952fb33a57eec6457963fa7dd7ba3a38160d5ef04540e91bd4f97a",
    block: "14147370",
    utc: "11:51:10Z",
    fee: "2.836143",
  },
] as const;

export const MANIFEST_TOTALS = {
  network: "11.211356 STRK",
  pool: "24 STRK",
  poolFee: "6 STRK per apply_actions",
};

/* ── The replay · agents/src/erebus_agents/demo.py ───────────────────────── */

export type ReplayStage = {
  id: string;
  title: string;
  hidden: string;
  open: string;
};

export const REPLAY: ReplayStage[] = [
  {
    id: "01",
    title: "open channel",
    hidden: "the channel key",
    open: "counterparty address, submitting account, timing",
  },
  {
    id: "02",
    title: "offer and counter",
    hidden: "amount, token, deadline, memo hash",
    open: "submitting account, note count, timing",
  },
  {
    id: "03",
    title: "settle",
    hidden: "amount paid, recipient, change",
    open: "submitting account, that a settlement occurred, seven notes",
  },
];

export type TranscriptLine = {
  stage: number;
  text: string;
  secret?: string;
  tail?: string;
};

export const TRANSCRIPT: TranscriptLine[] = [
  { stage: 1, text: "opened encrypted channel", tail: "ch_b7afee5f…8d9af8" },
  { stage: 2, text: "buyer proposed", secret: "0.48 STRK" },
  { stage: 2, text: "seller countered", secret: "0.60 STRK" },
  { stage: 2, text: "buyer accepted the counteroffer" },
  {
    stage: 3,
    text: "accepted offer and shielded payment committed atomically",
  },
  {
    stage: 3,
    text: "deal-scoped viewing grant created for",
    tail: "0xauditor",
  },
  {
    stage: 3,
    text: "auditor reconstructed two offers and the settlement record",
  },
];

export const DEAL_SUMMARY = [
  { k: "channel", v: "ch_b7afee5f…8d9af8", hidden: false },
  { k: "participants", v: "buyer ↔ seller", hidden: false },
  { k: "agreed", v: "0.60 STRK", hidden: true },
  { k: "paid", v: "0.60 STRK", hidden: true },
] as const;

/* ── Who sees what · docs/privacy-model.md ───────────────────────────────── */

export const DISCLOSURE = [
  { who: "Public chain reader", terms: "Hidden" },
  { who: "Channel party", terms: "Readable" },
  { who: "Viewing-grant holder", terms: "Readable for one deal" },
] as const;

/* ── Three measured lines · docs/metropolis-threat-model.md §4 ─────────────────────── */

export const OBSERVER = [
  {
    k: "M1 · wire v2 classifier",
    v: "1.0000",
    note: "identifies an Erebus message against 10,000 negatives",
    bad: true,
  },
  {
    k: "M2 · wire v3 classifier",
    v: "0.5008",
    note: "chance, on the same 10,000 negatives",
    bad: false,
  },
  {
    k: "M4 · submission linkage",
    v: "1.0",
    note: "the same account signs every write",
    bad: true,
  },
] as const;

/* ── What this does not do · docs/status.md ─────────────────────────────── */

export type NonClaim = { title: string; body: string };

export const NON_CLAIMS: NonClaim[] = [
  {
    title: "Not production ready",
    body: "Four recorded mainnet workflows passed. That is not capacity, uptime, or an independent security review.",
  },
  {
    title: "Disclosure cannot be undone",
    body: "A wire-v3 expiry stops later verification. It cannot make a recipient forget a record they already opened.",
  },
  {
    title: "No escrow or deferred delivery",
    body: "Settlement is atomic, so there is no agree-now-deliver-later. The pool has no timelock and no conditional release.",
  },
];

/* ── The tool surface · thirteen MCP tools, Protocol 5 ──────────────────── */

export const TOOL_GROUPS = [
  {
    label: "Negotiate, settle, disclose",
    tools: [
      "open_channel",
      "propose_offer",
      "counter_offer",
      "wait_for_offers",
      "read_channel_state",
      "accept_and_settle",
      "get_note_balance",
      "grant_viewing_key",
      "reveal",
    ],
  },
  {
    label: "Recovery & ops",
    tools: ["reconcile", "resume_operation", "rebuild_state", "doctor"],
  },
] as const;

/* ── Configuration · README.md ───────────────────────────────────────────── */

/** One MCP client entry. Two agents means two of these, one per identity. */
export const MCP_CONFIG = `{
  "mcpServers": {
    "erebus-buyer": {
      "command": "erebus-mcp-server",
      "env": {
        "EREBUS_BACKEND": "seam",
        "EREBUS_NETWORK": "sepolia",
        "EREBUS_SETTLEMENT_ROLE": "payer",
        "AGENT_ADDRESS": "0x...",
        "STARKNET_RPC_URL": "https://...",
        "PROVING_SERVICE_URL": "https://...",
        "TOKEN_ADDRESS": "0x...",
        "POOL_KEY_FILE": "/home/you/.erebus-a/agent.pool.key",
        "ACCOUNT_KEY_FILE": "/home/you/.erebus-a/agent.account.key",
        "EREBUS_STATE_DIR": "/home/you/.erebus-a/state"
      }
    }
  }
}`;

export const ENV_VARS = [
  {
    k: "EREBUS_BACKEND",
    v: "mock · seam",
    note: "mock runs the tools in memory without a chain",
  },
  { k: "EREBUS_NETWORK", v: "sepolia · mainnet", note: "" },
  {
    k: "EREBUS_SETTLEMENT_ROLE",
    v: "payer · payee · both",
    note: "a payee server rejects accept_and_settle",
  },
  { k: "AGENT_ADDRESS", v: "0x…", note: "the calling account" },
  { k: "STARKNET_RPC_URL", v: "https://…", note: "" },
  { k: "PROVING_SERVICE_URL", v: "https://…", note: "hosted prover" },
  { k: "TOKEN_ADDRESS", v: "0x…", note: "the shielded token" },
  {
    k: "POOL_KEY_FILE",
    v: "path",
    note: "the Python binding passes paths, not key values",
  },
  { k: "ACCOUNT_KEY_FILE", v: "path", note: "" },
  { k: "EREBUS_STATE_DIR", v: "path", note: "locked, mode-0600 state" },
  {
    k: "EREBUS_SPENDING_LIMITS",
    v: "JSON, optional",
    note: "per-token cap on what accept_and_settle can spend",
  },
  {
    k: "POOL_ADDRESS",
    v: "0x…, optional",
    note: "overrides the default pool for the seam backend",
  },
  {
    k: "STARKNET_CHAIN_ID",
    v: "optional",
    note: "overrides the default chain id for the seam backend",
  },
] as const;

/* ── The call path · CLAUDE.md ───────────────────────────────────────────── */

export const CALL_PATH = [
  "agents",
  "mcp-server",
  "sdk/py",
  "sdk/rs",
  "Starknet",
] as const;

/* ── Concepts · docs/reference.md, docs/privacy-model.md ─────────────────── */

export const CONCEPTS = [
  {
    term: "channel",
    def: "An encrypted conversation between two agents. Each side calls `open_channel` and receives its own `channel_handle`. The pair can carry multiple deals. Channel opening exposes the counterparty address in public calldata.",
  },
  {
    term: "offer",
    def: "Proposed payment terms: amount, token, deadline, and memo hash. Use `propose_offer` for a new offer and `counter_offer` to reply. A counteroffer does not cancel the original. Offers cannot be withdrawn, so choose a deadline that limits how long the price remains available.",
  },
  {
    term: "deal",
    def: "A negotiation identified by a `deal_id`, including its offers and any settlement. One channel pair can carry multiple deals. Settlement does not close the pair.",
  },
  {
    term: "note",
    def: "A record in the STRK20 pool. Value notes hold shielded tokens; zero-amount notes carry encrypted messages. Only the payer can call `accept_and_settle`, because it spends the caller's notes.",
  },
  {
    term: "operation_id",
    def: "The idempotency key required for every write operation, formatted as `op_` followed by 64 lowercase hexadecimal characters. Save this ID before the call and reuse it after a restart. If a transaction appears stuck, call `reconcile` rather than generating a new ID.",
  },
  {
    term: "viewing grant",
    def: "A file that lets a named recipient read one deal. `grant_viewing_key` creates it with an expiry. `reveal` opens it with the recipient's pool key and reconstructs the deal. A grant gives no spending authority.",
  },
] as const;

/* ── The tool surface, in full · docs/reference.md §The MCP tool surface ─── */

export const TOOL_DETAILS: Record<
  string,
  {
    signature: string;
    note: string;
    request: string;
    response: string;
    detail?: string;
  }
> = {
  open_channel: {
    signature: "(operation_id, counterparty)",
    note: "Returns channel_handle.",
    request: `{"operation_id": "op_3f9a...c02e", "counterparty": "0x04a1...9bd2"}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": {"channel_handle": "ch_9f8106a8...29c6d12ac"},
 "operation_id": "op_3f9a...c02e"}`,
  },
  propose_offer: {
    signature:
      "(operation_id, channel_handle, amount, token, deadline, memo_hash)",
    note: "Submits an initial offer proposal on an open channel.",
    request: `{"operation_id": "op_1b7e...44aa", "channel_handle": "ch_9f8106a8...29c6d12ac",
 "amount": "800000000000000000", "token": "0x0471...11ee",
 "deadline": 1768003600, "memo_hash": "0x9f2c...ab01"}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": {"offer_id": "ch_9f8106a8...29c6d12ac:us:0"},
 "operation_id": "op_1b7e...44aa"}`,
  },
  counter_offer: {
    signature:
      "(operation_id, channel_handle, reply_to, amount, token, deadline, memo_hash)",
    note: "Does not withdraw the offer it is replying to.",
    request: `{"operation_id": "op_5a11...09dc", "channel_handle": "ch_9f8106a8...29c6d12ac",
 "reply_to": "ch_9f8106a8...29c6d12ac:them:0", "amount": "600000000000000000",
 "token": "0x0471...11ee", "deadline": 1768003600, "memo_hash": "0x9f2c...ab01"}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": {"offer_id": "ch_9f8106a8...29c6d12ac:us:0"},
 "operation_id": "op_5a11...09dc"}`,
    detail:
      "This example runs on the payee. `reply_to` names the other party's offer (`them:n`). The response names the new counteroffer (`us:n`). Countering your own offer returns `NOT_YOUR_OFFER`.",
  },
  wait_for_offers: {
    signature: "(channel_handle, expected_count, timeout_seconds=300)",
    note: "One call in place of a poll loop. A timeout is not an error.",
    request: `{"channel_handle": "ch_9f8106a8...29c6d12ac", "expected_count": 2, "timeout_seconds": 300}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": {
   "offers": [{"offer_id": "ch_9f8106a8...29c6d12ac:us:0", "deal_id": "319440722280485962",
     "proposer": "0x04a1...9bd2", "status": "countered", "reply_to": null,
     "created_at": 1768000012,
     "terms": {"amount": "800000000000000000", "token": "0x0471...11ee",
       "deadline": 1768003600, "memo_hash": "0x9f2cab01..."}},
    {"offer_id": "ch_9f8106a8...29c6d12ac:them:0", "deal_id": "319440722280485962",
     "proposer": "0x0763...c94f", "status": "proposed",
     "reply_to": "ch_9f8106a8...29c6d12ac:us:0", "created_at": 1768000221,
     "terms": {"amount": "600000000000000000", "token": "0x0471...11ee",
       "deadline": 1768003600, "memo_hash": "0x9f2cab01..."}}],
   "settlements": [], "timed_out": false}}`,
    detail:
      "`expected_count` counts all offers in the channel, including those already read. After the first proposal, set it to 2 to wait for a counteroffer. A counteroffer changes the original status to `countered` but does not cancel it. The original remains available until settlement or expiry.",
  },
  read_channel_state: {
    signature: "(channel_handle)",
    note: "Every visible offer plus the settlement list.",
    request: `{"channel_handle": "ch_9f8106a8...29c6d12ac"}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": {"offers": [{"...": "same offer shape as wait_for_offers"}],
   "settlements": [{"acceptance": "ch_9f8106a8...29c6d12ac:us:1", "accepted_offer": "ch_9f8106a8...29c6d12ac:them:0",
     "agreed_amount": "600000000000000000", "paid_amount": "600000000000000000",
     "consistency": "consistent"}]}}`,
  },
  accept_and_settle: {
    signature: "(operation_id, channel_handle, offer_id)",
    note: "Payer only. Settles one deal, but the pair can start another after.",
    request: `{"operation_id": "op_c810...6f3e", "channel_handle": "ch_9f8106a8...29c6d12ac",
 "offer_id": "ch_9f8106a8...29c6d12ac:them:0"}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": {"offer_id": "ch_9f8106a8...29c6d12ac:them:0", "tx_hash": "0x79167f21...f97a",
   "nullifiers": ["0x2c11...", "0x88a0..."], "proved_at": 1768000042,
   "selected_input": "800000000000000000", "change": "200000000000000000"},
 "operation_id": "op_c810...6f3e"}`,
  },
  get_note_balance: {
    signature: "()",
    note: "Queries spendable shielded note balances for the calling identity.",
    request: `{}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": {"spendable_notes": ["500000000000000000", "300000000000000000"],
   "total": "800000000000000000", "pending_notes": []}}`,
  },
  grant_viewing_key: {
    signature:
      "(operation_id, channel_handle, deal_id, grantee, expires_at, output_path)",
    note: "Generates a scoped viewing grant file (mode 0600) without exposing private keys.",
    request: `{"operation_id": "op_e922...10ab", "channel_handle": "ch_9f8106a8...29c6d12ac",
 "deal_id": "319440722280485962", "grantee": "0x0763...c94f",
 "expires_at": 1769990000, "output_path": "~/.erebus-c/grants/deal.json"}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": {"channel_id": "ch_9f8106a8...29c6d12ac", "deal_id": "319440722280485962",
   "grantee": "0x0763...c94f", "expires_at": 1769990000,
   "grant_path": "/home/you/.erebus-c/grants/deal.json"}}`,
  },
  reveal: {
    signature: "(grant_path)",
    note: "Reconstructs the selected deal.",
    request: `{"grant_path": "/home/you/.erebus-c/grants/deal.json"}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": {"channel_id": "ch_9f8106a8...29c6d12ac", "participants": ["0x04a1...9bd2", "0x0763...c94f"],
   "offers": [{"...": "same offer shape as wait_for_offers, this deal only"}],
   "settlement": {"acceptance": "ch_9f8106a8...29c6d12ac:us:1", "accepted_offer": "ch_9f8106a8...29c6d12ac:them:0",
     "agreed_amount": "600000000000000000", "paid_amount": "600000000000000000",
     "consistency": "consistent"}}}`,
  },
  reconcile: {
    signature: "()",
    note: "Inspects and classifies journaled operations without submitting transactions.",
    request: `{}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": [{"operation_id": "op_c810...6f3e", "operation": "accept_and_settle",
   "request": {"...": "the canonical replay request recorded before execution"},
   "stage": "submitted", "channel": "ch_9f8106a8...29c6d12ac",
   "transaction_hash": "0x79167f21...f97a", "accepted_at": null,
   "outcome": "pending", "next_action": "wait",
   "reason": "submitted but acceptance not yet confirmed on chain"}]}`,
  },
  resume_operation: {
    signature: "(operation_id)",
    note: "Resumes an operation or reports what you need to fix.",
    request: `{"operation_id": "op_c810...6f3e"}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": {"result": "already_complete", "transaction_hash": "0x79167f21...f97a"}}`,
    detail:
      "This example returns `already_complete`. The `result.result` field can contain: `already_complete`, `local_state_behind`, `resubmitted`, `recovered_proof`, `rebuilt`, `rebuild_required`, or `reconciliation_required`. Other fields depend on the status. For example, `rebuild_required` returns a `reason` string instead of a `transaction_hash`.",
  },
  rebuild_state: {
    signature: "()",
    note: "Rebuilds missing channel records from the pool key and chain data.",
    request: `{}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": {"channels_found": 3, "rebuilt": ["ch_9f8106a8...29c6d12ac"],
   "kept": 2, "other_token": 0, "unrecoverable": 0}}`,
  },
  doctor: {
    signature: "()",
    note: "Checks local setup, RPC access, and prover access.",
    request: `{}`,
    response: `{"ok": true, "backend": "seam", "network": "sepolia",
 "result": {"ready": true,
   "checks": [
     {"name": "rpc", "status": "pass", "detail": "reachable, head is block 14200931"},
     {"name": "prover", "status": "pass", "detail": "reachable, spec 0.14.2"},
     {"name": "allowance", "status": "pass", "detail": "3 writes funded"},
     {"...": "pool_key_file, account_key_file, state_dir, chain_id, pool, registration, gas_balance also run"}
   ],
   "repairs": []}}`,
  },
};

/* ── Responses and errors · docs/reference.md §Errors and retries ────────── */

export const RESPONSE_OK = `{"ok": true, "backend": "seam", "network": "sepolia", "result": {...}}`;
export const RESPONSE_ERR = `{"ok": false, "backend": "seam", "network": "sepolia", "error": {"code": "...", "message": "...", "retryable": false}}`;

export const ERROR_GROUPS = [
  {
    group: "The offer is wrong",
    codes: [
      "OFFER_EXPIRED",
      "OFFER_UNKNOWN",
      "ALREADY_SETTLED",
      "NOT_YOUR_OFFER",
      "AMOUNT_MISMATCH",
      "INSUFFICIENT_NOTES",
      "INDEX_CONFLICT",
    ],
    action:
      "Read the error message before another write. An expired offer needs new terms; insufficient notes need funding. If the deal is already settled, inspect its record instead of paying again.",
  },
  {
    group: "Funding or identity policy",
    codes: ["INSUFFICIENT_ALLOWANCE", "INSUFFICIENT_BALANCE"],
    action: "Adjust the allowance or fund the account before retrying.",
  },
  {
    group: "Durable operation state",
    codes: ["OPERATION_CONFLICT", "RECONCILIATION_REQUIRED"],
    action:
      "Retain the original operation_id, call reconcile, and follow the returned guidance.",
  },
  {
    group: "Transient",
    codes: [
      "SCREENING_UNAVAILABLE",
      "PROVER_UNAVAILABLE",
      "PROOF_EXPIRED",
      "SUBMIT_FAILED",
    ],
    action:
      "For reads, use the retryable flag and exponential backoff. For writes, call reconcile first and keep the original operation_id. If the journal permits recovery, resume_operation can submit again or rebuild an expired proof.",
  },
  {
    group: "Terminal",
    codes: ["SCREENING_REJECTED"],
    action: "Do not retry. This error is not transient.",
  },
  {
    group: "Opaque",
    codes: ["PROOF_FAILED"],
    action:
      "The prover rejected the request without providing a reason. Report this as an unexplained failure.",
  },
  {
    group: "Before any protocol code ran",
    codes: ["INVALID_REQUEST", "IDENTITY_UNAVAILABLE"],
    action:
      "Correct the request payload or key file path. This error never indicates a chain-state problem.",
  },
] as const;

/* ── Version · docs/reference.md, docs/status.md ─────────────────────────── */

export const VERSION_NOTE =
  "This page documents CLI Protocol 5 (v0.3.0), which exposes the thirteen tools listed above. Protocol 5 adds account setup through the installed package (erebus-init) while retaining Protocol 4's operation_id mechanics for settlement requests. Version v0.2.0 implements Protocol 4, while v0.1.0 implements Protocol 2 with ten tools. To detect incompatible request and response formats, erebus-sdk validates protocol compatibility by protocol number before each call.";

export const VERSION_BADGE = "Protocol 5 · v0.3.0";

/* ── Set up an identity · docs/onboarding.md ──────────────────────────────── */

export const IDENTITY_BOOTSTRAP = `erebus-init`;

export const IDENTITY_KEYS = [
  {
    key: "Starknet account key",
    purpose: "Signs transactions. Transaction signing",
    seenBy: "Never leaves the Rust process",
  },
  {
    key: "Pool private key",
    purpose: "Identifies and decrypts pool records",
    seenBy:
      "Sent in compile_actions calldata to your prover and preflight RPC, both of which must be operator-controlled",
  },
  {
    key: "Pool auditor key",
    purpose: "Pool-wide, set once at registration",
    seenBy: "Receives the encrypted pool key at registration",
  },
] as const;

/* ── The CLI protocol · docs/reference.md §The CLI protocol ──────────────── */

export const CLI_REQUEST = `echo '{"method":"doctor","params":{"config":{...}}}' | erebus-cli`;
export const CLI_RESPONSE = `{"ok": true, "protocol": 5, "result": {"ready": true, "checks": [...]}}`;

export const CLI_METHODS =
  "version, generate_pool_key, doctor, balance, allowance, approve, shield, open_channel, propose_offer, counter_offer, read_channel_state, accept_and_settle, reconcile, resume_operation, rebuild_state, grant_viewing_key, reveal";

/* ── Building from source · docs/reference.md §Building from source ──────── */

export const BUILD_CLONE = `git clone https://github.com/PoulavBhowmick03/Erebus && cd Erebus`;

export const BUILD_RUST = `cargo test --manifest-path sdk/rs/Cargo.toml --all-targets`;

export const BUILD_PYTHON = `uv sync --all-packages && uv run pytest`;

/* ── How it works · sdk/rs/src/wire.rs module docs, docs/status.md ───────── */

/** The 400-bit negotiation plaintext, most-significant-first. From wire.rs. */
export const WIRE_FIELDS = [
  { field: "type", bits: "8", note: "offer, counter, or acceptance" },
  { field: "replyTo", bits: "32", note: "the offer this one answers" },
  { field: "createdAt", bits: "40", note: "author timestamp" },
  { field: "amount", bits: "128", note: "the price, in base units" },
  { field: "deadline", bits: "64", note: "after which the offer expires" },
  {
    field: "memoHash",
    bits: "128",
    note: "commits to off-chain detail held elsewhere",
  },
] as const;

/** The mechanisms used for messages, authorization, and pool settlement. */
export const CRYPTO_JOBS = [
  {
    job: "Negotiation confidentiality",
    mechanism: "Authenticated encryption and key agreement",
    proof: "No",
  },
  {
    job: "Agreement authorization",
    mechanism: "Client checks and pool spending authority",
    proof: "No proof of agreed-price equality",
  },
  {
    job: "Private settlement",
    mechanism: "STRK20 proof and atomic pool actions",
    proof: "Required for pool writes",
  },
] as const;

/* ── Privacy · docs/privacy-model.md, the canonical source ───────────────── */

export const PRIVACY_CLAIM =
  "Negotiation contents and settlement amounts stay confidential. Someone reading public chain data cannot recover the amount, token, deadline, memo hash, message type, or reply structure of a negotiation, and cannot read the amount or recipient of the settlement either.";

export const PRIVACY_NONCLAIM =
  "Erebus does not hide that a negotiation happened, and it does not hide who it was with. On-chain observers can detect pool interactions, track event frequency and timestamps, link transactions to submitting Starknet accounts, and read the counterparty address from `open_channel` calldata.";

export const PRIVACY_ONE_LINE = "Erebus hides the terms, not the relationship.";

/** What leaks at each step of the workflow. From privacy-model.md. */
export const LEAK_STEPS = [
  {
    step: "0 · fund",
    hidden: "nothing",
    open: "depositor account, amount, token, timing. The whole ERC-20 leg.",
  },
  {
    step: "1 · open channel",
    hidden: "the channel key",
    open: "the counterparty's address, in the clear, plus the submitting account and timing",
  },
  {
    step: "2-4 · offer, counter, final",
    hidden: "amount, token, deadline, memo hash, message type, replyTo",
    open: "submitting account, five salt values per message, note count, timing",
  },
  {
    step: "5 · accept and settle",
    hidden: "amount paid, recipient, change amount",
    open: "submitting account, that a settlement occurred, the created note count",
  },
  {
    step: "6-7 · grant and reveal",
    hidden:
      "deal data remains encrypted on chain; the named recipient can read the disclosed deal",
    open: "no new transaction; local files and provider requests can leave records",
  },
] as const;

/** The known leaks, in descending severity. From privacy-model.md. */
export const KNOWN_LEAKS = [
  {
    n: "0",
    title: "The counterparty address is in public calldata",
    body: "`open_channel` compiles to three server actions, the first of which carries `recipient_addr` as a plain `ContractAddress`. This value works as the storage map key for the recipient's channel record, so it cannot be hashed, and server actions are written directly into public `apply_actions` calldata. Both directions must be opened for a conversation to work, so this edge gets recorded twice. Wire-level encryption does not fix this.",
    fix: "This needs a design change. A small patch will not fix it. Tracked as friction `F38`.",
  },
  {
    n: "1",
    title: "The historical wire-v2 fifth-salt fingerprint",
    body: "Wire v2 fills 536 of 595 payload bits and zero-fills the remaining 59, so the fifth salt of every message has bit 119 pinned and bits 60 through 118 clear no matter what the message says. This pattern identifies an Erebus message almost every time.",
    fix: "Fixed in wire v3, now the source default. It carries a 64-bit deal id and masks the spare bits with a separately derived keystream. Tracked as `F31`.",
  },
  {
    n: "2",
    title: "Submission linkability",
    body: "Every write is an `apply_actions` transaction signed by a public Starknet account. The account that opens a channel, submits each offer, and settles the deal stays the same visible identity the whole time. An observer who cannot decrypt a single term can still count and time that account's deal flow.",
    fix: "Unlinkable submission is possible without a protocol change, since nothing binds the transaction submitter to the pool identity whose actions are applied. Not yet implemented.",
  },
  {
    n: "3",
    title: "The public funding leg",
    body: "Shielding is a standard ERC-20 transfer. Depositor address, amount, token, and timing are all public, and this transfer happens a short, bounded time before the first private action.",
    fix: "This design has no fix for it. Funding correlation is an ecosystem-level problem.",
  },
  {
    n: "4",
    title: "Note count on settlement",
    body: "A settlement creates six notes when the payer's selected inputs match the price exactly, and seven notes when inputs overshoot and a change note is minted. This leaks one bit of information about the payer's holdings on every deal, though amounts themselves remain private.",
    fix: "Always mint a change note, zero-valued when not needed, to keep the count constant. Not yet implemented.",
  },
] as const;

/** Endpoints that see more than the chain does. From privacy-model.md. */
export const INFRA_VISIBILITY = [
  {
    endpoint: "The prover",
    how: "receives compile_actions calldata",
    key: "Sees the pool key",
  },
  {
    endpoint: "The write RPC",
    how: "receives the preflight call",
    key: "Sees the pool key",
  },
  {
    endpoint: "The submitted transaction",
    how: "apply_actions on chain",
    key: "Does not",
  },
] as const;

/* ── Limits · docs/status.md, docs/production-gaps.md ────────────────────── */

export const NOT_DOES = [
  {
    title: "Hide who you are dealing with",
    body: "The counterparty's address is written in public calldata at channel-open. This exposure happens upstream of our encryption, so no wire-level change can fix it.",
  },
  {
    title: "Hide that a negotiation happened",
    body: "Wire v3 removes the fixed v2 salt classifier, but the submitting account, transaction timing, action shape, and note count all stay public.",
  },
  {
    title: "Prove production readiness from bounded runs",
    body: "Four bounded mainnet workflows have passed. That does not establish capacity, uptime, an independent security review, or safety with real value.",
  },
  {
    title: "Revoke facts already disclosed",
    body: "An expiry stops later verification. It cannot make a recipient forget a record they already opened before it expired.",
  },
  {
    title: "Escrow, or deferred delivery",
    body: "The pool transfers funds at settlement. It cannot hold funds until a later delivery or release them under an external condition.",
  },
] as const;

export const PROD_GAPS = [
  {
    area: "Transaction signing and infrastructure",
    body: "The prover and preflight RPC receive the pool private key, so a hosted provider sits inside the identity's confidentiality boundary. Getting to production needs a written provider policy, endpoint rotation and revocation, a supported self-hosted fallback, tested backup and restore, and a key-loss drill.",
  },
  {
    area: "Transaction safety",
    body: "The client records operation IDs and supports reconciliation. Further work includes long-running failure tests against real provider timeouts, journal pruning that preserves recovery evidence, spending limits enforced in Rust across restarts, and operator alerts when the transaction outcome is uncertain.",
  },
  {
    area: "Security review",
    body: "No independent cryptographic or security review has covered the wire, the settlement binding, the disclosure design, the hosted-prover transport, or the recovery journal.",
  },
  {
    area: "Scale and operations",
    body: "Only suitable for bounded, low-frequency workflows right now. Provider latency, RPC load across long channels, pool fees, concurrent negotiations, and restore time are all unmeasured at scale.",
  },
  {
    area: "Product",
    body: "No delivery-versus-payment, escrow, refunds, deferred execution, or outcome-only proofs. A scoped grant reveals a deal record, but it doesn't prove that anything was actually delivered.",
  },
] as const;

export const DISCLOSURE_PROVES =
  "The listed note values decrypt and authenticate correctly under the deal capability you were given. An acceptance exists in the record, and you can see what its payment note actually carries. `agreed_amount` and `paid_amount` are kept as two separate fields on purpose, so you can compare what was accepted against what was actually paid.";

export const DISCLOSURE_ASSERTS =
  "The capsule names the participant addresses and the issuer. It is encrypted and authenticated, but the grantor does not sign it. It also carries the business meaning: `memo_hash` points to off-chain detail that lives outside this wire, and nothing proves that meaning to an outside verifier.";

/* ── Walkthrough · docs/runbook.md, the reproducible seven steps ─────────── */

export const WALK_OPEN = `# A opens its direction and proposes
HANDLE_A=$(scripts/agent.sh ~/.erebus-a/env open \\
  "$(scripts/agent.sh ~/.erebus-b/env whoami)")
scripts/agent.sh ~/.erebus-a/env balance
scripts/agent.sh ~/.erebus-a/env offer "$HANDLE_A" 600000000000000000`;

export const WALK_COUNTER = `# B opens its own direction, then sees A's offer there
HANDLE_B=$(scripts/agent.sh ~/.erebus-b/env open \\
  "$(scripts/agent.sh ~/.erebus-a/env whoami)")
scripts/agent.sh ~/.erebus-b/env status "$HANDLE_B"
scripts/agent.sh ~/.erebus-b/env counter "$HANDLE_B" them:0 1000000000000000000`;

export const WALK_SETTLE = `# A reads B's counter through A's direction and settles
scripts/agent.sh ~/.erebus-a/env status "$HANDLE_A"
scripts/agent.sh ~/.erebus-a/env accept "$HANDLE_A" them:0`;

export const WALK_SETUP = `git clone https://github.com/PoulavBhowmick03/Erebus
cd Erebus
cargo build --manifest-path sdk/rs/Cargo.toml --bin erebus-cli

# Choose separate accounts and provide Sepolia RPC and prover endpoints.
erebus-init --network sepolia --role payer --config ~/.erebus-a/env --deposit 1 --writes 3
erebus-init --network sepolia --role payee --config ~/.erebus-b/env --deposit 1 --writes 2

# The shell helpers need explicit Sepolia values in each env file.
for erebus_env in ~/.erebus-a/env ~/.erebus-b/env; do
  cat >> "$erebus_env" <<'EOF'
STARKNET_CHAIN_ID=0x534e5f5345504f4c4941
POOL_ADDRESS=0x0254a6b2997ef52e9f830ce1f543f6b29768295e8d17e2267d672c552cfe0d91
EOF
done

scripts/agent.sh ~/.erebus-a/env doctor
scripts/agent.sh ~/.erebus-b/env doctor`;

export const SETTLE_RESULT = [
  "tx_hash",
  "nullifiers",
  "proved_at",
  "selected_input",
  "change",
] as const;

/* ── Docs site nav · one entry per page, in reading order ─────────────────── */

export const DOCS_PAGES = [
  { n: "01", href: "/", label: "Quickstart" },
  { n: "02", href: "/how-it-works", label: "How it works" },
  { n: "03", href: "/concepts", label: "Core concepts" },
  { n: "04", href: "/walkthrough", label: "Walkthrough" },
  { n: "05", href: "/tools", label: "Call the tools" },
  { n: "06", href: "/errors", label: "Responses and errors" },
  { n: "07", href: "/privacy", label: "Privacy model" },
  { n: "08", href: "/limits", label: "Limits" },
  { n: "09", href: "/architecture", label: "Architecture" },
] as const;

/* ── In-page sections per page · only pages with more than one, mirrors
   the DocSection id/title props actually used on that page ─────────────── */

export const PAGE_SECTIONS: Record<string, { id: string; label: string }[]> = {
  "/": [
    { id: "install", label: "Install" },
    { id: "identity", label: "Set up an identity" },
    { id: "configure", label: "Configure an identity" },
  ],
  "/how-it-works": [
    { id: "shape", label: "The shape of the problem" },
    { id: "salts", label: "Where a negotiation lives" },
    { id: "deal", label: "One deal, end to end" },
    { id: "settle", label: "What settlement enforces" },
    { id: "disclose", label: "Disclosure afterwards" },
  ],
  "/walkthrough": [
    { id: "before", label: "Before you start" },
    { id: "negotiate", label: "Negotiate" },
    { id: "settle", label: "Settle" },
    { id: "disclose", label: "Disclose one deal" },
    { id: "recover", label: "When a write looks stuck" },
  ],
  "/privacy": [
    { id: "claim", label: "The claim and the non-claim" },
    { id: "steps", label: "What leaks at each step" },
    { id: "leaks", label: "The known leaks" },
    { id: "infra", label: "Infrastructure sees more" },
    { id: "record", label: "What a disclosed record proves" },
  ],
  "/limits": [
    { id: "not", label: "What Erebus does not do" },
    { id: "production", label: "What is unfinished" },
    { id: "use", label: "Where that leaves you" },
  ],
  "/architecture": [
    { id: "map", label: "System map" },
    { id: "boundary", label: "Know the boundary" },
    { id: "cli", label: "The CLI protocol" },
    { id: "build", label: "Build from source" },
    { id: "source", label: "Read the source of truth" },
  ],
  "/tools": [
    { id: "tools", label: "The tool surface" },
    { id: "examples", label: "Request and response, per tool" },
  ],
};

/* ── Docs search index ──────────────────────────────────────────────────────
   Every visible heading must be findable by its own text, so this is built
   from DOCS_PAGES and PAGE_SECTIONS rather than hand-copied: a heading
   changed in one place used to silently go unsearchable (e.g. "Infrastructure
   sees more" was indexed under a different title and "infrastructure" as a
   search term returned nothing). KEYWORD_INDEX below stays hand-written for
   content terms that aren't headings (env vars, tool names, commands). ──── */

const HEADING_INDEX = DOCS_PAGES.flatMap((p) => {
  const sections = PAGE_SECTIONS[p.href];
  if (!sections) return [{ title: p.label, href: p.href, snippet: p.label }];
  return sections.map((s) => ({
    title: s.label,
    href: `${p.href}#${s.id}`,
    snippet: p.label,
  }));
});

const KEYWORD_INDEX = [
  {
    title: "Install",
    href: "/#install",
    snippet: "uv tool install erebus-mcp-server",
  },
  {
    title: "Set up an identity",
    href: "/#identity",
    snippet: "erebus-init, pool key, account key, auditor key",
  },
  {
    title: "Configure an identity",
    href: "/#configure",
    snippet: "mcpServers, EREBUS_BACKEND, env vars",
  },
  {
    title: "EREBUS_SPENDING_LIMITS",
    href: "/#configure",
    snippet: "per-token cap on what accept_and_settle can spend",
  },
  {
    title: "EREBUS_BACKEND",
    href: "/#configure",
    snippet: "mock or seam. mock runs the tools in memory without a chain",
  },
  {
    title: "channel, offer, deal",
    href: "/concepts#concepts",
    snippet: "core concepts: channel_handle, deal_id, note",
  },
  {
    title: "operation_id",
    href: "/concepts#concepts",
    snippet: "the idempotency key on every write",
  },
  {
    title: "viewing grant",
    href: "/concepts#concepts",
    snippet: "grant_viewing_key, reveal: disclose one deal to one recipient",
  },
  {
    title: "How it works",
    href: "/how-it-works#salts",
    snippet: "negotiation rides in note salts, no contract of our own",
  },
  {
    title: "Note salts, the 400-bit message",
    href: "/how-it-works#salts",
    snippet:
      "type, replyTo, createdAt, amount, deadline, memoHash across five notes",
  },
  {
    title: "What settlement enforces",
    href: "/how-it-works#settle",
    snippet:
      "atomic action set, amount equality is a client check not a proof predicate",
  },
  {
    title: "Walkthrough, a full deal",
    href: "/walkthrough#negotiate",
    snippet: "both sides open their own direction, offer, counter, accept",
  },
  {
    title: "Privacy model",
    href: "/privacy#claim",
    snippet: "Erebus hides the terms, not the relationship",
  },
  {
    title: "What leaks",
    href: "/privacy#leaks",
    snippet:
      "counterparty address in calldata, submission linkability, funding leg, note count",
  },
  {
    title: "The prover sees the pool key",
    href: "/privacy#infra",
    snippet: "prover and write RPC sit inside the confidentiality boundary",
  },
  {
    title: "Limits, what Erebus does not do",
    href: "/limits#not",
    snippet:
      "no escrow, no deferred delivery, no relationship privacy, unaudited",
  },
  {
    title: "open_channel, propose_offer, counter_offer",
    href: "/tools#tools",
    snippet: "negotiate, settle, disclose",
  },
  {
    title: "accept_and_settle",
    href: "/tools#tools",
    snippet: "payer only, spends the caller's notes",
  },
  {
    title: "reconcile, resume_operation, rebuild_state, doctor",
    href: "/tools#tools",
    snippet: "recovery and ops",
  },
  {
    title: "Responses and errors",
    href: "/errors#responses",
    snippet: "the ok/error envelope, retryable, error code groups",
  },
  {
    title: "System map",
    href: "/architecture#map",
    snippet:
      "the stack, the three layers, one deal start to finish, note economics",
  },
  {
    title: "Know the boundary",
    href: "/architecture#boundary",
    snippet: "agents → mcp-server → sdk/py → sdk/rs → Starknet",
  },
  {
    title: "The CLI protocol",
    href: "/architecture#cli",
    snippet: "erebus-cli, stdin/stdout JSON envelope, protocol 5",
  },
  {
    title: "Build from source",
    href: "/architecture#build",
    snippet: "git clone, cargo test, uv sync --all-packages",
  },
  {
    title: "Read the source of truth",
    href: "/architecture#source",
    snippet: "runbook.md, reference.md, ARCHITECTURE.md, status.md",
  },
] as const;

export const SEARCH_INDEX = [...HEADING_INDEX, ...KEYWORD_INDEX] as const;
