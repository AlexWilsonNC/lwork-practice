import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const TwitterTimelineWrapper = styled.div`
  .twitter-timeline {
    ${({ theme }) => theme.twitterTimeline};
  }
`;

const TwitterWidget = () => {
    const { theme } = useTheme();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.charset = 'utf-8';

        document.body.appendChild(script);
    }, []);

    return (
        <TwitterTimelineWrapper theme={theme} className='homepage-hide-large'>
            <a
                className="twitter-timeline"
                data-width="450"
                data-height="500"
                data-theme={theme.themeName}
                href="https://twitter.com/PTCG_Legends?ref_src=twsrc%5Etfw"
            >
                Tweets by PTCG_Legends
            </a>
        </TwitterTimelineWrapper>
    );
};

export default TwitterWidget;
