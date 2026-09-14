import React from "react"

export const FloatingStickers: React.FC = () => {
  return (
    <>
      <div className="hidden lg:block absolute top-20 left-12 xl:left-24 w-16 h-16 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 z-10 border-4 border-white bg-white">
        <img
          src="https://api.dicebear.com/7.x/micah/svg?seed=Felix&backgroundColor=d8b4fe"
          alt="Dev avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="hidden lg:block absolute top-32 right-12 xl:right-32 w-14 h-14 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 z-10 border-4 border-white bg-white">
        <img
          src="https://api.dicebear.com/7.x/micah/svg?seed=Aria&backgroundColor=a7f3d0"
          alt="Dev avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="hidden lg:block absolute bottom-24 left-16 xl:left-32 w-12 h-12 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 z-10 border-4 border-white bg-white">
        <img
          src="https://api.dicebear.com/7.x/micah/svg?seed=Milo&backgroundColor=fde68a"
          alt="Dev avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="hidden lg:block absolute bottom-32 right-16 xl:right-40 w-16 h-16 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 z-10 border-4 border-white bg-white">
        <img
          src="https://api.dicebear.com/7.x/micah/svg?seed=Jasmine&backgroundColor=bae6fd"
          alt="Dev avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="hidden 2xl:block absolute top-1/2 left-8 w-14 h-14 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 z-10 border-4 border-white bg-white -translate-y-1/2">
        <img
          src="https://api.dicebear.com/7.x/micah/svg?seed=Oliver&backgroundColor=fbcfe8"
          alt="Dev avatar"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="hidden 2xl:block absolute top-1/2 right-8 w-12 h-12 rounded-full overflow-hidden shadow-sm hover:scale-105 transition-transform duration-300 z-10 border-4 border-white bg-white -translate-y-1/2">
        <img
          src="https://api.dicebear.com/7.x/micah/svg?seed=Leo&backgroundColor=c7d2fe"
          alt="Dev avatar"
          className="w-full h-full object-cover"
        />
      </div>
    </>
  )
}
