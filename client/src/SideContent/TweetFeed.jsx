import React, { useEffect } from 'react';

const TweetFeed = () => {
  useEffect(() => {
    // 1) Inject widgets.js once
    if (!window.twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // 2) On subsequent loads just re-render the embed
      window.twttr.widgets.load();
    }
  }, []);

  // 3) This blockquote is what Twitter will turn into your timeline
  return (
    <blockquote
      className="twitter-timeline"
      data-theme="light"      // or "dark", if you prefer
      data-height="500"
    >
      <a href="https://twitter.com/PTCG_Legends?ref_src=twsrc%5Etfw">
        Tweets by @PTCG_Legends
      </a>
    </blockquote>
  );
};

export default TweetFeed;
