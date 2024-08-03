import {h} from "preact"
import {useState, useEffect, useRef} from "preact/hooks"
import VoiceToText from "voice2text"

export function Voice() {
    const [transcript, setTranscript] = useState("")
    const [partialTranscript, setPartialTranscript] = useState("")
    const [status, setStatus] = useState("")
    const [isListening, setIsListening] = useState(false)
    const voice2textRef = useRef<VoiceToText | null>(null)

    useEffect(() => {
        voice2textRef.current = new VoiceToText({
            converter: "vosk",
            language: "en",
            sampleRate: 16000,
        })

        const handleVoiceEvent = (e: CustomEvent) => {
            if (e.detail.type === "PARTIAL") {
                setPartialTranscript(e.detail.text)
            } else if (e.detail.type === "FINAL") {
                setTranscript((prev) => prev + (prev ? " " : "") + e.detail.text)
                setPartialTranscript("")
            } else if (e.detail.type === "STATUS") {
                setStatus(e.detail.text)
            }
        }

        window.addEventListener("voice", handleVoiceEvent as EventListener)

        return () => {
            window.removeEventListener("voice", handleVoiceEvent as EventListener)
            if (voice2textRef.current) {
                voice2textRef.current.stop()
            }
        }
    }, [])

    const toggleListening = () => {
        if (voice2textRef.current) {
            if (isListening) {
                voice2textRef.current.stop()
            } else {
                voice2textRef.current.start()
            }
            setIsListening(! isListening)
        }
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
                {partialTranscript && (
                    <p className="partial-transcript">{partialTranscript}</p>
                )}
            </div>
        </div>
    )
}
