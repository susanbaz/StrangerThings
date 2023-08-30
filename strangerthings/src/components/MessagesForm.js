import React, { useState } from 'react';

const COHORT_NAME = '2302-ACC-PT-WEB-PT-C';
const BASE_URL = `https://strangers-things.herokuapp.com/api/${COHORT_NAME}` // Replace with your actual base URL

const makeHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const MessagesForm = ({ post }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const newMessage = {
      message: {
        content: message
      }
    };

    try {
      const response = await fetch(`${BASE_URL}/posts/${post._id}/messages`, {
        method: 'POST',
        headers: makeHeaders(),
        body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        const response = await response.json();
        setMessage('');
        alert('Message sent successfully.');
      } else {
        const errorData = await response.json();
        alert(`Error sending message: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h3>Send Message to Author</h3>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default MessagesForm;