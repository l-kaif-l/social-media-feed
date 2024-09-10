import React, { useState, useEffect, useCallback } from 'react';
import Post from './Post';
import LoadingSpinner from './LoadingSpinner';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.example.com/posts?page=${page}`);
      const newPosts = await response.json();
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      fetchPosts();
    }
  }, [fetchPosts]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="feed">
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default Feed;