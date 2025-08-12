// src/services/dashboardService.js

import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '@/utils/api';

/**
 * Obtener datos del dashboard
 */
export async function getDashboardData() {
  try {
    const data = await makeGetRequest("/api/dashboard");
    return data;    
  } catch (e) {
    console.error("Error al obtener datos del dashboard:", e);
    throw e;
  }
}