/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    REACT_APP_IMAGES_PATH: '/assets/images',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en-US/welcome',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
