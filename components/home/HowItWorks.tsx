import { Search, BrainCircuit, Landmark } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="bg-[#F8FAF9] py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-4">A simple path to <span className="text-[#1FBF9F]">electric</span>.</h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">Skip the dealership hassle. Our AI engine guides you seamlessly from discovery to delivery.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[100px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#D1F2EB] to-transparent -z-10" />

          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] hover:border-[#1FBF9F]/40 hover:shadow-lg transition-all shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8F8F5] rounded-bl-full group-hover:bg-[#D1F2EB] transition-colors" />
            <div className="w-16 h-16 rounded-2xl bg-[#E8F8F5] border border-[#D1F2EB] flex items-center justify-center mb-6 text-[#1FBF9F] group-hover:bg-[#D1F2EB] group-hover:border-[#1FBF9F]/50 transition-colors shadow-sm">
              <Search className="w-8 h-8" />
            </div>
            <div className="text-[#1FBF9F] text-sm font-bold mb-2">STEP 01</div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Discover & Compare</h3>
            <p className="text-[#6B7280] leading-relaxed">
              Explore our comprehensive database of every EV on the market. Compare real-world ranges, battery specs, and tech features side-by-side.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] hover:border-[#1FBF9F]/40 hover:shadow-lg transition-all shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8F8F5] rounded-bl-full group-hover:bg-[#D1F2EB] transition-colors" />
            <div className="w-16 h-16 rounded-2xl bg-[#E8F8F5] border border-[#D1F2EB] flex items-center justify-center mb-6 text-[#1FBF9F] group-hover:bg-[#D1F2EB] group-hover:border-[#1FBF9F]/50 transition-colors shadow-sm">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <div className="text-[#1FBF9F] text-sm font-bold mb-2">STEP 02</div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">AI Matching Engine</h3>
            <p className="text-[#6B7280] leading-relaxed">
              Tell our AI about your daily commute, family size, and weekend trips. Instantly get matched with the vehicles that perfectly fit your lifestyle.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] hover:border-[#1FBF9F]/40 hover:shadow-lg transition-all shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8F8F5] rounded-bl-full group-hover:bg-[#D1F2EB] transition-colors" />
            <div className="w-16 h-16 rounded-2xl bg-[#E8F8F5] border border-[#D1F2EB] flex items-center justify-center mb-6 text-[#1FBF9F] group-hover:bg-[#D1F2EB] group-hover:border-[#1FBF9F]/50 transition-colors shadow-sm">
              <Landmark className="w-8 h-8" />
            </div>
            <div className="text-[#1FBF9F] text-sm font-bold mb-2">STEP 03</div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Transparent Finance</h3>
            <p className="text-[#6B7280] leading-relaxed">
              Unlock true cost-to-own predictability. See exact EMI breakdowns, home charging costs, and state tax incentives before making a decision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
