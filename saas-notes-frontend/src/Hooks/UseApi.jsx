import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiUrl } from "../StandardConst";
;

// Generic fetcher
async function apiRequest({ url, method = "GET", body, headers = {} }) {
  const res = await fetch(`${ApiUrl}/${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
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
 * @param {Array} [config.queryKey] - React Query key for caching
 * @param {boolean} [config.enabled] - Whether query should auto-run
 */
export function UseApi({ url, method = "GET", body, queryKey, enabled = true }) {
  const queryClient = useQueryClient();

  // For GET requests → useQuery
  if (method === "GET") {
    return useQuery({
      queryKey: queryKey || [url],
      queryFn: () => apiRequest({ url, method }),
      enabled,
    });
  }

  // For POST/PUT/DELETE → useMutation
  return useMutation({
    mutationFn: (variables) =>
      apiRequest({ url, method, body: variables || body }),
    onSuccess: () => {
      // Invalidate related queries after mutation
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
}
