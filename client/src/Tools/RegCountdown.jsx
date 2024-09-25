import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  background-color: #1290eb;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 2px 3px;
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

const RegistrationTime = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const CountdownTooltip = ({ registrationTime }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [formattedRegTime, setFormattedRegTime] = useState('');
  const [isFutureEvent, setIsFutureEvent] = useState(false);

  useEffect(() => {
    const formatRegistrationTime = () => {
      const registrationDate = new Date(registrationTime);
      const options = { 
        weekday: 'short',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric',
        timeZoneName: 'short' 
      };
      const formattedTime = registrationDate.toLocaleDateString(undefined, options);
      setFormattedRegTime(formattedTime);
    };

    const calculateTimeRemaining = () => {
      const now = new Date();
      const registrationDate = new Date(registrationTime);
      const difference = registrationDate - now;

      if (difference > 0) {
        setIsFutureEvent(true);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else {
        setIsFutureEvent(false); // Clear if registration time is in the past
        setTimeRemaining('');
      }
    };

    formatRegistrationTime();
    calculateTimeRemaining();
    const intervalId = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [registrationTime]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span className="material-symbols-outlined reg-icon">
        {new Date(registrationTime) > new Date() ? 'schedule' : 'edit_note'}
      </span>
      {isFutureEvent && (
        <TooltipContainer>
          {formattedRegTime && <RegistrationTime>{formattedRegTime}</RegistrationTime>}
          {timeRemaining}
        </TooltipContainer>
      )}
    </div>
  );
};

export default CountdownTooltip;
