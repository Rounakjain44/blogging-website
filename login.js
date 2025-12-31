// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// LOGIN FUNCTIONALITY
const loginBtn = document.getElementById("sign_in");
if (loginBtn) {
  loginBtn.addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login success
        alert("Login successful!");
        document.querySelector(".login").style.display = "none";
        document.querySelector(".my_blog").style.display = "block";
      })
      .catch((error) => {
        // Login failed
        const errorCode = error.code;
        if (errorCode === "auth/user-not-found") {
          alert("User not found. Please check your email.");
        } else if (errorCode === "auth/wrong-password") {
          alert(" Incorrect password. Try again.");
        } else if (errorCode === "auth/invalid-email") {
          alert("Please enter a valid email.");
        } else {
          alert( error.message);
        }
      });
  });
}

//LOGOUT
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        document.querySelector(".my_blog").style.display = "none";
        document.querySelector(".login").style.display = "block";
        alert(" You have been logged out.");
      })
      .catch((error) => {
        alert(" Error logging out: " + error.message);
      });
  });
}

// Check user session
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.querySelector(".login").style.display = "none";
    document.querySelector(".my_blog").style.display = "block";
  } else {
    document.querySelector(".my_blog").style.display = "none";
    document.querySelector(".login").style.display = "block";
  }
});
