// //huggingface embeddeing
// const { date } = require("drizzle-orm/pg-core");
// const { HuggingFaceInferenceEmbeddings } = require('langchain/embeddings/hf');

// const embeddings = new HuggingFaceInferenceEmbeddings({
// 	apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
// });

// async function getEmbeddings(text) {
// 	try {
// 		const input = text.split(" ")
// 		const response = embeddings._embed(input)
// 		return response
// 	} catch (error) {
// 		console.log("error calling openai embeddings api", error);
// 		throw error;
// 	}
// }

// async function embedDocument() {
//     try {
//         const text = "Notes"
//         console.log("embedding document", text);
//         const embeddings = await getEmbeddings(text);
//         return {
//             id: "hhhhhh",
//             values: embeddings,
//             metadata: {
//                 text: text,
//             },
//         }
//     } catch (error) {
//         console.log("error embedding document", error);
//         throw error;
//     }
// }

// embedDocument().then((data)=>{
// 	console.log(data)
// })


