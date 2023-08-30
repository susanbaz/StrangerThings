import React, { useState, useEffect } from 'react';

const PostsViewUnauthenticated = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'GET',
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

  return (
    <div>
      <h2>Posts (Unauthenticated)</h2>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>{post.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default PostsViewUnauthenticated;