import React, { useState, useEffect } from 'react';
import './Profile.css';

export default function Profile() {
  const authToken = localStorage.getItem('authToken');
  const [username, setUsername] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [yourPosts, setYourPosts] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [isConfirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [yourMessages, setYourMessages] = useState([]);
  const [editedPost, setEditedPost] = useState({});

  useEffect(() => {
    async function fetchUsername() {
      try {
        const response = await fetch(
          `https://strangers-things.herokuapp.com/api/2302-ACC-PT-WEB-PT-C/users/me`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          setUsername(result.data.username);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchUsername();
  }, [authToken]);

  useEffect(() => {
    fetchYourPosts();
  }, [username]);

  const toggleTokenVisibility = () => {
    setShowToken(prevShowToken => !prevShowToken);
  };

  const toggleMessageVisibility = async () => {
    if (!showMessages) {
      await fetchMessages();
    }
    setShowMessages(prevShowMessages => !prevShowMessages);
  };

  const fetchYourPosts = async () => {
    try {
      const response = await fetch(
        `https://strangers-things.herokuapp.com/api/2302-ACC-PT-WEB-PT-C/posts`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.data && result.data.posts) {
        setYourPosts(
          result.data.posts.filter(post => post.author.username === username)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updatePost = async (
    postId,
    title,
    description,
    price,
    location,
    willDeliver
  ) => {
    try {
      const response = await fetch(
        `https://strangers-things.herokuapp.com/api/2302-ACC-PT-WEB-PT-C/posts/${postId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            post: {
              title,
              description,
              price,
              location,
              willDeliver,
            },
          }),
        }
      );

      const result = await response.json();

      if (result.post && result.post.isAuthor) {
        console.log('Update successful:', result);
        return result;
      } else if (result.post && !result.post.isAuthor) {
        console.log('Update failed: Not the author of the post');
        return null;
      } else {
        console.log('Update failed:', result);
        return null;
      }
    } catch (error) {
      console.error('Error updating post:', error);
      return null;
    }
  };

  const startEditing = post => {
    setEditingPostId(post._id);
    setEditedPost(post);
  };

  const stopEditing = () => {
    setEditingPostId(null);
  };

  const handleEditSubmit = async (postId, updatedPost) => {
    const { title, description, price, location, willDeliver } = updatedPost;
    await updatePost(
      postId,
      title,
      description,
      price,
      location,
      willDeliver
    );
    stopEditing();
    fetchYourPosts();
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `https://strangers-things.herokuapp.com/api/2302-ACC-PT-WEB-PT-C/users/me`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result = await response.json();
      setYourMessages(result.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async postId => {
    try {
      const response = await fetch(
        `https://strangers-things.herokuapp.com/api/2302-ACC-PT-WEB-PT-C/posts/${postId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        const updatedPosts = yourPosts.filter(post => post._id !== postId);
        setYourPosts(updatedPosts);
      }

      return result;
    } catch (err) {
      console.error(err);
    }
  };

  const showConfirmDialog = post => {
    setPostToDelete(post);
    setConfirmDialogVisible(true);
  };

  const hideConfirmDialog = () => {
    setPostToDelete(null);
    setConfirmDialogVisible(false);
  };

  const deleteAndRefresh = async postId => {
    await deletePost(postId);
    hideConfirmDialog();
  };

  return (
    <div>
      <h1>Welcome: {username}</h1>
      {showToken ? (
        <div>
          <p>Your auth token: {authToken}</p>
          <button onClick={toggleTokenVisibility}>Hide Token</button>
        </div>
      ) : (
        <button onClick={toggleTokenVisibility}>Show Token</button>
      )}

      <button onClick={fetchYourPosts}>Your Posts</button>
      <button onClick={toggleMessageVisibility}>
        {showMessages ? 'Hide Messages' : 'Show Messages'}
      </button>
      <div>
        {showMessages && yourMessages.length > 0 ? (
          <ul>
            {yourMessages.map(message => (
              <li key={message._id}>
                <p>Username: {message.fromUser.username}</p>
                <p>Message: {message.content}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div>
        <h2>Your Posts</h2>
        {yourPosts.length > 0 ? (
          <ul>
            {yourPosts.map(post => (
              <li key={post._id}>
                {editingPostId === post._id ? (
                  <>
                    <button onClick={() => handleEditSubmit(post._id, editedPost)}>Save Changes</button>
                    <button onClick={stopEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <p>Price: {post.price}</p>
                    <button onClick={() => startEditing(post)}>Edit Post</button>
                    <button onClick={() => showConfirmDialog(post)}>Delete Post</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts to view.</p>
        )}

        {isConfirmDialogVisible && (
          <div>
            <p>Are you sure you want to delete this post?</p>
            <button onClick={() => deleteAndRefresh(postToDelete)}>Confirm</button>
            <button onClick={hideConfirmDialog}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
