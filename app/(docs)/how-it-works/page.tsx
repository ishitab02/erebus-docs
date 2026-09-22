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
          Erebus stores encrypted offers in pool notes. The payer accepts an
          offer and pays in one transaction. The pool proof checks note
          spending. The Rust client checks that the payment matches the offer.
        </p>
      </Reveal>

      <div className="mt-16 md:mt-20">
        <DocSection id="shape" n="01" title="The shape of the problem">
          <p className="prose max-w-[62ch]">
            Two agents exchange offers and counteroffers. When the payer
            accepts, Erebus submits the acceptance and payment together. The
            pool applies both or neither.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Encryption hides the messages. Authorization controls who can act.
            The pool proof checks that the settlement obeys its spending rules.
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
            Erebus implements the negotiation messages and client checks. STRK20
            verifies and applies the pool actions. Erebus uses the existing pool
            contract and deploys no separate negotiation contract.
          </p>
        </DocSection>

        <DocSection id="salts" n="02" title="Where a negotiation lives">
          <p className="prose max-w-[62ch]">
            Pool notes lack a dedicated payload field, but the contract accepts
            a client-written salt anywhere in the range{" "}
            <code>
              2 &le; salt &lt; 2<sup>120</sup>
            </code>{" "}
            and stores it in the note&rsquo;s high bits. Since the contract does
            not interpret the salt as a negotiation message, Erebus uses this
            space to store negotiation messages directly.
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
            Wire v3 adds a 64-bit deal ID and encrypts the message with
            AES-256-GCM-SIV. The encrypted frame and authentication tag occupy
            592 bits across five note salts. Each salt provides 119 payload
            bits. A derived keystream masks the three unused bits, removing the
            fixed padding pattern from wire v2.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Note salts are public, so encryption protects the message contents.
            An observer can count the notes and see the transaction timing, but
            cannot read the price from the encrypted message.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Erebus uses structured salts only on{" "}
            <strong>zero-amount notes</strong>. Notes carrying actual token
            amounts require random salts to serve as one-time pad nonces.
            Reusing a non-random mask on value-bearing notes enables an observer
            to subtract ciphertexts and recover the exact delta between amounts.
            Zero-amount notes do not leak an amount difference. Their count and
            timing remain visible.
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
                "A grant lets one named recipient read one deal. It costs no gas and writes nothing to the chain, because it only unlocks data that is already there.",
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
            Pool writes follow the same path. The client simulates the action
            set, obtains a proof, and submits it through{" "}
            <code>apply_actions</code>. The pool requires a valid proof before
            it applies the actions.
          </p>
        </DocSection>

        <DocSection id="settle" n="04" title="What settlement enforces">
          <p className="prose max-w-[62ch]">
            The acceptance and payment share one action set. If the pool rejects
            that action set, neither takes effect.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            The pool proof checks that the input notes exist and that the
            spender controls the required keys. It also checks value
            conservation and prevents double spending.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            But the check that the amount paid equals the amount accepted lives{" "}
            <strong>client-side, in the Rust SDK</strong>. The STRK20 circuit
            does not know what a negotiation is, so it cannot evaluate that as a
            predicate.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Spending your notes requires your private key. A payer with modified
            client code can bypass its own amount-equality check. A recipient
            must compare the accepted amount with the payment record.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            A settlement creates six notes when the payer&rsquo;s inputs match
            the price exactly, and seven when they overshoot and a change note
            is minted.
          </p>
        </DocSection>

        <DocSection id="disclose" n="05" title="Disclosure afterwards">
          <p className="prose max-w-[62ch]">
            A viewing grant lets a named recipient read one deal. Erebus
            encrypts the read capability to the recipient&rsquo;s registered
            pool key and includes an expiry.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            The grant covers one deal. A grant holder can neither read other
            deals within the same channel nor execute transactions, as spending
            always requires the owner&rsquo;s pool private key. In mainnet
            testing, a third-party account successfully reconstructed a single
            deal from a scoped grant without exposing two earlier deals in the
            same channel.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Read{" "}
            <a href="/privacy#record" className="link">
              the privacy model
            </a>{" "}
            before relying on a disclosed record. It explains which facts the
            record proves and which it only asserts.
          </p>
        </DocSection>
      </div>
    </>
  );
}
