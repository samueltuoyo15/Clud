import React from "react"
import { CheckmarkCircle01Icon, Alert02Icon, Shield01Icon } from "hugeicons-react"

export const FloatingStickers: React.FC = () => {
  return (
    <>
      {/* Top Left Sticker: Drift Alert */}
      <div className="hidden lg:flex items-center gap-3 absolute top-12 left-6 xl:left-12 bg-white/95 border border-purple-200/80 rounded-2xl p-2.5 shadow-xs backdrop-blur-xs select-none rotate-[-4deg] hover:rotate-0 transition-transform duration-200 z-10">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center overflow-hidden shrink-0">
          <img
            src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=d8b4fe"
            alt="Dev avatar"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="text-left pr-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-neutral-900">Drift Caught</span>
            <Alert02Icon size={12} className="text-purple-600" />
          </div>
          <p className="text-[11px] text-neutral-500 font-mono">/api/v2/payments</p>
        </div>
      </div>

      {/* Top Right Sticker: Synced Spec */}
      <div className="hidden lg:flex items-center gap-3 absolute top-10 right-6 xl:right-12 bg-white/95 border border-emerald-200/80 rounded-2xl p-2.5 shadow-xs backdrop-blur-xs select-none rotate-[3deg] hover:rotate-0 transition-transform duration-200 z-10">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
          <img
            src="https://api.dicebear.com/7.x/bottts/svg?seed=Aria&backgroundColor=a7f3d0"
            alt="Dev avatar"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="text-left pr-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-neutral-900">OpenAPI Synced</span>
            <CheckmarkCircle01Icon size={12} className="text-emerald-600" />
          </div>
          <p className="text-[11px] text-neutral-500 font-mono">200 OK • 120ms</p>
        </div>
      </div>

      {/* Bottom Left Sticker: Protected Build */}
      <div className="hidden lg:flex items-center gap-3 absolute bottom-8 left-8 xl:left-16 bg-white/95 border border-amber-200/80 rounded-2xl p-2.5 shadow-xs backdrop-blur-xs select-none rotate-[2deg] hover:rotate-0 transition-transform duration-200 z-10">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center overflow-hidden shrink-0">
          <img
            src="https://api.dicebear.com/7.x/bottts/svg?seed=Milo&backgroundColor=fde68a"
            alt="Dev avatar"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="text-left pr-2">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-neutral-900">CI Guarded</span>
            <Shield01Icon size={12} className="text-amber-600" />
          </div>
          <p className="text-[11px] text-neutral-500 font-mono">0 breaking diffs</p>
        </div>
      </div>

      {/* Bottom Right Hand-drawn Annotation */}
      <div className="hidden md:flex flex-col items-end absolute bottom-6 right-8 xl:right-16 select-none opacity-80 pointer-events-none">
        <span className="text-xs text-neutral-500 font-mono tracking-tight text-right">
          less broken endpoints,
          <br />
          more shipping.
        </span>
        <span className="text-neutral-400 text-lg leading-none mt-0.5">⤷</span>
      </div>
    </>
  )
}
