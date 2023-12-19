import { HuggingFaceInferenceEmbeddings } from 'langchain/embeddings/hf';

const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
});

export async function getEmbeddings(text: string) {
    try {
        const input = [text]
        const response = await embeddings._embed(input)
        return response[0] as number[];
    } catch (error) {
        console.log("error", error);
        throw error;
    }
}
