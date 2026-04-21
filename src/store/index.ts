import { configureStore } from "@reduxjs/toolkit"
import apiKeyReducer from "./apiKeySlice"
import dashboardReducer from "./dashboardSlice"
import websocketReducer from "./websocketMiddleware"
import { api } from "./apiSlice"
import { createWebSocketMiddleware } from "./websocketMiddleware"

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
      .concat(api.middleware)
      .concat(createWebSocketMiddleware()),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
