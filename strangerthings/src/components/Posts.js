import React, { useState, useEffect } from 'react';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  const [messageFeedback, setMessageFeedback] = useState(null);

  const COHORT_NAME = '2302-ACC-PT-WEB-PT-C';
  const BASE_URL = `https://strangers-things.herokuapp.com/api/${COHORT_NAME}`;
  const authToken = localStorage.getItem('authToken');

  const fetchAllPosts = async () => {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
      const response = await fetch(`${BASE_URL}/posts`, { headers });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Failed to fetch posts');
      }
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error(err);
    }
  };

  const postMessage = async (postId) => {
    setMessageSending(true);
    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          message: {
            content: messageContent,
          },
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessageFeedback('Message sent successfully.');
      } else {
        throw new Error(result.error ? result.error.message : 'Failed to send message.');
      }
    } catch (err) {
      setMessageFeedback(err.message);
      console.error(err);
    } finally {
      setMessageSending(false);
    }
  };

  useEffect(() => {
    fetchAllPosts()
      .then((result) => {
        if (result && result.data.posts) {
          setPosts(result.data.posts);
        }
      })
      .catch((err) => {
        setError('Failed to load posts. Please try again later.');
        console.error(err);
      });
  }, []);

  const openMessageBox = (post) => {
    if (!authToken) {  // Check if user is not authenticated
      setMessageFeedback('You must be logged in to send a message.');
      return;
    }

    setSelectedPost(post);
    setShowMessageBox(true);
    setMessageFeedback(null);  // reset feedback when opening a new message box
  };

  const closeMessageBox = () => {
    setSelectedPost(null);
    setShowMessageBox(false);
    setMessageContent('');
    setMessageFeedback(null);  // reset feedback on close
  };
     
  return (
    <div className="posts">
      <h1>Posts</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {posts.length ? (
          posts.map((post) => (
            <li key={post._id}>
              <div>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <p>Price: {post.price}</p>
                <p>Location: {post.location}</p>
                <p>Seller: {post.author.username}</p>
                <button onClick={() => openMessageBox(post)}>Message Seller</button>
              </div>
              {showMessageBox && selectedPost && selectedPost._id === post._id && (
                <div className="message-box">
                  <h2>Message Seller</h2>
                  <p>Post: {selectedPost.title}</p>
                  <textarea
                    id="message-content"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Enter your message..."
                  />
                  <button onClick={() => postMessage(selectedPost._id)} disabled={messageSending}>
                    {messageSending ? 'Sending...' : 'Send Message'}
                  </button>
                  <button onClick={closeMessageBox}>Return</button>
                  {messageFeedback && <p>{messageFeedback}</p>}
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </ul>
    </div>
  );
}

export default Posts;