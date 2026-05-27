export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type QuoteRequest = {
  id: string;
  ev_model_label: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.FC<{ className?: string }> }> = {
  pending: { label: "Awaiting dealer responses", color: "text-amber-400 border-amber-500/20 bg-amber-500/8", icon: Clock },
  contacted: { label: "Dealer responded", color: "text-brand border-brand/20 bg-brand/8", icon: CheckCircle },
  resolved: { label: "Quote accepted", color: "text-white/50 border-white/10 bg-white/5", icon: CheckCircle },
};

function formatDate(v: string) {
  return new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function parseNotes(notes: string | null) {
  if (!notes) return {};
  const result: Record<string, string> = {};
  for (const line of notes.split("\n")) {
    const colon = line.indexOf(":");
    if (colon > 0) {
      result[line.slice(0, colon).trim().toLowerCase()] = line.slice(colon + 1).trim();
    }
  }
  return result;
}

export default async function MyQuotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?returnTo=/my-quotes");

  const admin = createAdminClient();
  const { data: quotes } = await admin
    .from("consultation_requests")
    .select("id, ev_model_label, notes, status, created_at")
    .eq("user_id", user.id)
    .eq("sector", "dealer_bid")
    .order("created_at", { ascending: false });

  const requests = (quotes ?? []) as QuoteRequest[];

  return (
    <main className="min-h-screen bg-surface-base text-white">
      <PremiumNavbar />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Dealer Bid Engine</p>
          <h1 className="mt-2 text-3xl font-bold">My quote requests</h1>
          <p className="mt-2 text-sm text-white/50">
            Verified dealers will respond to your requests within 24–48 hours.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/8 bg-white/[0.03] py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <MessageSquare className="h-6 w-6 text-white/30" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">No quote requests yet</p>
              <p className="mt-1 text-sm text-white/50">
                Browse EVs and click &ldquo;Get dealer quotes&rdquo; to start receiving competitive offers.
              </p>
            </div>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Browse EVs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const cfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              const parsedNotes = parseNotes(req.notes);

              return (
                <div
                  key={req.id}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold text-white">
                        {req.ev_model_label ?? "EV Quote Request"}
                      </h3>
                      <p className="mt-0.5 text-xs text-white/40">
                        Submitted {formatDate(req.created_at)}
                      </p>
                    </div>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Quote summary */}
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "Finance", value: parsedNotes["finance type"]?.toUpperCase() },
                      { label: "Max budget", value: parsedNotes["max budget"] },
                      { label: "Monthly", value: parsedNotes["monthly target"] },
                      { label: "Part exchange", value: parsedNotes["part exchange"] },
                    ]
                      .filter((item) => item.value)
                      .map(({ label, value }) => (
                        <div key={label} className="rounded-xl border border-white/6 bg-white/[0.02] p-3">
                          <p className="text-[10px] uppercase tracking-wider text-white/30">{label}</p>
                          <p className="mt-1 text-xs font-semibold text-white">{value}</p>
                        </div>
                      ))}
                  </div>

                  {req.status === "pending" && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-3">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                      <p className="text-xs text-amber-300">
                        Dealers are reviewing your request. Expect a response within 24–48 hours.
                      </p>
                    </div>
                  )}

                  {req.status === "contacted" && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand/15 bg-brand/5 px-4 py-3">
                      <CheckCircle className="h-4 w-4 shrink-0 text-brand" />
                      <p className="text-xs text-brand">
                        A dealer has responded. Check your email for their quote details.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PremiumFooter />
    </main>
  );
}
