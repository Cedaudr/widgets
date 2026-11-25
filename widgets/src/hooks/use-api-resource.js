import { useCallback, useEffect, useRef, useState } from "react"

export function useApiResource(load, key, { enabled = true, initialData = null } = {}) {
  const loadRef = useRef(load)

  useEffect(() => {
    loadRef.current = load
  }, [load])

  const [state, setState] = useState({ key, version: 0, data: initialData, error: null, loaded: false })
  const [version, setVersion] = useState(0)
  const reload = useCallback(() => setVersion((value) => value + 1), [])

  const loading = enabled && (!state.loaded || state.key !== key || state.version !== version)

  useEffect(() => {
    if (!enabled) return

    const controller = new AbortController()
    let active = true

    loadRef
      .current(controller.signal)
      .then((data) => {
        if (active) setState({ key, version, data, error: null, loaded: true })
      })
      .catch((error) => {
        if (active && error?.name !== "AbortError") {
          setState((previous) => ({ ...previous, key, version, error, loaded: true }))
        }
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [key, enabled, version])

  return { data: state.data, error: state.error, loading, reload }
}
