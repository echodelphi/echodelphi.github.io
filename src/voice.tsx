import {h} from "preact"
import {useState, useEffect, useRef} from "preact/hooks"
import {createClient} from "@deepgram/sdk"
import {GeminiBox} from "./geminiBox"
import Markdown from "react-markdown"

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY

export function Voice() {
    const [transcript, setTranscript] = useState("")
    const [transcriptReversed, setTranscriptReversed] = useState("")
    const [partialTranscript, setPartialTranscript] = useState("")
    const [status, setStatus] = useState("Initializing...")
    const [isListening, setIsListening] = useState(false)
    const [outputText, setOutputText] = useState("## This is where the response will display.\n\n*Please wait patiently.*")

    const deepgramLive = useRef(null)
    const mediaRecorder = useRef(null)

    useEffect(() => {
        let deepgram
        try {
            deepgram = createClient(DEEPGRAM_API_KEY)
        } catch (error) {
            console.error("Error creating Deepgram client:", error)
            setStatus("Error: Failed to initialize Deepgram client")
            return
        }

        const initializeDeepgram = () => {
            deepgramLive.current = deepgram.listen.live({
                language: "en-US",
                smart_format: true,
                model: "nova-2",
            })

            deepgramLive.current.addListener("open", () => {
                console.log("Connection opened.")
                setStatus("Ready to listen")
            })

            deepgramLive.current.addListener("close", () => {
                console.log("Connection closed.")
                setStatus("Connection closed")
            })

            deepgramLive.current.addListener("error", (error) => {
                console.error("Deepgram error:", error)
                setStatus("Error: Deepgram connection issue")
            })

            deepgramLive.current.addListener("transcriptReceived", (message) => {
                const data = JSON.parse(message)
                const transcription = data.channel.alternatives[0].transcript
                if (data.is_final) {
                    setTranscriptReversed((prev) => transcription + "\n" + prev)
                    setTranscript((prev) => prev + "\n" + transcription)
                    setPartialTranscript("")
                } else {
                    setPartialTranscript(transcription)
                }
            })
        }

        initializeDeepgram()

        return () => {
            if (deepgramLive.current) {
                deepgramLive.current.finish()
            }
        }
    }, [])

    const toggleListening = async () => {
        if (isListening) {
            if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
                mediaRecorder.current.stop()
            }
            setIsListening(false)
            setStatus("Stopped listening")
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({audio: true})
                mediaRecorder.current = new MediaRecorder(stream)
                mediaRecorder.current.addEventListener("dataavailable", async (event) => {
                    if (event.data.size > 0 && deepgramLive.current && deepgramLive.current.getReadyState() === 1) {
                        deepgramLive.current.send(event.data)
                    }
                })
                mediaRecorder.current.start(250)
                setIsListening(true)
                setStatus("Listening...")
            } catch (error) {
                console.error("Error accessing microphone:", error)
                setStatus("Error: Failed to access microphone")
            }
        }
    }

    return (
        <div className="voice-transcription">
            <h1 className="title">Voice Transcription</h1>
            <button className={`toggle-button ${isListening ? "listening" : ""}`} onClick={toggleListening}>
                {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <p className="status">Status: {status}</p>
            <GeminiBox transcript={transcript} setOutputText={setOutputText} isListening={isListening} />
            <div className="transcript-container">
                <Markdown>{outputText}</Markdown>
            </div>
            <div className="transcript-container">
                <h2 className="subtitle">Transcript</h2>
                {partialTranscript && (
                    <p className="partial-transcript">{partialTranscript}</p>
                )}
                <p className="transcript">{transcriptReversed}</p>
            </div>
        </div>
    )
}
