import {h} from "preact"
import {useEffect, useRef, useState} from "preact/hooks"
import VoiceToText from "voice2text"

interface VoiceEvent extends CustomEvent {
    detail: {
        type: "PARTIAL" | "FINAL" | "STATUS";
        text: string;
    };
}

const VOICE_EVENT_NAME = "voice"

export function Tabs() {
    const [transcript, setTranscript] = useState("")
    const [transcriptReversed, setTranscriptReversed] = useState("")
    const [partialTranscript, setPartialTranscript] = useState("")
    const [translatedText, setTranslatedText] = useState("")
    const [translatedTextAccumulated, setTranslatedTextAccumulated] = useState("")
    const [status, setStatus] = useState("")
    const [isListening, setIsListening] = useState<boolean>(false)
    const [targetLang, setTargetLang] = useState<string>("fra_Latn")
    const [isTranslating, setIsTranslating] = useState(false)
    const voice2text = useRef<VoiceToText | null>(null)
    const worker = useRef<Worker | null>(null)

    useEffect(() => {
        worker.current = new Worker(new URL("./worker.js", import.meta.url), {type: "module"})

        worker.current.onmessage = (event) => {
            if (event.data.status === "update") {
                setStatus(`Translation: ${event.data.output}`)
            } else if (event.data.status === "complete") {
                const newTranslation = event.data.output[0].translation_text
                setTranslatedText(newTranslation)
                setTranslatedTextAccumulated((prev) => newTranslation + "\n\n" + prev)
                setIsTranslating(false)
            } else {
                setStatus(event.data.text)
            }
        }

        voice2text.current = new VoiceToText({
            converter: "vosk",
            language: "en",
            sampleRate: 16000,
        })

        const handleVoiceEvent = async (e: VoiceEvent) => {
            switch (e.detail.type) {
                case "PARTIAL":
                    setPartialTranscript(e.detail.text)
                    break
                case "FINAL":
                    setTranscriptReversed((prev) => e.detail.text + "\n" + prev)
                    setTranscript((prev) => prev + "\n" + e.detail.text)
                    setPartialTranscript("")
                    if (worker.current && ! isTranslating) {
                        setIsTranslating(true)
                        worker.current.postMessage({
                            text: e.detail.text,
                            tgt_lang: targetLang,
                            src_lang: "eng_Latn",
                        })
                    }
                    break
                case "STATUS":
                    setStatus(e.detail.text)
                    break
            }
        }

        window.addEventListener(VOICE_EVENT_NAME, handleVoiceEvent as EventListener)

        return () => {
            window.removeEventListener(VOICE_EVENT_NAME, handleVoiceEvent as EventListener)
            if (voice2text.current) {
                voice2text.current.stop()
            }
            if (worker.current) {
                worker.current.terminate()
            }
        }
    }, [targetLang])

    const toggleListening = async () => {
        if (voice2text.current) {
            try {
                if (isListening) {
                    voice2text.current.stop()
                } else {
                    await voice2text.current.start()
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
            <h1 className="title">Voice Transcription and Translation</h1>
            <button className={`toggle-button ${isListening ? "listening" : ""}`} onClick={toggleListening}>
                {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <select value={targetLang} onChange={(e) => setTargetLang((e.target as HTMLSelectElement).value)}>
                <option value="fra_Latn">French</option>
                <option value="deu_Latn">German</option>
                <option value="spa_Latn">Spanish</option>
                <option value="zho_Hans">Chinese (Simplified)</option>
                <option value="jpn_Jpan">Japanese</option>
            </select>
            <p className="status">Status: {status}</p>
            <div className="transcript-container">
                <h2 className="subtitle">Translation:</h2>
                <p className="translation-accumulated">{translatedTextAccumulated}</p>
            </div>
            <div className="transcript-container">
                <h2 className="subtitle">Transcript:</h2>
                {partialTranscript && (
                    <p className="partial-transcript">{partialTranscript}</p>
                )}
                <p className="transcript">{transcriptReversed}</p>
            </div>
        </div>
    )
}
