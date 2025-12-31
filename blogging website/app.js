// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getDatabase, set, ref, get, remove, update } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";

// Firebase Configuration
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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

// Global Variables
const my_blog = document.querySelector('.my_blog');
const login_page = document.querySelector('.login');
const notify = document.querySelector('.notifi');
const Sign_btn = document.getElementById('sign_in');
const sign_out_btn = document.querySelector('#logout');
const add_post_btn = document.querySelector('#post_btn');
const update_btn = document.querySelector('.update_btn');
const post_btn = document.querySelector('.post_btn');
let currentUpdateKey = null;

//Notification Function (for 3 seconds only)
function showNotification(message) {
  notify.innerHTML = message;
  notify.style.display = "block";
  setTimeout(() => {
    notify.innerHTML = "";
    notify.style.display = "none";
  }, 3000);
}

// Auth State Change
onAuthStateChanged(auth, (user) => {
  if (user) {
    my_blog.classList.add('show');
    login_page.classList.add('hide');
  } else {
    my_blog.classList.remove('show');
    login_page.classList.remove('hide');
  }
});

function SignInUser() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential.user.uid);
    })
    .catch((error) => {
      showNotification("Login failed: Invalid email or password!");

      // Reset fields
      document.getElementById('email').value = "";
      document.getElementById('password').value = "";
    });
}


Sign_btn.addEventListener('click', SignInUser);

// Sign Out
sign_out_btn.addEventListener('click', () => {
  signOut(auth).then(() => {
    console.log('sign out successful');
  }).catch((error) => {
    console.log("error: " + error);
  });
});

// Add Post
function Add_Post() {
  const title = document.querySelector('#title').value;
  const post_content = document.querySelector('#post_content').value;
  const id = Math.floor(Math.random() * 1000);

  set(ref(db, 'posts/' + id), {
    title: title,
    post_content: post_content
  }).then(() => {
    showNotification("Data Added ✅");
    document.querySelector('#title').value = "";
    document.querySelector('#post_content').value = "";
    GetPostData();
  });
}
add_post_btn.addEventListener('click', Add_Post);

// Get Data
function GetPostData() {
  const user_ref = ref(db, 'posts/');
  get(user_ref).then((snapshot) => {
    const data = snapshot.val();
    const table = document.querySelector('table');
    let html = "";
    let postNumber = 1; // Post counter

    for (const key in data) {
      const { title, post_content } = data[key];
      html += `<tr>
        <td>${postNumber++}</td>
        <td>${title}</td>
        <td><button class="delete" onclick="delete_data(${key})">Delete</button></td>
        <td><button class="update" onclick="update_data(${key})">Update</button></td>
      </tr>`;
    }

    table.innerHTML = html;
  });
}
GetPostData();

// Delete Post
window.delete_data = function (key) {
  remove(ref(db, `posts/${key}`)).then(() => {
    showNotification("Data Deleted ❌");
    GetPostData();
  });
};

// Prepare for Update
window.update_data = function (key) {
  currentUpdateKey = key;
  const user_ref = ref(db, `posts/${key}`);
  get(user_ref).then((item) => {
    document.querySelector('#title').value = item.val().title;
    document.querySelector('#post_content').value = item.val().post_content;

    update_btn.classList.add('show');
    post_btn.classList.add('hide');
  });
};

// Final Update Button Logic (added once)
update_btn.addEventListener('click', function () {
  const title = document.querySelector('#title').value;
  const post_content = document.querySelector('#post_content').value;

  if (currentUpdateKey !== null) {
    update(ref(db, `posts/${currentUpdateKey}`), {
      title: title,
      post_content: post_content
    }).then(() => {
      showNotification("Data Updated ✅");

      document.querySelector('#title').value = "";
      document.querySelector('#post_content').value = "";

      update_btn.classList.remove('show');
      post_btn.classList.remove('hide');

      currentUpdateKey = null;
      GetPostData();
    }).catch((error) => {
      showNotification("Update Failed ❌");
      console.error("Update error:", error);
    });
  }
});
