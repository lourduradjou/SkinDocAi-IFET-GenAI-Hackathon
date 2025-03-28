import React, { useState } from 'react'
import './Options.css'

const Options = (props) => {
	const [prediction, setPrediction] = useState(null) // Store prediction result
	const [imageurl,setImageurl] = useState(null);
	const options = [
		{
			text: 'Tell me about SkinDocAi',
			handler: () => props.actionProvider.handleSkinDocAiInfo(),
			id: 1,
		},
		{
			text: 'How to upload an image?',
			handler: () => props.actionProvider.handleImageUploadInfo(),
			id: 2,
		},
		{
			text: 'Contact support',
			handler: () => props.actionProvider.handleContactSupport(),
			id: 3,
		},
	]

	const handlechange = async (e) => {
		const file = e.target.files[0]

		// sending image in url form to action provider which in turn display in message container
		const reader = new FileReader();
      	reader.onload = async(event) => {
        const imageUrl = event.target.result;
		
		await props.actions.handleImageUpload(imageUrl);
		};
		reader.readAsDataURL(file);

		if (file) {
			const formData = new FormData()
			formData.append('image', file)
			
			try {
				const response = await fetch('http://localhost:5000/predict', {
					// Replace with your Flask server URL
					method: 'POST',
					body: formData,
				})

				if (!response.ok) {
					throw new Error('Failed to upload image')
				}

				const data = await response.json()
				console.log('Prediction:', data)
				setPrediction(data) // Store prediction result
				//console.log(prediction)
				await props.actionProvider.handleResult(data);
			} catch (error) {
				console.error('Error uploading image:', error)
			}
			
		}

		
	}

	return (<>
	
		<div className='options-container'>
			{options.map((option) => (
				<button
					key={option.id}
					onClick={option.handler}
					className='upload-button'
				>
					{option.text}
				</button>
			))}

			<label
				htmlFor='image-upload'
				className='upload-button'
			>
				Upload Image
			</label>
			<input
				placeholder='upload here'
				id='image-upload'
				type='file'
				accept='image/*'
				style={{ display: 'none' }}
				onChange={handlechange}
			/>

			
			

			<br />
			<br />
		</div>
		
		<br />
		<br />
		</>
	)
}

export default Options
