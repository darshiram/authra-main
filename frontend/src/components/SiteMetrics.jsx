import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SiteMetrics() {
  const location = useLocation();
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID;

  useEffect(() => {
    // Prevent loading in development if ID is missing or dummy
    if (!trackingId || trackingId === 'G-XXXXXXXXXX') {
      return;
    }

    // Load GA script only once
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}', { send_page_view: false });
      `;
      document.head.appendChild(inlineScript);
    }
  }, [trackingId]);

  useEffect(() => {
    if (!trackingId || trackingId === 'G-XXXXXXXXXX') return;
    
    // Send pageview on route change
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search
      });
    }
  }, [location, trackingId]);

  return null;
}
