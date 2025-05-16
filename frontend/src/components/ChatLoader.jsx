import { LoaderIcon } from 'lucide-react'
import React from 'react'

function ChatLoader() {
  return (
    <div className='h-screen flex flex-col items-center justify-center p-4'>
        <LoaderIcon className='animate-spin size-10 text-purple-400'/>
        <p className='mt-4 text-center text-lg font-mono'>Connecting to chat</p>
      
    </div>
  )
}

export default ChatLoader
