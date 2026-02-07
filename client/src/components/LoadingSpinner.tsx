import { Loader } from 'lucide-react'

/**
 * Loading spinner component
 * Used for async operations
 */
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Loader className="w-8 h-8 text-accent animate-spin" />
      <p className="text-text-light text-sm">Loading...</p>
    </div>
  )
}
