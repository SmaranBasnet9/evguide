import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
}

// This function is used to get the list of tables in the public schema
// and their row security settings
export async function getPublicSchemaTables() {
  const client = await createClient();
  const { data, error } = await client
    .from("information_schema.tables")
    .select("table_schema, table_name")
    .eq("table_schema", "public")
    .eq("table_name", "ev_models");
  if (error) throw error;
  return data;
}