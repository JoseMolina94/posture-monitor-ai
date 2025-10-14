import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Monitor de Postura IA",
  description: "Monitor de postura en tiempo real usando TensorFlow.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/*
          IMPORTANTE: Cargamos TensorFlow y Pose Detection por CDN para evitar
          conflictos de módulos ('Export Pose' error) con Next.js/Turbopack.
          Esto hace que 'tf' y 'poseDetection' estén disponibles globalmente en 'window'.
        */}
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js"></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}