import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, get, ref } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

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

// Get post data 
function GetPostData() {
  const user_ref = ref(db, 'posts/');

  const mainDiv = document.querySelector('.main');
  mainDiv.innerHTML = "<p>Loading posts...</p>"; 

  get(user_ref).then((snapshot) => {
    const data = snapshot.val();

    let html = "";

    if (!data) {
      mainDiv.innerHTML = "<p>No posts found</p>";
      return;
    }

    for (const key in data) {
      const { title, post_content } = data[key];

      html += `
        <div class="post-card">
          <h2>${title}</h2>
          <p>${post_content}</p>
        </div>
      `;
    }

    mainDiv.innerHTML = html;
  }).catch((error) => {
    console.error("Error fetching posts:", error);
    mainDiv.innerHTML = "<p style='color:red;'>Failed to load posts. Please try again later.</p>"; // Error message
  });
}

GetPostData();  // Call function

