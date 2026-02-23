import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, Building2, ShieldCheck, PlayCircle } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute top-[10%] -right-[5%] w-[45%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-emerald-300/10 blur-[120px]" />
      </div>

      {/* Navigation Layer */}
      <header className="px-6 lg:px-16 py-6 flex items-center justify-between z-10 relative">
        <BrandLogo />
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 font-semibold px-4 py-2 transition-colors">
            Log In
          </Link>
          <Link href="/register" className="btn btn-primary shadow-sm hover:shadow-md transition-shadow py-2.5 px-5">
            Create Account
          </Link>
        </div>
      </header>

      {/* Hero Content */}
      <section className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 py-12 lg:py-24 gap-12 lg:gap-20 z-10 relative">

        {/* Left Side: Copy */}
        <div className="flex-1 space-y-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-sm rounded-full bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 font-bold shadow-sm">
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            Production-ready campus recruitment platform
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
            Reliable hiring workflows for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">everyone.</span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl font-medium">
            Run aptitude tests, complex coding rounds, dynamic candidate analytics, and manage complete placement drive operations within one unified, strictly-controlled portal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Link href="/login" className="btn btn-primary text-lg h-14 px-8 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all w-full sm:w-auto">
              Get Started <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link href="/register" className="btn h-14 px-8 rounded-xl bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 font-bold transition-all w-full sm:w-auto shadow-sm flex items-center justify-center">
              <PlayCircle className="mr-2 text-gray-500" size={20} />
              Book a Demo
            </Link>
          </div>
        </div>

        {/* Right Side: Features Grid */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 relative">
            <FeatureTile icon={<Building2 size={24} />} title="College Workflows" text="Manage students, verify departments, and control test participation parameters seamlessly." delay="0s" />
            <FeatureTile icon={<BriefcaseBusiness size={24} />} title="Company Drives" text="Create powerful dynamic assessments and run carefully targeted recruitment cycles." delay="0.1s" />
            <FeatureTile icon={<BarChart3 size={24} />} title="Deep Analytics" text="Track complex performance trends and evaluate granular shortlisting quality over time." delay="0.2s" />
            <FeatureTile icon={<ShieldCheck size={24} />} title="Secure Ops" text="Strict role-based workspace access and centralized platform administration controls." delay="0.3s" />
          </div>
        </div>

      </section>
    </main>
  );
}

function FeatureTile({ icon, title, text, delay }: { icon: React.ReactNode; title: string; text: string; delay: string }) {
  return (
    <article
      className="group relative bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 lg:p-8 rounded-2xl space-y-4 hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: delay, animationFillMode: "both" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100/80 text-blue-700 shadow-sm mb-2 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600 leading-relaxed font-medium">{text}</p>
      </div>
    </article>
  );
}
