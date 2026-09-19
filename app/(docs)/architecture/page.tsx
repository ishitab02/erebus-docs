import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Snippet } from "@/components/Snippet";
import { DocSection } from "@/components/DocSection";
import { SystemMap } from "@/components/SystemMap";
import {
  BUILD_CLONE,
  BUILD_PYTHON,
  BUILD_RUST,
  CALL_PATH,
  CLI_METHODS,
  CLI_REQUEST,
  CLI_RESPONSE,
  SYSTEM_MAP_ALT,
  doc,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Erebus docs · Architecture",
  description: "The call path key material never crosses, and where to read the rest.",
};

const NEXT = [
  ["runbook.md", doc("docs/runbook.md")],
  ["reference.md", doc("docs/reference.md")],
  ["ARCHITECTURE.md", doc("ARCHITECTURE.md")],
  ["status.md", doc("docs/status.md")],
] as const;

export default function Architecture() {
  return (
    <>
      <Reveal className="max-w-[68ch]">
        <h1 className="display mb-0 text-[clamp(28px,4.4vw,56px)]">Architecture.</h1>
        <p className="lead mt-6 max-w-[56ch]">
          System architecture, process boundaries, key isolation at sdk/rs, and build steps.
        </p>
      </Reveal>

      <div className="mt-16 md:mt-20">
        <DocSection id="map" n="01" title="System map">
          <p className="prose max-w-[62ch]">
            This one page covers the whole system: the stack running from agent to pool, the
            three layers in between, a deal traced start to finish, how a single offer turns into
            five notes, who can see what, and what the system does and does not claim to do.
          </p>
          <div className="mt-5">
            <SystemMap src="/erebus-overview.svg" alt={SYSTEM_MAP_ALT} />
          </div>
        </DocSection>

        <DocSection id="boundary" n="02" title="Know the boundary">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            {CALL_PATH.map((p, i) => {
              const isFirst = i === 0;
              const isBoundary = p === "sdk/rs";
              const arrowCrossesBoundary = CALL_PATH[i + 1] === "sdk/rs";
              return (
                <span key={p} className="flex items-center gap-4">
                  <span
                    className={`border px-4 py-2.5 text-[12px] ${
                      isBoundary
                        ? "boundary-mark font-semibold"
                        : isFirst
                          ? "border-fore font-semibold text-fore"
                          : "border-rule text-fore-2"
                    }`}
                  >
                    {p}
                  </span>
                  {i < CALL_PATH.length - 1 ? (
                    <span className={arrowCrossesBoundary ? "text-ember" : "text-fore-3"}>→</span>
                  ) : null}
                </span>
              );
            })}
          </div>
          <p className="prose mt-6 max-w-[62ch]">
            Agents manage decision policy, while Erebus infrastructure handles execution and key
            management. The boundary at{" "}
            <code style={{ color: "var(--color-ember)" }}>sdk/rs</code> strictly enforces key
            isolation: the policy engine determines negotiation flows without ever reading or
            accessing private key material.
          </p>
        </DocSection>

        <DocSection id="cli" n="03" title="The CLI protocol">
          <p className="prose max-w-[62ch]">
            <code>erebus-cli</code> receives a single JSON request via standard input (stdin) and
            outputs a uniform response envelope to standard output (stdout). Key file paths cross
            this execution boundary, but raw key values never do.
          </p>
          <div className="mt-5 space-y-3">
            <Snippet command={CLI_REQUEST} label="request" />
            <Snippet command={CLI_RESPONSE} label="response" />
          </div>
          <p className="label m-0 mb-3 mt-8 !text-fore-2">Protocol versioning</p>
          <p className="prose max-w-[62ch]">
            The <code>protocol</code> field designates the target contract version. Consumers
            enforce compatibility upfront to prevent schema mismatches:{" "}
            <code>erebus-sdk</code> validates the version number on every call, and the MCP
            server verifies protocol compatibility during its startup handshake.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            <span className="mono-xs block text-fore-3">{CLI_METHODS}</span>
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            All except <code>version</code> and <code>generate_pool_key</code> take a{" "}
            <code>config</code> object. Every chain write also takes <code>operation_id</code>.
          </p>
        </DocSection>

        <DocSection id="build" n="04" title="Build from source">
          <Snippet command={BUILD_CLONE} label="clone" accent />
          <div className="mt-3 space-y-3">
            <Snippet command={BUILD_RUST} label="rust" />
            <Snippet command={BUILD_PYTHON} label="python" />
          </div>
          <p className="label m-0 mb-3 mt-8 !text-fore-2">Workspace dependencies</p>
          <p className="prose max-w-[62ch]">
            Always run <code>uv sync --all-packages</code>. Executing <code>uv sync</code>{" "}
            without <code>--all-packages</code> skips editable installs for workspace members,
            preventing local <code>erebus-*</code> packages from importing correctly.
          </p>
          <p className="label m-0 mb-3 mt-8 !text-fore-2">TypeScript SDK</p>
          <p className="prose max-w-[62ch]">
            Serves exclusively as a differential-test oracle and requires a sibling checkout of{" "}
            <code>starkware-libs/starknet-privacy</code> to function. Toolchain: scarb 2.17.0 /
            starknet-foundry 0.59.0, Node 20+, Rust stable.
          </p>
        </DocSection>

        <DocSection id="source" n="05" title="Read the source of truth">
          <ul className="m-0 list-none space-y-3 p-0">
            {NEXT.map(([label, href]) => (
              <li key={label}>
                <a href={href} className="link">
                  {label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="prose mt-6 max-w-[62ch]">
            Unaudited, no external security review yet. Do not process high-value funds or
            production assets through this software.
          </p>
        </DocSection>
      </div>
    </>
  );
}
