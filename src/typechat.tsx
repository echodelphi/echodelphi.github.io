
import {createJsonTranslator, createOpenAILanguageModel} from "typechat"
import {createTypeScriptJsonValidator} from "typechat/ts"

export interface ProductAnalysisResponse {
    market: string;
    product: string;
    model: "subscription" | "one time payment" | "pay per use";
    type: "B2B" | "B2C";

}

// Process  requests interactively or from the input file specified on the command line
export default async function typechatRequest(apiKey: string, request: string) {
    request = request ? request : "This has bad quality."
    console.log("Request: ", request)
    apiKey = apiKey.replace(/\s/g, "")

    console.log("apiKey:" + apiKey)

    const model = createOpenAILanguageModel(apiKey, "gpt-4o-mini")

    const schema = 'export interface ProductAnalysisResponse { market: string; product: string; model: "subscription" | "one time payment" | "pay per use"; type: "B2B" | "B2C";}'
    const validator = createTypeScriptJsonValidator<ProductAnalysisResponse>(schema, "ProductAnalysisResponse")
    const translator = createJsonTranslator(model, validator)

    const response = await translator.translate(request)

    if (! response.success) {
        console.log(response.message)
        return ""
    }
    console.log(`The data is ${response}`)
    return response
}
