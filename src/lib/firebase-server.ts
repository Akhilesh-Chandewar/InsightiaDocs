import { getFirebaseUrl } from "./firebase";
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';


export async function downloadFromFirebase(file_key: string): Promise<string | null> {
    return new Promise(async (resolve, reject) => {
        try {
            const dURL = await getFirebaseUrl(file_key);
            const response = await axios.get(dURL, { responseType: 'arraybuffer' });
            const filePath = path.join("downloads/", file_key);
            fs.writeFileSync(filePath, Buffer.from(response.data));
            resolve(filePath)
        } catch (error) {
            console.error(error);
            reject(error);
            return null;
        }
    })
}
