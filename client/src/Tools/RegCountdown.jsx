import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  background-color: #1290eb;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 5px;
  position: absolute;
  z-index: 2;
  bottom: 105%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 12px;
  @media screen and (max-width: 530px) {
    font-size: 8px;  
    bottom: 95%;
  }
`;

const CountdownTooltip = ({ registrationTime }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const registrationDate = new Date(registrationTime);
      const difference = registrationDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(''); // Clear timeRemaining if registration time is in the past
      }
    };

    calculateTimeRemaining();
    const intervalId = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [registrationTime]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span className="material-symbols-outlined reg-icon">
        {new Date(registrationTime) > new Date() ? 'schedule' : 'edit_note'}
      </span>
      {/* {timeRemaining && <TooltipContainer>{timeRemaining}</TooltipContainer>} */}
      {timeRemaining && <TooltipContainer>Delayed</TooltipContainer>}
    </div>
  );
};

export default CountdownTooltip;
