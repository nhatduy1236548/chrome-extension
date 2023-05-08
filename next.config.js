/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {nextConfig,
    env: {
      NEXT_PUBLIC_NOTION_API_TOKEN: process.env.NOTION_API_TOKEN,
      NEXT_PUBLIC_NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
    },

}
