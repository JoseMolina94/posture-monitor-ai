/* Métrica de Porcentaje de Postura */

import { PostureMetrics } from "@/types"

type MonitorMetricsProps = {
  postureMetrics: PostureMetrics
}

export const MonitorMetrics = ({
  postureMetrics
}: MonitorMetricsProps) => {

  const percentageColor = (
    postureMetrics.posturePercentage > 85
      ? 'text-green-400'
      : postureMetrics.posturePercentage > 60
        ? 'text-yellow-400'
        : 'text-red-400'
  );

  return (
    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
      <div className="p-3 bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-400 font-medium">Postura Correcta</p>
        <p className={`text-3xl font-extrabold ${percentageColor}`}>
          {postureMetrics.posturePercentage.toFixed(1)}%
        </p>
      </div>
      <div className="p-3 bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-400 font-medium">Ángulo Izquierdo</p>
        <p className="text-xl font-bold text-white">
          {postureMetrics.leftAngle.toFixed(1)}°
        </p>
      </div>
      <div className="p-3 bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-400 font-medium">Ángulo Derecho</p>
        <p className="text-xl font-bold text-white">
          {postureMetrics.rightAngle.toFixed(1)}°
        </p>
      </div>
    </div>
  )
}