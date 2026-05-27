import DealerVehicleForm from "@/components/DealerVehicleForm";

export const metadata = { title: "Add Vehicle | Dealer Portal" };

export default function DealerNewVehiclePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-brand">Dealer Portal</p>
      <h1 className="mt-1 text-3xl font-bold text-white">Add a vehicle</h1>
      <p className="mt-1 text-white/50">Submit a new listing for review. It will go live once approved by our team.</p>
      <div className="mt-8">
        <DealerVehicleForm mode="create" />
      </div>
    </div>
  );
}
