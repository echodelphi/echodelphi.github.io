import {h} from "preact"
import {Link, Route, Router} from "preact-router"
import "./app.css"
import {Voice} from "./voice"
import {Translate} from "./translate"
import {Analysis} from "./analysis"

export function App() {
    return (
        <div className="app">
            <nav className="navbar">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/translate" className="nav-link">Translate</Link>
                <Link href="/analysis" className="nav-link">Analysis</Link>
                <Link href="/about" className="nav-link">About</Link>
                <Link href="/analysis" className="nav-link">Analysis</Link>
            </nav>

            <main className="main-content">
                <Router>
                    <Route path="/" component={Voice} />
                    <Route path="/translate" component={Translate} />
                    <Route path="/analysis" component={Analysis} />
                    <Route path="/about" component={About} />
                    <Route path="/analysis" component={Analysis} />
                </Router>
            </main>
        </div>
    )
}

function About() {
    return (
        <div className="home">
            <h1 className="title">EchoDelphi</h1>
            <p className="description">
                EchoDelphi is an application that summarizes a spoken language audio stream and makes a printed summary of it.
                As an example, the audio of a meeting can be transcribed in real-time, summarized and displayed on a monitor for
                the meeting participants to see a summary of their meeting so far. That way they can address missing items they
                still need to discuss.
            </p>
            <Link href="/src/translate" className="cta-button">Start Transcribing</Link>
        </div>
    )
}
