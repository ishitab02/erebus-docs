import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { DocSection } from "@/components/DocSection";
import { InlineCode } from "@/components/InlineCode";
import { NOT_DOES, PROD_GAPS, doc } from "@/lib/content";

export const metadata: Metadata = {
  title: "Erebus docs · Limits",
  description:
    "What Erebus does not do, what is unfinished before production, and the limits of the recorded tests.",
};

export default function Limits() {
  return (
    <>
      <Reveal className="max-w-[68ch]">
        <h1 className="display mb-0 text-[clamp(28px,4.4vw,56px)]">Limits.</h1>
        <p className="lead mt-6 max-w-[56ch]">
          Erebus has no escrow, delivery verification, or relationship privacy.
          It also needs further security review and operational testing before
          production use.
        </p>
      </Reveal>

      <div className="mt-16 md:mt-20">
        <DocSection id="not" n="01" title="What Erebus does not do">
          <p className="prose max-w-[62ch]">
            The current implementation has the limits below. Configuration
            changes alone cannot remove them.
          </p>
          <div className="mt-8 space-y-8">
            {NOT_DOES.map((n) => (
              <div key={n.title}>
                <p className="mono-sm m-0 text-fore">{n.title}</p>
                <p className="prose mt-2 max-w-[58ch]">
                  <InlineCode text={n.body} />
                </p>
              </div>
            ))}
          </div>
          <p className="prose mt-8 max-w-[62ch]">
            Settlement transfers funds immediately. The pool cannot hold them
            until a later delivery or release them when an external condition is
            met. Your application must decide whether to pay before it calls
            settlement.
          </p>
        </DocSection>

        <DocSection id="production" n="02" title="What is unfinished">
          <dl className="border-t border-rule">
            {PROD_GAPS.map((g) => (
              <div
                key={g.area}
                className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-rule py-5 md:grid-cols-[13rem_1fr]"
              >
                <dt className="mono-sm text-fore">{g.area}</dt>
                <dd className="prose m-0 max-w-[58ch]">{g.body}</dd>
              </div>
            ))}
          </dl>
          <p className="prose mt-6 max-w-[62ch]">
            <strong>No independent cryptographic or security review</strong>{" "}
            covers the wire, the settlement binding, the disclosure design, the
            hosted-prover transport, or the recovery journal. Four bounded
            mainnet runs show that the workflow completes; they do not show
            capacity, uptime, or safety under adversarial conditions, since none
            of that has been tested.
          </p>
        </DocSection>

        <DocSection id="use" n="03" title="Where that leaves you">
          <p className="prose max-w-[62ch]">
            Use Erebus for small evaluations: develop against <code>mock</code>,
            run a demo, or test a small transaction on Sepolia. The recorded
            mainnet runs do not establish production readiness.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Use a dedicated low-value identity for anything that touches
            mainnet. Registration cannot be reversed, and it permanently exposes
            that identity to the auditor. Whichever prover you choose gets that
            same permanent exposure from its side.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Erebus does not hide who you are dealing with, does not support
            escrow, and cannot prove that delivery happened. If your use case
            needs any of those, that gap cannot be closed with a configuration
            change.
          </p>
          <p className="prose mt-8 max-w-[62ch]">
            The current gap list lives at{" "}
            <a href={doc("docs/production-gaps.md")} className="link">
              production-gaps.md ↗
            </a>{" "}
            and{" "}
            <a href={doc("docs/status.md")} className="link">
              status.md ↗
            </a>{" "}
            has the actual current state.
          </p>
        </DocSection>
      </div>
    </>
  );
}
