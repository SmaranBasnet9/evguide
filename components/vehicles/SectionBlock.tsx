import { ReactNode } from "react";

interface SectionBlockProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function SectionBlock({ title, description, icon, children, className = "" }: SectionBlockProps) {
  return (
    <section className={`mb-16 ${className}`}>
      <div className="mb-8 flex items-center gap-3">
        {icon && <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D1F2EB] bg-[#E8F8F5] shadow-sm text-[#1FBF9F]">
          {icon}
        </div>}
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">{title}</h2>
          {description && <p className="text-[#6B7280] text-sm mt-1">{description}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {children}
      </div>
    </section>
  );
}
