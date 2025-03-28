import React, { useState } from 'react'
import { MyComponent } from './components/MyComponents'
import './App.css'
import logo from './assets/logo.jpg'

export default function App() {
	const [isChatOpen, setIsChatOpen] = useState(false)
	const diseases = [
		'Eczema',
		'Melanoma',
		'Atopic Dermatitis',
		'Basal Cell Carcinoma (BCC)',
		'Melanocytic Nevi (NV)',
		'Benign Keratosis-like Lesions (BKL)',
		'Psoriasis pictures Lichen Planus and related diseases',
		'Seborrheic Keratoses and other Benign Tumors',
		'Tinea Ringworm Candidiasis and other Fungal Infections',
		'Warts Molluscum and other Viral Infections',
	]

	const toggleChat = () => {
		setIsChatOpen(!isChatOpen)
	}

	return (
		<div className='Parent-container h-screen overflow-hidden'>
			{' '}
			{/* Prevent scrolling */}
			{/* Fixed Header */}
			<header className='bg-green-700 py-4 px-6 fixed w-full top-0 left-0 z-50 flex items-center'>
				<img
					src={logo}
					alt='SkinDocAI Logo'
					className='h-20 w-20 rounded-full object-cover border-4 border-white shadow-md'
				/>
				<div className='ml-6 text-center flex-grow'>
					<h1 className='text-3xl font-bold text-white font-serif'>
						SkinDocAI{' '}
						<span className='font-light'>Medical Assistant</span>
					</h1>
				</div>
			</header>
			{/* Fixed Content Container - No Scrolling */}
			<div className='fixed top-32 bottom-20 left-0 right-0 overflow-y-auto'>
				{' '}
				{/* Scrollable area */}
				<div className='max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg h-full'>
					{/* About Section */}
					<section className='mb-10'>
						<h2 className='text-3xl font-bold text-blue-600 mb-6 border-b-2 border-blue-100 pb-2'>
							About SkinDocAI
						</h2>
						<p className='text-lg text-gray-700 mb-4'>
							SkinDocAI is an innovative diagnostic assistant
							designed for both medical professionals and
							patients. Our AI-powered platform helps identify
							potential skin conditions and provides first aid
							guidance.
						</p>
						<p className='text-lg text-gray-700'>
							Currently supporting 10 common dermatological
							conditions, with continuous updates to expand our
							medical knowledge base and improve diagnostic
							accuracy.
						</p>
					</section>

					{/* Conditions Section */}
					<section>
						<h3 className='text-2xl font-semibold text-blue-500 mb-6'>
							Supported Conditions:
						</h3>
						<div className='bg-green-100 p-6 rounded-xl'>
							<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
								{diseases.map((disease, index) => (
									<div
										key={index}
										className='bg-white p-4 rounded-lg shadow text-center'
									>
										{disease}
									</div>
								))}
							</div>
						</div>
					</section>
				</div>
			</div>
			{/* Fixed Chat Button */}
			<button
				onClick={toggleChat}
				className='fixed bottom-8 right-8 bg-blue-600 text-white p-5 rounded-full shadow-xl z-50'
				style={{ width: '70px', height: '70px' }}
			>
				{isChatOpen ? '✕' : '💬'}
			</button>
			{/* Chatbot */}
			{isChatOpen && (
				<div className='fixed bottom-28 right-8 z-40'>
					<MyComponent />
				</div>
			)}
		</div>
	)
}
