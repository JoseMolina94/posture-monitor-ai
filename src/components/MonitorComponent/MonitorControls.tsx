import { PostureMonitorState } from "@/types"

type MonitorControlsProps = {
  monitorState: PostureMonitorState
  startMonitoring: () => void
  isClient: boolean
  isModelLoading: boolean
  detector: any
  stopMonitoring: () => void
}

export const MonitorControls = ({
  monitorState,
  startMonitoring,
  isClient,
  isModelLoading,
  detector,
  stopMonitoring
}: MonitorControlsProps) => {

  return (
    <div className="flex justify-center space-x-4 mt-6">
      {/* Controles */}
      {!monitorState.isRunning ? (
        <button
          onClick={() => startMonitoring()}
          className="flex items-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
          disabled={!isClient || isModelLoading || !detector}
        >
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.18c-.808.43-1.637.766-2.502.996C10.74 12.41 9.947 12.5 9 12.5c-3.14 0-5.75-2.5-5.75-5.5s2.61-5.5 5.75-5.5c.808 0 1.637.215 2.502.445.865.23 1.66 1.766 2.502.996l3.5 3.5c.34.34.34.9 0 1.24l-3.5 3.5zM9 19.5c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" /></svg>
          Iniciar Monitoreo
        </button>
      ) : (
        <button
          onClick={() => stopMonitoring()}
          className="flex items-center px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition duration-300 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Detener Monitoreo
        </button>
      )}
    </div>
  )
}