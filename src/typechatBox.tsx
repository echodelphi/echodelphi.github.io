import {h, Fragment} from "preact"
import {useState, useEffect, useRef} from "preact/hooks"
import "./geminiBox.css"
import typechatRequest from "./typechat"

export function TypeChatBox(props: { transcript: string; setOutputText: Function; isListening: boolean }) {
    const [gap, setGap] = useState(20000)
    const [apiKey, setApiKey] = useState("")
    const transcriptRef = useRef(props.transcript)
    const gapRef = useRef(gap)
    const apiKeyRef = useRef(apiKey)

    useEffect(() => {
        transcriptRef.current = props.transcript
    }, [props.transcript])

    useEffect(() => {
        gapRef.current = gap
    }, [gap])

    useEffect(() => {
        apiKeyRef.current = apiKey
    }, [apiKey])

    useEffect(() => {
        const timer = setInterval(() => generateInference(), gapRef.current)
        return props.isListening ? () => clearInterval(timer) : clearInterval(timer)
    }, [props.isListening])

    const handleIntervalChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        setGap((parseInt(e.currentTarget.value) * 1000))
    }
    const handleApiKeyChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        setApiKey(e.currentTarget.value)
    }

    const generateInference = async () => {
        console.log("handleSubmit", gap, props.isListening, transcriptRef.current)
        if (gap && props.isListening) {
            const response = await typechatRequest(apiKey, transcriptRef.current)
            props.setOutputText(response)
        }
    }

    return (
        <>
            {! props.isListening && (
                <div className="gemini-box">

                    <div className="input-group">
                        <input
                            type="number"
                            placeholder="Input gap in seconds"
                            value={gap / 1000}
                            onInput={handleIntervalChange}
                            className="modern-input"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Input api key"
                            value={apiKey}
                            onInput={handleApiKeyChange}
                            className="modern-input"
                        />
                    </div>
                </div>
            )}
        </>
    )
}
