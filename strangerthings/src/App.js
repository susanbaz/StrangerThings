import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import Posts from './components/Posts';
import UserLogin from './components/UserLogin';
import Logout from './components/Logout';
import Profile from './components/Profile';
import Register from './components/Register';
import PostsForm from './components/PostsForm';
import SearchForm from './components/SearchForm'; // <-- Import SearchForm component
import './App.css';
import './styles.css';
import Navbar from './components/Navbar';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      <div id="container">
       <Header/>
       <Navbar/>

        <div id="main-section">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/users" element={<UserLogin onLogin={handleLogin} />} />
            {isLoggedIn && <Route path="/log-out" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />}
            {isLoggedIn && <Route path="/profile" element={<Profile />} />}
            {isLoggedIn && <Route path="/create-post" element={<PostsForm />} />}
            <Route path="/search" element={<SearchForm />} /> {/* Add Route for SearchForm */}
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </>
  );
}