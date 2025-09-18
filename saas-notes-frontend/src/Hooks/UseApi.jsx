import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiUrl } from "../StandardConst";

// Generic fetcher
async function apiRequest({ url, method = "GET", body, headers = {}, params }) {
  // Build query string for GET requests with params
  let fullUrl = `${ApiUrl}/${url}`;
  if (params && method === "GET") {
    const qs = new URLSearchParams(params).toString();
    fullUrl += `?${qs}`;
  }

  const res = await fetch(fullUrl, {
    method,
    headers: {
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body && method !== "GET" ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Error: ${res.status}`);
  }

  return res.json();
}

/**
 * Custom hook for API calls
 * @param {Object} config
 * @param {string} config.url - API endpoint
 * @param {string} [config.method="GET"] - HTTP method
 * @param {Object} [config.body] - Request body for mutations
 * @param {Object} [config.params] - Query params for GET requests
 * @param {Array} [config.queryKey] - React Query key for caching
 * @param {boolean} [config.enabled] - Whether query should auto-run
 */
export function UseApi({ url, method = "GET", body, params, queryKey, enabled = true }) {
  const queryClient = useQueryClient();

  if (method === "GET") {
    return useQuery({
      queryKey: queryKey || [url, params], // include params in cache key
      queryFn: () => apiRequest({ url, method, params }),
      enabled,
    });
  }

  return useMutation({
    mutationFn: (variables) =>
      apiRequest({ url, method, body: variables || body }),
    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}

export default UseApi;