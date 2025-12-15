/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suprimir warnings de atributos extras causados por extensões do navegador
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Configuração para ignorar atributos de extensões do navegador durante a hidratação
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig

