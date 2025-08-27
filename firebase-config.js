const firebaseConfig = {
  apiKey: "AIzaSyD3FdDFTm2-ic5jRgTgKm8BwKTwvRb0fuw",
  authDomain: "lotteryhrms.firebaseapp.com",
  projectId: "lotteryhrms",
  storageBucket: "lotteryhrms.firebasestorage.app",
  messagingSenderId: "46749836470",
  appId: "1:46749836470:web:42d899c220ccfa61713217"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();