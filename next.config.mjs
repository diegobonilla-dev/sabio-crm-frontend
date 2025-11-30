/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar modo standalone para Docker
  output: 'standalone',

  // Configurar variables de entorno públicas
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
