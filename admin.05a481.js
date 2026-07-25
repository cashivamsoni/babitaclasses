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
  getDoc,
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

const lastUpdatedInput = document.getElementById("lastUpdatedInput");
const saveBtn = document.getElementById("saveBtn");
const saveStatus = document.getElementById("saveStatus");
const logoutBtn = document.getElementById("logoutBtn");

// ---------- Auth state ----------
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginView.style.display = "none";
    adminView.style.display = "block";
    await loadLastUpdated();
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

// ---------- Last updated date ----------
async function loadLastUpdated() {
  saveStatus.textContent = "";
  saveStatus.className = "msg";
  try {
    const snap = await getDoc(SITE_DOC);
    if (snap.exists() && snap.data().lastUpdated) {
      lastUpdatedInput.value = snap.data().lastUpdated;
    }
  } catch (err) {
    saveStatus.textContent = "Could not load the current date.";
    saveStatus.className = "msg error";
  }
}

saveBtn.addEventListener("click", async () => {
  const value = lastUpdatedInput.value;
  if (!value) {
    saveStatus.textContent = "Pick a date first.";
    saveStatus.className = "msg error";
    return;
  }
  saveBtn.disabled = true;
  saveStatus.textContent = "Saving...";
  saveStatus.className = "msg";
  try {
    await setDoc(SITE_DOC, { lastUpdated: value }, { merge: true });
    saveStatus.textContent = "Saved.";
    saveStatus.className = "msg success";
  } catch (err) {
    saveStatus.textContent = "Save failed — try again.";
    saveStatus.className = "msg error";
  } finally {
    saveBtn.disabled = false;
  }
});
