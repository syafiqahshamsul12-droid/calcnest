import { useEffect } from "react";

export default function GoogleAdSense() {
  useEffect(() => {
    const script = document.createElement("script");

    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9300935987849854";

    script.crossOrigin = "anonymous";

    document.head.appendChild(script);
  }, []);

  return null;
}