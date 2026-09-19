import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { DocSection } from "@/components/DocSection";
import { InlineCode } from "@/components/InlineCode";
import { NOT_DOES, PROD_GAPS, doc } from "@/lib/content";

export const metadata: Metadata = {
  title: "Erebus docs · Limits",
  description:
    "What Erebus does not do, what is unfinished before production, and which workloads it actually fits.",
};

export default function Limits() {
  return (
    <>
      <Reveal className="max-w-[68ch]">
        <h1 className="display mb-0 text-[clamp(28px,4.4vw,56px)]">Limits.</h1>
        <p className="lead mt-6 max-w-[56ch]">
          Erebus v0.2.0 is a published, mainnet-verified technical preview. It is not ready for
          material real value, and this page is specific about why.
        </p>
      </Reveal>

      <div className="mt-16 md:mt-20">
        <DocSection id="not" n="01" title="What Erebus does not do">
          <p className="prose max-w-[62ch]">
            These constraints reflect protocol design boundaries rather than open bugs. Four of
            the five are enforced at the protocol layer and cannot be bypassed in client-side
            agent code.
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
            The escrow limit ends up reshaping more designs than any other constraint here.
            Settlement is a single atomic action set, and the pool provides no timelock and no
            conditional release, so funds are never committed without also being delivered. This
            makes Erebus a good fit for work that can be verified at the moment of payment, and a
            poor fit for anything that needs delivery-versus-payment.
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
            <strong>No independent cryptographic or security review</strong> covers the wire, the
            settlement binding, the disclosure design, the hosted-prover transport, or the
            recovery journal. Four bounded mainnet runs show that the workflow completes; they do
            not show capacity, uptime, or safety under adversarial conditions, since none of that
            has been tested.
          </p>
        </DocSection>

        <DocSection id="use" n="03" title="Where that leaves you">
          <p className="prose max-w-[62ch]">
            Right now, it is advisable to stick to bounded, low-frequency work: evaluating the
            protocol, developing against <code>mock</code>, running a demo, or a small testnet
            canary using only value you can afford to lose. Every mainnet run so far has stayed
            this bounded on purpose.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Use a dedicated low-value identity for anything that touches mainnet. Registration
            cannot be reversed, and it permanently exposes that identity to the auditor.
            Whichever prover you choose gets that same permanent exposure from its side.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Erebus does not hide who you are dealing with, does not support escrow, and cannot
            prove that delivery happened. If your use case needs any of those, that gap cannot be
            closed with a configuration change.
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
