import {h} from "preact"
import {Link, Route, Router} from "preact-router"
import "./app.css"
import {Voice} from "./voice"

export function App() {
    return (
        <div className="app">
            <nav className="navbar">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/voice" className="nav-link">Voice Transcription</Link>
            </nav>

            <main className="main-content">
                <Router>
                    <Route path="/" component={Home} />
                    <Route path="/voice" component={Voice} />
                </Router>
            </main>
        </div>
    )
}

function Home() {
    return (
        <div className="home">
            <h1 className="title">EchoDelphi</h1>
            <p className="description">
                EchoDelphi is an application that summarizes a spoken language audio stream and makes a printed summary of it.
                As an example, the audio of a meeting can be transcribed in real-time, summarized and displayed on a monitor for
                the meeting participants to see a summary of their meeting so far. That way they can address missing items they
                still need to discuss.
            </p>
            <Link href="/voice" className="cta-button">Start Transcribing</Link>
        </div>
    )
}
