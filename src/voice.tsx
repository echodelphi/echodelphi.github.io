import {h} from "preact"
import {useState, useEffect, useRef} from "preact/hooks"
import {createClient, LiveTranscriptionEvents} from "@deepgram/sdk"
import {GeminiBox} from "./geminiBox"
import Markdown from "react-markdown"

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY

const log = (message: string) => {
    console.log(`[Voice Component] ${message}`)
}

export function Voice() {
    const [fullTranscript, setFullTranscript] = useState("")
    const [partialTranscript, setPartialTranscript] = useState("")
    const [status, setStatus] = useState("Initializing...")
    const [isListening, setIsListening] = useState(false)
    const [outputText, setOutputText] = useState("## This is where the response will display.\n\n*Please wait patiently.*")

    const deepgramConnection = useRef<any>(null)
    const mediaRecorder = useRef<MediaRecorder | null>(null)

    useEffect(() => {
        return () => {
            stopRecognition()
        }
    }, [])

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
            <h1 className="title">Voice Transcription</h1>
            <button className={`toggle-button ${isListening ? "listening" : ""}`} onClick={toggleListening}>
                {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <p className="status">Status: {status}</p>
            {/* <GeminiBox transcript={fullTranscript} setOutputText={setOutputText} isListening={isListening} />*/}
            <div className="transcript-container">
                <Markdown>{outputText}</Markdown>
            </div>
            <div className="transcript-container">
                <h2 className="subtitle">Transcript</h2>
                {partialTranscript && (
                    <p className="partial-transcript">{partialTranscript}</p>
                )}
                <p className="transcript">{fullTranscript}</p>
            </div>
        </div>
    )
}
