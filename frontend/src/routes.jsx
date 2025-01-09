// src/routes.jsx
import React from 'react';
import HomePage from './components/HomePage';
import ChatBot from './components/ChatBot';
import Solace from './components/Solace';



const routes = [
  { path: '/', element: <HomePage /> }, // This ensures the homepage is the default route
  { path: '/chatbot', element: <ChatBot />},
  { path: '/solace', element: <Solace />},

];

export default routes;
