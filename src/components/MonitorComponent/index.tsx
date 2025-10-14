import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Keypoint, Pose, PostureMetrics, PostureMonitorState } from '@/types';
import { usePoseDetection } from '@/hooks/usePoseDetection';
import { BAD_POSTURE_FRAMES, ENCORVADO_UMBRAL, MOVENET_KEYPOINT_CONNECTIONS } from '@/utils/constants';
import { MonitorControls } from './MonitorControls';
import { AlertNotification } from '../AlertNotification';
import { MonitorMetrics } from './MonitorMetrics';
import { MonitorIndicatorState } from './MonitorIndicatorState';
import { calculateAngle } from '@/utils/calculateAngle';

export default function MonitorComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [monitorState, setMonitorState] = useState<PostureMonitorState>({
    isRunning: false,
    isGoodPosture: true,
    message: "Pulsa 'Iniciar' para comenzar el monitoreo.",
    isModelReady: false,
    angleValue: 0,
  });

  const [postureMetrics, setPostureMetrics] = useState<PostureMetrics>({
    totalFrames: 0,
    goodFrames: 0,
    posturePercentage: 0,
    leftAngle: 0,
    rightAngle: 0,
  });

  const [isClient, setIsClient] = useState(false);
  const { detector, isModelLoading, error } = usePoseDetection();

  // Contador para manejar la persistencia del error (evitar alertas fugaces)
  const badPostureCounter = useRef(0);

  // Función para reproducir el sonido de alerta
  const playAlertSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reiniciar el sonido
      audioRef.current.play().catch(e => {
        console.warn("Fallo al reproducir el sonido (posiblemente bloqueado por el navegador).", e);
      });
    }
  }, []);

  // Función para lanzar la notificación del sistema
  const launchSystemNotification = useCallback(() => {
    // 1. Aseguramos que las Notificaciones existen
    if (typeof Notification === 'undefined') return;

    // 2. Solo notificar si la pestaña NO está visible
    if (document.visibilityState === 'hidden' && Notification.permission === "granted") {
      const options = {
        body: '¡Tu postura no es adecuada! Por favor, ajústala.',
        icon: '/icon-posture.png', // Un icono que puedes añadir a /public
        requireInteraction: false
      };
      new Notification('ALERTA DE POSTURA 🤖', options);
    }
  }, []);

  // Función de dibujo simple para ver los puntos de la pose
  const drawPose = useCallback((poses: Pose[], ctx: CanvasRenderingContext2D) => {
    if (!videoRef.current || typeof window.poseDetection === 'undefined') return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();

    // Dibuja el frame del video en el canvas
    ctx.drawImage(videoRef.current, 0, 0, ctx.canvas.width, ctx.canvas.height);

    // Dibuja la pose (skeleton y keypoints)
    for (const pose of poses) {
      if (pose.keypoints) {
        // Mapea los keypoints por nombre para un acceso rápido
        const keypointMap = pose.keypoints.reduce((map, kp) => {
          if (kp.name) {
            map.set(kp.name, kp);
          }
          return map;
        }, new Map<string, Keypoint>());

        // Dibuja los puntos (Keypoints)
        for (const keypoint of pose.keypoints) {
          if (keypoint.score && keypoint.score > 0.3) {
            const color = monitorState.isGoodPosture ? '#00FF00' : '#FF0000';
            ctx.beginPath();
            ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI); // Radio de 5px
            ctx.fillStyle = color;
            ctx.fill();
          }
        }

        // Dibuja las conexiones (Skeleton) usando la definición manual
        for (const [nameA, nameB] of MOVENET_KEYPOINT_CONNECTIONS) {
          const first = keypointMap.get(nameA);
          const second = keypointMap.get(nameB);

          if (first && second && first.score! > 0.3 && second.score! > 0.3) {
            ctx.beginPath();
            ctx.moveTo(first.x, first.y);
            ctx.lineTo(second.x, second.y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
          }
        }
      }
    }
    ctx.restore();
    // Libera la memoria de TensorFlow.js
    window.tf.dispose(poses);
  }, [monitorState.isGoodPosture]);

  // --- Bucle de Detección en Tiempo Real ---
  const detectPoseInRealTime = useCallback(async () => {
    if (!detector || !videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) {
      animationFrameId.current = requestAnimationFrame(detectPoseInRealTime);
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      animationFrameId.current = requestAnimationFrame(detectPoseInRealTime);
      return;
    }

    try {
      const poses: Pose[] = await detector.estimatePoses(videoRef.current);
      let isCurrentlyGood = true;
      let currentMessage = "Postura Óptima";
      let avgAngle = 0;
      let leftAngle = 0;
      let rightAngle = 0;

      if (poses.length > 0) {
        const keypoints = poses[0].keypoints;
        const MIN_SCORE = 0.5;

        // --- 1. Detección Bilateral ---

        // Lado Derecho
        const rShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
        const rHip = keypoints.find(kp => kp.name === 'right_hip');
        const rEar = keypoints.find(kp => kp.name === 'right_ear');

        // Lado Izquierdo
        const lShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
        const lHip = keypoints.find(kp => kp.name === 'left_hip');
        const lEar = keypoints.find(kp => kp.name === 'left_ear');

        let validAngles: number[] = [];

        // Calcular ángulo derecho si los puntos son visibles
        if (rShoulder && rHip && rEar && rShoulder.score! > MIN_SCORE && rHip.score! > MIN_SCORE && rEar.score! > MIN_SCORE) {
          rightAngle = calculateAngle(rEar, rShoulder, rHip);
          validAngles.push(rightAngle);
        }

        // Calcular ángulo izquierdo si los puntos son visibles
        if (lShoulder && lHip && lEar && lShoulder.score! > MIN_SCORE && lHip.score! > MIN_SCORE && lEar.score! > MIN_SCORE) {
          leftAngle = calculateAngle(lEar, lShoulder, lHip);
          validAngles.push(leftAngle);
        }

        // --- 2. Lógica de Alerta ---

        if (validAngles.length > 0) {
          avgAngle = validAngles.reduce((a, b) => a + b, 0) / validAngles.length;

          if (avgAngle < ENCORVADO_UMBRAL) {
            badPostureCounter.current += 1;
            currentMessage = `¡ALERTA! Ángulo promedio ${avgAngle.toFixed(1)}° < ${ENCORVADO_UMBRAL}°.`;

            if (badPostureCounter.current >= BAD_POSTURE_FRAMES) {
              isCurrentlyGood = false;
              playAlertSound();
              launchSystemNotification();
            } else {
              isCurrentlyGood = true; // Sigue siendo verde, pero advertimos
              currentMessage = `¡CUIDADO! Estás encorvado (${avgAngle.toFixed(1)}°)...`;
            }
          } else {
            badPostureCounter.current = 0;
            currentMessage = `Postura Óptima (Ángulo Promedio: ${avgAngle.toFixed(1)}°)`;
            isCurrentlyGood = true;
          }

        } else {
          currentMessage = "Asegúrate de que hombros, caderas y orejas sean visibles.";
          isCurrentlyGood = true;
        }
      } else {
        currentMessage = "No se detecta ninguna persona en el cuadro.";
        isCurrentlyGood = true;
      }

      // --- 3. Actualización de Métricas ---
      setPostureMetrics(prev => ({
        ...prev,
        totalFrames: prev.totalFrames + 1,
        goodFrames: prev.goodFrames + (isCurrentlyGood ? 1 : 0),
        posturePercentage: ((prev.goodFrames + (isCurrentlyGood ? 1 : 0)) / (prev.totalFrames + 1)) * 100,
        leftAngle: leftAngle,
        rightAngle: rightAngle,
      }));

      // --- 4. Actualización de Estado de Monitoreo ---
      setMonitorState(s => ({
        ...s,
        isGoodPosture: isCurrentlyGood,
        message: currentMessage,
        angleValue: avgAngle,
      }));

      // Dibujar la pose en el canvas
      if (poses.length > 0) {
        drawPose(poses, ctx);
      }

    } catch (err) {
      console.error("Error durante la detección de pose:", err);
    }

    // Continuar el bucle
    animationFrameId.current = requestAnimationFrame(detectPoseInRealTime);
  }, [detector, drawPose, playAlertSound, launchSystemNotification]);


  // --- Lógica de la Webcam y Stream ---

  // Estabilizada con useCallback para evitar la recreación en cada render
  const stopMonitoring = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    // Resetea las métricas al detener
    setPostureMetrics({
      totalFrames: 0,
      goodFrames: 0,
      posturePercentage: 0,
      leftAngle: 0,
      rightAngle: 0,
    });

    setMonitorState(s => ({
      isRunning: false,
      isGoodPosture: true,
      message: "Monitoreo detenido. Pulsa 'Iniciar' para reiniciar.",
      isModelReady: s.isModelReady,
      angleValue: 0,
    }));
  }, [setMonitorState]);

  const startMonitoring = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isClient || !detector) return;

    // Resetea métricas para un nuevo inicio
    setPostureMetrics({
      totalFrames: 0,
      goodFrames: 0,
      posturePercentage: 0,
      leftAngle: 0,
      rightAngle: 0,
    });

    try {
      // 1. Solicitar permiso de la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        videoRef.current!.onloadedmetadata = () => {
          resolve(true);
        };
      });

      // 2. Sincronizar el tamaño del canvas con el video
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.play();

      setMonitorState(s => ({
        ...s,
        isRunning: true,
        message: "¡Monitor de postura iniciado! Analizando...",
      }));

      // 3. Iniciar el bucle de detección de pose
      detectPoseInRealTime();

      // ** Solicitar permiso de Notificación **
      if (typeof Notification !== 'undefined' && Notification.permission !== "granted") {
        Notification.requestPermission();
      }


    } catch (error) {
      console.error("Error al acceder a la webcam o al iniciar el monitoreo:", error);
      setMonitorState(s => ({
        ...s,
        isRunning: false,
        message: "ERROR: No se pudo acceder a la cámara o el permiso fue denegado."
      }));
    }
  }, [isClient, detector, detectPoseInRealTime, setMonitorState]);

  useEffect(() => {
    setIsClient(true);
    // Este bloque de lógica solo se ejecuta una vez cuando el detector está listo
    if (detector && !monitorState.isModelReady) {
      setMonitorState(s => ({ ...s, isModelReady: true }));
    }
    // Inicializar el objeto Audio una vez
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('/alert.mp3');
    }

    // El cleanup ahora usa la función stopMonitoring estable
    return () => {
      stopMonitoring();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [detector, monitorState.isModelReady, stopMonitoring]);

  const statusColor = monitorState.isRunning
    ? (monitorState.isGoodPosture ? 'bg-green-500' : 'bg-red-500 animate-pulse')
    : (isModelLoading ? 'bg-yellow-600' : 'bg-gray-400');

  let statusMessage = monitorState.message;
  if (isModelLoading) {
    statusMessage = "Cargando modelo de IA (TensorFlow)...";
  } else if (error) {
    statusMessage = "ERROR de IA. " + error;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center justify-center font-sans">
      <h1 className="text-4xl font-extrabold text-white mb-6">
        Monitor de Postura por IA
      </h1>

      {/* Dashboard Principal */}
      <div className="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-2xl p-6 transition-all duration-300">

        <MonitorIndicatorState 
          monitorState={monitorState} 
          statusColor={statusColor} 
          statusMessage={statusMessage} 
        />

        {/* Contenedor de la Webcam y Canvas */}
        <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden mb-6 shadow-inner flex items-center justify-center">
          {/* Video (oculto, solo para capturar el stream) */}
          <video
            ref={videoRef}
            className="hidden"
            autoPlay
            playsInline
            muted
          />

          {/* Canvas (visible, donde se dibujará el video y los puntos de pose) */}
          <canvas
            ref={canvasRef}
            className={`w-full h-full object-cover ${monitorState.isRunning ? '' : 'hidden'}`}
          />

          {/* Mensaje de espera si no está corriendo */}
          {!monitorState.isRunning && (
            <p className="absolute text-white/70 text-lg font-medium">
              {!detector
                ? (error ? statusMessage : "Cargando modelo de IA...")
                : "Presiona Iniciar para usar tu cámara."
              }
            </p>
          )}
        </div>

        <MonitorMetrics postureMetrics={postureMetrics} />

        <MonitorControls
          monitorState={monitorState}
          detector={detector}
          isClient={isClient}
          isModelLoading={isModelLoading}
          startMonitoring={startMonitoring}
          stopMonitoring={stopMonitoring}
        />

      </div>

      <AlertNotification
        title='¡Alerta!'
        description='Ajusta tu posición de inmediato.'
        className={`${monitorState.isGoodPosture ? 'translate-x-[150%] border-transparent' : 'translate-x-0 border-red-500'}`}
      />

    </div>
  );
};
