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
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
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
const adminHub = document.getElementById("adminHub");
const adminView = document.getElementById("adminView");
const hubHomeBtn = document.getElementById("hubHomeBtn");
const backToHubBtn = document.getElementById("backToHubBtn");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");

const lastUpdatedDisplay = document.getElementById("lastUpdatedDisplay");
const saveStatus = document.getElementById("saveStatus");
const hubLogoutBtn = document.getElementById("hubLogoutBtn");
const editorLogoutBtn = document.getElementById("editorLogoutBtn");

const marqueeInput = document.getElementById("marqueeInput");
const marqueeSaveBtn = document.getElementById("marqueeSaveBtn");
const marqueeStatus = document.getElementById("marqueeStatus");

const noticeInput = document.getElementById("noticeInput");
const noticeAddBtn = document.getElementById("noticeAddBtn");
const noticeStatus = document.getElementById("noticeStatus");
const noticeList = document.getElementById("noticeList");
const noticeDeleteSelectedBtn = document.getElementById("noticeDeleteSelectedBtn");
const noticeSelectModeBtn = document.getElementById("noticeSelectModeBtn");

const wnTextInput = document.getElementById("wnTextInput");
const wnImageUrlInput = document.getElementById("wnImageUrlInput");
const wnImagePreview = document.getElementById("wnImagePreview");
const wnBtnTextInput = document.getElementById("wnBtnTextInput");
const wnBtnUrlInput = document.getElementById("wnBtnUrlInput");
const wnSaveBtn = document.getElementById("wnSaveBtn");
const wnStatus = document.getElementById("wnStatus");

// ---------- Auth state ----------
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginView.style.display = "none";
    adminView.style.display = "none";
    adminHub.style.display = "block";
    await markUpdatedToday();
    await loadMarquee();
    await loadWhatsNew();
    await renderNotices();
  } else {
    adminHub.style.display = "none";
    adminView.style.display = "none";
    loginView.style.display = "block";
    loginForm.reset();
  }
});

hubHomeBtn.addEventListener("click", () => {
  adminHub.style.display = "none";
  adminView.style.display = "block";
});

backToHubBtn.addEventListener("click", () => {
  adminView.style.display = "none";
  adminHub.style.display = "block";
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
    console.error(err);
  } finally {
    submitBtn.disabled = false;
  }
});

hubLogoutBtn.addEventListener("click", () => signOut(auth));
editorLogoutBtn.addEventListener("click", () => signOut(auth));

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
    saveStatus.textContent = "Could not update: " + (err.code || err.message);
    saveStatus.className = "msg error";
    console.error(err);
  }
}

// ---------- Top marquee text ----------
async function loadMarquee() {
  try {
    const snap = await getDoc(SITE_DOC);
    if (snap.exists() && snap.data().marqueeText) {
      marqueeInput.value = snap.data().marqueeText;
    }
  } catch (err) {
    marqueeStatus.textContent = "Could not load marquee: " + (err.code || err.message);
    marqueeStatus.className = "msg error";
    console.error(err);
  }
}

marqueeSaveBtn.addEventListener("click", async () => {
  const value = marqueeInput.value.trim();
  if (!value) {
    marqueeStatus.textContent = "Marquee text can't be empty.";
    marqueeStatus.className = "msg error";
    return;
  }
  marqueeSaveBtn.disabled = true;
  marqueeStatus.textContent = "Saving...";
  marqueeStatus.className = "msg";
  try {
    await setDoc(SITE_DOC, { marqueeText: value }, { merge: true });
    marqueeStatus.textContent = "Marquee updated.";
    marqueeStatus.className = "msg success";
  } catch (err) {
    marqueeStatus.textContent = "Save failed: " + (err.code || err.message);
    marqueeStatus.className = "msg error";
    console.error(err);
  } finally {
    marqueeSaveBtn.disabled = false;
  }
});

// ---------- Notices (add / edit / delete) ----------
const NOTICES_COL = collection(db, "notices");

async function renderNotices() {
  noticeList.innerHTML = "";
  noticeDeleteSelectedBtn.style.display = "none";
  try {
    const q = query(NOTICES_COL, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    snap.forEach((docSnap) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = docSnap.id;
      checkbox.addEventListener("change", updateDeleteSelectedVisibility);
      li.appendChild(checkbox);

      const span = document.createElement("span");
      span.textContent = docSnap.data().text || "";
      li.appendChild(span);

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", async () => {
        const updated = prompt("Edit notice:", docSnap.data().text || "");
        if (updated === null) return;
        const trimmed = updated.trim();
        if (!trimmed) return;
        try {
          await updateDoc(doc(db, "notices", docSnap.id), { text: trimmed });
          await renderNotices();
        } catch (err) {
          noticeStatus.textContent = "Edit failed: " + (err.code || err.message);
          noticeStatus.className = "msg error";
          console.error(err);
        }
      });
      li.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        if (!confirm("Delete this notice?")) return;
        try {
          await deleteDoc(doc(db, "notices", docSnap.id));
          await renderNotices();
        } catch (err) {
          noticeStatus.textContent = "Delete failed: " + (err.code || err.message);
          noticeStatus.className = "msg error";
          console.error(err);
        }
      });
      li.appendChild(deleteBtn);

      noticeList.appendChild(li);
    });
  } catch (err) {
    noticeStatus.textContent = "Could not load notices: " + (err.code || err.message);
    noticeStatus.className = "msg error";
    console.error(err);
  }
}

function updateDeleteSelectedVisibility() {
  const anyChecked = noticeList.querySelector('input[type="checkbox"]:checked');
  noticeDeleteSelectedBtn.style.display = anyChecked ? "block" : "none";
}

noticeSelectModeBtn.addEventListener("click", () => {
  const enabling = !noticeList.classList.contains("bulk-mode");
  noticeList.classList.toggle("bulk-mode", enabling);
  noticeSelectModeBtn.textContent = enabling ? "Cancel" : "Select";
  if (!enabling) {
    noticeList.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    noticeDeleteSelectedBtn.style.display = "none";
  }
});

noticeDeleteSelectedBtn.addEventListener("click", async () => {
  const checked = noticeList.querySelectorAll('input[type="checkbox"]:checked');
  if (checked.length === 0) return;
  if (!confirm("Delete " + checked.length + " selected notice(s)?")) return;

  noticeDeleteSelectedBtn.disabled = true;
  noticeStatus.textContent = "Deleting...";
  noticeStatus.className = "msg";
  try {
    for (const cb of checked) {
      await deleteDoc(doc(db, "notices", cb.dataset.id));
    }
    noticeStatus.textContent = "Selected notices deleted.";
    noticeStatus.className = "msg success";
    await renderNotices();
  } catch (err) {
    noticeStatus.textContent = "Delete failed: " + (err.code || err.message);
    noticeStatus.className = "msg error";
    console.error(err);
  } finally {
    noticeDeleteSelectedBtn.disabled = false;
  }
});

noticeAddBtn.addEventListener("click", async () => {
  const value = noticeInput.value.trim();
  if (!value) {
    noticeStatus.textContent = "Type a notice first.";
    noticeStatus.className = "msg error";
    return;
  }
  noticeAddBtn.disabled = true;
  noticeStatus.textContent = "Adding...";
  noticeStatus.className = "msg";
  try {
    await addDoc(NOTICES_COL, { text: value, createdAt: serverTimestamp() });
    noticeInput.value = "";
    noticeStatus.textContent = "Notice added.";
    noticeStatus.className = "msg success";
    await renderNotices();
  } catch (err) {
    noticeStatus.textContent = "Could not add notice: " + (err.code || err.message);
    noticeStatus.className = "msg error";
    console.error(err);
  } finally {
    noticeAddBtn.disabled = false;
  }
});

// ---------- What's New section (text, image, button) ----------
// Fallbacks match what's currently hardcoded on the live site, so the
// admin form shows the real current content even before anything is
// saved to Firestore.
const WN_DEFAULTS = {
  text: "The UP Board (UPMSP) has declared the results for class 10th and 12th and our student Vasu got 61.5% in class 10th with 73 marks in English.",
  image: "/images/newbanner.png",
  btnText: "Open Facebook Post",
  btnUrl: "https://www.facebook.com/share/p/1EHf5KEr9N/",
};

function updateWnPreview(url) {
  if (!url) {
    wnImagePreview.style.display = "none";
    return;
  }
  wnImagePreview.src = url;
  wnImagePreview.style.display = "block";
}

async function loadWhatsNew() {
  try {
    const snap = await getDoc(SITE_DOC);
    const data = snap.exists() ? snap.data() : {};
    wnTextInput.value = data.whatsNewText || WN_DEFAULTS.text;
    wnImageUrlInput.value = data.whatsNewImage || WN_DEFAULTS.image;
    wnBtnTextInput.value = data.whatsNewBtnText || WN_DEFAULTS.btnText;
    wnBtnUrlInput.value = data.whatsNewBtnUrl || WN_DEFAULTS.btnUrl;
    updateWnPreview(wnImageUrlInput.value);
  } catch (err) {
    wnStatus.textContent = "Could not load current content: " + (err.code || err.message);
    wnStatus.className = "msg error";
    console.error(err);
  }
}

wnImageUrlInput.addEventListener("input", () => updateWnPreview(wnImageUrlInput.value));

wnSaveBtn.addEventListener("click", async () => {
  const text = wnTextInput.value.trim();
  const image = wnImageUrlInput.value.trim();
  const btnText = wnBtnTextInput.value.trim();
  const btnUrl = wnBtnUrlInput.value.trim();

  if (!text || !image || !btnText || !btnUrl) {
    wnStatus.textContent = "All four fields need a value.";
    wnStatus.className = "msg error";
    return;
  }

  wnSaveBtn.disabled = true;
  wnStatus.textContent = "Saving...";
  wnStatus.className = "msg";
  try {
    await setDoc(
      SITE_DOC,
      {
        whatsNewText: text,
        whatsNewImage: image,
        whatsNewBtnText: btnText,
        whatsNewBtnUrl: btnUrl,
      },
      { merge: true }
    );
    wnStatus.textContent = "What's New section updated.";
    wnStatus.className = "msg success";
  } catch (err) {
    wnStatus.textContent = "Save failed: " + (err.code || err.message);
    wnStatus.className = "msg error";
    console.error(err);
  } finally {
    wnSaveBtn.disabled = false;
  }
});
