import {h} from "preact"
import {useEffect, useRef, useState} from "preact/hooks"
import {createClient, LiveTranscriptionEvents} from "@deepgram/sdk"

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY

const log = (message: string) => {
    console.log(`[Translate Component] ${message}`)
}

export function Translate() {
    const [fullTranscript, setFullTranscript] = useState("")
    const [partialTranscript, setPartialTranscript] = useState("")
    const [translatedText, setTranslatedText] = useState("")
    const [translatedTextAccumulated, setTranslatedTextAccumulated] = useState("")
    const [status, setStatus] = useState("Initializing...")
    const [isListening, setIsListening] = useState(false)
    const [targetLang, setTargetLang] = useState<string>("fra_Latn")
    const [isTranslating, setIsTranslating] = useState(false)
    const deepgramConnection = useRef<any>(null)
    const mediaRecorder = useRef<MediaRecorder | null>(null)
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

        return () => {
            stopRecognition()
            if (worker.current) {
                worker.current.terminate()
            }
        }
    }, [targetLang])

    const stopRecognition = () => {
        if (deepgramConnection.current) {
            deepgramConnection.current.finish()
            deepgramConnection.current = null
        }
        if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
            mediaRecorder.current.stop()
        }
        setIsListening(false)
        setStatus("Stopped")
    }

    const startRecognition = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true})
            mediaRecorder.current = new MediaRecorder(stream)

            const deepgram = createClient(DEEPGRAM_API_KEY)

            deepgramConnection.current = deepgram.listen.live({
                language: "en-US",
                smart_format: true,
                model: "nova-2",
            })

            deepgramConnection.current.addListener(LiveTranscriptionEvents.Open, () => {
                log("Deepgram connection opened")
                setStatus("Connected to Deepgram")

                mediaRecorder.current!.start(250)
                mediaRecorder.current!.addEventListener("dataavailable", (event) => {
                    if (deepgramConnection.current) {
                        deepgramConnection.current.send(event.data)
                    }
                })
            })
            deepgramConnection.current.addListener(LiveTranscriptionEvents.Close, () => {
                setStatus("Disconnected from Deepgram")
                stopRecognition()
            })
            deepgramConnection.current.addListener(LiveTranscriptionEvents.Transcript, (data: any) => {
                const transcription = data.channel.alternatives[0]
                if (transcription.transcript) {
                    log("Received transcript: " + transcription.transcript)
                    setPartialTranscript(transcription.transcript)
                    if (data.is_final) {
                        setFullTranscript((prev) => (prev ? prev + "\n" : "") + transcription.transcript)
                        setPartialTranscript("")
                        if (worker.current && ! isTranslating) {
                            setIsTranslating(true)
                            worker.current.postMessage({
                                text: transcription.transcript,
                                tgt_lang: targetLang,
                                src_lang: "eng_Latn",
                            })
                        }
                    }
                }
            })

            deepgramConnection.current.addListener(LiveTranscriptionEvents.Error, (error: any) => {
                console.error("Deepgram error:", error)
                setStatus("Error: Deepgram encountered an issue")
            })
            setIsListening(true)
            setStatus("Starting...")
        } catch (error) {
            console.error("Error starting recognition:", error)
            setStatus("Error: Failed to start recognition")
        }
    }

    const toggleListening = async () => {
        if (isListening) {
            stopRecognition()
        } else {
            await startRecognition()
        }
    }

    return (
        <div className="voice-transcription">
            <h1 className="title">Voice Transcription and Translation</h1>
            <div className="controls">
                <button className={`toggle-button ${isListening ? "listening" : ""}`} onClick={toggleListening}>
                    {isListening ? "Stop Listening" : "Start Listening"}
                </button>
                <select
                    className="language-select"
                    value={targetLang}
                    onChange={(e) => setTargetLang((e.target as HTMLSelectElement).value)}
                >
                    <option value="fra_Latn">French</option>
                    <option value="deu_Latn">German</option>
                    <option value="spa_Latn">Spanish</option>
                    <option value="zho_Hans">Chinese (Simplified)</option>
                    <option value="jpn_Jpan">Japanese</option>
                </select>
            </div>
            <p className="status">{status}</p>
            <div className="transcript-container">
                <h2 className="subtitle">Translation:</h2>
                <p className="transcript translation">{translatedTextAccumulated}</p>
            </div>
            <div className="transcript-container">
                <h2 className="subtitle">Transcript:</h2>
                {partialTranscript && (
                    <p className="partial-transcript">{partialTranscript}</p>
                )}
                <p className="transcript">{fullTranscript}</p>
            </div>
        </div>
    )
}
