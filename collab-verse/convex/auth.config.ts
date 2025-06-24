const authConfig = {
  providers: [
    {
      // domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      domain:"https://gentle-dragon-3.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};

export default authConfig;
