import { configureStore, type Middleware } from "@reduxjs/toolkit"
import apiKeyReducer from "./apiKeySlice"
import dashboardReducer from "./dashboardSlice"
import websocketReducer from "./websocketMiddleware"
import { api } from "./apiSlice"
import { createWebSocketMiddleware } from "./websocketMiddleware"

// Define RootState type from reducers before store creation
type PreloadedRootState = {
  apiKey: ReturnType<typeof apiKeyReducer>
  dashboard: ReturnType<typeof dashboardReducer>
  websocket: ReturnType<typeof websocketReducer>
  [api.reducerPath]: ReturnType<typeof api.reducer>
}

export const store = configureStore({
  reducer: {
    apiKey: apiKeyReducer,
    dashboard: dashboardReducer,
    websocket: websocketReducer,
    // Add the RTK Query API reducer
    [api.reducerPath]: api.reducer,
  },
  // Add the RTK Query middleware and WebSocket middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware as Middleware)
      .concat(createWebSocketMiddleware() as Middleware),
})

export type RootState = PreloadedRootState
export type AppDispatch = typeof store.dispatch
