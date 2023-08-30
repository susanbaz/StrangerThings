import React, { useEffect, useState } from 'react';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const COHORT_NAME = '2302-ACC-PT-WEB-PT-C';
  const BASE_URL = `https://strangers-things.herokuapp.com/api/${COHORT_NAME}`;

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const fetchAllPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/posts`);
        const result = await response.json();

        if (response.ok) {
          const filteredResults = result.data.posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSearchResults(filteredResults);
        } else {
          setError('Failed to fetch posts.');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('An error occurred while fetching posts.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPosts();
  }, [searchTerm]);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowMessageBox(true);
  };

  const closeMessageBox = () => {
    setSelectedPost(null);
    setShowMessageBox(false);
    setMessageContent('');
  };

  const handleSendMessage = async () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      const response = await fetch(`${BASE_URL}/posts/${selectedPost._id}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: { content: messageContent } }),
      });

      if (response.ok) {
        setMessageContent('');
        alert('Message sent successfully.');
      } else {
        const errorData = await response.json();
        alert(`Error sending message: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h3>Search Listings</h3>
      <input
        type="text"
        placeholder="Search listings..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {searchResults.map((post, index) => (
          <li key={index}>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <p>Price: {post.price}</p>
            <p>Location: {post.location}</p>
            <p>Seller: {post.author.username}</p>
            <button onClick={() => handlePostClick(post)}>Message Seller</button>
          </li>
        ))}
      </ul>
      {showMessageBox && (
        <div className="message-box">
          <h2>Message Seller</h2>
          <p>Post: {selectedPost.title}</p>
          <textarea 
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send Message</button>
          <button onClick={closeMessageBox}>Close</button>
        </div>
      )}
    </div>
  );
};

export default SearchForm;