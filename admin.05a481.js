// ---------- Firebase setup ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCeIXfg73jN9d6rvzkeenfUja3lyCVPWMA",
  authDomain: "babitaclasses-eb3e4.firebaseapp.com",
  projectId: "babitaclasses-eb3e4",
  storageBucket: "babitaclasses-eb3e4.firebasestorage.app",
  messagingSenderId: "191824554368",
  appId: "1:191824554368:web:bb9f7af3c4634f7616f965",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Single doc that holds simple site-wide fields (starting with lastUpdated)
const SITE_DOC = doc(db, "site", "meta");

// ---------- Elements ----------
const loginView = document.getElementById("loginView");
const adminView = document.getElementById("adminView");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");

const lastUpdatedDisplay = document.getElementById("lastUpdatedDisplay");
const saveStatus = document.getElementById("saveStatus");
const logoutBtn = document.getElementById("logoutBtn");

// ---------- Auth state ----------
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginView.style.display = "none";
    adminView.style.display = "block";
    await markUpdatedToday();
  } else {
    adminView.style.display = "none";
    loginView.style.display = "block";
    loginForm.reset();
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";
  const submitBtn = loginForm.querySelector("button");
  submitBtn.disabled = true;
  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
  } catch (err) {
    loginError.textContent = "Login failed — check your email and password.";
  } finally {
    submitBtn.disabled = false;
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));

// ---------- Last updated date: auto-set to today on every login ----------
function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatReadable(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

async function markUpdatedToday() {
  saveStatus.textContent = "Updating...";
  saveStatus.className = "msg";
  const today = todayISO();
  try {
    await setDoc(SITE_DOC, { lastUpdated: today }, { merge: true });
    lastUpdatedDisplay.textContent = formatReadable(today);
    saveStatus.textContent = "Site marked as updated today.";
    saveStatus.className = "msg success";
  } catch (err) {
    saveStatus.textContent = "Could not update — check your connection.";
    saveStatus.className = "msg error";
  }
}
