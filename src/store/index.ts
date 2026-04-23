import { configureStore } from "@reduxjs/toolkit"
import apiKeyReducer from "./apiKeySlice"
import dashboardReducer from "./dashboardSlice"
import { api } from "./apiSlice"

export const store = configureStore({
  reducer: {
    apiKey: apiKeyReducer,
    dashboard: dashboardReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
