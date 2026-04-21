import { configureStore } from "@reduxjs/toolkit"
import apiKeyReducer from "./apiKeySlice"
import dashboardReducer from "./dashboardSlice"

export const store = configureStore({
  reducer: {
    apiKey: apiKeyReducer,
    dashboard: dashboardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
