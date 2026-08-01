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
  documentId,
  where,
  deleteField,
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
let previousMarqueeText = "";
let previousWnState = {};
let previousGalleryUrls = [];

// ---------- Elements ----------
const loginView = document.getElementById("loginView");
const adminHub = document.getElementById("adminHub");
const adminView = document.getElementById("adminView");
const hubHomeBtn = document.getElementById("hubHomeBtn");
const backToHubBtn = document.getElementById("backToHubBtn");
const hubAttendanceBtn = document.getElementById("hubAttendanceBtn");
const adminAttendanceView = document.getElementById("adminAttendanceView");
const attendanceBackBtn = document.getElementById("attendanceBackBtn");
const attendanceLogoutBtn = document.getElementById("attendanceLogoutBtn");
const hubBlogBtn = document.getElementById("hubBlogBtn");
const adminBlogView = document.getElementById("adminBlogView");
const blogBackBtn = document.getElementById("blogBackBtn");
const blogLogoutBtn = document.getElementById("blogLogoutBtn");
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
const noticeSelectAllBtn = document.getElementById("noticeSelectAllBtn");

noticeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    noticeAddBtn.click();
  }
});

const undoToast = document.getElementById("undoToast");
const undoToastMsg = document.getElementById("undoToastMsg");
const undoToastBtn = document.getElementById("undoToastBtn");

const wnTextInput = document.getElementById("wnTextInput");
const wnImageUrlInput = document.getElementById("wnImageUrlInput");
const wnBtnTextInput = document.getElementById("wnBtnTextInput");
const wnBtnUrlInput = document.getElementById("wnBtnUrlInput");
const wnSaveBtn = document.getElementById("wnSaveBtn");
const wnStatus = document.getElementById("wnStatus");

const galleryInputs = [1, 2, 3, 4, 5, 6, 7, 8].map((n) =>
  document.getElementById("galleryInput" + n)
);
const gallerySaveBtn = document.getElementById("gallerySaveBtn");
const galleryStatus = document.getElementById("galleryStatus");

const videoTitleInput = document.getElementById("videoTitleInput");
const videoUrlInput = document.getElementById("videoUrlInput");
const videoAddBtn = document.getElementById("videoAddBtn");

[videoTitleInput, videoUrlInput].forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      videoAddBtn.click();
    }
  });
});
const videoStatus = document.getElementById("videoStatus");
const videoAdminList = document.getElementById("videoAdminList");
const videoSelectModeBtn = document.getElementById("videoSelectModeBtn");
const videoSelectAllBtn = document.getElementById("videoSelectAllBtn");
const videoDeleteSelectedBtn = document.getElementById("videoDeleteSelectedBtn");

const syllabusSessionSelect = document.getElementById("syllabusSessionSelect");
const syllabusNewSessionBtn = document.getElementById("syllabusNewSessionBtn");
const syllabusDeleteSessionBtn = document.getElementById("syllabusDeleteSessionBtn");
const syllabusStatus = document.getElementById("syllabusStatus");
const syllabusAddRowBtn = document.getElementById("syllabusAddRowBtn");
const syllabusRowList = document.getElementById("syllabusRowList");

const studentNameInput = document.getElementById("studentNameInput");
const studentRollInput = document.getElementById("studentRollInput");
const studentAddBtn = document.getElementById("studentAddBtn");
const studentStatus = document.getElementById("studentStatus");
const studentList = document.getElementById("studentList");
const studentSelectModeBtn = document.getElementById("studentSelectModeBtn");
const studentSelectAllBtn = document.getElementById("studentSelectAllBtn");
const studentDeleteSelectedBtn = document.getElementById("studentDeleteSelectedBtn");

const attendanceDateInput = document.getElementById("attendanceDateInput");
const attendanceHolidayView = document.getElementById("attendanceHolidayView");
const attendanceHolidayName = document.getElementById("attendanceHolidayName");
const attendanceRemoveHolidayBtn = document.getElementById("attendanceRemoveHolidayBtn");
const attendanceMarkView = document.getElementById("attendanceMarkView");
const attendanceMarkHolidayBtn = document.getElementById("attendanceMarkHolidayBtn");
const attendanceStudentList = document.getElementById("attendanceStudentList");
const attendanceStatus = document.getElementById("attendanceStatus");

const attendanceFromInput = document.getElementById("attendanceFromInput");
const attendanceToInput = document.getElementById("attendanceToInput");
const attendanceLoadRangeBtn = document.getElementById("attendanceLoadRangeBtn");
const attendanceRangeStatus = document.getElementById("attendanceRangeStatus");
const attendanceSelectModeBtn = document.getElementById("attendanceSelectModeBtn");
const attendanceSelectAllBtn = document.getElementById("attendanceSelectAllBtn");
const attendanceRangeList = document.getElementById("attendanceRangeList");
const attendanceDeleteSelectedBtn = document.getElementById("attendanceDeleteSelectedBtn");
const attendanceExportPdfBtn = document.getElementById("attendanceExportPdfBtn");

const blogTitleInput = document.getElementById("blogTitleInput");
const blogDateInput = document.getElementById("blogDateInput");
const blogBlocksContainer = document.getElementById("blogBlocksContainer");
const blogAddTextBlockBtn = document.getElementById("blogAddTextBlockBtn");
const blogAddImageBlockBtn = document.getElementById("blogAddImageBlockBtn");
const blogButtonsContainer = document.getElementById("blogButtonsContainer");
const blogAddButtonBtn = document.getElementById("blogAddButtonBtn");
const blogAddBtn = document.getElementById("blogAddBtn");
const blogStatus = document.getElementById("blogStatus");
const blogPostList = document.getElementById("blogPostList");
const blogSelectModeBtn = document.getElementById("blogSelectModeBtn");
const blogSelectAllBtn = document.getElementById("blogSelectAllBtn");
const blogDeleteSelectedBtn = document.getElementById("blogDeleteSelectedBtn");

// ---------- Auth state ----------
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginView.style.display = "none";
    adminView.style.display = "none";
    adminAttendanceView.style.display = "none";
    adminBlogView.style.display = "none";
    adminHub.style.display = "block";
    await loadLastUpdatedDisplay();
    await loadMarquee();
    await loadWhatsNew();
    await loadGallery();
    await renderNotices();
    await renderVideos();
    await loadSyllabusSessions();
  } else {
    adminHub.style.display = "none";
    adminView.style.display = "none";
    adminAttendanceView.style.display = "none";
    adminBlogView.style.display = "none";
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

hubAttendanceBtn.addEventListener("click", async () => {
  adminHub.style.display = "none";
  adminAttendanceView.style.display = "block";
  const todayStr = todayISO();
  attendanceDateInput.value = todayStr;
  attendanceFromInput.value = todayStr;
  attendanceToInput.value = todayStr;
  await loadStudents();
  await loadAttendanceForDate(todayStr);
});

attendanceBackBtn.addEventListener("click", () => {
  adminAttendanceView.style.display = "none";
  adminHub.style.display = "block";
});

attendanceLogoutBtn.addEventListener("click", () => signOut(auth));

hubBlogBtn.addEventListener("click", async () => {
  adminHub.style.display = "none";
  adminBlogView.style.display = "block";
  await renderBlogPosts();
});

blogBackBtn.addEventListener("click", () => {
  adminBlogView.style.display = "none";
  adminHub.style.display = "block";
});

blogLogoutBtn.addEventListener("click", () => signOut(auth));

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

const markUpdatedTodayBtn = document.getElementById("markUpdatedTodayBtn");

// ---------- Last updated date: shown on the hub, only updates on button click ----------
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

async function loadLastUpdatedDisplay() {
  try {
    const snap = await getDoc(SITE_DOC);
    if (snap.exists() && snap.data().lastUpdated) {
      lastUpdatedDisplay.textContent = formatReadable(snap.data().lastUpdated);
    }
  } catch (err) {
    saveStatus.textContent = "Could not load current date: " + (err.code || err.message);
    saveStatus.className = "msg error";
    console.error(err);
  }
}

markUpdatedTodayBtn.addEventListener("click", async () => {
  const previousDisplay = lastUpdatedDisplay.textContent;
  let previousStored = null;
  try {
    const snap = await getDoc(SITE_DOC);
    previousStored = snap.exists() ? snap.data().lastUpdated : null;
  } catch (err) {
    // If this read fails, undo just won't be offered below — the main action still proceeds.
  }

  saveStatus.textContent = "Updating...";
  saveStatus.className = "msg";
  const today = todayISO();
  try {
    await setDoc(SITE_DOC, { lastUpdated: today }, { merge: true });
    lastUpdatedDisplay.textContent = formatReadable(today);
    saveStatus.textContent = "Site marked as updated today.";
    saveStatus.className = "msg success";
    showUndoToast("Marked as updated today.", async () => {
      if (previousStored) {
        await setDoc(SITE_DOC, { lastUpdated: previousStored }, { merge: true });
      }
      lastUpdatedDisplay.textContent = previousDisplay;
    });
  } catch (err) {
    saveStatus.textContent = "Could not update: " + (err.code || err.message);
    saveStatus.className = "msg error";
    console.error(err);
  }
});

// ---------- Top marquee text ----------
async function loadMarquee() {
  try {
    const snap = await getDoc(SITE_DOC);
    if (snap.exists() && snap.data().marqueeText) {
      marqueeInput.value = snap.data().marqueeText;
    }
    previousMarqueeText = marqueeInput.value;
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
  const previousValue = previousMarqueeText;
  marqueeSaveBtn.disabled = true;
  marqueeStatus.textContent = "Saving...";
  marqueeStatus.className = "msg";
  try {
    await setDoc(SITE_DOC, { marqueeText: value }, { merge: true });
    previousMarqueeText = value;
    marqueeStatus.textContent = "Marquee updated.";
    marqueeStatus.className = "msg success";
    showUndoToast("Marquee updated.", async () => {
      await setDoc(SITE_DOC, { marqueeText: previousValue }, { merge: true });
      marqueeInput.value = previousValue;
      previousMarqueeText = previousValue;
    });
  } catch (err) {
    marqueeStatus.textContent = "Save failed: " + (err.code || err.message);
    marqueeStatus.className = "msg error";
    console.error(err);
  } finally {
    marqueeSaveBtn.disabled = false;
  }
});

// ---------- Undo toast (6s window) ----------
let undoTimer = null;
let currentUndoHandler = null;

function showUndoToast(message, undoFn) {
  clearTimeout(undoTimer);
  if (currentUndoHandler) {
    undoToastBtn.removeEventListener("click", currentUndoHandler);
  }

  undoToastMsg.textContent = message;
  undoToast.classList.add("show");

  currentUndoHandler = async () => {
    clearTimeout(undoTimer);
    undoToast.classList.remove("show");
    undoToastBtn.removeEventListener("click", currentUndoHandler);
    currentUndoHandler = null;
    await undoFn();
  };
  undoToastBtn.addEventListener("click", currentUndoHandler);

  undoTimer = setTimeout(() => {
    undoToast.classList.remove("show");
    if (currentUndoHandler) {
      undoToastBtn.removeEventListener("click", currentUndoHandler);
      currentUndoHandler = null;
    }
  }, 6000);
}

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
      checkbox._noticeData = docSnap.data();
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
        const previousText = docSnap.data().text || "";
        const updated = prompt("Edit notice:", previousText);
        if (updated === null) return;
        const trimmed = updated.trim();
        if (!trimmed) return;
        try {
          await updateDoc(doc(db, "notices", docSnap.id), { text: trimmed });
          await renderNotices();
          showUndoToast("Notice updated.", async () => {
            await updateDoc(doc(db, "notices", docSnap.id), { text: previousText });
            await renderNotices();
          });
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
        const deletedId = docSnap.id;
        const deletedData = docSnap.data();
        try {
          await deleteDoc(doc(db, "notices", deletedId));
          await renderNotices();
          showUndoToast("Notice deleted.", async () => {
            await setDoc(doc(db, "notices", deletedId), deletedData);
            await renderNotices();
          });
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

// ---------- Shared "Select All / Deselect All" helper for every bulk-select list ----------
function setupSelectAll(listEl, selectAllBtn, selectModeBtn) {
  selectAllBtn.addEventListener("click", () => {
    const checkboxes = listEl.querySelectorAll('input[type="checkbox"]');
    const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every((cb) => cb.checked);
    checkboxes.forEach((cb) => {
      cb.checked = !allChecked;
      cb.dispatchEvent(new Event("change"));
    });
    selectAllBtn.textContent = allChecked ? "Select All" : "Deselect All";
  });

  // Show/hide Select All alongside bulk-mode, and reset its label each time
  selectModeBtn.addEventListener("click", () => {
    const enabling = listEl.classList.contains("bulk-mode");
    selectAllBtn.style.display = enabling ? "inline-block" : "none";
    selectAllBtn.textContent = "Select All";
  });
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
setupSelectAll(noticeList, noticeSelectAllBtn, noticeSelectModeBtn);


noticeDeleteSelectedBtn.addEventListener("click", async () => {
  const checked = noticeList.querySelectorAll('input[type="checkbox"]:checked');
  if (checked.length === 0) return;
  if (!confirm("Delete " + checked.length + " selected notice(s)?")) return;

  noticeDeleteSelectedBtn.disabled = true;
  noticeStatus.textContent = "Deleting...";
  noticeStatus.className = "msg";
  try {
    const deleted = [];
    for (const cb of checked) {
      deleted.push({ id: cb.dataset.id, data: cb._noticeData });
      await deleteDoc(doc(db, "notices", cb.dataset.id));
    }
    noticeStatus.textContent = "Selected notices deleted.";
    noticeStatus.className = "msg success";
    await renderNotices();
    showUndoToast(deleted.length + " notice(s) deleted.", async () => {
      for (const item of deleted) {
        await setDoc(doc(db, "notices", item.id), item.data);
      }
      await renderNotices();
    });
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
    const newDoc = await addDoc(NOTICES_COL, { text: value, createdAt: serverTimestamp() });
    noticeInput.value = "";
    noticeStatus.textContent = "Notice added.";
    noticeStatus.className = "msg success";
    await renderNotices();
    showUndoToast("Notice added.", async () => {
      await deleteDoc(doc(db, "notices", newDoc.id));
      await renderNotices();
    });
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

async function loadWhatsNew() {
  try {
    const snap = await getDoc(SITE_DOC);
    const data = snap.exists() ? snap.data() : {};
    wnTextInput.value = data.whatsNewText || WN_DEFAULTS.text;
    wnImageUrlInput.value = data.whatsNewImage || WN_DEFAULTS.image;
    wnBtnTextInput.value = data.whatsNewBtnText || WN_DEFAULTS.btnText;
    wnBtnUrlInput.value = data.whatsNewBtnUrl || WN_DEFAULTS.btnUrl;
    previousWnState = {
      text: wnTextInput.value,
      image: wnImageUrlInput.value,
      btnText: wnBtnTextInput.value,
      btnUrl: wnBtnUrlInput.value,
    };
  } catch (err) {
    wnStatus.textContent = "Could not load current content: " + (err.code || err.message);
    wnStatus.className = "msg error";
    console.error(err);
  }
}


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

  const previousState = previousWnState;
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
    previousWnState = { text, image, btnText, btnUrl };
    wnStatus.textContent = "What's New section updated.";
    wnStatus.className = "msg success";
    showUndoToast("What's New updated.", async () => {
      await setDoc(
        SITE_DOC,
        {
          whatsNewText: previousState.text,
          whatsNewImage: previousState.image,
          whatsNewBtnText: previousState.btnText,
          whatsNewBtnUrl: previousState.btnUrl,
        },
        { merge: true }
      );
      wnTextInput.value = previousState.text;
      wnImageUrlInput.value = previousState.image;
      wnBtnTextInput.value = previousState.btnText;
      wnBtnUrlInput.value = previousState.btnUrl;
      previousWnState = previousState;
    });
  } catch (err) {
    wnStatus.textContent = "Save failed: " + (err.code || err.message);
    wnStatus.className = "msg error";
    console.error(err);
  } finally {
    wnSaveBtn.disabled = false;
  }
});

// ---------- Gallery images (8 URLs) ----------
const GALLERY_DEFAULTS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => "/images/image" + n + ".jpg");

async function loadGallery() {
  try {
    const snap = await getDoc(SITE_DOC);
    const stored = snap.exists() && Array.isArray(snap.data().galleryImages) ? snap.data().galleryImages : [];
    galleryInputs.forEach((input, i) => {
      input.value = stored[i] || GALLERY_DEFAULTS[i];
    });
    previousGalleryUrls = galleryInputs.map((input) => input.value);
  } catch (err) {
    galleryStatus.textContent = "Could not load gallery: " + (err.code || err.message);
    galleryStatus.className = "msg error";
    console.error(err);
  }
}

gallerySaveBtn.addEventListener("click", async () => {
  const values = galleryInputs.map((input) => input.value.trim());
  if (values.some((v) => !v)) {
    galleryStatus.textContent = "All 8 photo URLs need a value.";
    galleryStatus.className = "msg error";
    return;
  }
  const previousValues = previousGalleryUrls;
  gallerySaveBtn.disabled = true;
  galleryStatus.textContent = "Saving...";
  galleryStatus.className = "msg";
  try {
    await setDoc(SITE_DOC, { galleryImages: values }, { merge: true });
    previousGalleryUrls = values;
    galleryStatus.textContent = "Gallery updated.";
    galleryStatus.className = "msg success";
    showUndoToast("Gallery updated.", async () => {
      await setDoc(SITE_DOC, { galleryImages: previousValues }, { merge: true });
      galleryInputs.forEach((input, i) => (input.value = previousValues[i]));
      previousGalleryUrls = previousValues;
    });
  } catch (err) {
    galleryStatus.textContent = "Save failed: " + (err.code || err.message);
    galleryStatus.className = "msg error";
    console.error(err);
  } finally {
    gallerySaveBtn.disabled = false;
  }
});

// ---------- Function Videos (add / edit / delete) ----------
const VIDEOS_COL = collection(db, "videos");

function updateVideoDeleteSelectedVisibility() {
  const anyChecked = videoAdminList.querySelector('input[type="checkbox"]:checked');
  videoDeleteSelectedBtn.style.display = anyChecked ? "block" : "none";
}

videoSelectModeBtn.addEventListener("click", () => {
  const enabling = !videoAdminList.classList.contains("bulk-mode");
  videoAdminList.classList.toggle("bulk-mode", enabling);
  videoSelectModeBtn.textContent = enabling ? "Cancel" : "Select";
  if (!enabling) {
    videoAdminList.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    videoDeleteSelectedBtn.style.display = "none";
  }
});
setupSelectAll(videoAdminList, videoSelectAllBtn, videoSelectModeBtn);


async function renderVideos() {
  videoAdminList.innerHTML = "";
  videoDeleteSelectedBtn.style.display = "none";
  try {
    const q = query(VIDEOS_COL, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = docSnap.id;
      checkbox._videoData = data;
      checkbox.addEventListener("change", updateVideoDeleteSelectedVisibility);
      li.appendChild(checkbox);

      const span = document.createElement("span");
      span.textContent = data.title || "";
      li.appendChild(span);

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", async () => {
        const previousTitle = data.title || "";
        const previousUrl = data.url || "";
        const updatedTitle = prompt("Edit title:", previousTitle);
        if (updatedTitle === null) return;
        const updatedUrl = prompt("Edit URL:", previousUrl);
        if (updatedUrl === null) return;
        const title = updatedTitle.trim();
        const url = updatedUrl.trim();
        if (!title || !url) return;
        try {
          await updateDoc(doc(db, "videos", docSnap.id), { title, url });
          await renderVideos();
          showUndoToast("Video updated.", async () => {
            await updateDoc(doc(db, "videos", docSnap.id), { title: previousTitle, url: previousUrl });
            await renderVideos();
          });
        } catch (err) {
          videoStatus.textContent = "Edit failed: " + (err.code || err.message);
          videoStatus.className = "msg error";
          console.error(err);
        }
      });
      li.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        if (!confirm("Delete this video?")) return;
        const deletedId = docSnap.id;
        try {
          await deleteDoc(doc(db, "videos", deletedId));
          await renderVideos();
          showUndoToast("Video deleted.", async () => {
            await setDoc(doc(db, "videos", deletedId), data);
            await renderVideos();
          });
        } catch (err) {
          videoStatus.textContent = "Delete failed: " + (err.code || err.message);
          videoStatus.className = "msg error";
          console.error(err);
        }
      });
      li.appendChild(deleteBtn);

      videoAdminList.appendChild(li);
    });
  } catch (err) {
    videoStatus.textContent = "Could not load videos: " + (err.code || err.message);
    videoStatus.className = "msg error";
    console.error(err);
  }
}

videoDeleteSelectedBtn.addEventListener("click", async () => {
  const checked = videoAdminList.querySelectorAll('input[type="checkbox"]:checked');
  if (checked.length === 0) return;
  if (!confirm("Delete " + checked.length + " selected video(s)?")) return;

  videoDeleteSelectedBtn.disabled = true;
  videoStatus.textContent = "Deleting...";
  videoStatus.className = "msg";
  try {
    const deleted = [];
    for (const cb of checked) {
      deleted.push({ id: cb.dataset.id, data: cb._videoData });
      await deleteDoc(doc(db, "videos", cb.dataset.id));
    }
    videoStatus.textContent = "Selected videos deleted.";
    videoStatus.className = "msg success";
    await renderVideos();
    showUndoToast(deleted.length + " video(s) deleted.", async () => {
      for (const item of deleted) {
        await setDoc(doc(db, "videos", item.id), item.data);
      }
      await renderVideos();
    });
  } catch (err) {
    videoStatus.textContent = "Delete failed: " + (err.code || err.message);
    videoStatus.className = "msg error";
    console.error(err);
  } finally {
    videoDeleteSelectedBtn.disabled = false;
  }
});

videoAddBtn.addEventListener("click", async () => {
  const title = videoTitleInput.value.trim();
  const url = videoUrlInput.value.trim();
  if (!title || !url) {
    videoStatus.textContent = "Both title and URL are needed.";
    videoStatus.className = "msg error";
    return;
  }
  videoAddBtn.disabled = true;
  videoStatus.textContent = "Adding...";
  videoStatus.className = "msg";
  try {
    const newDoc = await addDoc(VIDEOS_COL, { title, url, createdAt: serverTimestamp() });
    videoTitleInput.value = "";
    videoUrlInput.value = "";
    videoStatus.textContent = "Video added.";
    videoStatus.className = "msg success";
    await renderVideos();
    showUndoToast("Video added.", async () => {
      await deleteDoc(doc(db, "videos", newDoc.id));
      await renderVideos();
    });
  } catch (err) {
    videoStatus.textContent = "Could not add video: " + (err.code || err.message);
    videoStatus.className = "msg error";
    console.error(err);
  } finally {
    videoAddBtn.disabled = false;
  }
});

// ---------- Syllabus Sessions ----------
// Only sessions saved here are admin-managed. Older static sessions
// (2020-21 through 2023-24) stay untouched in the page's own HTML.
const SYLLABUS_COL = collection(db, "syllabusSessions");

const DEFAULT_SYLLABUS_SESSION = {
  id: "2025-26",
  order: 2025,
  rows: [
    {
      exam: "Test - 1",
      syllabus: "https://drive.google.com/file/d/1x4jFCTrxftFXBarUP9tbFCjtMXPR-Qn2/view?usp=drivesdk",
      datesheet: "Part A - 3 May 2025 (Saturday), Part B - 13 May 2025 (Tuesday)",
      result: "https://drive.google.com/uc?export=download&id=1uxiqSSvlqzyRat2JHAMJBsNFsWbHshX0",
    },
    { exam: "Test - 2", syllabus: "NA", datesheet: "NA", result: "NA" },
    {
      exam: "Term - 1",
      syllabus: "https://drive.google.com/uc?export=download&id=1UDdI_iiWPK-rjmnpoQ5TRZpnzqJJlPpB",
      datesheet: "27 July 2025 (Sunday)",
      result: "https://drive.google.com/uc?export=download&id=1VMijTLYNzxrlDvZZfcyS5RsRwyBuCLZm",
    },
    { exam: "Term - 2", syllabus: "NA", datesheet: "NA", result: "NA" },
  ],
};

let syllabusSessionsCache = [];
let selectedSyllabusId = null;

function populateSyllabusSelect() {
  syllabusSessionSelect.innerHTML = "";
  syllabusSessionsCache.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.id;
    syllabusSessionSelect.appendChild(opt);
  });
}

function getSelectedSession() {
  return syllabusSessionsCache.find((s) => s.id === selectedSyllabusId);
}

async function saveSyllabusSession(session) {
  await setDoc(doc(db, "syllabusSessions", session.id), { order: session.order, rows: session.rows });
}

function renderSyllabusRows() {
  syllabusRowList.innerHTML = "";
  const session = getSelectedSession();
  if (!session) return;

  session.rows.forEach((row, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent =
      row.exam + " — " + [row.syllabus, row.datesheet, row.result].filter(Boolean).join(" | ");
    li.appendChild(span);

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editSyllabusRow(index));
    li.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteSyllabusRow(index));
    li.appendChild(deleteBtn);

    syllabusRowList.appendChild(li);
  });
}

async function loadSyllabusSessions() {
  try {
    const q = query(SYLLABUS_COL, orderBy("order", "desc"));
    const snap = await getDocs(q);
    syllabusSessionsCache = [];
    snap.forEach((d) => {
      const data = d.data();
      syllabusSessionsCache.push({
        id: d.id,
        order: data.order,
        rows: Array.isArray(data.rows) ? data.rows : [],
      });
    });
    if (syllabusSessionsCache.length === 0) {
      syllabusSessionsCache.push({
        ...DEFAULT_SYLLABUS_SESSION,
        rows: DEFAULT_SYLLABUS_SESSION.rows.slice(),
      });
    }
    populateSyllabusSelect();
    selectedSyllabusId = syllabusSessionsCache[0].id;
    syllabusSessionSelect.value = selectedSyllabusId;
    renderSyllabusRows();
  } catch (err) {
    syllabusStatus.textContent = "Could not load sessions: " + (err.code || err.message);
    syllabusStatus.className = "msg error";
    console.error(err);
  }
}

async function editSyllabusRow(index) {
  const session = getSelectedSession();
  const row = session.rows[index];
  const previousRow = { ...row };

  const exam = prompt("Exam name:", row.exam);
  if (exam === null) return;
  const syllabus = prompt("Syllabus (paste a link, or type text/NA):", row.syllabus);
  if (syllabus === null) return;
  const datesheet = prompt("Datesheet (paste a link, or type text/date):", row.datesheet);
  if (datesheet === null) return;
  const result = prompt("Result (paste a link, or type text/NA):", row.result);
  if (result === null) return;

  session.rows[index] = {
    exam: exam.trim(),
    syllabus: syllabus.trim(),
    datesheet: datesheet.trim(),
    result: result.trim(),
  };
  syllabusStatus.textContent = "Saving...";
  syllabusStatus.className = "msg";
  try {
    await saveSyllabusSession(session);
    renderSyllabusRows();
    syllabusStatus.textContent = "Row updated.";
    syllabusStatus.className = "msg success";
    showUndoToast("Row updated.", async () => {
      session.rows[index] = previousRow;
      await saveSyllabusSession(session);
      renderSyllabusRows();
    });
  } catch (err) {
    session.rows[index] = previousRow;
    syllabusStatus.textContent = "Save failed: " + (err.code || err.message);
    syllabusStatus.className = "msg error";
    console.error(err);
  }
}

async function deleteSyllabusRow(index) {
  if (!confirm("Delete this row?")) return;
  const session = getSelectedSession();
  const removedRow = session.rows[index];
  session.rows.splice(index, 1);
  syllabusStatus.textContent = "Deleting...";
  syllabusStatus.className = "msg";
  try {
    await saveSyllabusSession(session);
    renderSyllabusRows();
    syllabusStatus.textContent = "Row deleted.";
    syllabusStatus.className = "msg success";
    showUndoToast("Row deleted.", async () => {
      session.rows.splice(index, 0, removedRow);
      await saveSyllabusSession(session);
      renderSyllabusRows();
    });
  } catch (err) {
    session.rows.splice(index, 0, removedRow);
    syllabusStatus.textContent = "Delete failed: " + (err.code || err.message);
    syllabusStatus.className = "msg error";
    console.error(err);
  }
}

syllabusAddRowBtn.addEventListener("click", async () => {
  const session = getSelectedSession();
  if (!session) return;
  const exam = prompt("Exam name:", "");
  if (exam === null || !exam.trim()) return;
  const syllabus = prompt("Syllabus (paste a link, or type text/NA):", "NA") || "NA";
  const datesheet = prompt("Datesheet (paste a link, or type text/date):", "NA") || "NA";
  const result = prompt("Result (paste a link, or type text/NA):", "NA") || "NA";

  session.rows.push({
    exam: exam.trim(),
    syllabus: syllabus.trim(),
    datesheet: datesheet.trim(),
    result: result.trim(),
  });
  syllabusStatus.textContent = "Saving...";
  syllabusStatus.className = "msg";
  try {
    await saveSyllabusSession(session);
    renderSyllabusRows();
    syllabusStatus.textContent = "Row added.";
    syllabusStatus.className = "msg success";
    showUndoToast("Row added.", async () => {
      session.rows.pop();
      await saveSyllabusSession(session);
      renderSyllabusRows();
    });
  } catch (err) {
    session.rows.pop();
    syllabusStatus.textContent = "Could not add row: " + (err.code || err.message);
    syllabusStatus.className = "msg error";
    console.error(err);
  }
});

syllabusSessionSelect.addEventListener("change", () => {
  selectedSyllabusId = syllabusSessionSelect.value;
  renderSyllabusRows();
});

syllabusNewSessionBtn.addEventListener("click", async () => {
  const label = prompt("New session label (e.g. 2026-27):", "");
  if (!label || !label.trim()) return;
  const trimmed = label.trim();
  if (syllabusSessionsCache.some((s) => s.id === trimmed)) {
    syllabusStatus.textContent = "That session already exists.";
    syllabusStatus.className = "msg error";
    return;
  }
  const orderMatch = trimmed.match(/\d{4}/);
  const order = orderMatch ? parseInt(orderMatch[0], 10) : Date.now();
  const newSession = { id: trimmed, order, rows: [] };
  syllabusStatus.textContent = "Creating...";
  syllabusStatus.className = "msg";
  try {
    await saveSyllabusSession(newSession);
    syllabusSessionsCache.push(newSession);
    syllabusSessionsCache.sort((a, b) => b.order - a.order);
    populateSyllabusSelect();
    selectedSyllabusId = trimmed;
    syllabusSessionSelect.value = trimmed;
    renderSyllabusRows();
    syllabusStatus.textContent = "Session created.";
    syllabusStatus.className = "msg success";
    showUndoToast('Session "' + trimmed + '" created.', async () => {
      await deleteDoc(doc(db, "syllabusSessions", trimmed));
      syllabusSessionsCache = syllabusSessionsCache.filter((s) => s.id !== trimmed);
      if (syllabusSessionsCache.length === 0) {
        syllabusSessionsCache.push({
          ...DEFAULT_SYLLABUS_SESSION,
          rows: DEFAULT_SYLLABUS_SESSION.rows.slice(),
        });
      }
      populateSyllabusSelect();
      selectedSyllabusId = syllabusSessionsCache[0].id;
      syllabusSessionSelect.value = selectedSyllabusId;
      renderSyllabusRows();
    });
  } catch (err) {
    syllabusStatus.textContent = "Could not create session: " + (err.code || err.message);
    syllabusStatus.className = "msg error";
    console.error(err);
  }
});

syllabusDeleteSessionBtn.addEventListener("click", async () => {
  const session = getSelectedSession();
  if (!session) return;
  if (!confirm('Delete session "' + session.id + '"? This removes it from the live site.')) return;
  const deletedSession = { id: session.id, order: session.order, rows: session.rows.slice() };
  syllabusStatus.textContent = "Deleting...";
  syllabusStatus.className = "msg";
  try {
    await deleteDoc(doc(db, "syllabusSessions", session.id));
    syllabusSessionsCache = syllabusSessionsCache.filter((s) => s.id !== session.id);
    if (syllabusSessionsCache.length === 0) {
      syllabusSessionsCache.push({
        ...DEFAULT_SYLLABUS_SESSION,
        rows: DEFAULT_SYLLABUS_SESSION.rows.slice(),
      });
    }
    populateSyllabusSelect();
    selectedSyllabusId = syllabusSessionsCache[0].id;
    syllabusSessionSelect.value = selectedSyllabusId;
    renderSyllabusRows();
    syllabusStatus.textContent = "Session deleted.";
    syllabusStatus.className = "msg success";
    showUndoToast('Session "' + deletedSession.id + '" deleted.', async () => {
      await saveSyllabusSession(deletedSession);
      await loadSyllabusSessions();
    });
  } catch (err) {
    syllabusStatus.textContent = "Delete failed: " + (err.code || err.message);
    syllabusStatus.className = "msg error";
    console.error(err);
  }
});

// ---------- Students (add / edit / delete) ----------
const STUDENTS_COL = collection(db, "students");

function updateStudentDeleteSelectedVisibility() {
  const anyChecked = studentList.querySelector('input[type="checkbox"]:checked');
  studentDeleteSelectedBtn.style.display = anyChecked ? "block" : "none";
}

studentSelectModeBtn.addEventListener("click", () => {
  const enabling = !studentList.classList.contains("bulk-mode");
  studentList.classList.toggle("bulk-mode", enabling);
  studentSelectModeBtn.textContent = enabling ? "Cancel" : "Select";
  if (!enabling) {
    studentList.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    studentDeleteSelectedBtn.style.display = "none";
  }
});
setupSelectAll(studentList, studentSelectAllBtn, studentSelectModeBtn);


async function renderStudents() {
  studentList.innerHTML = "";
  studentDeleteSelectedBtn.style.display = "none";
  try {
    const q = query(STUDENTS_COL, orderBy("name", "asc"));
    const snap = await getDocs(q);
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = docSnap.id;
      checkbox._studentData = data;
      checkbox.addEventListener("change", updateStudentDeleteSelectedVisibility);
      li.appendChild(checkbox);

      const span = document.createElement("span");
      span.textContent = data.name + (data.rollNumber ? " (Roll " + data.rollNumber + ")" : "");
      li.appendChild(span);

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", async () => {
        const previousName = data.name || "";
        const previousRoll = data.rollNumber || "";
        const updatedName = prompt("Student name:", previousName);
        if (updatedName === null) return;
        const updatedRoll = prompt("Roll number (optional):", previousRoll);
        if (updatedRoll === null) return;
        const name = updatedName.trim();
        if (!name) return;
        const rollNumber = updatedRoll.trim();
        try {
          await updateDoc(doc(db, "students", docSnap.id), { name, rollNumber });
          await renderStudents();
          showUndoToast("Student updated.", async () => {
            await updateDoc(doc(db, "students", docSnap.id), {
              name: previousName,
              rollNumber: previousRoll,
            });
            await renderStudents();
          });
        } catch (err) {
          studentStatus.textContent = "Edit failed: " + (err.code || err.message);
          studentStatus.className = "msg error";
          console.error(err);
        }
      });
      li.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        if (!confirm("Delete this student?")) return;
        const deletedId = docSnap.id;
        try {
          await deleteDoc(doc(db, "students", deletedId));
          await renderStudents();
          showUndoToast("Student deleted.", async () => {
            await setDoc(doc(db, "students", deletedId), data);
            await renderStudents();
          });
        } catch (err) {
          studentStatus.textContent = "Delete failed: " + (err.code || err.message);
          studentStatus.className = "msg error";
          console.error(err);
        }
      });
      li.appendChild(deleteBtn);

      studentList.appendChild(li);
    });
  } catch (err) {
    studentStatus.textContent = "Could not load students: " + (err.code || err.message);
    studentStatus.className = "msg error";
    console.error(err);
  }
  await refreshAttendanceStudentsIfOpen();
}

async function refreshAttendanceStudentsIfOpen() {
  if (!currentAttendanceDate) return;
  try {
    const studentsSnap = await getDocs(query(STUDENTS_COL, orderBy("name", "asc")));
    studentsCache = [];
    studentsSnap.forEach((d) => studentsCache.push({ id: d.id, ...d.data() }));
    if (!currentAttendanceDoc.holiday) renderAttendanceStudentList();
  } catch (err) {
    // Silent — the Mark Attendance list just stays as it was.
  }
}

async function loadStudents() {
  await renderStudents();
}

studentDeleteSelectedBtn.addEventListener("click", async () => {
  const checked = studentList.querySelectorAll('input[type="checkbox"]:checked');
  if (checked.length === 0) return;
  if (!confirm("Delete " + checked.length + " selected student(s)?")) return;

  studentDeleteSelectedBtn.disabled = true;
  studentStatus.textContent = "Deleting...";
  studentStatus.className = "msg";
  try {
    const deleted = [];
    for (const cb of checked) {
      deleted.push({ id: cb.dataset.id, data: cb._studentData });
      await deleteDoc(doc(db, "students", cb.dataset.id));
    }
    studentStatus.textContent = "Selected students deleted.";
    studentStatus.className = "msg success";
    await renderStudents();
    showUndoToast(deleted.length + " student(s) deleted.", async () => {
      for (const item of deleted) {
        await setDoc(doc(db, "students", item.id), item.data);
      }
      await renderStudents();
    });
  } catch (err) {
    studentStatus.textContent = "Delete failed: " + (err.code || err.message);
    studentStatus.className = "msg error";
    console.error(err);
  } finally {
    studentDeleteSelectedBtn.disabled = false;
  }
});

studentAddBtn.addEventListener("click", async () => {
  const name = studentNameInput.value.trim();
  const rollNumber = studentRollInput.value.trim();
  if (!name) {
    studentStatus.textContent = "Student name is required.";
    studentStatus.className = "msg error";
    return;
  }
  studentAddBtn.disabled = true;
  studentStatus.textContent = "Adding...";
  studentStatus.className = "msg";
  try {
    const newDoc = await addDoc(STUDENTS_COL, { name, rollNumber, createdAt: serverTimestamp() });
    studentNameInput.value = "";
    studentRollInput.value = "";

    // Backfill "Absent" into every existing attendance date, so this student's
    // history shows Absent rather than a blank for days before they joined.
    const attendanceSnap = await getDocs(collection(db, "attendance"));
    const backfillPromises = [];
    attendanceSnap.forEach((d) => {
      const data = d.data();
      if (!data.holiday) {
        backfillPromises.push(
          setDoc(doc(db, "attendance", d.id), { records: { [newDoc.id]: "absent" } }, { merge: true })
        );
      }
    });
    await Promise.all(backfillPromises);

    studentStatus.textContent = "Student added.";
    studentStatus.className = "msg success";
    await renderStudents();
    showUndoToast("Student added.", async () => {
      await deleteDoc(doc(db, "students", newDoc.id));
      await renderStudents();
    });
  } catch (err) {
    studentStatus.textContent = "Could not add student: " + (err.code || err.message);
    studentStatus.className = "msg error";
    console.error(err);
  } finally {
    studentAddBtn.disabled = false;
  }
});

[studentNameInput, studentRollInput].forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      studentAddBtn.click();
    }
  });
});

// ---------- Mark Attendance ----------
const ATTENDANCE_COL = collection(db, "attendance");
let currentAttendanceDate = null;
let currentAttendanceDoc = { holiday: null, records: {} };
let studentsCache = [];

async function loadAttendanceForDate(dateStr) {
  currentAttendanceDate = dateStr;
  attendanceStatus.textContent = "Loading...";
  attendanceStatus.className = "msg";
  try {
    const snap = await getDoc(doc(db, "attendance", dateStr));
    currentAttendanceDoc = snap.exists()
      ? { holiday: snap.data().holiday || null, records: snap.data().records || {} }
      : { holiday: null, records: {} };

    const studentsSnap = await getDocs(query(STUDENTS_COL, orderBy("name", "asc")));
    studentsCache = [];
    studentsSnap.forEach((d) => studentsCache.push({ id: d.id, ...d.data() }));

    renderAttendanceView();
    attendanceStatus.textContent = "";
  } catch (err) {
    attendanceStatus.textContent = "Could not load attendance: " + (err.code || err.message);
    attendanceStatus.className = "msg error";
    console.error(err);
  }
}

function renderAttendanceView() {
  if (currentAttendanceDoc.holiday) {
    attendanceHolidayView.style.display = "block";
    attendanceMarkView.style.display = "none";
    attendanceHolidayName.textContent = currentAttendanceDoc.holiday;
  } else {
    attendanceHolidayView.style.display = "none";
    attendanceMarkView.style.display = "block";
    renderAttendanceStudentList();
  }
}

function renderAttendanceStudentList() {
  attendanceStudentList.innerHTML = "";
  studentsCache.forEach((student) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = student.name + (student.rollNumber ? " (Roll " + student.rollNumber + ")" : "");
    li.appendChild(span);

    const status = currentAttendanceDoc.records[student.id] || "absent";

    const presentBtn = document.createElement("button");
    presentBtn.type = "button";
    presentBtn.textContent = "Present";
    presentBtn.style.background = status === "present" ? "#1e8f2e" : "#ccc";
    presentBtn.style.color = status === "present" ? "#fff" : "#555";
    presentBtn.addEventListener("click", () => setAttendanceStatus(student.id, "present"));
    li.appendChild(presentBtn);

    const absentBtn = document.createElement("button");
    absentBtn.type = "button";
    absentBtn.textContent = "Absent";
    absentBtn.style.background = status === "absent" ? "#c0392b" : "#ccc";
    absentBtn.style.color = status === "absent" ? "#fff" : "#555";
    absentBtn.addEventListener("click", () => setAttendanceStatus(student.id, "absent"));
    li.appendChild(absentBtn);

    attendanceStudentList.appendChild(li);
  });
}

async function setAttendanceStatus(studentId, status) {
  const previousStatus = currentAttendanceDoc.records[studentId]; // undefined if unset
  currentAttendanceDoc.records[studentId] = status;
  renderAttendanceStudentList();
  try {
    await setDoc(
      doc(db, "attendance", currentAttendanceDate),
      { records: { [studentId]: status } },
      { merge: true }
    );
    showUndoToast("Attendance updated.", async () => {
      if (previousStatus === undefined) {
        delete currentAttendanceDoc.records[studentId];
        await setDoc(
          doc(db, "attendance", currentAttendanceDate),
          { records: { [studentId]: deleteField() } },
          { merge: true }
        );
      } else {
        currentAttendanceDoc.records[studentId] = previousStatus;
        await setDoc(
          doc(db, "attendance", currentAttendanceDate),
          { records: { [studentId]: previousStatus } },
          { merge: true }
        );
      }
      renderAttendanceStudentList();
    });
  } catch (err) {
    currentAttendanceDoc.records[studentId] = previousStatus;
    renderAttendanceStudentList();
    attendanceStatus.textContent = "Could not save: " + (err.code || err.message);
    attendanceStatus.className = "msg error";
    console.error(err);
  }
}

attendanceDateInput.addEventListener("change", () => {
  if (attendanceDateInput.value) loadAttendanceForDate(attendanceDateInput.value);
});

attendanceMarkHolidayBtn.addEventListener("click", async () => {
  const name = prompt("Holiday name:", "");
  if (!name || !name.trim()) return;
  const trimmed = name.trim();
  try {
    await setDoc(doc(db, "attendance", currentAttendanceDate), { holiday: trimmed }, { merge: true });
    currentAttendanceDoc.holiday = trimmed;
    renderAttendanceView();
    showUndoToast('Marked as holiday: "' + trimmed + '".', async () => {
      await setDoc(
        doc(db, "attendance", currentAttendanceDate),
        { holiday: deleteField() },
        { merge: true }
      );
      currentAttendanceDoc.holiday = null;
      renderAttendanceView();
    });
  } catch (err) {
    attendanceStatus.textContent = "Could not mark holiday: " + (err.code || err.message);
    attendanceStatus.className = "msg error";
    console.error(err);
  }
});

attendanceRemoveHolidayBtn.addEventListener("click", async () => {
  const previousName = currentAttendanceDoc.holiday;
  try {
    await setDoc(doc(db, "attendance", currentAttendanceDate), { holiday: deleteField() }, { merge: true });
    currentAttendanceDoc.holiday = null;
    renderAttendanceView();
    showUndoToast("Holiday removed.", async () => {
      await setDoc(
        doc(db, "attendance", currentAttendanceDate),
        { holiday: previousName },
        { merge: true }
      );
      currentAttendanceDoc.holiday = previousName;
      renderAttendanceView();
    });
  } catch (err) {
    attendanceStatus.textContent = "Could not remove holiday: " + (err.code || err.message);
    attendanceStatus.className = "msg error";
    console.error(err);
  }
});

// ---------- Clear Attendance Records (date range, bulk delete) ----------
function updateAttendanceDeleteSelectedVisibility() {
  const anyChecked = attendanceRangeList.querySelector('input[type="checkbox"]:checked');
  attendanceDeleteSelectedBtn.style.display = anyChecked ? "block" : "none";
}

attendanceSelectModeBtn.addEventListener("click", () => {
  const enabling = !attendanceRangeList.classList.contains("bulk-mode");
  attendanceRangeList.classList.toggle("bulk-mode", enabling);
  attendanceSelectModeBtn.textContent = enabling ? "Cancel" : "Select";
  if (!enabling) {
    attendanceRangeList.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    attendanceDeleteSelectedBtn.style.display = "none";
  }
});
setupSelectAll(attendanceRangeList, attendanceSelectAllBtn, attendanceSelectModeBtn);


function summarizeAttendanceDoc(data) {
  if (data.holiday) return "Holiday: " + data.holiday;
  const records = data.records || {};
  const values = Object.values(records);
  if (values.length === 0) return "No records";
  const present = values.filter((v) => v === "present").length;
  const absent = values.filter((v) => v === "absent").length;
  return present + " present, " + absent + " absent";
}

async function renderAttendanceRange(fromDate, toDate) {
  attendanceRangeList.innerHTML = "";
  attendanceDeleteSelectedBtn.style.display = "none";
  try {
    const q = query(
      ATTENDANCE_COL,
      where(documentId(), ">=", fromDate),
      where(documentId(), "<=", toDate)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      attendanceRangeStatus.textContent = "No attendance records found in that range.";
      attendanceRangeStatus.className = "msg";
      return;
    }
    attendanceRangeStatus.textContent = "";

    const docs = [];
    snap.forEach((d) => docs.push({ id: d.id, data: d.data() }));
    docs.sort((a, b) => a.id.localeCompare(b.id));

    docs.forEach(({ id, data }) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = id;
      checkbox._attendanceData = data;
      checkbox.addEventListener("change", updateAttendanceDeleteSelectedVisibility);
      li.appendChild(checkbox);

      const span = document.createElement("span");
      span.textContent = id + " — " + summarizeAttendanceDoc(data);
      li.appendChild(span);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        if (!confirm("Delete attendance for " + id + "?")) return;
        try {
          await deleteDoc(doc(db, "attendance", id));
          await renderAttendanceRange(fromDate, toDate);
          showUndoToast("Attendance for " + id + " deleted.", async () => {
            await setDoc(doc(db, "attendance", id), data);
            await renderAttendanceRange(fromDate, toDate);
          });
        } catch (err) {
          attendanceRangeStatus.textContent = "Delete failed: " + (err.code || err.message);
          attendanceRangeStatus.className = "msg error";
          console.error(err);
        }
      });
      li.appendChild(deleteBtn);

      attendanceRangeList.appendChild(li);
    });
  } catch (err) {
    attendanceRangeStatus.textContent = "Could not load records: " + (err.code || err.message);
    attendanceRangeStatus.className = "msg error";
    console.error(err);
  }
}

attendanceLoadRangeBtn.addEventListener("click", () => {
  const from = attendanceFromInput.value;
  const to = attendanceToInput.value;
  if (!from || !to) {
    attendanceRangeStatus.textContent = "Pick both a From and To date.";
    attendanceRangeStatus.className = "msg error";
    return;
  }
  if (from > to) {
    attendanceRangeStatus.textContent = "From date must be before To date.";
    attendanceRangeStatus.className = "msg error";
    return;
  }
  renderAttendanceRange(from, to);
});

attendanceDeleteSelectedBtn.addEventListener("click", async () => {
  const checked = attendanceRangeList.querySelectorAll('input[type="checkbox"]:checked');
  if (checked.length === 0) return;
  if (!confirm("Delete " + checked.length + " selected date(s) of attendance?")) return;

  const from = attendanceFromInput.value;
  const to = attendanceToInput.value;
  attendanceDeleteSelectedBtn.disabled = true;
  attendanceRangeStatus.textContent = "Deleting...";
  attendanceRangeStatus.className = "msg";
  try {
    const deleted = [];
    for (const cb of checked) {
      deleted.push({ id: cb.dataset.id, data: cb._attendanceData });
      await deleteDoc(doc(db, "attendance", cb.dataset.id));
    }
    attendanceRangeStatus.textContent = "Selected records deleted.";
    attendanceRangeStatus.className = "msg success";
    await renderAttendanceRange(from, to);
    showUndoToast(deleted.length + " date(s) of attendance deleted.", async () => {
      for (const item of deleted) {
        await setDoc(doc(db, "attendance", item.id), item.data);
      }
      await renderAttendanceRange(from, to);
    });
  } catch (err) {
    attendanceRangeStatus.textContent = "Delete failed: " + (err.code || err.message);
    attendanceRangeStatus.className = "msg error";
    console.error(err);
  } finally {
    attendanceDeleteSelectedBtn.disabled = false;
  }
});


// ---------- Export Attendance PDF (selected dates from Clear Attendance Records) ----------
function pad2(n) {
  return String(n).padStart(2, "0");
}
function formatDMY(isoDate) {
  const [y, m, d] = isoDate.split("-");
  return `${d}-${m}-${y}`;
}

attendanceExportPdfBtn.addEventListener("click", async () => {
  const checked = attendanceRangeList.querySelectorAll('input[type="checkbox"]:checked');
  if (checked.length === 0) {
    attendanceRangeStatus.textContent = "Select at least one date first (tap Select, then check dates).";
    attendanceRangeStatus.className = "msg error";
    return;
  }

  attendanceRangeStatus.textContent = "Generating PDF...";
  attendanceRangeStatus.className = "msg";

  try {
    const dates = Array.from(checked)
      .map((cb) => ({ id: cb.dataset.id, data: cb._attendanceData }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const studentsSnap = await getDocs(query(STUDENTS_COL, orderBy("name", "asc")));
    const students = [];
    studentsSnap.forEach((d) => students.push({ id: d.id, ...d.data() }));
    students.sort((a, b) => {
      const rollA = parseInt(a.rollNumber, 10);
      const rollB = parseInt(b.rollNumber, 10);
      if (!isNaN(rollA) && !isNaN(rollB)) return rollA - rollB;
      if (!isNaN(rollA)) return -1;
      if (!isNaN(rollB)) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 26;
    const pageMargin = 12; // thin frame margin, like the marksheet PDFs

    function drawPageFrame() {
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(0, 0, 0);
      pdf.rect(pageMargin, pageMargin, pageWidth - pageMargin * 2, pageHeight - pageMargin * 2);
    }

    // Table geometry — split dates into groups so each group's columns stay readable,
    // instead of shrinking everything to fit on one wide page
    const rollColW = 45;
    const nameColW = 110;
    const tableWidth = pageWidth - margin * 2;
    const minDateColW = 55;
    const maxDatesPerGroup = Math.max(1, Math.floor((tableWidth - rollColW - nameColW) / minDateColW));
    const dateGroups = [];
    for (let i = 0; i < dates.length; i += maxDatesPerGroup) {
      dateGroups.push(dates.slice(i, i + maxDatesPerGroup));
    }
    const rowH = 22;

    function drawHeaderRow(y, groupDates, dateColW) {
      pdf.setFont("times", "bold");
      pdf.setFontSize(9);
      let x = margin;
      pdf.rect(x, y, rollColW, rowH);
      pdf.text("Roll No.", x + rollColW / 2, y + rowH / 2 + 3, { align: "center" });
      x += rollColW;
      pdf.rect(x, y, nameColW, rowH);
      pdf.text("Name", x + nameColW / 2, y + rowH / 2 + 3, { align: "center" });
      x += nameColW;
      groupDates.forEach(({ id }) => {
        pdf.rect(x, y, dateColW, rowH);
        pdf.text(formatDMY(id), x + dateColW / 2, y + rowH / 2 + 3, { align: "center" });
        x += dateColW;
      });
    }

    let isFirstPageOfDoc = true;

    dateGroups.forEach((groupDates, groupIndex) => {
      const dateColW = Math.max(minDateColW, (tableWidth - rollColW - nameColW) / groupDates.length);

      // ---- Pass 1: figure out how students split across pages for this date group ----
      const firstPageTop = margin + 64;
      const chunks = [];
      let chunkStart = 0;
      let y = (groupIndex === 0 ? firstPageTop : margin) + rowH;
      for (let i = 0; i < students.length; i++) {
        if (y + rowH > pageHeight - pageMargin - 10) {
          chunks.push({
            start: chunkStart,
            end: i,
            tableTop: groupIndex === 0 && chunks.length === 0 ? firstPageTop : margin,
          });
          chunkStart = i;
          y = margin + rowH;
        }
        y += rowH;
      }
      chunks.push({
        start: chunkStart,
        end: students.length,
        tableTop: groupIndex === 0 && chunks.length === 0 ? firstPageTop : margin,
      });

      // ---- Pass 2: draw ----
      chunks.forEach((chunk, chunkIndex) => {
        if (!isFirstPageOfDoc) pdf.addPage();
        isFirstPageOfDoc = false;
        drawPageFrame();

        if (groupIndex === 0 && chunkIndex === 0) {
          const titleTop = margin + 10;
          pdf.setFont("times", "bold");
          pdf.setFontSize(16);
          pdf.text("Babita Classes", pageWidth / 2, titleTop, { align: "center" });

          pdf.setFont("times", "normal");
          pdf.setFontSize(11);
          const rangeLabel =
            "Attendance data from " + formatDMY(dates[0].id) + " to " + formatDMY(dates[dates.length - 1].id);
          pdf.text(rangeLabel, pageWidth / 2, titleTop + 18, { align: "center" });

          const now = new Date();
          const extractedLine =
            "Extracted from https://babitaclasses.vercel.app/admin on " +
            pad2(now.getDate()) + "-" + pad2(now.getMonth() + 1) + "-" + now.getFullYear() +
            " " + pad2(now.getHours()) + ":" + pad2(now.getMinutes()) + ":" + pad2(now.getSeconds());
          pdf.setFontSize(9);
          pdf.text(extractedLine, pageWidth / 2, titleTop + 34, { align: "center" });
        }

        const tableTop = chunk.tableTop;
        drawHeaderRow(tableTop, groupDates, dateColW);
        const bodyTop = tableTop + rowH;
        const bodyBottom = bodyTop + (chunk.end - chunk.start) * rowH;

        // Roll No. + Name + non-holiday cells, per row
        pdf.setFont("times", "normal");
        pdf.setFontSize(9);
        for (let i = chunk.start; i < chunk.end; i++) {
          const student = students[i];
          const rowY = bodyTop + (i - chunk.start) * rowH;
          let x = margin;
          pdf.rect(x, rowY, rollColW, rowH);
          pdf.text(student.rollNumber || "-", x + rollColW / 2, rowY + rowH / 2 + 3, { align: "center" });
          x += rollColW;
          pdf.rect(x, rowY, nameColW, rowH);
          const nameLines = pdf.splitTextToSize(student.name || "", nameColW - 6);
          pdf.text(nameLines[0] || "", x + 4, rowY + rowH / 2 + 3);
          x += nameColW;

          groupDates.forEach(({ data }) => {
            if (!data.holiday) {
              pdf.rect(x, rowY, dateColW, rowH);
              const status = (data.records || {})[student.id];
              const cellText = status === "present" ? "Present" : status === "absent" ? "Absent" : "-";
              if (status === "present") pdf.setTextColor(30, 140, 40);
              else if (status === "absent") pdf.setTextColor(192, 57, 43);
              else pdf.setTextColor(0, 0, 0);
              pdf.text(cellText, x + dateColW / 2, rowY + rowH / 2 + 3, { align: "center" });
              pdf.setTextColor(0, 0, 0);
            }
            x += dateColW;
          });
        }

        // Merged holiday columns — one tall cell per holiday date, spanning this page's rows,
        // with the holiday name rotated to read top-to-bottom. Long names wrap onto extra
        // lines (stacked side-by-side within the column) instead of overflowing the cell.
        let hx = margin + rollColW + nameColW;
        groupDates.forEach(({ data }) => {
          if (data.holiday) {
            const cellH = bodyBottom - bodyTop;
            pdf.rect(hx, bodyTop, dateColW, cellH);
            pdf.setFont("times", "bold");
            pdf.setFontSize(9);
            pdf.setTextColor(192, 57, 43);

            const lines = pdf.splitTextToSize(data.holiday, Math.max(cellH - 8, 20));
            const lineSpacing = 12;
            const totalW = lines.length * lineSpacing;
            let lineX = hx + dateColW / 2 - totalW / 2 + lineSpacing / 2;
            lines.forEach((line) => {
              const lineW = pdf.getTextWidth(line);
              const lineY = bodyTop + (cellH + lineW) / 2;
              pdf.text(line, lineX, lineY, { angle: 90 });
              lineX += lineSpacing;
            });
            pdf.setTextColor(0, 0, 0);
          }
          hx += dateColW;
        });
      });
    });

    const today = new Date();
    const filename =
      "Babita Classes Attendance Record " +
      pad2(today.getDate()) + "-" + pad2(today.getMonth() + 1) + "-" + today.getFullYear() +
      " " +
      pad2(today.getHours()) + "-" + pad2(today.getMinutes()) + "-" + pad2(today.getSeconds()) +
      ".pdf";
    pdf.save(filename);

    attendanceRangeStatus.textContent = "PDF downloaded.";
    attendanceRangeStatus.className = "msg success";
  } catch (err) {
    attendanceRangeStatus.textContent = "Could not generate PDF: " + (err.message || err);
    attendanceRangeStatus.className = "msg error";
    console.error(err);
  }
});

// ---------- Blog Posts (add / edit / delete) ----------
const BLOG_POSTS_COL = collection(db, "blogPosts");

function updateBlogDeleteSelectedVisibility() {
  const anyChecked = blogPostList.querySelector('input[type="checkbox"]:checked');
  blogDeleteSelectedBtn.style.display = anyChecked ? "block" : "none";
}

blogSelectModeBtn.addEventListener("click", () => {
  const enabling = !blogPostList.classList.contains("bulk-mode");
  blogPostList.classList.toggle("bulk-mode", enabling);
  blogSelectModeBtn.textContent = enabling ? "Cancel" : "Select";
  if (!enabling) {
    blogPostList.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    blogDeleteSelectedBtn.style.display = "none";
  }
});
setupSelectAll(blogPostList, blogSelectAllBtn, blogSelectModeBtn);

function moveBlockRow(row, direction) {
  const sibling = direction === "up" ? row.previousElementSibling : row.nextElementSibling;
  if (!sibling) return;
  if (direction === "up") {
    blogBlocksContainer.insertBefore(row, sibling);
  } else {
    blogBlocksContainer.insertBefore(sibling, row);
  }
}

function createBlockControls(row) {
  const controls = document.createElement("div");
  controls.className = "blog-block-controls";

  const upBtn = document.createElement("button");
  upBtn.type = "button";
  upBtn.className = "move-btn";
  upBtn.textContent = "▲";
  upBtn.addEventListener("click", () => moveBlockRow(row, "up"));

  const downBtn = document.createElement("button");
  downBtn.type = "button";
  downBtn.className = "move-btn";
  downBtn.textContent = "▼";
  downBtn.addEventListener("click", () => moveBlockRow(row, "down"));

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "blog-remove-btn";
  removeBtn.textContent = "×";
  removeBtn.addEventListener("click", () => row.remove());

  controls.appendChild(upBtn);
  controls.appendChild(downBtn);
  controls.appendChild(removeBtn);
  return controls;
}

function addTextBlockRow(value) {
  const row = document.createElement("div");
  row.className = "blog-block-row";
  row.dataset.blockType = "text";

  const header = document.createElement("div");
  header.className = "blog-block-header";
  const labelGroup = document.createElement("span");
  const handle = document.createElement("span");
  handle.className = "blog-block-drag-handle";
  handle.textContent = "⠿";
  labelGroup.appendChild(handle);
  const label = document.createElement("span");
  label.className = "blog-block-type";
  label.textContent = "Text";
  labelGroup.appendChild(label);
  header.appendChild(labelGroup);
  header.appendChild(createBlockControls(row));
  row.appendChild(header);

  const textarea = document.createElement("textarea");
  textarea.rows = 4;
  textarea.placeholder = "Paragraph text...";
  textarea.value = value || "";
  row.appendChild(textarea);

  makeBlockRowDraggable(row);
  blogBlocksContainer.appendChild(row);
}

function addImageBlockRow(value) {
  const row = document.createElement("div");
  row.className = "blog-block-row";
  row.dataset.blockType = "image";

  const header = document.createElement("div");
  header.className = "blog-block-header";
  const labelGroup = document.createElement("span");
  const handle = document.createElement("span");
  handle.className = "blog-block-drag-handle";
  handle.textContent = "⠿";
  labelGroup.appendChild(handle);
  const label = document.createElement("span");
  label.className = "blog-block-type";
  label.textContent = "Photo";
  labelGroup.appendChild(label);
  header.appendChild(labelGroup);
  header.appendChild(createBlockControls(row));
  row.appendChild(header);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "https://...";
  input.value = value || "";
  row.appendChild(input);

  makeBlockRowDraggable(row);
  blogBlocksContainer.appendChild(row);
}

// ---------- Drag-and-drop reordering for content blocks ----------
function makeBlockRowDraggable(row) {
  row.draggable = true;
  row.addEventListener("dragstart", () => {
    setTimeout(() => row.classList.add("dragging"), 0);
  });
  row.addEventListener("dragend", () => {
    row.classList.remove("dragging");
  });
}

function getBlockRowAfterDrag(container, y) {
  const rows = [...container.querySelectorAll(".blog-block-row:not(.dragging)")];
  return rows.reduce(
    (closest, row) => {
      const box = row.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: row };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}

blogBlocksContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = blogBlocksContainer.querySelector(".blog-block-row.dragging");
  if (!dragging) return;
  const afterElement = getBlockRowAfterDrag(blogBlocksContainer, e.clientY);
  if (afterElement == null) {
    blogBlocksContainer.appendChild(dragging);
  } else {
    blogBlocksContainer.insertBefore(dragging, afterElement);
  }
});

blogAddTextBlockBtn.addEventListener("click", () => addTextBlockRow());
blogAddImageBlockBtn.addEventListener("click", () => addImageBlockRow());

function derivePreviewText(text) {
  const clean = (text || "").trim().replace(/\s+/g, " ");
  if (!clean) return "";
  const maxLen = 160;
  if (clean.length <= maxLen) return clean;
  const cut = clean.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "...";
}

function collectContentBlocks() {
  const blocks = [];
  blogBlocksContainer.querySelectorAll(".blog-block-row").forEach((row) => {
    const type = row.dataset.blockType;
    const field = row.querySelector("textarea, input");
    const value = field.value.trim();
    if (value) blocks.push({ type, value });
  });
  return blocks;
}

function addButtonRow(text, url) {
  const row = document.createElement("div");
  row.className = "blog-dynamic-row";
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Button text";
  textInput.value = text || "";
  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.placeholder = "https://...";
  urlInput.value = url || "";
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "blog-remove-btn";
  removeBtn.textContent = "×";
  removeBtn.addEventListener("click", () => row.remove());
  row.appendChild(textInput);
  row.appendChild(urlInput);
  row.appendChild(removeBtn);
  blogButtonsContainer.appendChild(row);
}

blogAddButtonBtn.addEventListener("click", () => addButtonRow());
addTextBlockRow();
addButtonRow();

function collectButtons() {
  const buttons = [];
  blogButtonsContainer.querySelectorAll(".blog-dynamic-row").forEach((row) => {
    const inputs = row.querySelectorAll("input");
    const text = inputs[0].value.trim();
    const url = inputs[1].value.trim();
    if (text && url) buttons.push({ text, url });
  });
  return buttons;
}

function clearBlogForm() {
  blogTitleInput.value = "";
  blogDateInput.value = "";
  blogBlocksContainer.innerHTML = "";
  blogButtonsContainer.innerHTML = "";
  addTextBlockRow();
  addButtonRow();
}

function fillBlogForm(data) {
  blogTitleInput.value = data.title || "";
  blogDateInput.value = data.date || "";

  blogBlocksContainer.innerHTML = "";
  if (Array.isArray(data.contentBlocks) && data.contentBlocks.length) {
    data.contentBlocks.forEach((b) => {
      if (b.type === "image") addImageBlockRow(b.value);
      else addTextBlockRow(b.value);
    });
  } else {
    // Legacy posts saved before content-blocks existed: one text block from
    // fullText, then one image block per legacy imageUrls entry.
    if (data.fullText) addTextBlockRow(data.fullText);
    const legacyImages = Array.isArray(data.imageUrls) && data.imageUrls.length ? data.imageUrls : data.imageUrl ? [data.imageUrl] : [];
    legacyImages.forEach((url) => addImageBlockRow(url));
    if (!data.fullText && legacyImages.length === 0) addTextBlockRow();
  }

  blogButtonsContainer.innerHTML = "";
  const buttons = Array.isArray(data.buttons) && data.buttons.length
    ? data.buttons
    : data.buttonText && data.buttonUrl
    ? [{ text: data.buttonText, url: data.buttonUrl }]
    : [];
  if (buttons.length) buttons.forEach((b) => addButtonRow(b.text, b.url));
  else addButtonRow();
}

async function renderBlogPosts() {
  blogPostList.innerHTML = "";
  blogDeleteSelectedBtn.style.display = "none";
  try {
    const q = query(BLOG_POSTS_COL, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = docSnap.id;
      checkbox._blogData = data;
      checkbox.addEventListener("change", updateBlogDeleteSelectedVisibility);
      li.appendChild(checkbox);

      const span = document.createElement("span");
      span.textContent = (data.title || "") + (data.date ? " — " + data.date : "");
      li.appendChild(span);

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => {
        fillBlogForm(data);
        blogAddBtn.textContent = "Save Changes";
        blogAddBtn.dataset.editingId = docSnap.id;
        blogStatus.textContent = 'Editing "' + (data.title || "") + '" — scroll up to edit and save.';
        blogStatus.className = "msg";
        window.scrollTo({ top: adminBlogView.offsetTop, behavior: "smooth" });
      });
      li.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        if (!confirm('Delete "' + (data.title || "this post") + '"?')) return;
        const deletedId = docSnap.id;
        try {
          await deleteDoc(doc(db, "blogPosts", deletedId));
          await renderBlogPosts();
          showUndoToast("Post deleted.", async () => {
            await setDoc(doc(db, "blogPosts", deletedId), data);
            await renderBlogPosts();
          });
        } catch (err) {
          blogStatus.textContent = "Delete failed: " + (err.code || err.message);
          blogStatus.className = "msg error";
          console.error(err);
        }
      });
      li.appendChild(deleteBtn);

      blogPostList.appendChild(li);
    });
  } catch (err) {
    blogStatus.textContent = "Could not load posts: " + (err.code || err.message);
    blogStatus.className = "msg error";
    console.error(err);
  }
}

blogDeleteSelectedBtn.addEventListener("click", async () => {
  const checked = blogPostList.querySelectorAll('input[type="checkbox"]:checked');
  if (checked.length === 0) return;
  if (!confirm("Delete " + checked.length + " selected post(s)?")) return;

  blogDeleteSelectedBtn.disabled = true;
  blogStatus.textContent = "Deleting...";
  blogStatus.className = "msg";
  try {
    const deleted = [];
    for (const cb of checked) {
      deleted.push({ id: cb.dataset.id, data: cb._blogData });
      await deleteDoc(doc(db, "blogPosts", cb.dataset.id));
    }
    blogStatus.textContent = "Selected posts deleted.";
    blogStatus.className = "msg success";
    await renderBlogPosts();
    showUndoToast(deleted.length + " post(s) deleted.", async () => {
      for (const item of deleted) {
        await setDoc(doc(db, "blogPosts", item.id), item.data);
      }
      await renderBlogPosts();
    });
  } catch (err) {
    blogStatus.textContent = "Delete failed: " + (err.code || err.message);
    blogStatus.className = "msg error";
    console.error(err);
  } finally {
    blogDeleteSelectedBtn.disabled = false;
  }
});

blogAddBtn.addEventListener("click", async () => {
  const title = blogTitleInput.value.trim();
  const date = blogDateInput.value.trim();
  const contentBlocks = collectContentBlocks();
  const buttons = collectButtons();

  if (!title || !date || contentBlocks.length === 0) {
    blogStatus.textContent = "Title, Date, and at least one content block are required.";
    blogStatus.className = "msg error";
    return;
  }

  const firstTextBlock = contentBlocks.find((b) => b.type === "text");
  const previewText = derivePreviewText(firstTextBlock ? firstTextBlock.value : "");
  if (!previewText) {
    blogStatus.textContent = "Add at least one text block so a preview can be generated.";
    blogStatus.className = "msg error";
    return;
  }

  const postData = { title, date, previewText, contentBlocks, buttons };
  const editingId = blogAddBtn.dataset.editingId;

  blogAddBtn.disabled = true;
  blogStatus.textContent = editingId ? "Saving..." : "Adding...";
  blogStatus.className = "msg";
  try {
    if (editingId) {
      const previousSnapData = Array.from(blogPostList.querySelectorAll('input[type="checkbox"]')).find(
        (cb) => cb.dataset.id === editingId
      )?._blogData;
      await updateDoc(doc(db, "blogPosts", editingId), postData);
      clearBlogForm();
      blogAddBtn.textContent = "Add Post";
      delete blogAddBtn.dataset.editingId;
      blogStatus.textContent = "Post updated.";
      blogStatus.className = "msg success";
      await renderBlogPosts();
      showUndoToast("Post updated.", async () => {
        if (previousSnapData) {
          await updateDoc(doc(db, "blogPosts", editingId), previousSnapData);
          await renderBlogPosts();
        }
      });
    } else {
      const newDoc = await addDoc(BLOG_POSTS_COL, { ...postData, createdAt: serverTimestamp() });
      clearBlogForm();
      blogStatus.textContent = "Post added.";
      blogStatus.className = "msg success";
      await renderBlogPosts();
      showUndoToast("Post added.", async () => {
        await deleteDoc(doc(db, "blogPosts", newDoc.id));
        await renderBlogPosts();
      });
    }
  } catch (err) {
    blogStatus.textContent = "Could not save: " + (err.code || err.message);
    blogStatus.className = "msg error";
    console.error(err);
  } finally {
    blogAddBtn.disabled = false;
  }
});
