/* Debug Firebase loading */
console.log('Checking Firebase availability...');
window.addEventListener('load', () => {
  console.log('Window loaded. Firebase:', typeof firebase, firebase);
  console.log('Firebase auth:', firebase?.auth);
});

/* Firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyD3FdDFTm2-ic5jRgTgKm8BwKTwvRb0fuw",
  authDomain: "lotteryhrms.firebaseapp.com",
  projectId: "lotteryhrms",
  storageBucket: "lotteryhrms.firebasestorage.app",
  messagingSenderId: "46749836470",
  appId: "1:46749836470:web:42d899c220ccfa61713217"
};

/* Wait for Firebase to load */
function initializeFirebase() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase is not defined. Retrying in 500ms...');
    setTimeout(initializeFirebase, 500);
    return;
  }

  try {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    /* Handle login form submission */
    const loginForm = document.getElementById('loginForm');
    const loginBtn = loginForm.querySelector('.login-btn');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const keepSignedIn = document.getElementById('keepSignedIn').checked;

      if (!email || !password) {
        showError('Please enter both email and password.');
        return;
      }

      try {
        setLoadingState(loginBtn, true);
        errorMessage.style.display = 'none';

        // Set auth persistence
        await auth.setPersistence(
          keepSignedIn
            ? firebase.auth.Auth.Persistence.LOCAL
            : firebase.auth.Auth.Persistence.SESSION
        );

        // Sign in
        const userCredential = await auth.signInWithEmailAndPassword(email, password);

        // Verify user in Firestore
        const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
        if (!userDoc.exists) {
          await auth.signOut();
          showError('No user data found. Please contact admin.');
          return;
        }

        // Redirect to dashboard
        window.location.href = 'index.html';
      } catch (error) {
        console.error('Login error:', error);
        let message = 'An error occurred during login. Please try again.';
        switch (error.code) {
          case 'auth/user-not-found':
            message = 'No user found with this email.';
            break;
          case 'auth/wrong-password':
            message = 'Incorrect password.';
            break;
          case 'auth/invalid-email':
            message = 'Invalid email format.';
            break;
          case 'auth/too-many-requests':
            message = 'Too many attempts. Please try again later.';
            break;
        }
        showError(message);
      } finally {
        setLoadingState(loginBtn, false);
      }
    });

    /* Handle forgot password */
    document.querySelector('.forgot-password').addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      if (!email) {
        showError('Please enter your email to reset password.');
        return;
      }

      try {
        setLoadingState(loginBtn, true);
        errorMessage.style.display = 'none';
        await auth.sendPasswordResetEmail(email);
        alert('Password reset email sent. Check your inbox.');
      } catch (error) {
        console.error('Password reset error:', error);
        let message = 'Error sending password reset email.';
        switch (error.code) {
          case 'auth/invalid-email':
            message = 'Invalid email format.';
            break;
          case 'auth/user-not-found':
            message = 'No user found with this email.';
            break;
        }
        showError(message);
      } finally {
        setLoadingState(loginBtn, false);
      }
    });

    /* Helper functions */
    function setLoadingState(element, isLoading) {
      element.classList.toggle('loading', isLoading);
    }

    function showError(message) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    }

    /* Check if already signed in */
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          window.location.href = 'index.html';
        } else {
          await auth.signOut();
          showError('No user data found. Please contact admin.');
        }
      }
    });

  } catch (error) {
    console.error('Firebase initialization failed:', error);
    showError('Failed to initialize Firebase. Please check your network or try again later.');
  }
}

/* Call initialization */
initializeFirebase();