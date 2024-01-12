import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromFirebase } from "./firebase-server";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { convertToAscii } from "./utils";
import md5 from "md5";
import { getEmbeddings } from "./embeddings";
import {
    Document,
    RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";

export const getPineconeClient = () => {
    return new Pinecone({
        environment: process.env.PINECONE_ENVIRONMENT!,
        apiKey: process.env.PINECONE_API_KEY!,
    });
};

type CSVdata = {
    metadata: {
        line: number
        source: string
    },
    pageContent: string
}

export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function embedDocument(doc: Document) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent);
        console.log(embeddings)
        const hash = md5(doc.pageContent);
        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
            }
        } as PineconeRecord;
    } catch (error) {
        console.log("error embedding document", error);
        throw error;
    }
}


async function prepareDocument(row: CSVdata) {
    let { pageContent, metadata } = row;
    pageContent = pageContent.replace(/\n/g, "");
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                line: metadata.line,
                source: metadata.source,
                text: truncateStringByBytes(pageContent, 36000),
            },
        }),
    ]);
    return docs;
}

export async function loadFirebaseIntoPinecone(file_key: string) {
    const file_name = await downloadFromFirebase(file_key);
    if (!file_name) {
        throw new Error("Could not download from Firebase");
    }
    const loader = new CSVLoader(file_name);
    const rows = (await loader.load()) as CSVdata[]
    const documents = await Promise.all(rows.map(prepareDocument));
    const vectors = await Promise.all(documents.flat().map(embedDocument));
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("insightiadocs");
    const namespace = pineconeIndex.namespace(convertToAscii(file_key));
    await namespace.upsert(vectors);
    return documents[0]
}

