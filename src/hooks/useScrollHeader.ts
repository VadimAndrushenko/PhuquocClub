import { useEffect, useRef, useState } from 'react';

export function useScrollHeader() {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    lastScrollRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollRef.current && currentScroll > 50) {
        setShowHeader(false);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          setShowHeader(true);
        }, 1500);
      } else {
        setShowHeader(true);
      }

      lastScrollRef.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []); 

  return { showHeader };
}