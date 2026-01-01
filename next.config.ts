import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true, // Mevcut ayarınız

  // Eklenen kısım: Server Actions için dosya boyutu limitini 10MB yapıyoruz
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
