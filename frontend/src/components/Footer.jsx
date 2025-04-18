import React from 'react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1a1a1a] border-t border-[#2a2a2a] py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-xs">
              <span className="text-[#00BFFF] font-semibold">
                Technologies used:
              </span>{' '}
              React, React Router, Tailwind CSS, TMDB API, Vite
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-xs">
              Project built for the GDSC Mentorship Program | Mentee: Emiliano
              Huerta | Mentor: Guillermo Jiménez
            </p>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-[#2a2a2a] text-center">
          <p className="text-gray-500 text-xs">
            &copy; {currentYear} Webflix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
