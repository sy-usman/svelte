import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
import pkg from 'firebase-admin';

const project_id = process.env.PROJECT_ID;
const private_key = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n');
const client_email = process.env.CLIENT_EMAIL;

try {
    pkg.initializeApp({
    credential: pkg.credential.cert({
        projectId: project_id,
        privateKey: private_key,
        clientEmail: client_email
    })
 });
} catch (e) {
    const error = e as Error;
    if(!/already exists/u.test(error.message)){
        console.error('Firebase admin initialization error', error.stack);
    }
}

export const adminDB = getFirestore();
export const adminAuth = getAuth();