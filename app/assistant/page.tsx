import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationForm from "@/components/ConsultationForm";
import { createAdminClient } from "@/lib/supabase/admin";

async function getEvModels() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("ev_models")
    .select("id, brand, model")
    .order("brand");
  return data ?? [];
}

export default async function AssistantPage() {
  const evModels = await getEvModels();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-semibold text-blue-600">Consultation</p>
        <h1 className="mt-2 text-4xl font-bold">Speak to an Expert</h1>
        <p className="mt-3 text-slate-600">
          Want personalised advice on EV financing or choosing the right model? Submit a request
          and our team will get back to you.
        </p>
        <div className="mt-10">
          <ConsultationForm evModels={evModels} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
