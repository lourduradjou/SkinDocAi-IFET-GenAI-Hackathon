import React from 'react';
import { Chatbot } from 'react-chatbot-kit';
import config from '../bot/config.js';
import MessageParser from '../bot/MessageParser.js';
import ActionProvider from '../bot/ActionProvider.js';
import 'react-chatbot-kit/build/main.css';

export const MyComponent = () => {
  
  return (
    <div className="chatbot-container">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
       
      />
    </div>
  );
};