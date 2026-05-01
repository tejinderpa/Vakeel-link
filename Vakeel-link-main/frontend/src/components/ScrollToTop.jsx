import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the window to top
    window.scrollTo(0, 0);
    
    // Also find any scrollable main elements and reset them
    const scrollableElements = document.querySelectorAll('.overflow-y-auto');
    scrollableElements.forEach(el => {
      el.scrollTo(0, 0);
    });
  }, [pathname]);

  return null;
}
