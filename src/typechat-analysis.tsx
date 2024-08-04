import {createJsonTranslator, createLanguageModel} from "typechat"
import {createTypeScriptJsonValidator} from "typechat/ts"

export interface PitchAnalysis {
    market: string;
    product: string;
    businessModel: string;
    businessType: string;
    competitiveAdvantage: string;
    goToMarket: string;
    summary: string;
}

const schema = `
 export interface PitchAnalysis {
     market: string;
     product: string;
     businessModel: string;
     businessType: string;
     competitiveAdvantage: string;
     goToMarket: string;
     summary: string;
 }`

export async function createPitchAnalysisTranslator(apiKey: string) {
    const model = createLanguageModel(apiKey)
    const validator = createTypeScriptJsonValidator<PitchAnalysis>(schema, "PitchAnalysis")
    return createJsonTranslator(model, validator)
}

export async function analyzePitch(translator: ReturnType<typeof createJsonTranslator>, request: string): Promise<PitchAnalysis | null> {
    console.log("Request: ", request)

    const response = await translator.translate(request)

    if (! response.success) {
        console.error("Translation failed:", response.message)
        return null
    }

    console.log("TypeChat response:", JSON.stringify(response.data, null, 2))
    return response.data
}
