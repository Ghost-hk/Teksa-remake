// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  images: {
    //
    domains: [
      "teksa-images.s3.eu-west-2.amazonaws.com",
      "lh3.googleusercontent.com",
    ],
  },
};

//https://teksa-images.s3.eu-west-2.amazonaws.com/balckHoodie.jpeg
export default config;
