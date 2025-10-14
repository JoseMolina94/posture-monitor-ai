// --- TIPOS DE DATOS ---
export type Keypoint = {
  x: number;
  y: number;
  score?: number;
  name?: string;
};
export type Pose = { keypoints: Keypoint[]; score?: number; };
export type PoseDetector = any;

// Interfaz para gestionar el estado de la aplicación
export interface PostureMonitorState {
  isRunning: boolean;
  isGoodPosture: boolean; // TRUE = Verde, FALSE = Rojo
  message: string;
  isModelReady: boolean;
  angleValue: number; // Nuevo estado para mostrar el ángulo
}

// Interfaz para el estado de la IA
export interface PoseDetectionState {
    detector: PoseDetector | null;
    isModelLoading: boolean;
    error: string | null;
}

export interface PostureMetrics {
  totalFrames: number;
  goodFrames: number;
  posturePercentage: number; // Porcentaje de tiempo con buena postura
  leftAngle: number;
  rightAngle: number;
}