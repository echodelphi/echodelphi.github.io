import {h, Fragment} from "preact"
import {useState, useEffect, useRef} from "preact/hooks"
import runChat from "./gemini"
import "./geminiBox.css"

export function GeminiBox(props: {transcript: string; setOutputText: Function; isListening: boolean}) {
    const [metaPrompt, setInputText] = useState("Extract a TODO list from the provided transcript in Markdown.")
    const [apiKey, setApiKey] = useState("AIzaSyAFlr_X8A308SRb8Gm3La9Y59ElQVUk0sY")
    const [gap, setGap] = useState(20000)
    const transcriptRef = useRef(props.transcript)
    const gapRef = useRef(gap)

    useEffect(() => {
        transcriptRef.current = props.transcript
    }, [props.transcript])

    useEffect(() => {
        gapRef.current = gap
    }, [gap])

    useEffect(() => {
        const timer = setInterval(() => generateInference(), gapRef.current)
        return props.isListening ? () => clearInterval(timer) : clearInterval(timer)
    }, [props.isListening])

    useEffect(() => {
        console.log("inputText", metaPrompt)
    }, [metaPrompt])

    useEffect(() => {
        console.log("apiKey", apiKey)
    }, [apiKey])

    const handleInputChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        setInputText(e.currentTarget.value)
    }

    const handleApiKeyChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        setApiKey(e.currentTarget.value)
    }

    const handleIntervalChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        setGap((parseInt(e.currentTarget.value) * 1000))
    }

    const generateInference = async () => {
        console.log("handleSubmit", metaPrompt, apiKey, gap, props.isListening, transcriptRef.current)
        if (metaPrompt && apiKey && gap && props.isListening) {
            const response = await runChat(transcriptRef.current + "\n" + metaPrompt, apiKey)
            props.setOutputText(response)
        }
    }

    return (
        <>
            {! props.isListening && (
                <div className="gemini-box">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Enter your message"
                            value={metaPrompt}
                            onInput={handleInputChange}
                            className="modern-input"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Enter your API key"
                            value={apiKey}
                            onInput={handleApiKeyChange}
                            className="modern-input"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="number"
                            placeholder="Input gap in seconds"
                            value={gap / 1000}
                            onInput={handleIntervalChange}
                            className="modern-input"
                        />
                    </div>
                </div>
            )}
        </>
    )
}
