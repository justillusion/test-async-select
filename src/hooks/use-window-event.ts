import {useEffect, useRef} from 'react';

export function useWindowEvent<T extends keyof WindowEventMap>(
  type: T, listener: (this:Window, event: WindowEventMap[T]) => any, options?: AddEventListenerOptions
) {
  const listenerRef = useRef(listener);
  // it updates current state inside listener
  listenerRef.current = listener

  useEffect(() => {
    function handler (event: WindowEventMap[T]) {
      listenerRef.current.call(window, event);
    }
    window.addEventListener(type, handler, options)
    return () => {
      window.removeEventListener(type, handler, options)
    }
  }, [type, options])
}