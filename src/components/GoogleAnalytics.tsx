import { useEffect } from "react";

export default function GoogleAnalytics() {
  useEffect(() => {
    const GA_ID = "G-Q6G9519GZ6";

   const script = document.createElement("script");
   script.async = true;
   script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;

document.head.appendChild(script);

    const script2 = document.createElement("script");
    script2.innerHTML = 
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    ;

    document.head.appendChild(script2);
  }, []);

  return null;
}