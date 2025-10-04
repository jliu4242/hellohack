'use client'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useEffect } from 'react'

export default function signin() {

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        });

    useEffect(() => {
        ui.start('#firebaseui-auth-container', {
            signInOptions: [
                {
                    provider: firebase.auth.EmailProvider.PROVIDER_ID,
                    requireDisplayName: false
                },
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ]
        });
    }
    )

    return (
        <div>
            <h1>Login</h1>
            <div id='firebase-ui-auth-container'></div>
        </div>
    )
}

