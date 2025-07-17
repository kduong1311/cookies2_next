/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      'marketplace.canva.com',
      'https://api.cloudinary.com/v1_1/da9rooi9r/auto/upload',
      'res.cloudinary.com',
      'www.santos.fr',
      'stellar.co.uk',
      'images.thdstatic.com',
      'havamall.com',
      'encrypted-tbn0.gstatic.com',
      'lh3.googleusercontent.com',
    ],
  },
  
  // Fix lỗi Critters và các module Node.js khác
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     // Disable Node.js modules trên client-side
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //       path: false,
  //       os: false,
  //       crypto: false,
  //       stream: false,
  //       assert: false,
  //       http: false,
  //       https: false,
  //       url: false,
  //       zlib: false,
  //     }
  //   }
  //   return config
  // },
};

export default nextConfig;