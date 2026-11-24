import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'

// Same reducers as the website (website/src/store) — one definition of favourites, compare, preferences…
import compare from '@/store/slices/compareSlice'
import favorites from '@/store/slices/favoritesSlice'
import filters from '@/store/slices/filtersSlice'
import preferences from '@/store/slices/preferencesSlice'
import ui from '@/store/slices/uiSlice'

const rootReducer = combineReducers({ filters, ui, preferences, favorites, compare })
type State = ReturnType<typeof rootReducer>
const KEY = 'apex-aura/state/v1'
/** Slices kept on the device between launches. */
const PERSISTED = ['preferences', 'favorites', 'compare'] as const

function makeStore(preloadedState?: Partial<State>) {
  return configureStore({ reducer: rootReducer, preloadedState })
}
export type AppStore = ReturnType<typeof makeStore>

/** Loads saved favourites/compare/currency, then provides the store and saves changes back (debounced). */
export function StoreProvider({ children, onReady }: { children: React.ReactNode; onReady?: () => void }) {
  const [store, setStore] = useState<AppStore | null>(null)

  useEffect(() => {
    let cancelled = false
    AsyncStorage.getItem(KEY)
      .then((raw) => (raw ? (JSON.parse(raw) as Partial<State>) : undefined))
      .catch(() => undefined)
      .then((saved) => {
        if (cancelled) return
        const s = makeStore(saved)
        let timer: ReturnType<typeof setTimeout> | undefined
        let last = ''
        s.subscribe(() => {
          clearTimeout(timer)
          timer = setTimeout(() => {
            const state = s.getState()
            const json = JSON.stringify(Object.fromEntries(PERSISTED.map((k) => [k, state[k]])))
            if (json !== last) {
              last = json
              void AsyncStorage.setItem(KEY, json)
            }
          }, 300)
        })
        setStore(s)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (store) onReady?.()
  }, [store, onReady])

  if (!store) return null
  return <Provider store={store}>{children}</Provider>
}
