import {h} from "preact"
import {useState, useEffect, useRef} from "preact/hooks"
import runChat from "./gemini"

export function GeminiBox(props: { transcript: string }) {
    const [metaPrompt, setInputText] = useState("Extract a TODO list from the provided transcript.")
    const [outputText, setOutputText] = useState("")
    const [apiKey, setApiKey] = useState("AIzaSyAFlr_X8A308SRb8Gm3La9Y59ElQVUk0sY")
    const [gap, setGap] = useState(5000)
    const [isOn, setIsOn] = useState(false)
    const transcriptRef = useRef(props.transcript)
    const gapRef = useRef(gap)

    useEffect(() => {
        transcriptRef.current = props.transcript
    }, [props.transcript])

    useEffect(() => {
        gapRef.current = gap
    }, [gap])

    useEffect(() => {
        const timer = setInterval(() => {
            handleSubmit()
            console.log("gap:", gapRef.current)
            console.log("transcript:", transcriptRef.current)
            console.log("isOn:", isOn)
        }, gapRef.current)
        console.log("timer created", timer, transcriptRef.current)
        if (isOn) {
            console.log("timer started", timer, transcriptRef.current)
            return () => clearInterval(timer)
        } else {
            clearInterval(timer)
            console.log("timer cleared", timer, transcriptRef.current)
        }
    }, [isOn])

    useEffect(() => {
        console.log("inputText", metaPrompt)
    }, [metaPrompt])

    useEffect(() => {
        console.log("apiKey", apiKey)
    }, [apiKey])

    const handleInputChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        const newInputText = e.currentTarget.value
        setInputText(newInputText)
        setIsOn(false)
    }

    const handleApiKeyChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        const newApiKey = e.currentTarget.value
        setApiKey(newApiKey)
        setIsOn(false)
    }

    const handleIntervalChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        const newGap = parseInt(e.currentTarget.value) * 1000 // Convert seconds to milliseconds
        setGap(newGap)
        setIsOn(false)
    }

    const handleIsOn = () => {
        setIsOn(! isOn)
    }

    const handleSubmit = async () => {
        console.log("handleSubmit", metaPrompt, apiKey, gap, isOn, transcriptRef.current)
        if (metaPrompt && apiKey && gap && isOn) {
            const response = await runChat(transcriptRef.current + "\n" + metaPrompt, apiKey)
            setOutputText(response)
        }
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Enter your message"
                value={metaPrompt}
                onInput={handleInputChange}
            />
            <input
                type="text"
                placeholder="Enter your API key"
                value={apiKey}
                onInput={handleApiKeyChange}
            />
            <input
                type="number"
                placeholder="Input gap in seconds"
                value={gap / 1000}
                onInput={handleIntervalChange}
            />
            <button onClick={handleIsOn}>{isOn ? "Turn Off" : "Turn On"}</button>
            <textarea
                readOnly
                placeholder="Output will appear here"
                value={outputText}
            >
            </textarea>
        </div>
    )
}
