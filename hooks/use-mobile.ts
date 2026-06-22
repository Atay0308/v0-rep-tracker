import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * description: A custom hook that detects if the user is on a mobile device based on the window width. 
 * It listens for the window size and updates the state accordingly, allowing components to conditionally render mobile specific layouts.
 * 
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}
