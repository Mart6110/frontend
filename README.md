# Sand Battery Dashboard Frontend

A modern React-based dashboard for monitoring and controlling sand battery energy storage systems.

## Features

- 📊 Real-time dashboard with KPI cards and charts
- 📈 Advanced analytics with multiple visualization options
- 🔄 Real-time data updates via RTK Query
- 🎨 Dark/Light theme support
- 📱 Responsive design for mobile and desktop
- 🔐 API key authentication
- 📤 Excel export functionality

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Redux Toolkit** with RTK Query for state management and API calls
- **Chakra UI** for component library
- **TanStack Router** for routing
- **ECharts** for data visualization
- **Formik + Yup** for forms and validation

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Backend API running on port 8080 (for local development)

### Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   # Quick setup script
   chmod +x setup.sh
   ./setup.sh
   
   # Or manually
   cp .env.example .env.local
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Environment Configuration

### Local Development

API requests are proxied through Vite dev server to `http://localhost:8080`:

```env
# .env.local
VITE_API_BASE_URL=/api
```

### Production

Direct API calls to production backend:

```env
# .env.production
VITE_API_BASE_URL=https://api.dunepower.acceptable.pro
```

See [API_SETUP.md](./API_SETUP.md) for detailed configuration guide.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate test coverage report

## Docker Deployment

### Build and run with Docker Compose:

```bash
docker-compose up -d
```

The frontend will be available at `http://localhost:3000`

### Build Docker image only:

```bash
docker build -t sandbattery-frontend .
docker run -p 3000:80 sandbattery-frontend
```

## API Integration

This project uses RTK Query for API communication. See examples in:
- [API_SETUP.md](./API_SETUP.md) - Complete setup guide
- [src/store/apiSlice.ts](./src/store/apiSlice.ts) - API endpoint definitions
- [src/components/ExampleApiUsage.tsx](./src/components/ExampleApiUsage.tsx) - Usage examples

### Example Usage

```typescript
import { useGetLatestDataQuery } from '@/store/apiSlice'

function Dashboard() {
  const { data, isLoading } = useGetLatestDataQuery(
    undefined,
    { pollingInterval: 30000 } // Update every 30 seconds
  )
  
  return <div>Sand Temperature: {data?.sand_temp}°C</div>
}
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── dashboard/    # Dashboard-specific components
│   └── ui/           # Base UI components
├── pages/            # Page components
├── routes/           # TanStack Router routes
├── store/            # Redux store and slices
│   ├── apiSlice.ts   # RTK Query API definitions
│   ├── apiKeySlice.ts
│   └── dashboardSlice.ts
├── services/         # Service layer (mock data)
├── utils/            # Utility functions
├── constants/        # App constants and text
└── theme/            # Chakra UI theme customization
```

## Configuration Files

- `vite.config.ts` - Vite configuration with API proxy
- `tsconfig.json` - TypeScript configuration
- `nginx.conf` - Nginx configuration for Docker deployment
- `docker-compose.yml` - Docker Compose setup
- `.env.example` - Environment variable template

## Development

### Adding New API Endpoints

1. Define types in `src/store/apiSlice.ts`
2. Add endpoint to the `api` builder:
   ```typescript
   endpoints: (builder) => ({
     getNewData: builder.query<ReturnType, ParamsType>({
       query: (params) => ({
         url: '/endpoint',
         params,
       }),
     }),
   })
   ```
3. Export the auto-generated hook
4. Use in components: `useGetNewDataQuery()`

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage
```

## Deployment

### Production Build

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy with Docker

1. Build production image:
   ```bash
   docker build -t sandbattery-frontend:latest .
   ```

2. Run with docker-compose:
   ```bash
   docker-compose up -d
   ```

### Deploy to Cloud

1. Set environment variables for production
2. Build the Docker image
3. Push to container registry
4. Deploy to your hosting platform (AWS, GCP, Azure, etc.)

## Troubleshooting

### API Requests Failing

- **Development**: Check that backend is running on port 8080
- **Production**: Verify `VITE_API_BASE_URL` in `.env.production`
- Check browser console and network tab for errors

### Environment Variables Not Loading

- Restart dev server after changing `.env` files
- Ensure variables are prefixed with `VITE_`
- Check that `.env.local` exists and is not in `.gitignore`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

[Your License Here]
