import React, { useState, useEffect } from 'react';

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

const PostsViewUpgraded = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'GET',
        headers: makeHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        const errorData = await response.json();
        console.error('Error fetching posts:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: makeHeaders(),
      });

      if (response.ok) {
        await fetchPosts();
        alert('Post deleted successfully.');
      } else {
        const errorData = await response.json();
        alert(`Error deleting post: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <h2>Posts (Upgraded with Authentication)</h2>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            {post.content}
            {post.isAuthor && (
              <button onClick={() => handleDeletePost(post.id)}>
                Delete Post
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsViewUpgraded;