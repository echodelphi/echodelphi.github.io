import {h} from "preact"
import {useState, useEffect} from "preact/hooks"
import runChat from "./gemini"

export function GeminiBox(props: { transcript: string }) {
    const [inputText, setInputText] = useState("")
    const [outputText, setOutputText] = useState("")
    const [apiKey, setApiKey] = useState("")
    const [gap, setGap] = useState(20000) // Default to 1 minute
    const [isOn, setIsOn] = useState(false)
    useEffect(() => {
        console.log("setInterval", gap)

        const timer = setInterval(() => {
            handleSubmit()
            console.log("gap:" + gap)
            console.log("props", props.transcript)
        }, gap)

        return () => clearInterval(timer)
    }, [props.transcript, isOn])

    useEffect(() => {
        console.log("inputText", inputText)
    }, [inputText])

    useEffect(() => {
        console.log("apiKey", apiKey)
    }, [apiKey])

    const handleInputChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        const newInputText = e.currentTarget.value
        setInputText(newInputText)
    }

    const handleApiKeyChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        const newApiKey = e.currentTarget.value
        setApiKey(newApiKey)
    }


    const handleSubmit = async () => {
        console.log("handleSubmit", inputText, apiKey, gap, isOn)
        if (inputText && apiKey && gap && isOn) {
            // const response = await runChat(props.transcript + "\n" + inputText, apiKey);
            // setOutputText(response)
            setOutputText(props.transcript)
        }
    }

    const handleIsOn = () => {
        setIsOn(! isOn)
    }
    return (
        <div>
            <input
                type="text"
                placeholder="Enter your message"
                value={inputText}
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
                onInput={(e: h.JSX.TargetedEvent<HTMLInputElement>) => {
                    setGap((parseInt(e.currentTarget.value) * 1000 // Convert seconds to milliseconds
                    ))
                }}
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
