import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight01Icon } from "hugeicons-react";

export const Hero: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("accessToken");

  return (
    <section className="min-h-screen flex flex-col items-center text-center px-6 pt-32 pb-16 bg-transparent relative overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">

        {/* Social Proof Badge */}
        <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-full py-1.5 px-2 pr-4 mb-6 w-fit">
          <div className="flex -space-x-2">
            <img src="/images/student-1.webp" alt="User 1" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
            <img src="/images/student-2.webp" alt="User 2" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
            <img src="/images/student-3.webp" alt="User 3" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
          </div>
          <span className="text-sm text-neutral-600 font-medium">Built for teams that want to ship faster</span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-neutral-950 leading-snug mb-8 max-w-4xl tracking-tight">
          Clud monitors your OpenAPI specs and instantly alerts your team when the API shifts.
        </h1>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full sm:w-auto">
          <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full gap-2">
              {isLoggedIn ? "Go to dashboard" : "Start free monitoring"}
              <ArrowRight01Icon size={18} />
            </Button>
          </Link>
          <Button variant="light" size="lg" className="w-full sm:w-auto gap-2 text-neutral-900 font-medium">
            See how it works
            <ArrowRight01Icon size={18} className="text-neutral-500" />
          </Button>
        </div>

        {/* Hero Screenshot Placeholder */}
        <div className="w-full max-w-4xl mx-auto mb-24 relative">
          <div className="absolute inset-0 bg-blue-50/50 rounded-5xl blur-3xl -z-10 scale-95" />
          <div className="w-full aspect-video bg-white/40 backdrop-blur border border-white/60 rounded-3xl overflow-hidden flex items-center justify-center">
            <span className="text-neutral-400 font-medium">Dashboard Screenshot</span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          <div className="md:col-span-2 bg-neutral-50 rounded-3xl p-8 border border-neutral-200 min-h-75 flex flex-col justify-between items-start text-left">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Real-time alerts</h3>
              <p className="text-neutral-600">Get instantly notified in Slack or Teams the second a backend developer ships a breaking change.</p>
            </div>
            <div className="w-full h-32 bg-white rounded-xl border border-neutral-100 mt-6" />
          </div>

          <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-200 min-h-75 flex flex-col justify-between items-start text-left">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No setup required</h3>
              <p className="text-neutral-600">Just paste your OpenAPI URL. We handle the rest.</p>
            </div>
            <div className="w-full h-24 bg-white rounded-xl border border-neutral-100 mt-6" />
          </div>

          <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-200 min-h-75 flex flex-col justify-between items-start text-left">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Beautiful Changelogs</h3>
              <p className="text-neutral-600">Human-readable summaries of every change, automatically generated.</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-neutral-50 rounded-3xl p-8 border border-neutral-200 min-h-75 flex flex-col justify-between items-start text-left">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Zero downtime</h3>
              <p className="text-neutral-600">Catch breaking changes before they reach your users and affect your revenue.</p>
            </div>
            <div className="w-full h-32 bg-white rounded-xl border border-neutral-100 mt-6" />
          </div>
        </div>

      </div>
    </section>
  );
};
