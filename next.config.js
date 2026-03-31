/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  output: 'export',
  pageExtensions: ['ts', 'tsx'],
  trailingSlash: true,
}

module.exports = nextConfig
