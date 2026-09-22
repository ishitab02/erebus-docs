import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Snippet } from "@/components/Snippet";
import { DocSection } from "@/components/DocSection";
import {
  SETTLE_RESULT,
  WALK_COUNTER,
  WALK_OPEN,
  WALK_SETTLE,
  WALK_SETUP,
  doc,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Erebus docs · Walkthrough",
  description:
    "One deal from funding to disclosure, with the commands, the two-sided open, and the two costs people forget to budget for.",
};

export default function Walkthrough() {
  return (
    <>
      <Reveal className="max-w-[68ch]">
        <h1 className="display mb-0 text-[clamp(28px,4.4vw,56px)]">
          Walkthrough.
        </h1>
        <p className="lead mt-6 max-w-[56ch]">
          Run a negotiation and settlement on Sepolia with two identities. These
          commands use the helper scripts in the main Erebus repository.
        </p>
      </Reveal>

      <div className="mt-16 md:mt-20">
        <DocSection id="before" n="01" title="Before you start">
          <p className="prose max-w-[62ch]">
            Install the package from{" "}
            <a href="/" className="link">
              the quickstart
            </a>{" "}
            first. The shell examples also need Git, Python 3, and a Rust
            toolchain. Clone the main repository, build its CLI, and initialize
            two Sepolia identities with the commands below. Choose separate
            accounts and keep the generated keys and state directories separate.
            Setup asks you to fund each account, then shields the deposit and
            registers the identity. The payer needs at least 1 STRK in shielded
            notes for this example; both sides also need public STRK for fees.
          </p>
          <div className="mt-5">
            <Snippet command={WALK_SETUP} label="setup" accent />
          </div>
          <p className="prose mt-5 max-w-[62ch]">
            Run the remaining commands from the cloned repository. The helper
            scripts use the CLI you just built. If setup pauses, use its printed
            resume command. Do not repeat a shield request with a new operation
            ID.
          </p>

          <p className="prose mt-8 max-w-[62ch]">
            Budget for both public fees and shielded payment funds:
          </p>
          <ul className="mt-4 max-w-[62ch] list-disc space-y-3 pl-5">
            <li className="prose m-0">
              The payee needs an allowance for <strong>two</strong> charged
              writes, its own open and its counter, even though it never pays
              the price itself. Opening a direction submits a real{" "}
              <code>apply_actions</code> transaction, incurring the same cost as
              any other write.
            </li>
            <li className="prose m-0">
              The pool fee comes out of the identity&rsquo;s{" "}
              <strong>public</strong> STRK balance. A healthy shielded balance
              will not cover it, and neither will a large allowance.
              <code>doctor</code> flags this as a <code>gas_balance</code>{" "}
              warning when it happens.
            </li>
          </ul>
        </DocSection>

        <DocSection id="negotiate" n="02" title="Negotiate">
          <p className="prose max-w-[62ch]">
            <strong>Both sides must open their own channel direction.</strong> A
            one-sided open causes an <code>unknown channel handle</code> error
            on the counterparty, preventing the payee from seeing the offer it
            needs to answer.
          </p>
          <div className="mt-6 space-y-3">
            <Snippet command={WALK_OPEN} label="payer" />
            <Snippet command={WALK_COUNTER} label="payee" />
          </div>
          <p className="prose mt-6 max-w-[62ch]">
            The payer&rsquo;s <code>balance</code> command checks its shielded
            notes before the offer. Through MCP, use{" "}
            <code>get_note_balance</code>. Values are expressed in base units,
            working out to 0.6 and 1.0 STRK in this example. Your agent chooses
            the prices and deadlines.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Every write takes an <code>operation_id</code>. Save the ID and
            request before the call. The helper scripts record these in the
            identity state directory.
          </p>
        </DocSection>

        <DocSection id="settle" n="03" title="Settle">
          <p className="prose max-w-[62ch]">
            Only the payer settles. <code>accept_and_settle</code> spends the
            caller&rsquo;s notes, so the payee waits for the payer to accept its
            final offer.
          </p>
          <div className="mt-5">
            <Snippet command={WALK_SETTLE} label="settle" accent />
          </div>
          <p className="prose mt-5 max-w-[62ch]">
            Settlement consumes the payer&rsquo;s notes, creates the
            payee&rsquo;s note, returns change if the input values exceed the
            price, and leaves the channel pair open in case you want to run
            another deal. The result carries:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SETTLE_RESULT.map((f) => (
              <span
                key={f}
                className="mono-xs border border-rule px-2 py-1 text-fore-2"
              >
                {f}
              </span>
            ))}
          </div>
          <p className="prose mt-6 max-w-[62ch]">
            Proof generation and provider response times can keep a transaction
            pending for minutes. Use the recovery steps below if the result is
            uncertain.
          </p>
        </DocSection>

        <DocSection id="disclose" n="04" title="Disclose one deal">
          <p className="prose max-w-[62ch]">
            <code>grant_viewing_key</code> writes a grant file scoped to one
            deal and one registered recipient, with an explicit expiry.{" "}
            <code>reveal</code> reads it back and reconstructs that deal.
            Neither one touches the chain, so neither costs gas.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Use the MCP request examples in{" "}
            <a className="link" href="/tools#examples">
              the tool reference
            </a>
            . Replace the example handles and IDs with values from your session.
            Choose a registered recipient, a future expiry, and a new output
            path. Open the file with <code>reveal</code> in that
            recipient&rsquo;s session. A grant gives no spending authority.
            Expiry cannot erase data the recipient already read.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            For a local observer example, run{" "}
            <code>
              python3 scripts/observer.py scripts/fixtures/observer-wire-v3.json
            </code>
            . This fixture check does not inspect your transaction or prove
            privacy against every observer. The script also accepts a Sepolia
            transaction hash. Compare its output with the authorized reveal.
            Counterparty addresses and transaction timing remain public.
          </p>
        </DocSection>

        <DocSection id="recover" n="05" title="When a write looks stuck">
          <p className="prose max-w-[62ch]">
            You must start recovery explicitly. Never generate a new{" "}
            <code>operation_id</code> for a stuck write, as doing so risks
            duplicate execution and double payment.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Follow this sequence to resolve a stalled transaction:
          </p>
          <ol className="mt-5 max-w-[62ch] list-disc space-y-3 pl-5">
            <li className="prose m-0">
              Call <code>reconcile</code> first to inspect state. It submits no
              transactions.
            </li>
            <li className="prose m-0">
              If the classification permits resumption, call{" "}
              <code>resume_operation</code> with the original{" "}
              <strong>operation_id</strong>.
            </li>
            <li className="prose m-0">
              If the proof expired, use <code>resume_operation</code> to rebuild
              it only when the journal permits recovery. Keep the same{" "}
              <strong>operation_id</strong>.
            </li>
          </ol>
          <p className="prose mt-6 max-w-[62ch]">
            For further setup and recovery instructions, read{" "}
            <a href={doc("docs/runbook.md")} className="link">
              runbook.md ↗
            </a>
            .
          </p>
        </DocSection>
      </div>
    </>
  );
}
