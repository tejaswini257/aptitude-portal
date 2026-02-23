import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, Building2, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function Home() {
  return (
    <main className="auth-page">
      <section className="card max-w-5xl w-full p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <BrandLogo />
            <div className="inline-flex items-center gap-2 text-xs rounded-full bg-blue-50 text-blue-700 px-3 py-1 font-semibold">
              Production-ready campus recruitment platform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              AptiCore helps colleges and companies run reliable hiring workflows.
            </h1>
            <p className="text-secondary text-lg">
              Aptitude testing, coding rounds, candidate analytics, and drive operations in one unified portal.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/login" className="btn btn-primary">
                Get Started <ArrowRight size={16} />
              </Link>
              <Link href="/register" className="btn btn-secondary">
                Create Account
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <FeatureTile icon={<Building2 size={18} />} title="College Workflows" text="Manage students, departments, and test participation." />
            <FeatureTile icon={<BriefcaseBusiness size={18} />} title="Company Drives" text="Create assessments and run recruitment cycles." />
            <FeatureTile icon={<BarChart3 size={18} />} title="Analytics" text="Track performance trends and shortlisting quality." />
            <FeatureTile icon={<ShieldCheck size={18} />} title="Secure Ops" text="Role-based access and centralized platform controls." />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureTile({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
      <div className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-700">{icon}</div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="text-xs text-secondary leading-relaxed">{text}</p>
    </article>
  );
}
