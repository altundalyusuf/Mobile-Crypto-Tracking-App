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
│       │   ├── CoinCard.tsx     # Individual coin card component
│       │   ├── CoinChart.tsx    # Price history chart component
│       │   └── CoinDetailModal.tsx # Coin detail modal with chart and stats
│       └── HomeScreen.tsx       # Main market screen with search, filters, and pagination
│
├── lib/                          # External service configurations
│   └── supabase.ts              # Supabase client initialization with AsyncStorage
│
├── navigation/                   # Navigation configuration
│   └── TabNavigator.tsx         # Bottom tab navigator (Home, Favorites) with logout
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
└── utils/                        # Utility functions (currently empty)
```

## Key Architecture Decisions

### State Management

- **Redux Toolkit**: Centralized state management
- **RTK Query**: Data fetching and caching for CoinRanking API
- **AsyncStorage**: Persistence for favorites and Supabase auth sessions

### Feature Organization

- Features are self-contained with their own slices and screens
- Market feature includes reusable components in a subfolder
- No shared components folder (components are feature-specific)

### Navigation

- **Root Stack Navigator**: Handles auth flow (LoginScreen ↔ TabNavigator)
- **Bottom Tab Navigator**: Main app navigation (Home, Favorites)
- Logout button available in both tab screens

### API Integration

- **CoinRanking API**: Fetches cryptocurrency data
- **Supabase**: Handles authentication
- Environment variables: `EXPO_PUBLIC_COINRANKING_API_KEY`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## File Naming Conventions

- **Slices**: `*Slice.ts` (e.g., `authSlice.ts`)
- **Screens**: `*Screen.tsx` (e.g., `LoginScreen.tsx`)
- **Components**: PascalCase (e.g., `CoinCard.tsx`)
- **Utilities**: camelCase (e.g., `colors.ts`)
