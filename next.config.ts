import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    rules: {
      '*.glsl': {
        as: '*.js',
        loaders: ['raw-loader'],
      },
    },
  },
}

export default nextConfig
