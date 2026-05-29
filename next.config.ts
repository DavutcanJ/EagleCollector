import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Legacy routes from the ministry-only version → unified model.
      { source: "/expenses", destination: "/transactions", permanent: true },
      { source: "/expenses/:id", destination: "/transactions/:id", permanent: true },
      { source: "/politicians", destination: "/officials", permanent: true },
      { source: "/politicians/:id", destination: "/officials/:id", permanent: true },
      { source: "/ministries", destination: "/institutions", permanent: true },
      { source: "/ministries/:id", destination: "/institutions/:id", permanent: true },
      // Legacy ad-hoc API → versioned API.
      { source: "/api/expenses", destination: "/api/v1/transactions", permanent: true },
      { source: "/api/politicians", destination: "/api/v1/officials", permanent: true },
      { source: "/api/ministries", destination: "/api/v1/institutions", permanent: true },
    ];
  },
};

export default nextConfig;
