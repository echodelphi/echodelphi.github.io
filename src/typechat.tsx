
import {createJsonTranslator, createOpenAILanguageModel} from "typechat"
import {createTypeScriptJsonValidator} from "typechat/ts"

export interface SentimentResponse {
    sentiment: "negative" | "neutral" | "positive"; // The sentiment of the text
}

// Process  requests interactively or from the input file specified on the command line
export default async function typechatRequest(apiKey: string, request: string) {
    request = request ? request : "This has bad quality."
    console.log("Request: ", request)

    const model = createOpenAILanguageModel(apiKey, "gpt-4o-mini")
    // const model = createOpenAILanguageModel("sk-proj-lzwcGkIHY-yUyAx-sxUWsmsA9ciUOTvLDO1IobctuQ1kYvNSjaChDfFZQLT3kFJcTvgAl7eXTIll91pXZtCn0k84F3uxDOxiA1tifUFgnVciibQaDCtWbLCAA", "gpt-4o-mini");

    const schema = 'export interface SentimentResponse { sentiment: "negative" | "neutral" | "positive";}'
    const validator = createTypeScriptJsonValidator<SentimentResponse>(schema, "SentimentResponse")
    const translator = createJsonTranslator(model, validator)

    const response = await translator.translate(request)

    if (! response.success) {
        console.log(response.message)
        return ""
    }
    console.log(`The sentiment is ${response.data.sentiment}`)
    return response.data.sentiment
}
