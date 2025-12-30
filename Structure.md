# Project Structure

```
src/
├── api/                          # API Services (RTK Query)
│   └── coinsApi.ts              # CoinRanking API endpoints (getCoins, getCoinHistory)
│
├── components/                   # Shared/Common components (currently empty)
│
├── features/                     # Feature-based modules
│   ├── auth/                    # Authentication feature
│   │   ├── authSlice.ts        # Redux slice for auth state (login, signup, logout, session)
│   │   └── LoginScreen.tsx      # Login/Signup UI screen
│   │
│   ├── favorites/               # Favorites feature
│   │   ├── favoritesSlice.ts   # Redux slice for favorites state with AsyncStorage persistence
│   │   └── FavoritesScreen.tsx  # Favorites list screen with search
│   │
│   └── market/                  # Crypto market feature
│       ├── components/          # Market-specific components
│       │   ├── CoinCard.tsx     # Individual coin card component with favorite toggle
│       │   ├── CoinChart.tsx    # Price history chart component (24h) with high/low stats
│       │   └── CoinDetailModal.tsx # Custom iOS-style bottom sheet modal with PanResponder drag gestures
│       ├── hooks/               # Market-specific custom hooks
│       │   └── useCoinPagination.ts # Pagination and data aggregation logic
│       └── HomeScreen.tsx       # Main market screen with search, filters, and pagination
│
├── lib/                          # External service configurations
│   └── supabase.ts              # Supabase client initialization with AsyncStorage
│
├── navigation/                   # Navigation configuration
│   └── TabNavigator.tsx         # Bottom tab navigator (Home, Favorites) with logout confirmation dialog and loading overlay
│
├── store/                        # Redux store configuration
│   ├── hooks.ts                 # Typed Redux hooks (useAppDispatch, useAppSelector)
│   └── store.ts                 # Redux store setup with auth, favorites, and coinsApi reducers
│
├── theme/                        # Theme configuration
│   └── colors.ts                # Color palette constants
│
├── types/                        # TypeScript type definitions
│   └── coin.ts                  # CoinRanking API interfaces (Coin, CoinsResponse, etc.)
│
└── utils/                        # Utility functions
    ├── formatters.ts            # Formatting utilities (price, numbers, URLs)
    └── hooks/                   # Shared custom hooks
        └── useDebounce.ts       # Debounce hook for search inputs
```

## Key Architecture Decisions

### State Management

- **Redux Toolkit**: Centralized state management
- **RTK Query**: Data fetching and caching for CoinRanking API
- **AsyncStorage**: Persistence for favorites and Supabase auth sessions

### Feature Organization

- Features are self-contained with their own slices and screens
- Market feature includes reusable components and hooks in subfolders
- No shared components folder (components are feature-specific)
- Shared utilities and hooks are in `utils/` directory

### Navigation

- **Root Stack Navigator**: Handles auth flow (LoginScreen ↔ TabNavigator)
- **Bottom Tab Navigator**: Main app navigation (Home, Favorites)
- **Logout**: Confirmation dialog ("Are you sure?") with loading overlay during sign-out process
- Logout button available in both tab screens with visual feedback

### API Integration

- **CoinRanking API**: Fetches cryptocurrency data
- **Supabase**: Handles authentication
- Environment variables: `EXPO_PUBLIC_COINRANKING_API_KEY`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Key Implementation Details

### CoinDetailModal (Bottom Sheet)

- Custom iOS-style bottom sheet using `PanResponder` and `Animated.View`
- Drag-to-dismiss functionality with threshold and velocity detection
- Spring animation for snap-back behavior
- Safe area insets support for notched devices
- Handle bar for visual drag indicator

### HomeScreen Features

- **Search**: Debounced search with minimum 2-character requirement (API limitation)
- **Filters**: Horizontal scrollable filter chips (Market Cap, Price, 24h Volume, Change, Listed At)
- **Pagination**: Infinite scroll with `useCoinPagination` hook managing data aggregation
- **Keyboard**: Auto-dismiss on scroll for better UX

### Authentication Flow

- Supabase Auth with session persistence via AsyncStorage
- Login/Signup toggle on single screen
- Session check on app start
- Auth state change listener for real-time updates

### Favorites System

- AsyncStorage persistence for offline access
- Real-time price updates via polling (120s interval)
- Search functionality within favorites
- Merge strategy: Fresh API data + local favorites fallback

## File Naming Conventions

- **Slices**: `*Slice.ts` (e.g., `authSlice.ts`)
- **Screens**: `*Screen.tsx` (e.g., `LoginScreen.tsx`)
- **Components**: PascalCase (e.g., `CoinCard.tsx`)
- **Utilities**: camelCase (e.g., `colors.ts`)
- **Hooks**: `use*.ts` (e.g., `useDebounce.ts`, `useCoinPagination.ts`)
