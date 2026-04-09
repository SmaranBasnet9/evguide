import Link from "next/link";
import { Zap, Mail, MessageCircle, Globe } from "lucide-react";

export default function PremiumFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-emerald-400" />
              <Link href="/" className="text-2xl font-bold tracking-tight text-white">
                EVGuide<span className="text-emerald-400"> AI</span>
              </Link>
            </div>
            <p className="mb-8 max-w-sm text-zinc-400">
              The premium EV decision platform for UK buyers. Use AI Match, Compare EVs, and finance tools to choose with more confidence.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5 text-zinc-400 transition-all hover:bg-white/10 hover:text-emerald-400">
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5 text-zinc-400 transition-all hover:bg-white/10 hover:text-emerald-400">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5 text-zinc-400 transition-all hover:bg-white/10 hover:text-emerald-400">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/vehicles" className="text-zinc-400 transition-colors hover:text-emerald-400">Vehicles</Link></li>
              <li><Link href="/compare" className="text-zinc-400 transition-colors hover:text-emerald-400">Compare EVs</Link></li>
              <li><Link href="/ai-match" className="text-zinc-400 transition-colors hover:text-emerald-400">AI Match</Link></li>
              <li><Link href="/finance" className="text-zinc-400 transition-colors hover:text-emerald-400">Check affordability</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/blog" className="text-zinc-400 transition-colors hover:text-emerald-400">Blog</Link></li>
              <li><Link href="/blog" className="text-zinc-400 transition-colors hover:text-emerald-400">Buying Guides</Link></li>
              <li><Link href="/finance" className="text-zinc-400 transition-colors hover:text-emerald-400">Affordability Tools</Link></li>
              <li><Link href="/support" className="text-zinc-400 transition-colors hover:text-emerald-400">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/support" className="text-zinc-400 transition-colors hover:text-emerald-400">Contact</Link></li>
              <li><Link href="/privacy" className="text-zinc-400 transition-colors hover:text-emerald-400">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-zinc-400 transition-colors hover:text-emerald-400">Cookie Policy</Link></li>
              <li><Link href="/terms" className="text-zinc-400 transition-colors hover:text-emerald-400">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} EVGuide AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            Built for smarter EV decisions <Zap className="w-3 h-3 text-emerald-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
