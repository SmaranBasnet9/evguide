import Link from "next/link";
import { Zap, Mail, MessageCircle, Globe } from "lucide-react";
import CookieSettingsButton from "@/components/legal/CookieSettingsButton";

export default function PremiumFooter() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-[#1FBF9F]" />
              <Link href="/" className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
                EVGuide<span className="text-[#1FBF9F]"> AI</span>
              </Link>
            </div>
            <p className="mb-8 max-w-sm text-[#6B7280]">
              The premium EV decision platform for UK buyers. Use AI Match, Compare EVs, and finance tools to choose with more confidence.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F8FAF9] text-[#6B7280] transition-all hover:bg-[#E8F8F5] hover:text-[#1FBF9F]">
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F8FAF9] text-[#6B7280] transition-all hover:bg-[#E8F8F5] hover:text-[#1FBF9F]">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F8FAF9] text-[#6B7280] transition-all hover:bg-[#E8F8F5] hover:text-[#1FBF9F]">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-[#1A1A1A]">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/vehicles" className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]">Vehicles</Link></li>
              <li><Link href="/compare" className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]">Compare EVs</Link></li>
              <li><Link href="/ai-match" className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]">AI Match</Link></li>
              <li><Link href="/finance" className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]">Check affordability</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-[#1A1A1A]">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/blog" className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]">Blog</Link></li>
              <li><Link href="/blog" className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]">Buying Guides</Link></li>
              <li><Link href="/finance" className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]">Affordability Tools</Link></li>
              <li><Link href="/support" className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-[#1A1A1A]">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/support" className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]">Contact</Link></li>
              <li><Link href="/privacy" className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]">Cookie Policy</Link></li>
              <li><CookieSettingsButton className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]" /></li>
              <li><Link href="/terms" className="text-[#6B7280] transition-colors hover:text-[#1FBF9F]">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E5E7EB] pt-8 md:flex-row">
          <p className="text-sm text-[#6B7280]">
            &copy; {new Date().getFullYear()} EVGuide AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            Built for smarter EV decisions <Zap className="w-3 h-3 text-[#1FBF9F]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
