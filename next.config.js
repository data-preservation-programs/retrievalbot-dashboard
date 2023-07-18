/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        esmExternals: 'loose',
        serverActions: true,
    },
}

module.exports = nextConfig
