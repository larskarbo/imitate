import { DependencyList, useEffect, useRef } from "react"

const useKeypress = (
  keys: string[] | string,
  handler: (event: KeyboardEvent) => void,
  deps: DependencyList = [],
) => {
  const eventListenerRef = useRef<(event: KeyboardEvent) => void>()

  useEffect(() => {
    eventListenerRef.current = (event: KeyboardEvent) => {
      if (Array.isArray(keys) ? keys.includes(event.key) : keys === event.key) {
        handler(event)
      }
    }
  }, [keys, deps])

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      eventListenerRef.current?.(event)
    }
    window.addEventListener("keydown", eventListener)
    return () => {
      window.removeEventListener("keydown", eventListener)
    }
  }, [])
}

export default useKeypress
