/**
 * API Configuration
 *
 * The API URL is configured via the NEXT_PUBLIC_API_URL environment variable.
 *
 * Default: https://kgm.preprodagency.com/api (production)
 *
 * For local development, create a .env.local file in the front/ directory:
 * NEXT_PUBLIC_API_URL=http://localhost:8000/api
 *
 * For production, the default is already set to:
 * https://kgm.preprodagency.com/api
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://kgm.preprodagency.com/api";

export const API_ENDPOINTS = {
  COMING_SOON: `${API_BASE_URL}/coming-soon`,
  TEST_DRIVE: `${API_BASE_URL}/test-drive`,
  ORDERS: `${API_BASE_URL}/orders`,
} as const;
