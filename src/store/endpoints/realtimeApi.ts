import { api } from "../apiSlice"

/**
 * Example: Real-time Data Endpoint with WebSocket Integration
 * 
 * This demonstrates how to combine RTK Query with WebSocket for real-time updates.
 * The query fetches initial data via HTTP, and WebSocket updates keep it fresh.
 */

// Example types
interface RealtimeData {
  id: string
  value: number
  timestamp: string
}

interface RealtimeDataResponse {
  data: RealtimeData[]
  lastUpdate: string
}

/**
 * Real-time data API endpoint
 */
export const realtimeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get realtime data - initial fetch via HTTP
     */
    getRealtimeData: builder.query<RealtimeDataResponse, void>({
      query: () => "/realtime/data",
      providesTags: ["Events"],
      
      /**
       * onCacheEntryAdded - Advanced feature for WebSocket integration
       * This allows you to listen to WebSocket updates and update the cache
       */
      async onCacheEntryAdded(
        _arg,
        { cacheDataLoaded, cacheEntryRemoved }
      ) {
        // Wait for the initial query to resolve before proceeding
        await cacheDataLoaded

        // TODO: Implement WebSocket message handling
        // This is a placeholder for future real-time update integration
        // When implemented, subscribe to WebSocket messages here and call updateCachedData
        
        // Example pattern (not currently active):
        // - Listen for ws/message actions
        // - Filter by message.type (e.g., "realtime_data_update")
        // - Call updateCachedData to update the cached query data
        
        // Subscribe to store changes to listen for WebSocket messages
        // In a real implementation, you'd use store.subscribe or middleware
        // This is a simplified example
        
        // Wait until cache entry is removed
        await cacheEntryRemoved
        // Cleanup WebSocket subscriptions here when cache is removed
      },
    }),

    /**
     * Subscribe to realtime updates
     * This mutation triggers WebSocket subscription on the server
     */
    subscribeToRealtime: builder.mutation<void, { channel: string }>({
      query: (params) => ({
        url: "/realtime/subscribe",
        method: "POST",
        body: params,
      }),
    }),

    /**
     * Unsubscribe from realtime updates
     */
    unsubscribeFromRealtime: builder.mutation<void, { channel: string }>({
      query: (params) => ({
        url: "/realtime/unsubscribe",
        method: "POST",
        body: params,
      }),
    }),
  }),
})

export const {
  useGetRealtimeDataQuery,
  useSubscribeToRealtimeMutation,
  useUnsubscribeFromRealtimeMutation,
} = realtimeApi

/**
 * Usage in components:
 * 
 * import { useGetRealtimeDataQuery } from "@/store/endpoints/realtimeApi"
 * import { wsConnect, wsDisconnect } from "@/store/websocketMiddleware"
 * import { useAppDispatch } from "@/store/hooks"
 * 
 * function RealtimeComponent() {
 *   const dispatch = useAppDispatch()
 *   const { data, isLoading } = useGetRealtimeDataQuery()
 *   
 *   useEffect(() => {
 *     // Connect to WebSocket when component mounts
 *     dispatch(wsConnect())
 *     
 *     return () => {
 *       // Disconnect when component unmounts
 *       dispatch(wsDisconnect())
 *     }
 *   }, [dispatch])
 *   
 *   return (
 *     <div>
 *       {data?.data.map(item => (
 *         <div key={item.id}>{item.value}</div>
 *       ))}
 *     </div>
 *   )
 * }
 */
