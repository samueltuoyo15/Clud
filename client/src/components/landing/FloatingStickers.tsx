import React from "react"

export const FloatingStickers: React.FC = () => {
  return (
    <>
      <div className="hidden lg:block absolute top-20 left-12 xl:left-24 w-16 h-16 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 z-10 border-4 border-white bg-white">
        <img
          src="https://api.dicebear.com/7.x/big-smile/svg?seed=Sam&backgroundColor=e9d5ff&accessories=faceMask"
          alt="Dev avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="hidden lg:block absolute top-32 right-12 xl:right-32 w-14 h-14 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 z-10 border-4 border-white bg-white">
        <img
          src="https://api.dicebear.com/7.x/big-smile/svg?seed=Alex&backgroundColor=d8b4fe&accessories=faceMask"
          alt="Dev avatar"
          className="w-full h-full object-cover -scale-x-100"
        />
      </div>

      <div className="hidden lg:block absolute bottom-24 left-16 xl:left-32 w-12 h-12 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 z-10 border-4 border-white bg-white">
        <img
          src="https://api.dicebear.com/7.x/big-smile/svg?seed=Taylor&backgroundColor=c084fc&accessories=faceMask"
          alt="Dev avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="hidden lg:block absolute bottom-32 right-16 xl:right-40 w-16 h-16 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 z-10 border-4 border-white bg-white">
        <img
          src="https://api.dicebear.com/7.x/big-smile/svg?seed=Jordan&backgroundColor=a855f7&accessories=faceMask"
          alt="Dev avatar"
          className="w-full h-full object-cover -scale-x-100"
        />
      </div>

      <div className="hidden 2xl:block absolute top-1/2 left-8 w-14 h-14 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 z-10 border-4 border-white bg-white -translate-y-1/2">
        <img
          src="https://api.dicebear.com/7.x/big-smile/svg?seed=Casey&backgroundColor=9333ea&accessories=faceMask"
          alt="Dev avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="hidden 2xl:block absolute top-1/2 right-8 w-12 h-12 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 z-10 border-4 border-white bg-white -translate-y-1/2">
        <img
          src="https://api.dicebear.com/7.x/big-smile/svg?seed=Morgan&backgroundColor=7e22ce&accessories=faceMask"
          alt="Dev avatar"
          className="w-full h-full object-cover -scale-x-100"
        />
      </div>
    </>
  )
}
