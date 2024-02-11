/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      's.gravatar.com',
      'avatars.githubusercontent.com',
      'apis.live.net'
    ]
  }
}

module.exports = nextConfig
