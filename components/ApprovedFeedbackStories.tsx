"use client";

import { useEffect, useMemo, useState } from "react";
import type { ApprovedFeedbackStory } from "@/lib/feedback";
import UserEVFeedbackBox from "@/components/UserEVFeedbackBox";
import { createClient } from "@/lib/supabase/client";

type Props = {
  stories: ApprovedFeedbackStory[];
  models?: Array<{
    id: string;
    brand: string;
    model: string;
  }>;
};

function renderStars(rating: number) {
  return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
}

export default function ApprovedFeedbackStories({ stories, models = [] }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [showForm, setShowForm] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAuth() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (mounted) {
          setIsLoggedIn(Boolean(user));
        }
      } finally {
        if (mounted) {
          setIsCheckingAuth(false);
        }
      }
    }

    loadAuth();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session?.user));
      setIsCheckingAuth(false);
      if (!session?.user) {
        setShowForm(false);
      }
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="mt-8">
      <div>
        <h3 className="text-2xl font-bold text-slate-900">Real User Stories</h3>
        <p className="mt-2 text-sm text-slate-600">Anonymized feedback from EV owners.</p>
      </div>

      {stories.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          No approved stories yet. Be the first to share your EV experience.
        </div>
      ) : (
        <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {stories.slice(0, 2).map((story) => (
            <article
              key={`${story.id}-${story.createdAt}`}
              className="w-[320px] shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="text-sm font-semibold text-slate-900">{story.ownerLabel}</p>
              <p className="mt-1 text-xs text-slate-500">Driving: {story.evLabel}</p>
              <p className="mt-3 text-sm font-semibold text-amber-600">{renderStars(story.rating)}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{story.feedback}</p>
            </article>
          ))}
        </div>
      )}

      {!isCheckingAuth && isLoggedIn ? (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {showForm ? "Hide Experience Form" : "Upload Your EV Experience"}
          </button>
        </div>
      ) : null}

      {isLoggedIn && showForm ? <UserEVFeedbackBox models={models} /> : null}
    </div>
  );
}
