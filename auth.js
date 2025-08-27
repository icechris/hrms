/* Firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyD3FdDFTm2-ic5jRgTgKm8BwKTwvRb0fuw",
  authDomain: "lotteryhrms.firebaseapp.com",
  projectId: "lotteryhrms",
  storageBucket: "lotteryhrms.firebasestorage.app",
  messagingSenderId: "46749836470",
  appId: "1:46749836470:web:42d899c220ccfa61713217"
};
firebase.initializeApp(firebaseConfig);
// firebase.initializeApp(firebaseConfig);
 const db = firebase.firestore();

/* User state */
let CURRENT_USER = null;
let CURRENT_ROLE = null;
let CURRENT_EMPLOYEE_ID = null;

/* Auth state listener */
// auth.onAuthStateChanged(async (user) => {
//   try {
//     if (user) {
//       // User is signed in
//       CURRENT_USER = { email: user.email, uid: user.uid };
      
//       // Fetch user data from Firestore users collection
//       const userDoc = await db.collection('users').doc(user.uid).get();
//       if (userDoc.exists) {
//         const userData = userDoc.data();
//         CURRENT_ROLE = userData.role || 'employee';
//         CURRENT_EMPLOYEE_ID = user.uid;
        
//         // Update UI with user info
//         document.getElementById('user-email').textContent = user.email;
//         document.getElementById('user-role').textContent = CURRENT_ROLE.charAt(0).toUpperCase() + CURRENT_ROLE.slice(1);
//         document.getElementById('user-initials').textContent = userData.name ? userData.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
//         document.getElementById('btn-logout').classList.remove('hidden');
//       } else {
//         // No user data in Firestore, redirect to login
//         alert('No user data found. Please contact admin.');
//         auth.signOut();
//         window.location.href = 'login.html';
//         return;
//       }
      
//       // Apply RBAC
//       applyRBAC();
      
//       // Refresh accounting data for the current month
//       refreshAccounting();
//     } else {
//       // No user is signed in, redirect to login
//       CURRENT_USER = null;
//       CURRENT_ROLE = null;
//       CURRENT_EMPLOYEE_ID = null;
      
//       window.location.href = 'login.html';
//     }
//   } catch (error) {
//     handleError('auth state change', error, 'Error loading user data');
//     // Redirect to login on error
//     window.location.href = 'login.html';
//   }
// });

/* Logout functionality */
document.getElementById('btn-logout').addEventListener('click', async () => {
  if (!confirm('Are you sure you want to log out?')) return;
  
  try {
    await auth.signOut();
    alert('Logged out successfully');
    window.location.href = 'login.html';
  } catch (error) {
    handleError('logout', error, 'Error during logout');
  }
});