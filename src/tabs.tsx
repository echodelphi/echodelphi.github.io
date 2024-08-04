import {h} from "preact"
import {useState, useEffect, useRef} from "preact/hooks"
import VoiceToText from "voice2text"
import {GeminiBox} from "./geminiBox"
import {env, pipeline, Pipeline, TranslationPipeline} from "@xenova/transformers"

env.allowLocalModels = false

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
    const [status, setStatus] = useState("")
    const [isListening, setIsListening] = useState<boolean>(false)
    const [translator, setTranslator] = useState<TranslationPipeline | null>(null)
    const [targetLang, setTargetLang] = useState<string>("fra_Latn")
    const voice2text = useRef<VoiceToText | null>(null)

    useEffect(() => {
        const initTranslator = async () => {
            const translatorPipeline = await pipeline("translation", "Xenova/nllb-200-distilled-600M")
            setTranslator(translatorPipeline)
        }
        initTranslator()

        voice2text.current = new VoiceToText({
            converter: "vosk",
            language: "en",
            sampleRate: 16000,
        })
        const handleVoiceEvent = (e: VoiceEvent) => {
            switch (e.detail.type) {
                case "PARTIAL":
                    setPartialTranscript(e.detail.text)
                    break
                case "FINAL":
                    setTranscriptReversed((prev) => e.detail.text + "\n" + prev)
                    setTranscript((prev) => prev + "\n" + e.detail.text)
                    setPartialTranscript("")
                    if (translator && targetLang) {
                        translator(e.detail.text, {
                            src_lang: "eng_Latn",
                            tgt_lang: targetLang,
                        }).then((result) => {
                            setTranscript((prev) => prev + "\nTranslated: " + result[0].translation_text)
                        }).catch((error) => {
                            console.error("Translation error:", error)
                            setStatus("Error: Failed to translate text")
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
        }
    }, [])

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
                <h2 className="subtitle">Transcript:</h2>
                {partialTranscript && (
                    <p className="partial-transcript">{partialTranscript}</p>
                )}
                <p className="transcript">{transcriptReversed}</p>
            </div>
        </div>
    )
}
