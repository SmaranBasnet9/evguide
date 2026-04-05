import { createClient } from "@/lib/supabase/server";

type RawFeedbackRow = {
  id: string;
  user_id: string;
  owner_name: string | null;
  ev_used: string | null;
  satisfaction_rating: number;
  feedback: string;
  created_at: string;
  ev_models: Array<{
    brand: string | null;
    model: string | null;
  }> | null;
};

export type ApprovedFeedbackStory = {
  id: string;
  ownerLabel: string;
  evLabel: string;
  rating: number;
  feedback: string;
  createdAt: string;
};

function anonymizeUser(userId: string) {
  return `EV Owner ${userId.slice(0, 6).toUpperCase()}`;
}

export async function getApprovedFeedbackStories(limit = 6): Promise<ApprovedFeedbackStory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_ev_feedback")
    .select("id, user_id, owner_name, ev_used, satisfaction_rating, feedback, created_at, ev_models(brand, model)")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    if (error) {
      console.error("Error fetching approved stories:", error.message);
    }
    return [];
  }

  return (data as RawFeedbackRow[]).map((item) => {
    const modelRow = item.ev_models?.[0] ?? null;
    const modelName = modelRow?.brand && modelRow?.model
      ? `${modelRow.brand} ${modelRow.model}`
      : null;

    return {
      id: item.id,
      ownerLabel: item.owner_name?.trim() || anonymizeUser(item.user_id),
      evLabel: item.ev_used || modelName || "EV not specified",
      rating: item.satisfaction_rating,
      feedback: item.feedback,
      createdAt: item.created_at,
    };
  });
}

export async function getApprovedFeedbackStoriesForModel(
  brand: string,
  model: string,
  limit = 6
): Promise<ApprovedFeedbackStory[]> {
  const allStories = await getApprovedFeedbackStories(100);
  const brandLower = brand.toLowerCase();
  const modelLower = model.toLowerCase();

  const matched = allStories.filter((story) => {
    const label = story.evLabel.toLowerCase();
    return label.includes(brandLower) && label.includes(modelLower);
  });

  return matched.slice(0, limit);
}
