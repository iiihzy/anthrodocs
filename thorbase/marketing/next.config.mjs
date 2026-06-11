/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出配置
  // output: 'export',
  // distDir: 'dist',

  // 图片优化配置
  images: {
    unoptimized: true,
  },

  // 头信息配置
  async headers() {
    return [
      {
        source: "/feedback",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
