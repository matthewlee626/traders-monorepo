/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['source.unsplash.com'],
  },
  env: {
    BACKEND_ROUTE: `${process.env.BACKEND_ROUTE}`,
    FRONTEND_URL: `${process.env.FRONTEND_URL}`,
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/login',
  //       destination: `${process.env.BACKEND_ROUTE}/user/login`,
  //       permanent: false,
  //     },
  //     {
  //       source: '/logout',
  //       destination: `${process.env.BACKEND_ROUTE}/user/logout`,
  //       permanent: false,
  //     },
  //   ];
  // },
};
