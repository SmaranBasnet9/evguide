import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import AdminRoleToggle from "@/components/AdminRoleToggle";

async function getUsers() {
  const supabase = createAdminClient();

  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) throw new Error(authError.message);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role");

  const roleMap = new Map((profiles ?? []).map((profile) => [profile.id, profile.role]));

  return authData.users.map((user) => {
    const metaName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null;

    return {
      id: user.id,
      name: metaName ?? "-",
      email: user.email ?? "-",
      created_at: user.created_at,
      role: roleMap.get(user.id) ?? "user",
    };
  });
}

async function getCurrentUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export default async function AdminUsersPage() {
  const [users, currentUserId] = await Promise.all([getUsers(), getCurrentUserId()]);

  const admins = users.filter((user) => user.role === "admin");
  const regularUsers = users.filter((user) => user.role !== "admin");

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Users</h1>
        <p className="mt-1 text-slate-500">
          {users.length} total - {admins.length} admin{admins.length !== 1 ? "s" : ""},{" "}
          {regularUsers.length} regular user{regularUsers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">
          Admins
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {admins.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-500">No admins yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-6 py-3 font-semibold text-slate-600">Name</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Email</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Joined</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Role</th>
                  <th className="px-6 py-3 font-semibold text-slate-600"></th>
                </tr>
              </thead>
              <tbody>
                {admins.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{user.email}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        Admin
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AdminRoleToggle
                        userId={user.id}
                        currentRole={user.role}
                        isSelf={user.id === currentUserId}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">
          Users
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {regularUsers.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-500">No regular users yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-6 py-3 font-semibold text-slate-600">Name</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Email</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Joined</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Role</th>
                  <th className="px-6 py-3 font-semibold text-slate-600"></th>
                </tr>
              </thead>
              <tbody>
                {regularUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{user.email}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        User
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AdminRoleToggle
                        userId={user.id}
                        currentRole={user.role}
                        isSelf={user.id === currentUserId}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
