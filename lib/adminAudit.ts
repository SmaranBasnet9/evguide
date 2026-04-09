import { existsSync } from "node:fs";
import path from "node:path";
import { createAdminClient } from "@/lib/supabase/admin";

export type AuditStatus = "healthy" | "warning" | "missing" | "error" | "unverified";

export type SchemaCheckResult = {
  id: string;
  label: string;
  table: string;
  columns: string[];
  status: AuditStatus;
  message: string;
  localMigration: string | null;
  hasLocalMigration: boolean;
  usedBy: string[];
};

export type AdminRouteAudit = {
  route: string;
  label: string;
  dependsOn: string[];
  status: AuditStatus;
  message: string;
};

export type DatabaseAuditReport = {
  generatedAt: string;
  env: {
    hasSupabaseUrl: boolean;
    hasServiceRoleKey: boolean;
  };
  adminClientReady: boolean;
  adminClientMessage: string;
  migrationFiles: Array<{
    file: string;
    exists: boolean;
    description: string;
  }>;
  checks: SchemaCheckResult[];
  routes: AdminRouteAudit[];
  summary: {
    healthy: number;
    warning: number;
    missing: number;
    error: number;
    unverified: number;
  };
};

type SchemaCheckConfig = {
  id: string;
  label: string;
  table: string;
  columns: string[];
  localMigration?: string;
  usedBy: string[];
};

type RouteConfig = {
  route: string;
  label: string;
  dependsOn: string[];
};

const SCHEMA_CHECKS: SchemaCheckConfig[] = [
  {
    id: "profiles-core",
    label: "Profiles and roles",
    table: "profiles",
    columns: ["id", "role"],
    usedBy: ["Admin access", "Users & Access", "Protected API routes"],
  },
  {
    id: "ev-models-core",
    label: "EV model catalogue",
    table: "ev_models",
    columns: ["id", "brand", "model", "price", "range_km", "created_at"],
    usedBy: ["Homepage", "Vehicles", "Compare EVs", "Admin EVs"],
  },
  {
    id: "ev-models-tier",
    label: "EV tier extension",
    table: "ev_models",
    columns: ["tier"],
    localMigration: "003_add_vehicle_tier.sql",
    usedBy: ["Vehicle merchandising"],
  },
  {
    id: "blog-posts-core",
    label: "Blog post core fields",
    table: "blog_posts",
    columns: ["id", "slug", "title", "excerpt", "content", "published", "published_at"],
    usedBy: ["Blog listing", "Article page", "Admin blog"],
  },
  {
    id: "blog-posts-seo",
    label: "Blog SEO and GEO fields",
    table: "blog_posts",
    columns: ["meta_title", "meta_description", "keywords", "geo_location", "author"],
    localMigration: "004_add_blog_seo_columns.sql",
    usedBy: ["Article metadata", "Structured data", "Admin blog SEO form"],
  },
  {
    id: "user-feedback",
    label: "User feedback moderation",
    table: "user_ev_feedback",
    columns: ["id", "user_id", "feedback", "is_approved", "created_at"],
    usedBy: ["Testimonials", "Admin feedback"],
  },
  {
    id: "consultation-requests",
    label: "Consultation requests",
    table: "consultation_requests",
    columns: ["id", "sector", "status", "full_name", "email", "created_at"],
    usedBy: ["Finance quote capture", "Dealer requests", "Admin consultations"],
  },
  {
    id: "vehicle-queries",
    label: "Vehicle recommendation leads",
    table: "vehicle_queries",
    columns: ["id", "ev_brand", "ev_model_name", "status", "created_at"],
    usedBy: ["Recommendation enquiries", "Admin vehicle queries"],
  },
  {
    id: "seo-pages",
    label: "SEO landing pages",
    table: "seo_pages",
    columns: ["id", "page_slug", "meta_title", "meta_description", "is_active"],
    usedBy: ["Route metadata overrides", "Admin SEO"],
  },
  {
    id: "geo-regions",
    label: "GEO regions",
    table: "geo_regions",
    columns: ["id", "name", "slug", "region_type", "country", "is_active"],
    usedBy: ["Geo landing pages", "Admin GEO"],
  },
  {
    id: "user-intent-profiles",
    label: "Intent profiles",
    table: "user_intent_profiles",
    columns: ["id", "intent_score", "user_type", "last_activity_at"],
    usedBy: ["Lead intelligence", "CRM"],
  },
  {
    id: "crm-leads",
    label: "CRM lead records",
    table: "crm_leads",
    columns: ["id", "profile_id", "status", "priority", "updated_at"],
    localMigration: "001_create_crm_tables.sql",
    usedBy: ["CRM journey"],
  },
  {
    id: "crm-lead-notes",
    label: "CRM lead notes",
    table: "crm_lead_notes",
    columns: ["id", "profile_id", "body", "created_at"],
    localMigration: "001_create_crm_tables.sql",
    usedBy: ["CRM journey"],
  },
  {
    id: "test-drive-bookings",
    label: "Test drive bookings",
    table: "test_drive_bookings",
    columns: ["id", "profile_id", "user_id", "status", "created_at"],
    localMigration: "002_create_test_drive_bookings.sql",
    usedBy: ["CRM journey", "Test drive flow"],
  },
  {
    id: "user-events",
    label: "User event tracking",
    table: "user_events",
    columns: ["id", "event_type", "created_at"],
    usedBy: ["Tracking", "Lead scoring", "CRM event timeline"],
  },
  {
    id: "lead-scores",
    label: "Lead scoring cache",
    table: "lead_scores",
    columns: ["id", "profile_id", "score", "updated_at"],
    usedBy: ["Lead scoring"],
  },
  {
    id: "user-financial-profiles",
    label: "Financial profiling",
    table: "user_financial_profiles",
    columns: ["id", "profile_id", "updated_at"],
    usedBy: ["Financial profiling"],
  },
  {
    id: "user-car-interest",
    label: "Vehicle interest tracking",
    table: "user_car_interest",
    columns: ["id", "car_id", "updated_at"],
    usedBy: ["Interest tracking", "Vehicle personalization"],
  },
  {
    id: "user-preferences",
    label: "Recommendation preferences",
    table: "user_preferences",
    columns: ["id", "user_id", "updated_at"],
    usedBy: ["AI Match persistence"],
  },
  {
    id: "recommendations",
    label: "Recommendation history",
    table: "recommendations",
    columns: ["id", "user_id", "score", "created_at"],
    usedBy: ["AI Match history"],
  },
  {
    id: "user-followups",
    label: "User follow-up log",
    table: "user_followups",
    columns: ["id", "session_id", "created_at"],
    usedBy: ["Session follow-up logging"],
  },
  {
    id: "reviews",
    label: "Editorial reviews",
    table: "reviews",
    columns: ["id", "slug", "title", "published_at"],
    usedBy: ["Reviews pages"],
  },
];

const ROUTE_CHECKS: RouteConfig[] = [
  { route: "/admin", label: "Admin dashboard", dependsOn: ["profiles-core", "ev-models-core", "blog-posts-core", "user-feedback", "consultation-requests", "vehicle-queries", "seo-pages", "geo-regions"] },
  { route: "/admin/evs", label: "EV admin", dependsOn: ["profiles-core", "ev-models-core"] },
  { route: "/admin/blog", label: "Blog admin", dependsOn: ["profiles-core", "blog-posts-core", "blog-posts-seo"] },
  { route: "/admin/feedback", label: "Feedback moderation", dependsOn: ["profiles-core", "user-feedback", "ev-models-core"] },
  { route: "/admin/consultations", label: "Consultations", dependsOn: ["profiles-core", "consultation-requests", "ev-models-core"] },
  { route: "/admin/vehicle-queries", label: "Vehicle queries", dependsOn: ["profiles-core", "vehicle-queries"] },
  { route: "/admin/leads", label: "Lead intelligence", dependsOn: ["profiles-core", "user-intent-profiles", "ev-models-core"] },
  { route: "/admin/crm", label: "CRM journey", dependsOn: ["profiles-core", "user-intent-profiles", "crm-leads", "crm-lead-notes", "test-drive-bookings", "user-events"] },
  { route: "/admin/users", label: "Users and access", dependsOn: ["profiles-core"] },
  { route: "/admin/seo", label: "SEO management", dependsOn: ["profiles-core", "seo-pages"] },
  { route: "/admin/geo", label: "GEO management", dependsOn: ["profiles-core", "geo-regions"] },
];

const MIGRATION_FILES = [
  { file: "000_set_updated_at.sql", description: "Shared updated_at trigger helper" },
  { file: "001_create_crm_tables.sql", description: "CRM leads and lead notes" },
  { file: "002_create_test_drive_bookings.sql", description: "Test drive booking table" },
  { file: "003_add_vehicle_tier.sql", description: "EV merchandising tier column" },
  { file: "004_add_blog_seo_columns.sql", description: "Blog SEO and GEO columns" },
];

function getMigrationPath(file: string) {
  return path.join(process.cwd(), "supabase", "manual", file);
}

function isMissingTableError(message: string, table: string) {
  const lower = message.toLowerCase();
  return lower.includes(`relation \"public.${table}\" does not exist`) || lower.includes(`relation \"${table}\" does not exist`);
}

function isMissingColumnError(message: string) {
  const lower = message.toLowerCase();
  return lower.includes("column") && lower.includes("does not exist");
}

function isAuthError(message: string) {
  const lower = message.toLowerCase();
  return lower.includes("jwt") || lower.includes("unauthorized") || lower.includes("permission") || lower.includes("forbidden") || lower.includes("invalid api key");
}

async function runSchemaCheck(
  admin: ReturnType<typeof createAdminClient>,
  config: SchemaCheckConfig,
): Promise<SchemaCheckResult> {
  const { error } = await admin.from(config.table).select(config.columns.join(", ")).limit(1);
  const hasLocalMigration = Boolean(config.localMigration) && existsSync(getMigrationPath(config.localMigration!));

  if (!error) {
    return {
      id: config.id,
      label: config.label,
      table: config.table,
      columns: config.columns,
      status: "healthy",
      message: "Table and required columns are queryable.",
      localMigration: config.localMigration ?? null,
      hasLocalMigration,
      usedBy: config.usedBy,
    };
  }

  const message = error.message;

  if (isAuthError(message)) {
    return {
      id: config.id,
      label: config.label,
      table: config.table,
      columns: config.columns,
      status: "unverified",
      message: `Could not verify this table because the admin client was rejected: ${message}`,
      localMigration: config.localMigration ?? null,
      hasLocalMigration,
      usedBy: config.usedBy,
    };
  }

  if (isMissingTableError(message, config.table)) {
    return {
      id: config.id,
      label: config.label,
      table: config.table,
      columns: config.columns,
      status: "missing",
      message: `Table ${config.table} is missing from the connected database.`,
      localMigration: config.localMigration ?? null,
      hasLocalMigration,
      usedBy: config.usedBy,
    };
  }

  if (isMissingColumnError(message)) {
    return {
      id: config.id,
      label: config.label,
      table: config.table,
      columns: config.columns,
      status: "warning",
      message: `Required columns are incomplete: ${message}`,
      localMigration: config.localMigration ?? null,
      hasLocalMigration,
      usedBy: config.usedBy,
    };
  }

  return {
    id: config.id,
    label: config.label,
    table: config.table,
    columns: config.columns,
    status: "error",
    message,
    localMigration: config.localMigration ?? null,
    hasLocalMigration,
    usedBy: config.usedBy,
  };
}

function summarizeChecks(checks: SchemaCheckResult[]) {
  return checks.reduce(
    (summary, check) => {
      summary[check.status] += 1;
      return summary;
    },
    {
      healthy: 0,
      warning: 0,
      missing: 0,
      error: 0,
      unverified: 0,
    } satisfies DatabaseAuditReport["summary"],
  );
}

function getRouteStatus(depResults: SchemaCheckResult[]): Pick<AdminRouteAudit, "status" | "message"> {
  if (depResults.some((item) => item.status === "missing" || item.status === "error")) {
    const blockedBy = depResults
      .filter((item) => item.status === "missing" || item.status === "error")
      .map((item) => item.label)
      .join(", ");

    return {
      status: "error",
      message: `This admin route is blocked by missing or broken dependencies: ${blockedBy}.`,
    };
  }

  if (depResults.some((item) => item.status === "warning" || item.status === "unverified")) {
    const degradedBy = depResults
      .filter((item) => item.status === "warning" || item.status === "unverified")
      .map((item) => item.label)
      .join(", ");

    return {
      status: "warning",
      message: `This admin route is degraded or not fully verified: ${degradedBy}.`,
    };
  }

  return {
    status: "healthy",
    message: "All required dependencies look healthy.",
  };
}

export async function getDatabaseAuditReport(): Promise<DatabaseAuditReport> {
  const env = {
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };

  const migrationFiles = MIGRATION_FILES.map((item) => ({
    ...item,
    exists: existsSync(getMigrationPath(item.file)),
  }));

  let adminClientMessage = "Admin client ready.";
  let adminClientReady = false;
  let checks: SchemaCheckResult[] = [];

  try {
    const admin = createAdminClient();
    adminClientReady = true;
    checks = await Promise.all(SCHEMA_CHECKS.map((config) => runSchemaCheck(admin, config)));
  } catch (error) {
    adminClientMessage = error instanceof Error ? error.message : "Unknown admin client error";
    checks = SCHEMA_CHECKS.map((config) => ({
      id: config.id,
      label: config.label,
      table: config.table,
      columns: config.columns,
      status: "unverified",
      message: `Could not start the admin client: ${adminClientMessage}`,
      localMigration: config.localMigration ?? null,
      hasLocalMigration: Boolean(config.localMigration) && existsSync(getMigrationPath(config.localMigration!)),
      usedBy: config.usedBy,
    }));
  }

  const checkMap = new Map(checks.map((item) => [item.id, item]));

  const routes = ROUTE_CHECKS.map((route) => {
    const depResults = route.dependsOn
      .map((id) => checkMap.get(id))
      .filter(Boolean) as SchemaCheckResult[];

    const routeState = getRouteStatus(depResults);

    return {
      route: route.route,
      label: route.label,
      dependsOn: route.dependsOn,
      status: routeState.status,
      message: routeState.message,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    env,
    adminClientReady,
    adminClientMessage,
    migrationFiles,
    checks,
    routes,
    summary: summarizeChecks(checks),
  };
}
