import React from 'react'
import { Link } from 'react-router-dom'
import { Home01Icon, ZapIcon, Settings01Icon, Search01Icon } from 'hugeicons-react'

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans flex text-neutral-900">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 flex flex-col p-4 bg-neutral-50/50">
        <div className="flex items-center gap-2 mb-10 px-2 mt-2">
          <img 
            src="/favicon.svg" 
            alt="Clud Logo" 
            className="w-8 h-8 rounded-md border border-neutral-200 shadow-sm"
          />
          <span className="font-heading font-bold text-lg">Clud</span>
        </div>

        <nav className="flex-1 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 bg-neutral-950 text-white rounded-lg font-medium text-sm transition-colors">
            <Home01Icon size={18} />
            Dashboard
          </Link>
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium text-sm transition-colors">
            <ZapIcon size={18} />
            Integrations
          </Link>
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium text-sm transition-colors">
            <Settings01Icon size={18} />
            Settings
          </Link>
        </nav>

        {/* User profile snippet */}
        <div className="mt-auto border-t border-neutral-200 pt-4 pb-2 px-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#006FEE] text-white rounded-full flex items-center justify-center font-bold text-sm">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Samuel</p>
            <p className="text-xs text-neutral-500 truncate">samuel@company.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 border-b border-neutral-200 flex items-center justify-between px-8 bg-white shrink-0">
          <h2 className="text-lg font-semibold font-heading">Overview</h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search01Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text"
                placeholder="Search APIs..."
                className="pl-9 pr-4 py-2 bg-neutral-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#006FEE]/20 transition-all w-64"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8 bg-neutral-50">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold font-heading mb-1">Your APIs</h1>
                <p className="text-neutral-500 text-sm">Monitor breaking changes across your services.</p>
              </div>
              <button className="bg-[#006FEE] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#005bc4] transition-colors">
                Add New API
              </button>
            </div>

            {/* Empty State / Content placeholder */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-blue-50 text-[#006FEE] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ZapIcon size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">No APIs configured yet</h3>
              <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                Connect your first OpenAPI spec URL to start polling for breaking changes.
              </p>
              <button className="bg-neutral-950 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors">
                Connect API
              </button>
            </div>

          </div>
        </div>

      </main>

    </div>
  )
}

