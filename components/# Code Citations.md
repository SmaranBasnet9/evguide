# Code Citations

## License: unknown
https://github.com/oortega/CajaEtravel/blob/660f5027a26f0761e8a60e4664c251c9cc2e5cc5/indexENG.html

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">
```


## License: unknown
https://github.com/oortega/CajaEtravel/blob/660f5027a26f0761e8a60e4664c251c9cc2e5cc5/indexENG.html

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">
```


## License: unknown
https://github.com/zarzax/umn-classfinder/blob/978937406c6bd16eea6b753eaa75dca2db26a376/index.php

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option
```


## License: unknown
https://github.com/0xffakhrul/bda-laravel/blob/866eb25a0c9e2a06a11c3315c8c1808525094a90/resources/views/donor/appointments/create.blade.php

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option
```


## License: unknown
https://github.com/zubairaziz/csc261-project/blob/06b93832fefc7d59633db4358f6188d5b2d9b23d/milestone3/taskB/professor-availability.html

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text
```


## License: unknown
https://github.com/zarzax/umn-classfinder/blob/978937406c6bd16eea6b753eaa75dca2db26a376/index.php

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option
```


## License: unknown
https://github.com/oortega/CajaEtravel/blob/660f5027a26f0761e8a60e4664c251c9cc2e5cc5/indexENG.html

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option
```


## License: unknown
https://github.com/0xffakhrul/bda-laravel/blob/866eb25a0c9e2a06a11c3315c8c1808525094a90/resources/views/donor/appointments/create.blade.php

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option
```


## License: unknown
https://github.com/zubairaziz/csc261-project/blob/06b93832fefc7d59633db4358f6188d5b2d9b23d/milestone3/taskB/professor-availability.html

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text
```


## License: unknown
https://github.com/zarzax/umn-classfinder/blob/978937406c6bd16eea6b753eaa75dca2db26a376/index.php

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text
```


## License: unknown
https://github.com/oortega/CajaEtravel/blob/660f5027a26f0761e8a60e4664c251c9cc2e5cc5/indexENG.html

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text
```


## License: unknown
https://github.com/zubairaziz/csc261-project/blob/06b93832fefc7d59633db4358f6188d5b2d9b23d/milestone3/taskB/professor-availability.html

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text
```


## License: unknown
https://github.com/0xffakhrul/bda-laravel/blob/866eb25a0c9e2a06a11c3315c8c1808525094a90/resources/views/donor/appointments/create.blade.php

```
````typescript
// filepath: d:\evguide\app\cars\[id]\page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return evModels.map((model) => ({
    id: model.id,
  }));
}

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  const model = evModels.find(m => m.id === id);

  if (!model) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h1 className="text-4xl font-bold">Vehicle not found</h1>
          <p className="mt-4 text-slate-600">The EV model you're looking for doesn't exist.</p>
          <Link href="/compare" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to Compare
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Placeholder */}
            <div className="aspect-video rounded-3xl bg-gradient-to-br from-blue-100 to-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-lg">{model.brand} {model.model}</span>
            </div>
            
            {/* Details */}
            <div>
              <p className="text-sm font-semibold text-blue-600">{model.brand}</p>
              <h1 className="mt-2 text-5xl font-bold">{model.model}</h1>
              <p className="mt-4 text-4xl font-bold text-slate-900">£{model.price.toLocaleString()}</p>
              
              <p className="mt-6 text-lg text-slate-600">{model.description}</p>
              
              <div className="mt-8 flex gap-4">
                <Link
                  href={`/compare?carA=${model.id}`}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Compare This EV
                </Link>
                <Link
                  href={`/finance?car=${model.id}`}
                  className="flex-1 rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Finance This EV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Range</p>
              <p className="mt-2 text-2xl font-bold">{model.rangeKm} km</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Battery</p>
              <p className="mt-2 text-2xl font-bold">{model.batteryKWh} kWh</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Top Speed</p>
              <p className="mt-2 text-2xl font-bold">{model.topSpeedKph} km/h</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Acceleration</p>
              <p className="mt-2 text-2xl font-bold">{model.acceleration}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Motor Power</p>
              <p className="mt-2 text-2xl font-bold">{model.motorCapacityKw} kW</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Torque</p>
              <p className="mt-2 text-2xl font-bold">{model.torqueNm} Nm</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Seating</p>
              <p className="mt-2 text-2xl font-bold">{model.seats} Seats</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Boot Space</p>
              <p className="mt-2 text-2xl font-bold">{model.bootLitres} L</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="text-3xl font-bold mb-8">Detailed Specifications</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Performance */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Performance</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Motor Power</dt>
                  <dd className="font-semibold">{model.motorCapacityKw} kW</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Torque</dt>
                  <dd className="font-semibold">{model.torqueNm} Nm</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Acceleration (0-100 km/h)</dt>
                  <dd className="font-semibold">{model.acceleration}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Top Speed</dt>
                  <dd className="font-semibold">{model.topSpeedKph} km/h</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Drive Type</dt>
                  <dd className="font-semibold">{model.drive}</dd>
                </div>
              </dl>
            </div>

            {/* Battery & Charging */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Battery & Charging</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Battery Capacity</dt>
                  <dd className="font-semibold">{model.batteryKWh} kWh</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Range</dt>
                  <dd className="font-semibold">{model.rangeKm} km</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Charging Standard</dt>
                  <dd className="font-semibold">{model.chargingStandard}</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Fast Charging Time</dt>
                  <dd className="font-semibold">{model.fastChargeTime}</dd>
                </div>
              </dl>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Dimensions & Capacity</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Seating</dt>
                  <dd className="font-semibold">{model.seats} Seats</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Boot Space</dt>
                  <dd className="font-semibold">{model.bootLitres} L</dd>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">Ground Clearance</dt>
                  <dd className="font-semibold">{model.groundClearanceMm} mm</dd>
                </div>
              </dl>
            </div>

            {/* Features & Safety */}
            <div>
              <h3 className="text-xl font-bold mb-6 pb-4 border-b border-slate-200">Features & Safety</h3>
              <dl className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <dt className="font-medium">ADAS Features</dt>
                  <dd className="font-semibold">{model.adas}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Book Appointment */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">Interested in the {model.brand} {model.model}?</h2>
            <p className="mt-4 text-blue-100 text-lg">Book a free appointment with our EV consultant</p>
            <p className="mt-2 text-blue-50 text-base">We'll guide you through pricing, financing, and test drive options tailored to your needs</p>
            <Link
              href={`/appointment?carId=${model.id}`}
              className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-slate-50 transition-colors"
            >
              Book Your Free Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Additional CTA Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="text-center">
            <h3 className="text-3xl font-bold">Want to explore more?</h3>
            <p className="mt-4 text-slate-600">Compare with other models or check financing options</p>
            <div className="mt-8 flex gap-4 justify-center">
              <Link
                href={`/finance?car=${model.id}`}
                className="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Financing
              </Link>
              <Link
                href="/compare"
                className="rounded-2xl bg-slate-600 px-8 py-3 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Compare Models
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
````

````typescript
// filepath: d:\evguide\app\appointment\page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { evModels } from "@/data/evModels";

function AppointmentFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId");
  const model = evModels.find(m => m.id === carId);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold">Book Your Free EV Consultation</h1>
          <p className="mt-4 text-lg text-slate-600">
            Our expert consultants are ready to help you find the perfect electric vehicle
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-emerald-900">Thank you!</h3>
                    <p className="mt-2 text-emerald-800">We've received your appointment request. Our team will contact you shortly to confirm your preferred date and time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                        placeholder="+44 (0) 123 456 7890"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Preferred Time */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        required
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-blue-600"
                      >
                        <option value="">Select a time slot</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text
```

