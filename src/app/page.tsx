'use client'; 
// La directiva 'use client' es OBLIGATORIA para usar Hooks y APIs del navegador como la webcam.

import MonitorComponent from "@/components/MonitorComponent"; // Importación ajustada con la extensión .tsx

/**
 * Esta es la página raíz de nuestra aplicación.
 * El componente principal de monitoreo es importado aquí.
 */
const HomePage = () => {
  return (
    <MonitorComponent />
  );
};

export default HomePage;
