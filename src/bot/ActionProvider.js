import React from 'react'
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Legend,
	Radar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
} from 'recharts'

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
	function formatSkinDiseaseHTML(text) {
		let html = text.replace(/\*/g, '')

		html = html.replace(/([A-Za-z ]+):/g, '</p><h3>$1:</h3><p>')

		html = html.replace(/• ([^\n]+)/g, '</p><li>$1</li><p>')

		html =
			'<div class="skin-info">' +
			html.replace(/\n/g, '</p><p>') +
			'</div>'

		html = html.replace(/<p><\/p>/g, '')
		html = html.replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>')
		html = html.replace(/<\/ul><ul>/g, '')

		html = html.replace(/<\/p>/g, '</p><br>')
		html = html.replace(/<\/h3>/g, '</h3><br>')

		html = html.replace(/\s+/g, ' ')
		html = html.replace(/(<[^>]+>) /g, '$1')

		return html
	}

	const fetchGeminiResponse = async (message) => {
		const apiKey = 'AIzaSyCPAZ6sub_jBgzFLx1UiK84bjDnkqGy-pI' // Replace with your actual Gemini API key
		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contents: [
						{
							role: 'user',
							parts: [{ text: message }],
						},
					],
				}),
			})

			if (!response.ok) {
				throw new Error(
					`API Error: ${response.status} ${response.statusText}`
				)
			}

			const data = await response.json()
			console.log('Gemini API Response:', data) // Debugging output

			// Extract AI response
			if (data.candidates && data.candidates.length > 0) {
				return (
					data.candidates[0]?.content?.parts?.[0]?.text ||
					'No response from AI.'
				)
			} else {
				return 'AI did not return a response.'
			}
		} catch (error) {
			console.error('AI Response Error:', error)
			return "Sorry, I couldn't understand that."
		}
	}

	const handleSkinDocAiInfo = () => {
		const botMessage = createChatBotMessage(
			'SkinDocAi is an AI-powered tool that helps you diagnose skin conditions by analyzing images. Simply upload an image, and I’ll provide insights!',
			{
				widget: 'options',
			}
		)

		setState((prev) => ({
			...prev,
			messages: [...prev.messages, botMessage],
		}))
	}

	const handleImageUploadInfo = () => {
		const botMessage = createChatBotMessage(
			'To upload an image, click the "Upload Image" button . Make sure the image is clear and well-lit for accurate results.'
		)

		setState((prev) => ({
			...prev,
			messages: [...prev.messages, botMessage],
		}))
	}

	const handleContactSupport = () => {
		const botMessage = createChatBotMessage(
			'For support, please email us at bharathrajp.2523@gmail.com or call +91 6374657388  .'
		)

		setState((prev) => ({
			...prev,
			messages: [...prev.messages, botMessage],
		}))
	}

	const handleUserMessage = async (message) => {
		// Create User Message in Chat
		// const userMessage = createChatBotMessage(message);
		// setState((prev) => ({
		//     ...prev,
		//     messages: [...prev.messages, userMessage],
		// }));

		try {
			// Get AI Response (Choose Either OpenAI or Gemini)
			//const botReply = await fetchOpenAIResponse(message); // For OpenAI
			let botReply = await fetchGeminiResponse(message)
			const htmlContent = formatSkinDiseaseHTML(botReply)

			const botMessage = createChatBotMessage(
				<div dangerouslySetInnerHTML={{ __html: htmlContent }} />,
				{ widget: 'options' }
			)

			setState((prev) => ({
				...prev,
				messages: [...prev.messages, botMessage],
			}))
		} catch (error) {
			console.error('AI Response Error:', error)
			const errorMessage = createChatBotMessage(
				'Oops! Something went wrong.'
			)
			setState((prev) => ({
				...prev,
				messages: [...prev.messages, errorMessage],
			}))
		}
	}

	const handleImageUpload = (imageurl) => {
		const userMessage = {
			type: 'user',
			message: (
				<div>
					<p>You uploaded:</p>
					<img
						src={imageurl}
						alt='Uploaded'
						style={{ maxWidth: '50%', height: 'auto' }}
					/>
				</div>
			),
		}

		setState((prev) => ({
			...prev,
			messages: [...prev.messages, userMessage],
		}))
	}

	const handleResult = async(prediction) => {
		// ✅ Add timestamp
		const timestamp = new Date().toLocaleTimeString()

		// ✅ Prepare data for the chart
		const chartData = prediction.all_predictions.map((pred) => ({
			disease: pred.disease,
			confidence: parseFloat(pred.confidence.replace('%', '')), // Convert confidence to a number
		}))
		const message = `hey gemini give me the first aid for this disease ${prediction.top_prediction.disease} in that give me the first one alone`;

        let botReply = await fetchGeminiResponse(message);
        const htmlContent = formatSkinDiseaseHTML(botReply);

                

		const BotMessage = {
			type: 'bot',
			timestamp: timestamp,
			message: (
				<div className='result-container mt-4 w-full'>
                

                

                {/* ✅ Display top prediction separately */}
                <div className='space-y-4 mt-6'>
                    <h3 className='text-lg font-bold text-white'>Top Prediction:</h3>
                    <p className='flex items-center'>
                        <span className='font-medium mr-2 text-white'>Disease:</span>
                        <span className='px-3 py-1 bg-green-100 text-red-800 rounded'>
                            {prediction.top_prediction.disease}
                        </span>
                    </p>
                    <p className='flex items-center'>
                        <span className='font-medium mr-2 text-white'>Confidence:</span>
                        <div className='w-full bg-green-100 rounded-full h-2.5'>
                            <div
                                className='bg-blue-500 h-2.5 rounded-full'
                                style={{ width: `${prediction.top_prediction.confidence}` }}
                            ></div>
                        </div>
                        <span className='ml-2 text-white'>
                            {prediction.top_prediction.confidence}
                        </span>
                    </p>
                    {prediction.treatment && (
                        <p className='flex items-start'>
                            <span className='font-medium mr-2 text-white'>Recommendation:</span>
                            <span>{prediction.treatment}</span>
                        </p>
                    )}
                </div>
					<br />
					
					<h2>First Aid :</h2>
					<br />
                {/* ✅ Include HTML Content from formatSkinDiseaseHTML */}
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>

			),
		}

		// ✅ Update state with the new chart-based result message
		setState((prev) => ({
			...prev,
			messages: [...prev.messages, BotMessage],
			isLoading: false, // Clear loading state
		}))

		const botMessage = createChatBotMessage(
			'What would you like to do next?',
			{ widget: 'options' }
		)

		setState((prev) => ({
			...prev,
			messages: [...prev.messages, botMessage],
		}))
	}

	return (
		<div>
			{React.Children.map(children, (child) => {
				return React.cloneElement(child, {
					actions: {
						handleSkinDocAiInfo,
						handleImageUploadInfo,
						handleContactSupport,
						handleUserMessage,
						handleImageUpload,
						handleResult,
					},
				})
			})}
		</div>
	)
}

export default ActionProvider
