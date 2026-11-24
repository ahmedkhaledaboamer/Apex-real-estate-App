# Apex Aura — Mobile App

React Native app (Expo SDK 58, Expo Router, TypeScript) for Apex Aura Real Estate, Dubai.
Same design and the same data as the website.

## Setup

The app shares its data and business logic (properties, communities, agents, pricing, fees,
calculators, Redux slices, brand tokens) with the website, so both repositories must sit
**side by side**, with the website cloned into a folder named `website`:

```
apex-aura/
├── website/   ← https://github.com/ahmedkhaledaboamer/Apex-real-estate
└── mobile/    ← this repository
```

```bash
mkdir apex-aura && cd apex-aura
git clone https://github.com/ahmedkhaledaboamer/Apex-real-estate.git website
git clone https://github.com/ahmedkhaledaboamer/Apex-real-estate-App.git mobile
cd mobile
npm install
```

`@/…` imports resolve to `mobile/src` first, then to `website/src` (see `metro.config.js` and
`tsconfig.json`). Edit shared data once in `website/src` and both the site and the app update.

## Run

```bash
npx expo start          # scan the QR code with Expo Go (Android / iPhone, same Wi-Fi)
npx expo start --web    # browser preview (maps show a placeholder on web)
npx tsc --noEmit        # type-check
```

## Build for the stores

Use EAS: `npx eas-cli@latest build --platform android` (or `ios`). See https://docs.expo.dev/build/introduction/.
