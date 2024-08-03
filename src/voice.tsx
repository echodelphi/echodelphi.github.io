import VoiceToText from "voice2text"

let voice2text = new VoiceToText({
    converter: "vosk",
    language: "en",
    sampleRate: 16000,
})

window.addEventListener("voice", (e) => {
    if (e.detail.type === "PARTIAL") {
        console.log("partial result: ", e.detail.text)
    } else if (e.detail.type === "FINAL") {
        console.log("final result: ", e.detail.text)
    } else if (e.detail.type === "STATUS") {
        console.log("status: ", e.detail.text)
    }
})

voice2text.start()

setTimeout(() => {
    voice2text.stop() // or voice2text.pause();
}, 60000)
