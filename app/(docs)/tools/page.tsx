import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { DocSection } from "@/components/DocSection";
import { Snippet } from "@/components/Snippet";
import { TOOL_DETAILS, TOOL_GROUPS, VERSION_NOTE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Erebus docs · Call the tools",
  description: "The thirteen MCP tools: signatures, notes, and the full negotiation sequence.",
};

export default function Tools() {
  return (
    <>
      <Reveal className="max-w-[68ch]">
        <h1 className="display mb-0 text-[clamp(28px,4.4vw,56px)]">Call the tools.</h1>
        <p className="lead mt-6 max-w-[56ch]">
          Thirteen tools, Protocol 5. Amounts are decimal strings, <code>memo_hash</code> is hex.
        </p>
      </Reveal>

      <div className="mt-16 md:mt-20">
        <DocSection id="tools" n="01" title="The tool surface">
          <div className="border-t border-rule">
            {TOOL_GROUPS.map((g) => (
              <div key={g.label} className="border-b border-rule py-6">
                <p className="label m-0 mb-4 !text-fore-2">{g.label}</p>
                <div className="space-y-4">
                  {g.tools.map((t) => (
                    <div
                      key={t}
                      className="grid grid-cols-1 gap-x-8 gap-y-1 xl:grid-cols-[11rem_19rem_1fr]"
                    >
                      <span className="mono-sm text-fore">{t}</span>
                      <span className="mono-xs tnum text-fore-3">{TOOL_DETAILS[t]?.signature}</span>
                      <span className="mono-xs text-fore-3">{TOOL_DETAILS[t]?.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="prose mt-5 max-w-[62ch]">
            A full negotiation is <code>open_channel</code>, <code>propose_offer</code>,{" "}
            <code>wait_for_offers</code>, <code>counter_offer</code>,{" "}
            <code>accept_and_settle</code>, then <code>grant_viewing_key</code> and{" "}
            <code>reveal</code>.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Every write takes <code>operation_id</code>. Persist it and the intent before the
            call, and reuse both after a restart. See <code>operation_id</code> under core
            concepts.
          </p>
          <p className="prose mt-4 max-w-[62ch]">{VERSION_NOTE}</p>
        </DocSection>

        <DocSection id="examples" n="02" title="Request and response, per tool">
          <p className="prose max-w-[62ch]">
            Every envelope is <code>{"{ok, backend, network, result | error}"}</code>. A write
            also carries back the <code>operation_id</code> it was called with.{" "}
            <code>{'{"...": "..."}'}</code> marks a value elided for length, not a real field
            name.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            An <code>offer_id</code> reads as{" "}
            <code>{"<channel>:us:<n>"}</code> or <code>{"<channel>:them:<n>"}</code>, and the{" "}
            <code>us</code> and <code>them</code> are relative to whoever is calling. The same
            offer is <code>us:0</code> to the side that made it and <code>them:0</code> to the
            side that received it, so an id copied from one agent&rsquo;s transcript into the
            other&rsquo;s call will not resolve. Except where noted, these examples are one
            payer&rsquo;s session.
          </p>
          <div className="mt-8 space-y-10 border-t border-rule pt-8">
            {TOOL_GROUPS.flatMap((g) => g.tools).map((t) => {
              const d = TOOL_DETAILS[t];
              if (!d) return null;
              return (
                <div key={t}>
                  <p className="mono-sm mb-3 text-fore">{t}</p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="mono-xs mb-2 uppercase tracking-[0.14em] text-fore-3">
                        Request
                      </p>
                      <Snippet command={d.request} label={`${t}-request`} accent />
                    </div>
                    <div>
                      <p className="mono-xs mb-2 uppercase tracking-[0.14em] text-fore-3">
                        Response
                      </p>
                      <Snippet command={d.response} label={`${t}-response`} />
                    </div>
                  </div>
                  {d.detail ? <p className="prose mt-3 max-w-[62ch] text-fore-3">{d.detail}</p> : null}
                </div>
              );
            })}
          </div>
        </DocSection>
      </div>
    </>
  );
}
