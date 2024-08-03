import {h} from "preact"

export function Transcript(props: {transcript: string; partialTranscript: string}) {
    return (
        <div className="transcript-container">
            <h2 className="subtitle">Transcript:</h2>
            <p className="transcript">{props.transcript}</p>
            <p className="partial-transcript">{props.partialTranscript}</p>
        </div>
    )
}
