"use client";

import { Globe, Mail, MessageCircle } from "lucide-react";

const SOCIAL_LINKS = [
  { Icon: MessageCircle, label: "Chat with us" },
  { Icon: Globe, label: "Visit our website" },
  { Icon: Mail, label: "Email us" },
];

export default function FooterSocialLinks() {
  return (
    <div className="flex items-center gap-3">
      {SOCIAL_LINKS.map(({ Icon, label }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-400 transition-all hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
