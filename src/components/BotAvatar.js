import React from 'react'
import './BotAvatar.css' // Import the custom CSS
import logo from '../assets/logo.jpg'

const BotAvatar = () => {
	return (
		<div className='bot-avatar'>
			<img
				src={logo} // ✅ Replace with your custom icon path
				alt='Bot'
				className='bot-icon'
			/>
		</div>
	)
}

export default BotAvatar
