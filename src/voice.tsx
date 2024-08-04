import {h} from "preact"
import {useState, useEffect, useRef} from "preact/hooks"
import {createClient} from "@deepgram/sdk"
import {GeminiBox} from "./geminiBox"
import Markdown from "react-markdown"

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY

// Add a simple logger function
const log = (message: string) => {
    console.log(`[Voice Component] ${message}`)
}

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
        log("Initializing Deepgram client")
        let deepgram
        try {
            deepgram = createClient(DEEPGRAM_API_KEY)
            log("Deepgram client created successfully")
        } catch (error) {
            console.error("Error creating Deepgram client:", error)
            setStatus("Error: Failed to initialize Deepgram client")
            return
        }

        const initializeDeepgram = () => {
            log("Initializing Deepgram live connection")
            deepgramLive.current = deepgram.listen.live({
                language: "en-US",
                smart_format: true,
                model: "nova-2",
            })

            deepgramLive.current.addListener("open", () => {
                log("Connection opened")
                setStatus("Ready to listen")
            })

            deepgramLive.current.addListener("close", () => {
                log("Connection closed")
                setStatus("Connection closed")
            })

            deepgramLive.current.addListener("error", (error) => {
                console.error("Deepgram error:", error)
                setStatus("Error: Deepgram connection issue")
            })

            deepgramLive.current.addListener("transcriptReceived", (message) => {
                log("Transcript received")
                try {
                    const data = JSON.parse(message)
                    log(`Parsed data: ${JSON.stringify(data)}`)

                    if (! data.channel || ! data.channel.alternatives || data.channel.alternatives.length === 0) {
                        log("Error: Unexpected data structure from Deepgram")
                        return
                    }

                    const transcription = data.channel.alternatives[0].transcript
                    log(`Transcription: ${transcription}`)

                    if (data.is_final) {
                        log("Final transcription received")
                        setTranscriptReversed((prev) => transcription + "\n" + prev)
                        setTranscript((prev) => prev + "\n" + transcription)
                        setPartialTranscript("")
                    } else {
                        log("Partial transcription received")
                        setPartialTranscript(transcription)
                    }
                } catch (error) {
                    console.error("Error parsing Deepgram response:", error)
                    log(`Error parsing Deepgram response: ${error.message}`)
                }
            })
        }

        initializeDeepgram()

        return () => {
            if (deepgramLive.current) {
                log("Finishing Deepgram connection")
                deepgramLive.current.finish()
            }
        }
    }, [])

    const toggleListening = async () => {
        if (isListening) {
            log("Stopping listening")
            if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
                mediaRecorder.current.stop()
                log("MediaRecorder stopped")
            }
            setIsListening(false)
            setStatus("Stopped listening")
        } else {
            log("Starting listening")
            try {
                const stream = await navigator.mediaDevices.getUserMedia({audio: true})
                log("Audio stream obtained")
                mediaRecorder.current = new MediaRecorder(stream)
                mediaRecorder.current.addEventListener("dataavailable", async (event) => {
                    log(`Data available: ${event.data.size} bytes`)
                    if (event.data.size > 0 && deepgramLive.current && deepgramLive.current.getReadyState() === 1) {
                        log("Sending data to Deepgram")
                        deepgramLive.current.send(event.data)
                    } else {
                        log(`Not sending data. Deepgram ready state: ${deepgramLive.current?.getReadyState()}`)
                    }
                })
                mediaRecorder.current.start(250)
                log("MediaRecorder started")
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
            {/* <GeminiBox transcript={transcript} setOutputText={setOutputText} isListening={isListening} />*/}
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
