import {h} from "preact"
import {useEffect, useRef, useState} from "preact/hooks"
import {createClient, LiveTranscriptionEvents} from "@deepgram/sdk"
import "./analysis.css"
import runChat from "./gemini"
import {createPitchAnalysisTranslator, analyzePitch} from "./typechat-analysis"
import {createJsonTranslator, createLanguageModel} from "typechat"
import {createTypeScriptJsonValidator} from "typechat/ts"

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY
const ABCD = "3yyC2kUrd_Te2y0CpNiljWd2HKlcCq_mlGBdJJFH4bmyviRc6YY0OZL8cvT3B"
const EFGH = "lbkFJFyTD1lcdHF3imZn5BIWPzesTkXHLghIYW26jFs5FQA4ddnIyMca2fgQEAA"

const log = (message: string) => {
    console.log(`[Analysis Component] ${message}`)
}

interface PitchAnalysis {
    market: string;
    product: string;
    businessModel: string;
    businessType: string;
    competitiveAdvantage: string;
    goToMarket: string;
    summary: string;
}

const Card = ({title, icon, content}: {title: string; icon: string; content: string}) => (
    <div className="analysis-card">
        <h3>{icon} {title}</h3>
        <p>{content || "No data available"}</p>
    </div>
)

export function Analysis() {
    const [fullTranscript, setFullTranscript] = useState("")
    const [partialTranscript, setPartialTranscript] = useState("")
    const [status, setStatus] = useState("Initializing...")
    const [isListening, setIsListening] = useState(false)
    const [pitchAnalysis, setPitchAnalysis] = useState<PitchAnalysis>({
        market: "",
        product: "",
        businessModel: "",
        businessType: "",
        competitiveAdvantage: "",
        goToMarket: "",
        summary: "",
    })
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

    const [translator, setTranslator] = useState<ReturnType<typeof createJsonTranslator> | null>(null)

    useEffect(() => {
        async function initTranslator() {
            const newTranslator = await createPitchAnalysisTranslator("sk-proj-" + ABCD + EFGH)
            setTranslator(newTranslator)
        }

        initTranslator()
    }, [])

    const analyzeTranscript = async () => {
        if (! translator) {
            setStatus("Translator not initialized")
            return
        }

        setStatus("Analyzing transcript...")
        try {
            const prompt = `Analyze this startup pitch transcript and provide a response that conforms to the PitchAnalysis interface:

            ${fullTranscript}`

            const analysisResult = await analyzePitch(translator, prompt)
            setPitchAnalysis(analysisResult as PitchAnalysis)
            setStatus("Analysis complete")
        } catch (error) {
            console.error("Error during analysis:", error)
            setStatus("Error during analysis")
        }
    }

    return (
        <div className="pitch-analysis">
            <h1 className="title">Startup Pitch Analysis</h1>
            <div className="controls">
                <button
                    className={`toggle-button ${isListening ? "listening" : ""}`}
                    onClick={toggleListening}
                >
                    {isListening ? "Stop Listening" : "Start Listening"}
                </button>
                <button
                    className="analyze-button"
                    onClick={analyzeTranscript}
                    disabled={! fullTranscript}
                >
          Analyze
                </button>
            </div>
            <p className="status">{status}</p>
            <div className="analysis-cards">
                <Card title="Market" icon="🌍" content={pitchAnalysis.market} />
                <Card title="Product" icon="⚙️" content={pitchAnalysis.product} />
                <Card title="Business Model" icon="💼" content={pitchAnalysis.businessModel} />
                <Card title="Business Type" icon="🏢" content={pitchAnalysis.businessType} />
                <Card title="Competitive Advantage" icon="🏆" content={pitchAnalysis.competitiveAdvantage} />
                <Card title="Go to Market" icon="🚀" content={pitchAnalysis.goToMarket} />
            </div>
            <div className="summary-section">
                <h2 className="subtitle">Pitch Summary</h2>
                <p className="summary">{pitchAnalysis.summary || "No summary available yet."}</p>
            </div>
            <div className="transcript-container">
                <h2 className="subtitle">Transcript</h2>
                {partialTranscript && (
                    <p className="partial-transcript">{partialTranscript}</p>
                )}
                <p className="transcript">{fullTranscript || "No transcript available yet."}</p>
            </div>
        </div>
    )
}
