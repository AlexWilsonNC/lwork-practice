import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const SubscriptionFormContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1290eb;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 100%;
  h3 {margin-top: 15px;}
`;

const CloseButton = styled.button`
  float: right;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color:white;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const SubscribeButton = styled.button`
  padding: 3px 5px;
  margin-top: 5px;
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

const SubscriptionForm = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setErrorMessage('Please provide a valid email.');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Pass email in the body
      });

      const result = await response.json();

      if (response.ok) {
        alert('You have successfully subscribed for updates!');
        setErrorMessage(null); // Clear any previous error message
        closeModal(); // Close modal after successful submission
      } else {
        setErrorMessage(result.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Subscription failed. Please try again later.');
    }
  };

  return (
    <SubscriptionFormContainer>
      <ModalContent className='modalsubpopup'>
        <CloseButton onClick={closeModal}>&times;</CloseButton>
        <h3>Subscribe for Event Updates</h3>
        <p className='smallsubtxt'>Emails consist of:
          <ul>
            <li>when new events are added to the season</li>
            <li>an event's registration is announced</li>
            <li>when an event's results are available</li>
          </ul>
        </p>
        <br></br>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          <SubscribeButton type="submit">Subscribe</SubscribeButton>
          <br></br>
          <br></br>
          <p className='smallsubtxt'>(This is NOT an official resource - please do not solely rely on our email system for perfect updates.)</p>
        </form>
      </ModalContent>
    </SubscriptionFormContainer>
  );
};

export default SubscriptionForm;
