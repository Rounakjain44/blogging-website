// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDZnxBxCbx19CFS8-HcDRy9jA926HaLFzQ",
  authDomain: "fireblog-a15d3.firebaseapp.com",
  projectId: "fireblog-a15d3",
  storageBucket: "fireblog-a15d3.firebasestorage.app",
  messagingSenderId: "748896034718",
  appId: "1:748896034718:web:0a4ed05ff018fcea76408f",
  measurementId: "G-XEBZCSMP6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Handle form submit
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Form reload hone se rokna

  // Input values
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let message = document.getElementById('message').value;

  // Random id banake data save karna
  let id = Math.floor(Math.random() * 100000);

  set(ref(db, 'contacts/' + id), {
    name: name,
    email: email,
    message: message
  }).then(() => {
    alert("Message sent successfully!");
    document.getElementById('contactForm').reset(); // Form clear
  }).catch(() => {
    alert("Error sending message!");
  });
});
