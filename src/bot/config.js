import { createChatBotMessage } from 'react-chatbot-kit'
// import CustomInput from '../components/CustomInput'; // Ensure the path is correct
import Options from '../components/Options'
import BotAvatar from '../components/BotAvatar'

const config = {
	initialMessages: [
		createChatBotMessage(`Hi! I'm SkinDocAi. How can I help you today?`, {
			widget: 'options',
		}),
	],
	botName: 'SkinDocAi',
	widgets: [
		{
			widgetName: 'options',
			widgetFunc: (props) => <Options {...props} />,
		},
	],
	// customComponents: {
	//   input: (props) => <CustomInput {...props} />, // Ensure this is correct
	// },
	customComponents: {
		botAvatar: (props) => <BotAvatar {...props} />, // 🔥 Custom Avatar Component
	},
}

export default config
