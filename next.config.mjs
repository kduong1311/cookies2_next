/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,

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
};

export default nextConfig;