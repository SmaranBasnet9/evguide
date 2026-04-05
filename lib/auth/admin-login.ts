import type { SupabaseClient, User } from "@supabase/supabase-js";

type ProfileRow = {
  id: string;
  role: string | null;
};

export type AdminLoginResult =
  | { ok: true; user: User }
  | { ok: false; message: string };

export async function loginAdminWithPassword(
  supabase: SupabaseClient,
  email: string,
  password: string
): Promise<AdminLoginResult> {
  try {
    // Authenticate first. Do not write to profiles here.
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return { ok: false, message: signInError.message };
    }

    const user = authData.user;
    if (!user) {
      return { ok: false, message: "Login failed. User not found." };
    }

    // Read the existing profile row for this authenticated user.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .single<ProfileRow>();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return { ok: false, message: "Profile not found. Please contact support." };
    }

    if (profile.role !== "admin") {
      await supabase.auth.signOut();
      return { ok: false, message: "Access denied. Admin account required." };
    }

    return { ok: true, user };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected login error.";
    return { ok: false, message };
  }
}