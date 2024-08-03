import {h, Fragment} from "preact"
import {useState} from "preact/hooks"
import "./app.css"

export function App() {
    const [count, setCount] = useState(0);

    return <>
        <h1>EchoDelphi!        </h1>
        <button onClick={() => setCount(count+1)}>Start</button>
        <p>Count: {count}</p>
        <p>EchoDelphi is an application that summarizes a spoken language audio stream and makes a printed summary of it. 
        As an example, the audio of a meeting can be transcribed in realtime, summarized and displayed on a monitor for the meeting participants to see a summary of their meeting so far. That way they can address missi items they still need to discuss.
        </p>

    </>
}

