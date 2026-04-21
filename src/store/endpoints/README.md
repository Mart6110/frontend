# Store Endpoints

This directory contains API endpoint definitions using RTK Query.

## Structure

Each endpoint file should:
1. Import the base `api` from `../apiSlice`
2. Define TypeScript types for requests and responses
3. Use `api.injectEndpoints()` to add endpoints
4. Export the auto-generated hooks

## Example

```typescript
import { api } from "../apiSlice"

interface DataResponse {
  id: string
  value: number
}

export const dataApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getData: builder.query<DataResponse, string>({
      query: (id) => `/data/${id}`,
      providesTags: ["Data"],
    }),
  }),
})

export const { useGetDataQuery } = dataApi
```

## Benefits

- **Centralized configuration**: All endpoints use the same base URL and API key
- **Automatic caching**: RTK Query handles caching and refetching
- **Type safety**: Full TypeScript support
- **Optimistic updates**: Easy to implement optimistic UI updates
- **Auto-generated hooks**: No need to write custom hooks

See `exampleApi.ts` for a complete example.
