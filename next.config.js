/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deshabilitar completamente las herramientas de desarrollo
  devIndicators: false,
  // Mantener el modo estricto de React
  reactStrictMode: true,
  // Configuración experimental
  experimental: {
    // Deshabilitar la carga optimizada
    disableOptimizedLoading: true
  }
};

module.exports = nextConfig; 