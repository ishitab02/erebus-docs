import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { DocSection } from "@/components/DocSection";
import { Snippet } from "@/components/Snippet";
import { InlineCode } from "@/components/InlineCode";
import { TOOL_DETAILS, TOOL_GROUPS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Erebus docs · Call the tools",
  description:
    "The thirteen MCP tools: signatures, notes, and the full negotiation sequence.",
};

export default function Tools() {
  return (
    <>
      <Reveal className="max-w-[68ch]">
        <h1 className="display mb-0 text-[clamp(28px,4.4vw,56px)]">
          Call the tools.
        </h1>
        <p className="lead mt-6 max-w-[56ch]">
          The thirteen MCP tools, with arguments and example responses. The
          server uses CLI Protocol 5.
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
                      <span className="mono-xs tnum text-fore-3">
                        {TOOL_DETAILS[t]?.signature}
                      </span>
                      <span className="mono-xs text-fore-3">
                        {TOOL_DETAILS[t]?.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="prose mt-5 max-w-[62ch]">
            A negotiation uses <code>open_channel</code>,{" "}
            <code>propose_offer</code>, <code>wait_for_offers</code>,{" "}
            <code>counter_offer</code>, and <code>accept_and_settle</code>,
            followed by <code>grant_viewing_key</code> and <code>reveal</code>{" "}
            to disclose the settled deal.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            Every write operation requires an <code>operation_id</code>. Save
            the ID and request before the call. Reuse that ID after a restart.
            More on this under{" "}
            <a href="/concepts#concepts" className="link">
              core concepts
            </a>
            .
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            This page documents <strong>CLI Protocol 5</strong> (
            <strong>v0.3.0</strong>), which exposes the thirteen tools listed
            above. Protocol 5 adds account setup through the installed package (
            <code>erebus-init</code>) while retaining Protocol 4&rsquo;s{" "}
            <code>operation_id</code> mechanics for settlement requests. Version{" "}
            <strong>v0.2.0</strong> implements <strong>Protocol 4</strong>,
            while <strong>v0.1.0</strong> implements <strong>Protocol 2</strong>{" "}
            with ten tools. To detect incompatible request and response formats,{" "}
            <code>erebus-sdk</code> validates protocol compatibility by protocol
            number before each call.
          </p>
        </DocSection>

        <DocSection id="examples" n="02" title="Request and response, per tool">
          <p className="prose max-w-[62ch]">
            All responses use the standard envelope{" "}
            <code>{"{ok, backend, network, result | error}"}</code>. Write
            operations include the <code>operation_id</code> supplied in the
            request. In the examples below, <code>{'{"...": "..."}'}</code>{" "}
            indicates fields truncated for readability.
          </p>
          <p className="prose mt-4 max-w-[62ch]">
            An <code>offer_id</code> uses the format{" "}
            <code>{"<channel>:us:<n>"}</code> or{" "}
            <code>{"<channel>:them:<n>"}</code>, where <code>us</code> and{" "}
            <code>them</code> are relative to the caller. A single offer appears
            as <code>us:0</code> to its proposer and <code>them:0</code> to the
            recipient; an ID copied from the counterparty&rsquo;s transcript
            refers to the wrong direction in your session. Unless noted
            otherwise, example payloads represent a single payer session.
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
                      <Snippet
                        command={d.request}
                        label={`${t}-request`}
                        accent
                      />
                    </div>
                    <div>
                      <p className="mono-xs mb-2 uppercase tracking-[0.14em] text-fore-3">
                        Response
                      </p>
                      <Snippet command={d.response} label={`${t}-response`} />
                    </div>
                  </div>
                  {d.detail ? (
                    <p className="prose mt-3 max-w-[62ch] text-fore-3">
                      <InlineCode text={d.detail} />
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </DocSection>
      </div>
    </>
  );
}
