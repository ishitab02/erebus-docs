import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { DocSection } from "@/components/DocSection";
import { CRYPTO_JOBS, WIRE_FIELDS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Erebus docs · How it works",
  description:
    "Where a negotiation actually lives, what one deal does end to end, and what the settlement proof does and does not enforce.",
};

export default function HowItWorks() {
  return (
    <>
      <Reveal className="max-w-[68ch]">
        <h1 className="display mb-0 text-[clamp(28px,4.4vw,56px)]">
          How it works.
        </h1>
        <p className="lead mt-6 max-w-[56ch]">
          Enables autonomous agents to negotiate terms and execute settlement without
          revealing offer amounts or payment details on-chain. This page explains where
          a negotiation lives on-chain and what the settlement proof does and does not
          enforce.
        </p>
      </Reveal>

      <div className="mt-16 md:mt-20">
        <DocSection id="shape" n="01" title="The shape of the problem">
          <p className="prose max-w-[62ch]">
            An agent negotiation follows a structured message sequence: offer,
            counteroffer and acceptance, followed by settlement. Executing
            either phase privately is an established pattern on its own. The
            core protocol challenge is binding the two together, so the payment
            provably reflects the terms that were agreed.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            This workflow requires three distinct cryptographic tasks. Only the
            third requires a zero-knowledge proof.
          </p>
          <dl className="mt-6 border-t border-rule">
            {CRYPTO_JOBS.map((j) => (
              <div
                key={j.job}
                className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-rule py-4 md:grid-cols-[13rem_1fr_9rem]"
              >
                <dt className="mono-sm text-fore">{j.job}</dt>
                <dd className="mono-xs m-0 text-fore-2">{j.mechanism}</dd>
                <dd className="mono-xs m-0 text-fore-3">{j.proof}</dd>
              </div>
            ))}
          </dl>
          <p className="prose mt-6 max-w-[62ch]">
            Erebus owns the first two tasks. The third is delegated to the
            existing, audited STRK20 privacy pool. Since negotiations run
            entirely within data structures that the pool already provides,
            Erebus does not require dedicated smart contract deployments.
          </p>
        </DocSection>

        <DocSection id="salts" n="02" title="Where a negotiation lives">
          <p className="prose max-w-[62ch]">
            Pool notes lack a dedicated payload field, but the contract accepts
            a client-written salt anywhere in the range{" "}
            <code>
              2 &le; salt &lt; 2<sup>120</sup>
            </code>{" "}
            and stores it in the note&rsquo;s high bits. Since the contract
            never interprets this number, Erebus uses this space to store
            negotiation messages directly.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Each message consists of a 400-bit plaintext payload, formatted in
            most-significant-bit (MSB) order:
          </p>
          <dl className="mt-5 border-t border-rule">
            {WIRE_FIELDS.map((f) => (
              <div
                key={f.field}
                className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-rule py-3 sm:grid-cols-[10rem_5rem_1fr]"
              >
                <dt className="mono-sm text-fore">{f.field}</dt>
                <dd className="mono-xs tnum m-0 text-fore-2">{f.bits} bits</dd>
                <dd className="mono-xs m-0 text-fore-3">{f.note}</dd>
              </div>
            ))}
          </dl>
          <p className="prose mt-6 max-w-[62ch]">
            The plaintext is encrypted with AES-256-GCM-SIV prior to
            transmission. The current wire prepends a 64-bit deal id so one
            channel can carry more than one deal, then splits the resulting
            ciphertext and authentication tag across the salts of five notes.
            Each note carries 119 usable payload bits, so five notes yield 595
            bits total. A derived keystream masks any spare bits to eliminate
            predictable structural patterns.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Because note salts are public on-chain, confidentiality relies
            entirely on the encryption payload rather than on storage privacy.
            An observer can verify that five notes were generated without being
            able to distinguish between different offer values. An offer of 1
            STRK and an offer of 500 STRK look identical on-chain.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            This design introduces one mandatory constraint: structured salts
            are restricted strictly to <strong>zero-amount notes</strong>. Notes
            carrying actual token amounts require random salts to serve as
            one-time pad nonces. Reusing a non-random mask on value-bearing
            notes enables an observer to subtract ciphertexts and recover the
            exact delta between amounts. Zero-amount notes carry no balance
            information, so embedding structured payloads within their salt
            field introduces no privacy risk.
          </p>
        </DocSection>

        <DocSection id="deal" n="03" title="One deal, end to end">
          <ol className="m-0 mt-1 list-none space-y-5 p-0">
            {[
              [
                "Fund",
                "Shielding moves tokens into the pool as a real ERC-20 transfer, and registers the identity. This step is public in full: depositor, amount, token, and timing.",
              ],
              [
                "Open a channel",
                "Each side opens its own direction to the other. Both directions are required: a one-sided open leaves the counterparty unable to see the offer it is meant to answer.",
              ],
              [
                "Offer and counter",
                "Each message is encrypted, split across five zero-amount note salts, and written to the pool. The counterparty locates it by deriving the same note ids from the shared channel secret, so no scanning of public events is involved.",
              ],
              [
                "Accept and settle",
                "The payer builds a single action set that contains both the acceptance and the payment. Its notes are spent, the payee's note is created, and a change note is created if the inputs overshot the price.",
              ],
              [
                "Disclose, if you want to",
                "A grant hands one deal to one named recipient. It costs no gas and writes nothing to the chain, because it only unlocks data that is already there.",
              ],
            ].map(([title, body], i) => (
              <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-x-5">
                <span className="mono-xs pt-1 text-fore-3">
                  {String(i).padStart(2, "0")}
                </span>
                <div>
                  <p className="mono-sm m-0 text-fore">{title}</p>
                  <p className="prose mt-2 max-w-[58ch]">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="prose mt-8 max-w-[62ch]">
            All transaction writes follow the same path. The client must
            simulate the action set locally, generate a proof, and submit it via{" "}
            <code>apply_actions</code>. Proof generation is mandatory and cannot
            be bypassed.
          </p>
        </DocSection>

        <DocSection id="settle" n="04" title="What settlement enforces">
          <p className="prose max-w-[62ch]">
            Settlement executes as a single action set on-chain, ensuring that
            acceptance and payment occur simultaneously within a single state
            transition. This eliminates any window where one party is committed
            while the other is not.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Within this transition, the pool&rsquo;s zero-knowledge proof
            enforces core protocol rules on-chain: it verifies that spent notes
            exist, the spender controls the required private keys, total inputs
            equal total outputs plus fees, and no note is double spent.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            But the check that the amount paid equals the amount accepted lives{" "}
            <strong>client-side, in the Rust SDK</strong>. The STRK20 circuit
            does not know what a negotiation is, so it cannot evaluate that as a
            predicate.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            A counterparty running modified client code cannot steal your notes,
            as spending always requires your private key. However, matching the
            agreed price to the transferred amount is enforced by your local
            client software rather than the chain. Moving this check into the
            settlement verifier is planned for a future release.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            A settlement creates six notes when the payer&rsquo;s inputs match
            the price exactly, and seven when they overshoot and a change note
            is minted.
          </p>
        </DocSection>

        <DocSection id="disclose" n="05" title="Disclosure afterwards">
          <p className="prose max-w-[62ch]">
            Selective disclosure is essential for auditing, regulatory
            compliance, and dispute resolution. A grant derives a unidirectional
            read capability for a single deal, encrypts it to the
            recipient&rsquo;s registered pool key, and binds an expiry.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            This read capability is strictly scoped. A grant holder can neither
            read other deals within the same channel nor execute transactions,
            as spending always requires the owner&rsquo;s pool private key. In
            mainnet testing, a third-party account successfully reconstructed a
            single deal from a scoped grant without exposing two earlier deals
            in the same channel.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Read{" "}
            <a href="/privacy#record" className="link">
              the privacy model
            </a>{" "}
            before relying on a disclosed record. It documents plainly what such
            a record does and does not establish.
          </p>
        </DocSection>
      </div>
    </>
  );
}
