import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
    GenerativeModel,
    ChatSession,
    GenerationConfig,
    SafetySetting,
} from "@google/generative-ai"

const MODEL_NAME: string = "gemini-1.5-pro"
const API_KEY: string = "AIzaSyBODPD0qgF01nIW_XT4qcOUdSn3eQV1JAs"

import {PitchAnalysis} from "./typechat"

async function runChat(prompt: string, apiKey: string): Promise<PitchAnalysis> {
    const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(apiKey)
    const model: GenerativeModel = genAI.getGenerativeModel({model: MODEL_NAME})

    const generationConfig: GenerationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    }
    const safetySettings: SafetySetting[] = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ]
    const chat: ChatSession = model.startChat({
        generationConfig,
        safetySettings,
    })

    const result = await chat.sendMessage(prompt)
    const response = result.response
    const responseText = response.text()
    console.log(responseText)

    // Parse the response text into a PitchAnalysis object
    const pitchAnalysis: PitchAnalysis = JSON.parse(responseText)
    return pitchAnalysis
}

export default runChat
