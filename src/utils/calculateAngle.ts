import { Keypoint } from "@/types";

// Función de utilidad para calcular el ángulo entre tres puntos (A, B, C) donde B es el vértice
export const calculateAngle = (A: Keypoint, B: Keypoint, C: Keypoint): number => {
  const vectorBA = [A.x - B.x, A.y - B.y];
  const vectorBC = [C.x - B.x, C.y - B.y];

  const dotProduct = vectorBA[0] * vectorBC[0] + vectorBA[1] * vectorBC[1];

  const magnitudeBA = Math.sqrt(vectorBA[0] * vectorBA[0] + vectorBA[1] * vectorBA[1]);
  const magnitudeBC = Math.sqrt(vectorBC[0] * vectorBC[0] + vectorBC[1] * vectorBC[1]);

  if (magnitudeBA === 0 || magnitudeBC === 0) return 180;

  const cosAngle = dotProduct / (magnitudeBA * magnitudeBC);
  const angleRad = Math.acos(Math.min(1, Math.max(-1, cosAngle)));

  return angleRad * (180 / Math.PI);
};