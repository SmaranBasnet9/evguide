import AdminEVForm from "@/components/AdminEVForm";

export default function NewEVPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-semibold text-blue-600">EV Models</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Add New EV</h1>
      <p className="mt-2 text-slate-600">Add a new EV model to the database.</p>

      <div className="mt-8">
        <AdminEVForm />
      </div>
    </div>
  );
}