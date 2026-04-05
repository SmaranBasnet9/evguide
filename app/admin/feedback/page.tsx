import { createAdminClient } from "@/lib/supabase/admin";
import AdminFeedbackModerationTable from "@/components/AdminFeedbackModerationTable";

type FeedbackRow = {
  id: string;
  user_id: string;
  owner_name: string | null;
  ev_used: string | null;
  satisfaction_rating: number;
  feedback: string;
  is_approved: boolean;
  created_at: string;
  ev_models: Array<{
    brand: string | null;
    model: string | null;
  }> | null;
};

async function getFeedbackRows() {
  const supabase = createAdminClient();

  const [{ data: feedbackRows, error: feedbackError }, { data: authData, error: usersError }] = await Promise.all([
    supabase
      .from("user_ev_feedback")
      .select("id, user_id, owner_name, ev_used, satisfaction_rating, feedback, is_approved, created_at, ev_models(brand, model)")
      .order("created_at", { ascending: false }),
    supabase.auth.admin.listUsers(),
  ]);

  if (feedbackError) {
    throw new Error(feedbackError.message);
  }

  if (usersError) {
    throw new Error(usersError.message);
  }

  const emailMap = new Map(authData.users.map((user) => [user.id, user.email ?? "-"]));

  return (feedbackRows as FeedbackRow[]).map((row) => {
    const model = row.ev_models?.[0] ?? null;
    const evLabel = row.ev_used || (model?.brand && model?.model ? `${model.brand} ${model.model}` : "Not specified");

    return {
      ...row,
      email: emailMap.get(row.user_id) ?? "-",
      evLabel,
    };
  });
}

export default async function AdminFeedbackPage() {
  const feedbackRows = await getFeedbackRows();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-slate-900">Feedback Moderation</h1>
      <p className="mt-1 text-slate-500">
        Review user stories and control what appears on the public site.
      </p>

      <AdminFeedbackModerationTable rows={feedbackRows} />
    </div>
  );
}
