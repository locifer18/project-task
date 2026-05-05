import React from 'react'

function Wrapper({children}: {children: React.ReactNode}) {
  return (      
  <div className="min-h-[85vh] rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-8 xl:py-6">
    {children}
    </div>
  )
}

export default Wrapper