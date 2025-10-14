
// --- CONFIGURACIÓN DE IA Y MODELO ---
export const ENCORVADO_UMBRAL = 160; // 160 grados: Si es menor, se considera encorvado
export const BAD_POSTURE_FRAMES = 10; // Frames para confirmar mala postura (aprox. 0.3-0.5 segundos)

// Definición manual de las conexiones del esqueleto para MoveNet (17 puntos)
// Los números son índices, pero usamos los nombres para mayor claridad.
export const MOVENET_KEYPOINT_CONNECTIONS: [string, string][] = [
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'],
    ['left_elbow', 'left_wrist'],
    ['left_hip', 'left_knee'],
    ['left_knee', 'left_ankle'],
    ['right_shoulder', 'right_elbow'],
    ['right_elbow', 'right_wrist'],
    ['right_hip', 'right_knee'],
    ['right_knee', 'right_ankle'],
    ['left_shoulder', 'left_hip'],
    ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['nose', 'left_eye'],
    ['left_eye', 'left_ear'],
    ['nose', 'right_eye'],
    ['right_eye', 'right_ear'],
];