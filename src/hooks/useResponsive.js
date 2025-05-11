import { useState, useEffect } from 'react';

const useResponsive = (breakpoint = 768) => { // Default breakpoint for mobile (md in Tailwind)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  return isMobile;
};

export default useResponsive;