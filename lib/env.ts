function normalizeEnvValue(value: string | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value
    .replace(/\\n/g, "")
    .replace(/\r?\n/g, "")
    .trim();

  return normalized.length > 0 ? normalized : undefined;
}

export function readEnv(name: string): string | undefined {
  return normalizeEnvValue(process.env[name]);
}

export function readPublicEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"): string | undefined {
  switch (name) {
    case "NEXT_PUBLIC_SUPABASE_URL":
      return normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
    case "NEXT_PUBLIC_SUPABASE_ANON_KEY":
      return normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    default:
      return undefined;
  }
}

export function requireEnv(name: string): string {
  const value = readEnv(name);

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

export function requirePublicEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"): string {
  const value = readPublicEnv(name);

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}
