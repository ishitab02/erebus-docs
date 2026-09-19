import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Snippet } from "@/components/Snippet";
import { DocSection } from "@/components/DocSection";
import {
  SETTLE_RESULT,
  WALK_COUNTER,
  WALK_OPEN,
  WALK_SETTLE,
  WALK_SHIELD,
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
          One deal, start to finish, between two identities you control. Run it
          against <code>mock</code> first, where execution requires no gas or
          private keys.
        </p>
      </Reveal>

      <div className="mt-16 md:mt-20">
        <DocSection id="before" n="01" title="Before you start">
          <p className="prose max-w-[62ch]">
            You need two identities, because a negotiation has two sides and
            each one settles from its own notes. Follow{" "}
            <a href="/" className="link">
              the quickstart
            </a>{" "}
            twice, once per identity, into two separate state directories. Then
            shield funds on the payer side, which also registers the identity
            and makes it available as a counterparty.
          </p>
          <div className="mt-5">
            <Snippet command={WALK_SHIELD} label="shield" accent />
          </div>
          <p className="prose mt-5 max-w-[62ch]">
            If the approval is too fresh, the shield can fail, since the proof
            gets built against a historical block. Give the approval time to
            reach proving depth before you retry.
          </p>

          <p className="prose mt-8 max-w-[62ch]">
            Two easily overlooked costs frequently cause initial setup errors:
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
            Call <code>get_note_balance</code> on the payer side to confirm
            sufficient funds before proposing a price. Values are expressed in
            base units, working out to 0.6 and 1.0 STRK in this example.
            Specific prices and deadlines belong in your agent policy, while
            this walkthrough illustrates the lifecycle flow.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Every write takes an <code>operation_id</code>. Persist both the ID
            and its associated intent prior to execution.
          </p>
        </DocSection>

        <DocSection id="settle" n="03" title="Settle">
          <p className="prose max-w-[62ch]">
            Only the payer settles. <code>accept_and_settle</code> spends the
            caller&rsquo;s notes, so a payee just leaves its final offer sitting
            there for the payer to accept.
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
            Transactions take 1-4 minutes to execute, with proof generation
            accounting for most of that time.
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
            A viewing grant enforces four key properties: it is restricted to a
            single deal, includes an explicit expiry, carries no spending
            authority, and requires a matching recipient pool key. Because
            disclosures are non-revocable once shared, issuing a new grant
            cannot alter or erase previously disclosed state.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            To verify these privacy boundaries, run the observer script against
            the public chain record as a negative control. The script recovers
            zero payload data from the current wire format, while confirming
            that channel relationships and transaction timestamps remain public
            metadata.
          </p>
        </DocSection>

        <DocSection id="recover" n="05" title="When a write looks stuck">
          <p className="prose max-w-[62ch]">
            Recovery here is explicit, you drive it, nothing happens
            automatically. Never generate a new <code>operation_id</code> for
            a stuck write, as doing so risks duplicate execution and double
            payment.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Follow this sequence to resolve a stalled transaction:
          </p>
          <ol className="mt-5 max-w-[62ch] list-disc space-y-3 pl-5">
            <li className="prose m-0">
              Call <code>reconcile</code> first to inspect state. This
              operation is strictly read-only and submits no transactions.
            </li>
            <li className="prose m-0">
              Call <code>resume_operation</code> retaining the original{" "}
              <strong>operation_id</strong> only when the classification
              indicates the operation is resumable.
            </li>
            <li className="prose m-0">
              Rebuild the proof under the same <strong>operation_id</strong> if
              the result indicates an expired proof and the local journal
              permits it.
            </li>
          </ol>
          <p className="prose mt-6 max-w-[62ch]">
            For clean-environment setup guides, faucet paths, and logging
            standards, refer to{" "}
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
