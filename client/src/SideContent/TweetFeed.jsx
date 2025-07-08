import React, { useEffect, useRef } from 'react';

const TweetFeed = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadTimeline = () => {
      // Tell Twitter to parse any twitter-timeline blockquotes inside containerRef
      window.twttr.widgets.load(containerRef.current);
    };

    if (window.twttr && window.twttr.widgets) {
      // Already loaded: just render
      loadTimeline();
    } else {
      // Inject widgets.js
      window.twttr = window.twttr || {};
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.onload = loadTimeline;           // <-- call loadTimeline once ready
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div ref={containerRef}>
      <blockquote
        className="twitter-timeline"
        data-theme="light"
        data-height="500"
      >
        <a href="https://twitter.com/PTCG_Legends?ref_src=twsrc%5Etfw">
          Tweets by @PTCG_Legends
        </a>
      </blockquote>
    </div>
  );
};

export default TweetFeed;
