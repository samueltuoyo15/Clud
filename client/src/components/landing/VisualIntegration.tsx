import React from "react"

export const VisualIntegration: React.FC = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-neutral-900 tracking-tight mb-4">
            Connects to your existing workflow
          </h2>
          <p className="text-lg text-neutral-500">
            No new tools to learn. We catch the drift and alert your team exactly where they already work.
          </p>
        </div>

        {/* Node Graph Illustration */}
        <div className="relative max-w-4xl mx-auto h-[400px] flex items-center justify-center rounded-3xl bg-neutral-50 border-2 border-neutral-100 overflow-hidden">
          
          {/* Center Slack Node */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-neutral-900 text-white rounded-full px-6 py-3 flex items-center gap-3 border-4 border-white">
              <svg width="24" height="24" viewBox="0 0 24.5 24.5" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.3 15.3c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4v-2.4H5.3zm1.2-1.2c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4V8.9c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v5.2z" fill="#E01E5A"/>
                <path d="M9.1 5.3c0-1.3-1.1-2.4-2.4-2.4S4.3 4 4.3 5.3s1.1 2.4 2.4 2.4h2.4V5.3zm1.2 1.2c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h5.2c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4h-5.2z" fill="#36C5F0"/>
                <path d="M19.1 9.1c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4-2.4 1.1-2.4 2.4v2.4h2.4zm-1.2 1.2c0-1.3-1.1-2.4-2.4-2.4s-2.4 1.1-2.4 2.4v5.2c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4v-5.2z" fill="#2EB67D"/>
                <path d="M15.3 19.1c0 1.3 1.1 2.4 2.4 2.4s2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4h-2.4v2.4zm-1.2-1.2c1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4H8.9c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4h5.2z" fill="#ECB22E"/>
              </svg>
              <span className="font-semibold text-sm">#api-alerts</span>
            </div>
          </div>

          {/* Lines going to team members */}
          <svg className="absolute inset-0 w-full h-full z-10" preserveAspectRatio="none">
            {/* Top source to Slack */}
            <path d="M50% 10% L50% 33%" stroke="#E5E7EB" strokeWidth="3" fill="none" />
            
            {/* Slack to User 1 */}
            <path d="M50% 33% C50% 60%, 25% 60%, 25% 75%" stroke="#E5E7EB" strokeWidth="3" fill="none" />
            
            {/* Slack to User 2 */}
            <path d="M50% 33% C50% 60%, 50% 60%, 50% 75%" stroke="#E5E7EB" strokeWidth="3" fill="none" />
            
            {/* Slack to User 3 */}
            <path d="M50% 33% C50% 60%, 75% 60%, 75% 75%" stroke="#E5E7EB" strokeWidth="3" fill="none" />
          </svg>

          {/* Clud Source Node (Top) */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border-2 border-neutral-200">
              <img src="/favicon.svg" alt="Clud" className="w-6 h-6" />
            </div>
          </div>

          {/* Team Member 1 */}
          <div className="absolute top-[75%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-20 hover:scale-105 transition-transform">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?u=a" alt="Team member" className="w-16 h-16 rounded-2xl border-4 border-white object-cover bg-neutral-200" />
              <div className="absolute -bottom-2 -right-2 bg-rose-100 text-rose-600 rounded-lg px-2 py-1 text-[10px] font-bold border-2 border-white">
                Frontend
              </div>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="absolute top-[75%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 hover:scale-105 transition-transform">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?u=b" alt="Team member" className="w-16 h-16 rounded-2xl border-4 border-white object-cover bg-neutral-200" />
              <div className="absolute -bottom-2 -right-2 bg-blue-100 text-blue-600 rounded-lg px-2 py-1 text-[10px] font-bold border-2 border-white">
                Backend
              </div>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="absolute top-[75%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-20 hover:scale-105 transition-transform">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?u=c" alt="Team member" className="w-16 h-16 rounded-2xl border-4 border-white object-cover bg-neutral-200" />
              <div className="absolute -bottom-2 -right-2 bg-emerald-100 text-emerald-600 rounded-lg px-2 py-1 text-[10px] font-bold border-2 border-white">
                Mobile
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
