import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import Cookies from "js-cookie"

interface ApiKeyState {
  apiKey: string | null
}

const initialState: ApiKeyState = {
  apiKey: Cookies.get("apiKey") ?? null,
}

const apiKeySlice = createSlice({
  name: "apiKey",
  initialState,
  reducers: {
    setApiKey(state, action: PayloadAction<string>) {
      state.apiKey = action.payload
      Cookies.set("apiKey", action.payload, { expires: 7 })
    },
    clearApiKey(state) {
      state.apiKey = null
      Cookies.remove("apiKey")
    },
  },
})

export const { setApiKey, clearApiKey } = apiKeySlice.actions
export default apiKeySlice.reducer
