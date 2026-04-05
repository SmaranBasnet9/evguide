"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ModelOption = {
  id: string;
  brand: string;
  model: string;
};

type Props = {
  models: ModelOption[];
};

export default function UserEVFeedbackBox({ models }: Props) {
  const supabase = useMemo(() => createClient(), []);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [ownerName, setOwnerName] = useState("");
  const [evModelId, setEvModelId] = useState("");
  const [evUsed, setEvUsed] = useState("");
  const [satisfactionRating, setSatisfactionRating] = useState(4);
  const [feedback, setFeedback] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    let mounted = true;

    async function loadUserAndFeedback() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!user) {
        setIsLoggedIn(false);
        setUserId(null);
        setIsCheckingAuth(false);
        return;
      }

      setIsLoggedIn(true);
      setUserId(user.id);

      setIsCheckingAuth(false);
    }

    loadUserAndFeedback();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!userId) {
      setMessage("Please sign in first.");
      setMessageType("error");
      return;
    }

    if (ownerName.trim().length < 2) {
      setMessage("Please enter your name (at least 2 characters).");
      setMessageType("error");
      return;
    }

    if (!evModelId && !evUsed.trim()) {
      setMessage("Please select an EV model or write the EV you are using.");
      setMessageType("error");
      return;
    }

    if (feedback.trim().length < 5) {
      setMessage("Please write at least 5 characters of feedback.");
      setMessageType("error");
      return;
    }

    const wordCount = feedback.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 150) {
      setMessage("Description must be 150 words or less.");
      setMessageType("error");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("user_ev_feedback")
      .insert({
        user_id: userId,
        owner_name: ownerName.trim(),
        ev_model_id: evModelId || null,
        ev_used: evUsed.trim() || null,
        satisfaction_rating: satisfactionRating,
        feedback: feedback.trim(),
        is_approved: false,
        approved_at: null,
      })
      .select("user_id")
      .single();

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      setSaving(false);
      return;
    }

    setMessage("Your feedback has been submitted and is pending admin approval.");
    setMessageType("success");
    setEvModelId("");
    setEvUsed("");
    setSatisfactionRating(4);
    setFeedback("");
    setSaving(false);
  }

  const feedbackWordCount = feedback.trim().split(/\s+/).filter(Boolean).length;
  const remainingWords = 150 - feedbackWordCount;

  if (isCheckingAuth) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        Please <Link href="/login" className="font-semibold text-blue-600 hover:underline">log in</Link> to upload your EV experience.
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <p className="text-sm font-semibold text-blue-600">Share Your Experience</p>
      <h3 className="mt-1 text-2xl font-bold text-slate-900">Tell us about your EV</h3>
      <p className="mt-2 text-sm text-slate-600">
        Your feedback helps other buyers understand real ownership satisfaction.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Your name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Example: Alex Khan"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Choose your EV model</label>
              <select
                value={evModelId}
                onChange={(e) => setEvModelId(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
              >
                <option value="">Select from listed models</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.brand} {model.model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Or type EV you use</label>
              <input
                type="text"
                value={evUsed}
                onChange={(e) => setEvUsed(e.target.value)}
                placeholder="Example: BYD Dolphin"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Satisfaction (1 to 5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setSatisfactionRating(score)}
                  className={`h-10 w-10 rounded-xl border text-sm font-semibold ${
                    satisfactionRating === score
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Your feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="How satisfied are you with your EV and why? (Max 150 words)"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
              required
            />
            <p className={`mt-2 text-xs ${remainingWords < 0 ? "text-red-600" : "text-slate-500"}`}>
              {remainingWords < 0
                ? `${Math.abs(remainingWords)} words over limit`
                : `${remainingWords} words remaining (max 150)`}
            </p>
          </div>

          <button
            type="submit"
            disabled={saving || remainingWords < 0}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Submit Feedback"}
          </button>

          {message ? (
            <p className={`text-sm ${messageType === "error" ? "text-red-600" : "text-emerald-600"}`}>
              {message}
            </p>
          ) : null}
      </form>
    </div>
  );
}
