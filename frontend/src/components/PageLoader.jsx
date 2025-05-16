import { LoaderCircleIcon } from 'lucide-react'
import React from 'react'

function PageLoader() {
  return (
    <div className='min-h-screen flex items-center justify-center' data-theme='light'>
        <LoaderCircleIcon className='animate-spin size-10 text-purple-400' />
      
    </div>
  )
}

export default PageLoader
