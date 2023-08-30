import React, { useState } from 'react';

const COHORT_NAME = '2302-ACC-PT-WEB-PT-C';
const BASE_URL = `https://strangers-things.herokuapp.com/api/${COHORT_NAME}`;

const makeHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const PostsForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const username = localStorage.getItem('username');

    const newPostData = {
      post: {
        title,
        description,
        price,
        sellerName: username,
        location,
      },
    };

    try {
      const response = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: makeHeaders(),
        body: JSON.stringify(newPostData),
      });

      if (response.ok) {
        const data = await response.json();
        if (onPostCreated) onPostCreated(data);
        setTitle('');
        setDescription('');
        setPrice('');
        setLocation('');
        setMessage('Listing successfully created!');
        setIsError(false);
      } else {
        const errorData = await response.json();
        setMessage(`Error creating listing: ${errorData.message}`);
        setIsError(true);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      setMessage('Error creating listing. Please check your connection and try again.');
      setIsError(true);
    }
  };

  return (
    <div>
      <h2>Create a New Listing</h2>
      {message && <div className={`message ${isError ? 'error' : 'success'}`}>{message}</div>}
      <form onSubmit={handleCreatePost}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            cols="50"
            placeholder="Write your listing description..."
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="$0.00"
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State"
            required
          />
        </div>
        <button type="submit">Create Listing</button>
      </form>
    </div>
  );
};

export default PostsForm;