import { api } from "../apiSlice"

/**
 * Example API endpoint file
 * This demonstrates how to create endpoints using the base API slice
 * 
 * To use this pattern for your actual endpoints:
 * 1. Copy this file and rename it (e.g., energyApi.ts, temperatureApi.ts)
 * 2. Define your request/response types
 * 3. Add your endpoints using the builder
 * 4. Import and use the auto-generated hooks in your components
 */

// Example types for the endpoint
interface ExampleDataRequest {
  startDate: string
  endDate: string
}

interface ExampleDataResponse {
  data: {
    timestamp: string
    value: number
  }[]
  total: number
}

// Inject endpoints into the base API slice
export const exampleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Example GET query
    getExampleData: builder.query<ExampleDataResponse, ExampleDataRequest>({
      query: (params) => ({
        url: "/example",
        params,
      }),
      // Tag for cache invalidation
      providesTags: ["Energy"],
    }),

    // Example POST mutation
    createExampleData: builder.mutation<void, { value: number }>({
      query: (body) => ({
        url: "/example",
        method: "POST",
        body,
      }),
      // Invalidate cache after mutation
      invalidatesTags: ["Energy"],
    }),
  }),
})

// Auto-generated hooks
export const {
  useGetExampleDataQuery,
  useCreateExampleDataMutation,
} = exampleApi

/**
 * Usage in components:
 * 
 * const { data, isLoading, error } = useGetExampleDataQuery({
 *   startDate: "2024-01-01",
 *   endDate: "2024-01-31"
 * })
 * 
 * const [createData, { isLoading }] = useCreateExampleDataMutation()
 * 
 * await createData({ value: 100 })
 */
