const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app.firebaseio.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-id",
  appId: "your-app-id"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const patientList = document.getElementById("patientList");

db.ref("patients").on("value", (snapshot) => {
  patientList.innerHTML = "";
  snapshot.forEach((child) => {
    const data = child.val();
    const div = document.createElement("div");
    div.className = "patient-card";
    div.innerHTML = `
      <h3>${data.name} (Token: ${data.token})</h3>
      <p>Age: ${data.age}</p>
      <p>Issue: ${data.problem}</p>
      <textarea placeholder="Write prescription..." id="presc-${data.token}"></textarea>
      <button onclick="savePrescription('${data.token}')">Save</button>
      <hr />
    `;
    patientList.appendChild(div);
  });
});

function savePrescription(token) {
  const presc = document.getElementById(`presc-${token}`).value;

  db.ref("patients/" + token).update({
    prescription: presc,
    status: "treated"
  }).then(() => {
    alert("Prescription saved for Token: " + token);
  });
}
