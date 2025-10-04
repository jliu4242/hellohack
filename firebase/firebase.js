import { initializeApp } from 'firebase/app';
import firebase from 'firebase';
import firebaseui from 'firebaseui';

const firebaseConfig = {
    apiKey: "API_KEY",
    //authDomain: "PROJECT_ID.firebaseapp.com",
    // The value of `databaseURL` depends on the location of the database
    //databaseURL: "https://DATABASE_NAME.firebaseio.com",
    projectId: "jobtracker-e3561",
    // The value of `storageBucket` depends on when you provisioned your default bucket (learn more)
    storageBucket: "PROJECT_ID.firebasestorage.app",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
}

const app = initializeApp(firebaseConfig);

var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
    signInOptions: [
        {
            provider: firebase.auth.EmailProvider.PROVIDER_ID,
            requireDisplayName: false
        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ]
});