import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationForm from "@/components/ConsultationForm";
import { createAdminClient } from "@/lib/supabase/admin";
import { evModels as staticEvModels } from "@/data/evModels";

async function getEvModels() {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("ev_models")
      .select("id, brand, model")
      .order("brand");
    if (data && data.length > 0) {
      return data;
    }
  } catch {
    // Use static models during build when server env keys are unavailable.
  }

  return staticEvModels.map((item) => ({
    id: item.id,
    brand: item.brand,
    model: item.model,
  }));
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
