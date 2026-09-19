import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Snippet } from "@/components/Snippet";
import { DocSection } from "@/components/DocSection";
import {
  ENV_VARS,
  IDENTITY_BOOTSTRAP,
  IDENTITY_KEYS,
  INSTALL,
  MCP_CONFIG,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Erebus docs · Quickstart",
  description:
    "Install the Erebus MCP server, configure an identity, and drive a shielded settlement from any agent framework.",
};

export default function Docs() {
  return (
    <>
      <Reveal className="max-w-[68ch]">
        <h1 className="display mb-0 text-[clamp(36px,6vw,80px)]">
          Get started.
        </h1>
        <p className="lead mt-8 max-w-[56ch]">
          Erebus runs as an MCP server. Install it, give it an identity, and any
          client that can set environment can drive a negotiation and a shielded
          settlement.
        </p>
      </Reveal>

      <div className="mt-16 md:mt-20">
        <DocSection id="install" n="01" title="Install">
          <Snippet command={INSTALL} label="install" highlight />
          <p className="prose mt-5 max-w-[62ch]">
            This installs the MCP server, the Python binding, and the Rust
            binary, prebuilt as a platform wheel, so there is no Rust toolchain
            to install on your end. We ship binaries for Linux x86-64 and macOS
            arm64 right now, and anything outside that means building from
            source yourself.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            <code>--python 3.12</code> is required. If omitted, <code>uv</code>{" "}
            defaults to your host system&rsquo;s Python interpreter. On older
            environments (such as Python 3.9), this causes dependency errors
            that do not explicitly reference the Python version. Explicitly
            passing <code>--python 3.12</code> ensures <code>uv</code> downloads
            and manages its own isolated runtime.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            To run everything with no chain, no keys, and no gas, set{" "}
            <code>EREBUS_BACKEND=mock</code>
          </p>
        </DocSection>

        <DocSection id="identity" n="02" title="Set up an identity">
          <p className="prose max-w-[62ch]">
            In Erebus, an identity is a Starknet account plus two key files,
            registered with the pool and holding shielded notes. One command
            walks you through the whole thing:
          </p>
          <div className="mt-5">
            <Snippet command={IDENTITY_BOOTSTRAP} label="init" accent />
          </div>
          <p className="prose mt-5 max-w-[62ch]">
            Select an existing account, or type <code>new</code> to create one.
            The command prints the account address and the funding shortfall;
            send STRK to that address and confirm to continue. From there, setup
            deploys a new account when required, approves the allowance, waits
            for proving depth, shields the chosen deposit, and finishes by
            running <code>doctor</code>. If the process times out or you close
            it before completion, resume it with <code>--resume</code> command;
            the selected address, keys, and operation IDs persist across the
            restart. For agents, <code>--list-accounts --json</code>,{" "}
            <code>--account &lt;id&gt;</code>, <code>--new</code>, and{" "}
            <code>--resume</code> make the choice explicit, and{" "}
            <code>--yes</code> authorizes the setup transactions without a
            prompt.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            <strong>Registration cannot be undone.</strong> It writes your
            identity&rsquo;s pool private key, encrypted, to the pool&rsquo;s
            auditor on-chain, granting the auditor visibility to decrypt all
            transactions linked to that identity. For any mainnet canary, use a
            disposable identity rather than your primary account.
          </p>

          <p className="prose mt-8 max-w-[62ch]">
            This process generates three distinct keys. Conflating their roles
            is a common source of configuration errors:
          </p>
          <dl className="mt-5 border-t border-rule">
            {IDENTITY_KEYS.map((k) => (
              <div
                key={k.key}
                className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-rule py-4 sm:grid-cols-[13rem_16rem_1fr]"
              >
                <dt className="mono-sm text-fore">{k.key}</dt>
                <dd className="mono-sm m-0 text-fore-2">{k.purpose}</dd>
                <dd className="mono-xs m-0 text-fore-3">{k.seenBy}</dd>
              </div>
            ))}
          </dl>
          <p className="prose mt-5 max-w-[62ch]">
            Python never sees key material, only file paths.
          </p>
        </DocSection>

        <DocSection id="configure" n="03" title="Configure an identity">
          <Snippet command={MCP_CONFIG} label="mcpServers" />
          <p className="prose mt-5 max-w-[62ch]">
            A negotiation has two sides. Register the counterparty as a second
            entry with its own identity, state directory, and{" "}
            <code>EREBUS_SETTLEMENT_ROLE=payee</code>.
          </p>

          <dl className="mt-8 border-t border-rule">
            {ENV_VARS.map((e) => (
              <div
                key={e.k}
                className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-rule py-4 sm:grid-cols-[16rem_10rem_1fr]"
              >
                <dt className="mono-sm text-fore">{e.k}</dt>
                <dd className="mono-sm tnum m-0 text-fore-2">{e.v}</dd>
                <dd className="mono-xs m-0 text-fore-3">{e.note}</dd>
              </div>
            ))}
          </dl>
          <p className="prose mt-5 max-w-[62ch]">
            <code>doctor</code> performs preflight validation before any
            transaction is submitted on-chain. It inspects local key files and
            permissions, state directory setup, RPC endpoint connectivity,
            prover availability, chain ID, registration status, token allowance,
            and account balance. Any failed check returns a specific remediation
            step. Run this command first whenever setup or execution errors
            occur.
          </p>
        </DocSection>
      </div>
    </>
  );
}
