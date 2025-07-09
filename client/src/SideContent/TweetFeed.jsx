import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const TwitterTimelineWrapper = styled.div`
  .twitter-timeline {
    ${({ theme }) => theme.twitterTimeline};
  }
`;

const TwitterWidget = () => {
    const { theme } = useTheme();
    const containerRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.charset = 'utf-8';

        // Append script only once
        if (!window.twttr) {
            document.body.appendChild(script);
        } else {
            // If already loaded, manually load the widget in this container
            window.twttr.widgets.load(containerRef.current);
        }
    }, []);

    return (
        <TwitterTimelineWrapper theme={theme} className='homepage-hide-large'>
            <div ref={containerRef}>
                <a
                    className="twitter-timeline"
                    data-width="450"
                    data-height="500"
                    data-theme={theme.themeName}
                    href="https://twitter.com/PTCG_Legends?ref_src=twsrc%5Etfw"
                >
                    Tweets by PTCG_Legends
                </a>
            </div>
        </TwitterTimelineWrapper>
    );
};

export default TwitterWidget;
