import {h} from "preact"
import {useState, useEffect} from "preact/hooks"
import VoiceToText from "voice2text"
import {GeminiBox} from "./geminiBox"
import {Transcript} from "./Transcript"

interface VoiceEvent extends CustomEvent {
    detail: {
        type: "PARTIAL" | "FINAL" | "STATUS";
        text: string;
    };
}

const VOICE_EVENT_NAME = "voice"

export function Voice() {
    const [transcript, setTranscript] = useState("")
    const [partialTranscript, setPartialTranscript] = useState("")
    const [status, setStatus] = useState("")
    const [isListening, setIsListening] = useState<boolean>(false)
    const voice2text = new VoiceToText({
        converter: "vosk",
        language: "en",
        sampleRate: 16000,
    })

    useEffect(() => {
        const handleVoiceEvent = (e: VoiceEvent) => {
            switch (e.detail.type) {
                case "PARTIAL":
                    setPartialTranscript(e.detail.text)
                    break
                case "FINAL":
                    setTranscript((prev) => e.detail.text + "\n" + prev + (prev ? " " : ""))
                    setPartialTranscript("")
                    break
                case "STATUS":
                    setStatus(e.detail.text)
                    break
            }
        }

        window.addEventListener(VOICE_EVENT_NAME, handleVoiceEvent as EventListener)

        return () => {
            window.removeEventListener(VOICE_EVENT_NAME, handleVoiceEvent as EventListener)
            if (voice2text) {
                voice2text.stop()
            }
        }
    }, [])

    const toggleListening = () => {
        if (voice2text) {
            try {
                if (isListening) {
                    voice2text.stop()
                } else {
                    voice2text.start()
                }
                setIsListening(! isListening)
            } catch (error) {
                console.error("Error toggling listening state:", error)
                setStatus("Error: Failed to toggle listening state")
            }
        } else {
            setStatus("Error: Voice recognition not initialized")
        }
    }

    return (
        <div className="voice-transcription">
            <h1 className="title">Voice Transcription</h1>
            <button className={`toggle-button ${isListening ? "listening" : ""}`} onClick={toggleListening}>
                {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <p className="status">Status: {status}</p>
            <GeminiBox transcript={transcript} />

            <div className="transcript-container">
                <h2 className="subtitle">Transcript:</h2>
                {partialTranscript && (
                    <p className="partial-transcript">{partialTranscript}</p>
                )}
                <p className="transcript">{transcript}</p>
            </div>
            <Transcript transcript={transcript} partialTranscript={partialTranscript} />
        </div>
    )
}

