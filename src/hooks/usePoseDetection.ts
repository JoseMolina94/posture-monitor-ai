import { useEffect, useState } from "react";
import { Keypoint, PoseDetectionState } from "@/types";

// Declaración de tipos globales de TensorFlow y Pose Detection (cargados por CDN)
declare global {
  interface Window {
    tf: typeof import('@tensorflow/tfjs-core');
    poseDetection: typeof import('@tensorflow-models/pose-detection') & {
      util: { getAdjacentKeyPoints: (keypoints: Keypoint[], isMovenet: boolean) => [Keypoint, Keypoint][] };
    };
  }
}

// Hook personalizado para manejar la carga del detector de pose
export const usePoseDetection = () => {
  const [aiState, setAiState] = useState<PoseDetectionState>({
    detector: null,
    isModelLoading: false,
    error: null,
  });

  useEffect(() => {
    const loadDetector = async () => {
      // Asegurarse de que los scripts de CDN hayan cargado
      if (typeof window === 'undefined' || !window.tf || !window.poseDetection) {
        setAiState(state => ({ ...state, error: "Librerías de IA no cargadas. Revisando..." }));
        return;
      }

      setAiState(state => ({ ...state, isModelLoading: true, error: null }));
      try {
        const tf = window.tf;
        const poseDetection = window.poseDetection;

        // 1. Inicializar TF.js y el backend WebGL
        await tf.setBackend('webgl');
        await tf.ready();

        // 2. Crear el detector de pose usando la configuración nativa de MoveNet
        const detectorInstance = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
            quantBytes: 4
          } as any
        );

        setAiState(state => ({
          ...state,
          detector: detectorInstance,
          isModelLoading: false
        }));
        console.log("Modelo de IA cargado con éxito.");

      } catch (err) {
        console.error("Error al cargar el modelo de IA (Revisa permisos y WebGL):", err);
        setAiState(state => ({
          ...state,
          isModelLoading: false,
          error: "Fallo al cargar la IA. Revisa la consola para más detalles."
        }));
      }
    };

    if (!aiState.detector) {
      loadDetector();
    }

  }, [aiState.detector]);

  return aiState;
};