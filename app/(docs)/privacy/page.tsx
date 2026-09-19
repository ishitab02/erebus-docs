import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { DocSection } from "@/components/DocSection";
import { InlineCode } from "@/components/InlineCode";
import {
  DISCLOSURE_ASSERTS,
  DISCLOSURE_PROVES,
  INFRA_VISIBILITY,
  KNOWN_LEAKS,
  LEAK_STEPS,
  PRIVACY_CLAIM,
  PRIVACY_NONCLAIM,
  PRIVACY_ONE_LINE,
  doc,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Erebus docs · Privacy model",
  description:
    "What Erebus hides, what it does not, and the known leaks in descending severity. The canonical statement.",
};

export default function Privacy() {
  return (
    <>
      <Reveal className="max-w-[68ch]">
        <h1 className="display mb-0 text-[clamp(28px,4.4vw,56px)]">Privacy model.</h1>
        <p className="lead mt-6 max-w-[56ch]">
          Documents what is actually hidden, what is not, and where the edges are.
        </p>
      </Reveal>

      <div className="mt-16 md:mt-20">
        <DocSection id="claim" n="01" title="The claim and the non-claim">
          <p className="label m-0 mb-3 !text-fore-2">The claim</p>
          <p className="prose max-w-[62ch]">{PRIVACY_CLAIM}</p>

          <p className="label m-0 mb-3 mt-8 !text-fore-2">The non-claim</p>
          <p className="prose max-w-[62ch]">
            <InlineCode text={PRIVACY_NONCLAIM} />
          </p>

          <p
            className="mt-8 max-w-[52ch] border-l-2 py-1 pl-5 text-[clamp(17px,1.9vw,23px)] leading-[1.35] text-fore"
            style={{ borderColor: "var(--color-ember)" }}
          >
            {PRIVACY_ONE_LINE}
          </p>
          <p className="prose mt-6 max-w-[62ch]">
            Erebus provides payload confidentiality rather than absolute privacy. If your threat
            model requires concealing that two parties transacted at all, Erebus does not support
            that requirement.
          </p>
        </DocSection>

        <DocSection id="steps" n="02" title="What leaks at each step">
          <dl className="border-t border-rule">
            {LEAK_STEPS.map((s) => (
              <div
                key={s.step}
                className="grid grid-cols-1 gap-x-8 gap-y-2 border-b border-rule py-5 lg:grid-cols-[13rem_1fr_1fr]"
              >
                <dt className="mono-sm text-fore">{s.step}</dt>
                <dd className="mono-xs m-0 text-fore-2">
                  <span className="label m-0 mb-1 block !text-fore-3">Hidden</span>
                  {s.hidden}
                </dd>
                <dd className="mono-xs m-0 text-fore-3">
                  <span className="label m-0 mb-1 block !text-fore-3">Public</span>
                  {s.open}
                </dd>
              </div>
            ))}
          </dl>
          <p className="prose mt-6 max-w-[62ch]">
            Granting and revealing produce zero chain activity. Disclosure is just a local read
            against data that is already on chain, which is why a grant costs no gas and leaves
            no trace behind.
          </p>
        </DocSection>

        <DocSection id="leaks" n="03" title="The known leaks">
          <p className="prose max-w-[62ch]">
            Listed in descending order of severity. Each one is either something we measured in
            this repository or something you can see directly in the upstream contract source.
          </p>
          <div className="mt-8 space-y-10">
            {KNOWN_LEAKS.map((l) => (
              <div key={l.n} className="grid grid-cols-[2.5rem_1fr] gap-x-5">
                <span className="mono-xs pt-1 text-ember">{l.n}</span>
                <div>
                  <p className="mono-sm m-0 text-fore">{l.title}</p>
                  <p className="prose mt-3 max-w-[58ch]">
                    <InlineCode text={l.body} />
                  </p>
                  <p className="mono-xs mt-3 max-w-[58ch] text-fore-3">
                    <InlineCode text={l.fix} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DocSection>

        <DocSection id="infra" n="04" title="Infrastructure sees more than the chain">
          <p className="prose max-w-[62ch]">
            The chain is not the only observer. The pool is an account contract simulated
            locally, so the compiled action set embeds the pool private key directly in its
            calldata. Two endpoints receive that calldata.
          </p>
          <dl className="mt-6 border-t border-rule">
            {INFRA_VISIBILITY.map((e) => (
              <div
                key={e.endpoint}
                className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-rule py-4 md:grid-cols-[13rem_1fr_9rem]"
              >
                <dt className="mono-sm text-fore">{e.endpoint}</dt>
                <dd className="mono-xs m-0 text-fore-2">{e.how}</dd>
                <dd className="mono-xs m-0 text-fore-3">{e.key}</dd>
              </div>
            ))}
          </dl>
          <p className="prose mt-6 max-w-[62ch]">
            Both can therefore reconstruct that identity&rsquo;s full history. The exposure
            aggregates across users on a shared prover, and it is permanent: there is no rotation
            and no revocation. Using a hosted prover means trusting that provider with your
            private data. Running your own prover removes that provider, but then you have to
            handle the node, storage, screening, and uptime work yourself.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            The submitted transaction itself never includes the key, so this one part of the
            design stays safe.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Separately, registration writes your pool private key, encrypted, to one auditor key
            that covers the whole pool. This is set once, it covers everything that identity ever
            does, and you never get asked to approve it, it happens the moment you register.
            There is no undoing it afterward. Use a separate, low-value identity for anything you
            put on mainnet.
          </p>
        </DocSection>

        <DocSection id="record" n="05" title="What a disclosed record proves">
          <p className="label m-0 mb-3 !text-fore-2">It proves</p>
          <p className="prose max-w-[62ch]">
            <InlineCode text={DISCLOSURE_PROVES} />
          </p>
          <p className="label m-0 mb-3 mt-8 !text-fore-2">It only asserts</p>
          <p className="prose max-w-[62ch]">
            <InlineCode text={DISCLOSURE_ASSERTS} />
          </p>
          <p className="prose mt-8 max-w-[62ch]">
            This atomicity guarantee is limited. The acceptance and the payment share one action
            set, but the amount-equality check runs client-side. The STRK20 circuit does not
            understand what a negotiation is, so it cannot prove that the negotiation and the
            payment actually match.
          </p>
          <p className="prose mt-6 max-w-[62ch]">
            The canonical version of this page is{" "}
            <a href={doc("docs/privacy-model.md")} className="link">
              privacy-model.md ↗
            </a>
            , which includes the contract line references behind each claim.
          </p>
        </DocSection>
      </div>
    </>
  );
}
