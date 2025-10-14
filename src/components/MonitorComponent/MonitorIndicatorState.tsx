/* Indicador de Estado */

import { PostureMonitorState } from "@/types"

type MonitorIndicatorStateProps = {
  statusColor: string
  statusMessage: string
  monitorState: PostureMonitorState
}

export const MonitorIndicatorState = ({
  statusColor,
  statusMessage,
  monitorState
}: MonitorIndicatorStateProps) => {

  return (
    <div className="flex items-center justify-between p-4 mb-6 rounded-xl transition-colors duration-500"
          style={{ backgroundColor: statusColor.split(' ')[0] }}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full ${statusColor} mr-4 border-4 border-white`}></div>
            <p className="text-xl font-bold text-white">
              {statusMessage}
            </p>
          </div>
          <p className="text-white text-sm opacity-70">
            {monitorState.angleValue > 0 ? `Ángulo Promedio: ${monitorState.angleValue.toFixed(1)}°` : 'Estado de la Detección'}
          </p>
        </div>
  )
}