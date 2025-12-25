src/
├── api/ # CoinRanking API (RTK Query kullanacaksan burası değişir, aşağıyı oku)
├── components/ # Ortak componentler
├── features/ # Özellik bazlı ayrım
│ ├── auth/ # AuthSlice.ts burada olacak
│ ├── market/ # MarketSlice.ts burada
│ └── favorites/ # FavoritesSlice.ts burada
├── navigation/ # Navigasyon
├── store/ # store.ts (Main configuration) ve hooks.ts (useAppDispatch, useAppSelector)
├── theme/ # Renkler/Fontlar
├── types/ # Interface'ler
└── utils/ # Helper'lar
