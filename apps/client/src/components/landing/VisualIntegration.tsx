import React from "react"

const APPS = [
  {
    name: "Slack",
    category: "Alerts",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24.5 24.5" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.3 15.3c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4v-2.4H5.3zm1.2-1.2c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4V8.9c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v5.2z" fill="#E01E5A"/>
        <path d="M9.1 5.3c0-1.3-1.1-2.4-2.4-2.4S4.3 4 4.3 5.3s1.1 2.4 2.4 2.4h2.4V5.3zm1.2 1.2c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h5.2c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4h-5.2z" fill="#36C5F0"/>
        <path d="M19.1 9.1c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4-2.4 1.1-2.4 2.4v2.4h2.4zm-1.2 1.2c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v5.2c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4v-5.2z" fill="#2EB67D"/>
        <path d="M15.3 19.1c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4h-2.4v2.4zm-1.2-1.2c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4H8.9c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h5.2z" fill="#ECB22E"/>
      </svg>
    ),
  },
  {
    name: "Discord",
    category: "Comms",
    icon: (
      <svg width="22" height="22" viewBox="0 0 127.14 96.36" xmlns="http://www.w3.org/2000/svg">
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-19.32-72.1M42.02,65.22c-5.36,0-9.82-4.95-9.82-11s4.38-11,9.82-11,9.91,4.95,9.82,11-4.46,11-9.82,11m43.1,0c-5.36,0-9.82-4.95-9.82-11s4.38-11,9.82-11,9.91,4.95,9.82,11-4.46,11-9.82,11" fill="#5865F2"/>
      </svg>
    ),
  },
  {
    name: "GitHub",
    category: "DevOps",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-900">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    name: "Linear",
    category: "Issues",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5E6AD2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    name: "Teams",
    category: "Comms",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5 12c1.38 0 2.5-1.12 2.5-2.5S17.88 7 16.5 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zm-9 0c1.38 0 2.5-1.12 2.5-2.5S8.88 7 7.5 7 5 8.12 5 9.5 6.12 12 7.5 12zm0 1c-1.83 0-5.5.92-5.5 2.75V19h11v-3.25c0-1.83-3.67-2.75-5.5-2.75zm9 0c-.29 0-.62.02-.97.05.89.69 1.47 1.6 1.47 2.7V19h5v-3.25c0-1.83-3.67-2.75-5.5-2.75z" fill="#5059C9"/>
      </svg>
    ),
  },
  {
    name: "Webhooks",
    category: "API",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 9v-4M12 19v-4M9 12H5M19 12h-4"/>
      </svg>
    ),
  },
]

export const VisualIntegration: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden border-b border-neutral-100 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-neutral-900 tracking-tight mb-4">
            Connects to your existing workflow
          </h2>
          <p className="text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto">
            No new tools to learn. We catch breaking contract changes and alert your entire product team instantly.
          </p>
        </div>

        {/* Node Graph Illustration with SVG Tree Lines */}
        <div className="relative max-w-3xl mx-auto h-[380px] rounded-3xl bg-neutral-50/80 border border-neutral-200 overflow-hidden mb-20">
          {/* SVG Tree Path Layer */}
          <svg
            viewBox="0 0 800 380"
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            fill="none"
          >
            {/* Top Engine to Center Alert Node */}
            <path
              d="M 400 65 L 400 135"
              stroke="#CBD5E1"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            {/* Center Alert Node to Frontend */}
            <path
              d="M 400 175 C 400 220, 130 220, 130 270"
              stroke="#CBD5E1"
              strokeWidth="2.5"
            />
            {/* Center Alert Node to Backend */}
            <path
              d="M 400 175 C 400 220, 310 220, 310 270"
              stroke="#CBD5E1"
              strokeWidth="2.5"
            />
            {/* Center Alert Node to Mobile */}
            <path
              d="M 400 175 C 400 220, 490 220, 490 270"
              stroke="#CBD5E1"
              strokeWidth="2.5"
            />
            {/* Center Alert Node to Product Manager */}
            <path
              d="M 400 175 C 400 220, 670 220, 670 270"
              stroke="#CBD5E1"
              strokeWidth="2.5"
            />
          </svg>

          {/* Top Node: Clud Monitor Engine */}
          <div className="absolute top-[35px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-neutral-200 shadow-xs">
              <img src="/favicon.svg" alt="" aria-hidden="true" width={20} height={20} className="w-5 h-5 object-contain" />
              <span className="text-xs font-bold text-neutral-900 font-heading">
                OpenAPI Spec Monitor
              </span>
            </div>
          </div>

          {/* Center Hub: Multi-Channel Alerts (Slack, Email, Discord) */}
          <div className="absolute top-[155px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-neutral-950 text-white rounded-2xl px-4 py-2 flex items-center gap-3 border-2 border-white shadow-xs">
              {/* Slack */}
              <div className="flex items-center gap-1.5 pr-2.5 border-r border-neutral-700">
                <svg width="15" height="15" viewBox="0 0 24.5 24.5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.3 15.3c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4v-2.4H5.3zm1.2-1.2c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4V8.9c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v5.2z" fill="#E01E5A"/>
                  <path d="M9.1 5.3c0-1.3-1.1-2.4-2.4-2.4S4.3 4 4.3 5.3s1.1 2.4 2.4 2.4h2.4V5.3zm1.2 1.2c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h5.2c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4h-5.2z" fill="#36C5F0"/>
                  <path d="M19.1 9.1c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4-2.4 1.1-2.4 2.4v2.4h2.4zm-1.2 1.2c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v5.2c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4v-5.2z" fill="#2EB67D"/>
                  <path d="M15.3 19.1c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4h-2.4v2.4zm-1.2-1.2c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4H8.9c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h5.2z" fill="#ECB22E"/>
                </svg>
                <span className="font-semibold text-xs text-white">#api-alerts</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-1.5 pr-2.5 border-r border-neutral-700">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <span className="font-semibold text-xs text-white">Email</span>
              </div>

              {/* Discord */}
              <div className="flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 127.14 96.36" xmlns="http://www.w3.org/2000/svg">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c2.64-27.38-4.51-51.11-19.32-72.1M42.02,65.22c-5.36,0-9.82-4.95-9.82-11s4.38-11,9.82-11,9.91,4.95,9.82,11-4.46,11-9.82,11m43.1,0c-5.36,0-9.82-4.95-9.82-11s4.38-11,9.82-11,9.91,4.95,9.82,11-4.46,11-9.82,11" fill="#5865F2"/>
                </svg>
                <span className="font-semibold text-xs text-white">Discord</span>
              </div>
            </div>
          </div>

          {/* Role 1: Frontend */}
          <div className="absolute top-[295px] left-[16%] -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="flex flex-col items-center">
              <div className="w-13 h-13 rounded-2xl bg-white p-0.5 border-2 border-white overflow-hidden shadow-xs">
                <img
                  src="https://i.pravatar.cc/150?u=a"
                  alt="Frontend Engineer"
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-xl bg-neutral-100 grayscale"
                />
              </div>
              <span className="mt-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md px-2 py-0.5 text-[10px] font-bold">
                Frontend
              </span>
            </div>
          </div>

          {/* Role 2: Backend */}
          <div className="absolute top-[295px] left-[39%] -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="flex flex-col items-center">
              <div className="w-13 h-13 rounded-2xl bg-white p-0.5 border-2 border-white overflow-hidden shadow-xs">
                <img
                  src="https://i.pravatar.cc/150?u=b"
                  alt="Backend Engineer"
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-xl bg-neutral-100 grayscale"
                />
              </div>
              <span className="mt-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-0.5 text-[10px] font-bold">
                Backend
              </span>
            </div>
          </div>

          {/* Role 3: Mobile */}
          <div className="absolute top-[295px] left-[61%] -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="flex flex-col items-center">
              <div className="w-13 h-13 rounded-2xl bg-white p-0.5 border-2 border-white overflow-hidden shadow-xs">
                <img
                  src="https://i.pravatar.cc/150?u=c"
                  alt="Mobile Engineer"
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-xl bg-neutral-100 grayscale"
                />
              </div>
              <span className="mt-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md px-2 py-0.5 text-[10px] font-bold">
                Mobile
              </span>
            </div>
          </div>

          {/* Role 4: Product Manager */}
          <div className="absolute top-[295px] left-[84%] -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="flex flex-col items-center">
              <div className="w-13 h-13 rounded-2xl bg-white p-0.5 border-2 border-white overflow-hidden shadow-xs">
                <img
                  src="https://i.pravatar.cc/150?u=d"
                  alt="Product Manager"
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-xl bg-neutral-100 grayscale"
                />
              </div>
              <span className="mt-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md px-2 py-0.5 text-[10px] font-bold">
                Product Manager
              </span>
            </div>
          </div>
        </div>

        {/* Connect Your Fav Apps Grid */}
        <div className="mt-16 text-center">
          <h3 className="text-xl md:text-2xl font-heading font-bold text-neutral-900 mb-2">
            Connect Your Fav Apps
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 mb-8 max-w-lg mx-auto">
            Unlock the full potential of your project with powerful integrations designed to enhance developer velocity.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
            {APPS.map((app) => (
              <div
                key={app.name}
                className="bg-white p-4 rounded-2xl border border-neutral-200 flex flex-col items-center justify-center gap-2.5 transition-all hover:border-neutral-300"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                  {app.icon}
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-neutral-900 leading-tight">
                    {app.name}
                  </p>
                  <span className="text-[10px] text-neutral-400">
                    {app.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
