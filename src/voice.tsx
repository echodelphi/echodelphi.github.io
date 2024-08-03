import {h} from "preact"
import {useState, useEffect} from "preact/hooks"
import VoiceToText from "voice2text"

export function Voice() {
    const [transcript, setTranscript] = useState("")
    const [status, setStatus] = useState("")
    const [isListening, setIsListening] = useState(false)

    useEffect(() => {
        const voice2text = new VoiceToText({
            converter: "vosk",
            language: "en",
            sampleRate: 16000,
        })

        const handleVoiceEvent = (e: CustomEvent) => {
            if (e.detail.type === "PARTIAL" || e.detail.type === "FINAL") {
                setTranscript(e.detail.text)
            } else if (e.detail.type === "STATUS") {
                setStatus(e.detail.text)
            }
        }

        window.addEventListener("voice", handleVoiceEvent as EventListener)

        return () => {
            window.removeEventListener("voice", handleVoiceEvent as EventListener)
            voice2text.stop()
        }
    }, [])

    const toggleListening = () => {
        const voice2text = new VoiceToText({
            converter: "vosk",
            language: "en",
            sampleRate: 16000,
        })

        if (isListening) {
            voice2text.stop()
        } else {
            voice2text.start()
        }
        setIsListening(! isListening)
    }

    return (
        <div className="voice-transcription">
            <h1 className="title">Voice Transcription</h1>
            <button className={`toggle-button ${isListening ? "listening" : ""}`} onClick={toggleListening}>
                {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <p className="status">Status: {status}</p>
            <div className="transcript-container">
                <h2 className="subtitle">Transcript:</h2>
                <p className="transcript">{transcript}</p>
            </div>
        </div>
    )
}
