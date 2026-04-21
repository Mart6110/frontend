import { api } from "../apiSlice"
import type { BaseQueryFn } from "@reduxjs/toolkit/query"

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
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        // Wait for the initial query to resolve before proceeding
        await cacheDataLoaded

        // Listen for WebSocket messages
        const handleWebSocketMessage = (action: any) => {
          if (action.type === "ws/message") {
            const message = action.payload

            // Handle different message types
            switch (message.type) {
              case "realtime_data_update":
                // Update the cached data with WebSocket data
                updateCachedData((draft) => {
                  draft.data = message.payload.data
                  draft.lastUpdate = message.payload.timestamp
                })
                break

              case "realtime_data_item_update":
                // Update a single item in the cached data
                updateCachedData((draft) => {
                  const index = draft.data.findIndex(
                    (item) => item.id === message.payload.id
                  )
                  if (index !== -1) {
                    draft.data[index] = message.payload
                  } else {
                    draft.data.push(message.payload)
                  }
                  draft.lastUpdate = new Date().toISOString()
                })
                break
            }
          }
        }

        // Subscribe to store changes to listen for WebSocket messages
        // In a real implementation, you'd use store.subscribe or middleware
        // This is a simplified example
        
        // Wait until cache entry is removed
        await cacheEntryRemoved
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
