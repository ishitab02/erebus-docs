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
    "Install the Erebus MCP server and configure identities for encrypted negotiation and shielded settlement.",
};

export default function Docs() {
  return (
    <>
      <Reveal className="max-w-[68ch]">
        <h1 className="display mb-0 text-[clamp(36px,6vw,80px)]">
          Get started.
        </h1>
        <p className="lead mt-8 max-w-[56ch]">
          Erebus is private settlement and negotiation infrastructure for AI
          agents. Its MCP server lets two agents exchange encrypted offers and
          settle through the STRK20 pool on Starknet.
        </p>
      </Reveal>

      <div className="mt-16 md:mt-20">
        <DocSection id="install" n="01" title="Install">
          <Snippet command={INSTALL} label="install" highlight />
          <p className="prose mt-5 max-w-[62ch]">
            The package includes the MCP server, Python binding, and Rust
            binary. Linux x86-64 and macOS arm64 have prebuilt packages. Other
            platforms require a source build.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Keep <code>--python 3.12</code> in the install command to select a
            supported Python version. This avoids dependency errors from an
            older system interpreter. <code>uv</code> can download Python if
            needed.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            For a local trial without funds or keys, create a separate mock
            configuration:
          </p>
          <Snippet
            command="erebus-init --network mock --config ~/.erebus-mock.env"
            label="mock setup"
          />
          <p className="prose mt-4 max-w-[62ch]">
            Configure your MCP client to launch <code>erebus-mcp-server</code>{" "}
            with <code>--config ~/.erebus-mock.env</code>. Use an absolute path
            if your client does not expand <code>~</code>.
          </p>
        </DocSection>

        <DocSection id="identity" n="02" title="Set up an identity">
          <p className="prose max-w-[62ch]">
            In Erebus, an identity is a Starknet account plus two key files,
            registered with the pool and holding shielded notes. Run the
            initializer to create or select an account:
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
            it before completion, use the printed{" "}
            <code>erebus-init --config ... --resume</code> command; the selected
            address, keys, and operation IDs persist across the restart. For
            agents, <code>--list-accounts --json</code>,{" "}
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
            Two keys belong to your identity. A third belongs to the pool
            auditor. Their roles differ:
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
            <code>doctor</code> checks whether the identity is ready to submit
            transactions. It inspects local key files and permissions, state
            directory setup, RPC endpoint connectivity, prover availability,
            chain ID, registration status, token allowance, and account balance.
            Any failed check returns a specific repair step. Run this command
            first whenever setup or execution errors occur.
          </p>
        </DocSection>
      </div>
    </>
  );
}
