import { useMemo } from 'react'

export function useCanvasSupport() {
  return useMemo(() => {
    if (typeof navigator === 'undefined') return true
    const cores = navigator.hardwareConcurrency ?? 4
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    return !mobile && cores > 2 && !reducedMotion
  }, [])
}
