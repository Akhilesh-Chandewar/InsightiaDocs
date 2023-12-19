import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebaseConfig";

export async function uploadToFirebase(file: File): Promise<{ file_key: string; file_name: string }> {
    return new Promise(async (resolve, reject) => {
        try {
            const file_key = "csv_data" + Date.now().toString() + file.name.replace(" ", "-");
            const file_ref = ref(storage, `/Insightia/${file_key}`);
            
            // Upload the file
            const uploadTask = uploadBytesResumable(file_ref, file);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    try {
                        resolve({ file_key, file_name: file.name,});
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        } catch (error) {
            reject(error);
        }
    });
}

export async  function getFirebaseUrl(file_key:string){
    const fileRef = ref(storage, `/Insightia/${file_key}`);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
}