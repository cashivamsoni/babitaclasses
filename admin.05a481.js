// ---------- Firebase setup ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
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
const rememberMeInput = document.getElementById("rememberMeInput");
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
const noticeSelectedCount = document.getElementById("noticeSelectedCount");

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

const galleryRowsContainer = document.getElementById("galleryRowsContainer");
const galleryImageInput = document.getElementById("galleryImageInput");
const galleryAddBtn = document.getElementById("galleryAddBtn");
galleryImageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    galleryAddBtn.click();
  }
});
const galleryAddStatus = document.getElementById("galleryAddStatus");
const gallerySelectModeBtn = document.getElementById("gallerySelectModeBtn");
const gallerySelectAllBtn = document.getElementById("gallerySelectAllBtn");
const gallerySelectedCount = document.getElementById("gallerySelectedCount");
const galleryDeleteSelectedBtn = document.getElementById("galleryDeleteSelectedBtn");
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
const videoSelectedCount = document.getElementById("videoSelectedCount");

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
const studentSelectedCount = document.getElementById("studentSelectedCount");

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
const attendanceRangeResults = document.getElementById("attendanceRangeResults");
const attendanceSelectModeBtn = document.getElementById("attendanceSelectModeBtn");
const attendanceSelectAllBtn = document.getElementById("attendanceSelectAllBtn");
const attendanceRangeList = document.getElementById("attendanceRangeList");
const attendanceDeleteSelectedBtn = document.getElementById("attendanceDeleteSelectedBtn");
const attendanceSelectedCount = document.getElementById("attendanceSelectedCount");
const attendanceExportPdfBtn = document.getElementById("attendanceExportPdfBtn");

const blogTitleInput = document.getElementById("blogTitleInput");
const blogDateInput = document.getElementById("blogDateInput");
const blogBlocksContainer = document.getElementById("blogBlocksContainer");
const blogAddTextBlockBtn = document.getElementById("blogAddTextBlockBtn");
const blogAddImageBlockBtn = document.getElementById("blogAddImageBlockBtn");
const blogAddButtonBtn = document.getElementById("blogAddButtonBtn");
const blogAddBtn = document.getElementById("blogAddBtn");
const blogStatus = document.getElementById("blogStatus");
const blogPostList = document.getElementById("blogPostList");
const blogSelectModeBtn = document.getElementById("blogSelectModeBtn");
const blogSelectAllBtn = document.getElementById("blogSelectAllBtn");
const blogDeleteSelectedBtn = document.getElementById("blogDeleteSelectedBtn");
const blogSelectedCount = document.getElementById("blogSelectedCount");

const hubResultsBtn = document.getElementById("hubResultsBtn");
const adminResultsView = document.getElementById("adminResultsView");
const resultsBackBtn = document.getElementById("resultsBackBtn");
const resultsLogoutBtn = document.getElementById("resultsLogoutBtn");
const resultTermSelect = document.getElementById("resultTermSelect");
const resultTermStatusDisplay = document.getElementById("resultTermStatusDisplay");
const resultNewTermBtn = document.getElementById("resultNewTermBtn");
const resultDeleteTermBtn = document.getElementById("resultDeleteTermBtn");
const resultPublishBtn = document.getElementById("resultPublishBtn");
const resultStatus = document.getElementById("resultStatus");
const resultTermNameInput = document.getElementById("resultTermNameInput");
const resultDateInput = document.getElementById("resultDateInput");
const resultSessionInput = document.getElementById("resultSessionInput");
const resultSetCodeInput = document.getElementById("resultSetCodeInput");
const resultMaxMarksInput = document.getElementById("resultMaxMarksInput");
const resultSaveDetailsBtn = document.getElementById("resultSaveDetailsBtn");
const resultDetailsStatus = document.getElementById("resultDetailsStatus");
const resultRollInput = document.getElementById("resultRollInput");
const resultNameInput = document.getElementById("resultNameInput");
const resultMarksInput = document.getElementById("resultMarksInput");
const resultAddStudentBtn = document.getElementById("resultAddStudentBtn");
const resultStudentStatus = document.getElementById("resultStudentStatus");

[resultRollInput, resultNameInput, resultMarksInput].forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      resultAddStudentBtn.click();
    }
  });
});
[resultTermNameInput, resultDateInput, resultSessionInput, resultSetCodeInput, resultMaxMarksInput].forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      resultSaveDetailsBtn.click();
    }
  });
});
const resultSelectModeBtn = document.getElementById("resultSelectModeBtn");
const resultSelectAllBtn = document.getElementById("resultSelectAllBtn");
const resultStudentList = document.getElementById("resultStudentList");
const resultDeleteSelectedBtn = document.getElementById("resultDeleteSelectedBtn");
const resultSelectedCount = document.getElementById("resultSelectedCount");

// ---------- Auth state ----------
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginView.style.display = "none";
    adminView.style.display = "none";
    adminAttendanceView.style.display = "none";
    adminBlogView.style.display = "none";
    adminResultsView.style.display = "none";
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
    adminResultsView.style.display = "none";
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

hubResultsBtn.addEventListener("click", async () => {
  adminHub.style.display = "none";
  adminResultsView.style.display = "block";
  await loadResultTerms();
});

resultsBackBtn.addEventListener("click", () => {
  adminResultsView.style.display = "none";
  adminHub.style.display = "block";
});

resultsLogoutBtn.addEventListener("click", () => signOut(auth));

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";
  const submitBtn = loginForm.querySelector("button");
  const originalBtnHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="btn-spinner"></span>';
  document.body.classList.add("wait");
  try {
    await setPersistence(
      auth,
      rememberMeInput.checked ? browserLocalPersistence : browserSessionPersistence
    );
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
  } catch (err) {
    loginError.textContent = "Login failed — check your email and password.";
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHTML;
    document.body.classList.remove("wait");
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

// ---------- Modal (replaces prompt()/confirm() with a consistently styled dialog) ----------
const modalOverlay = document.getElementById("modalOverlay");
const modalTitleEl = document.getElementById("modalTitle");
const modalBodyEl = document.getElementById("modalBody");
const modalConfirmBtn = document.getElementById("modalConfirmBtn");
const modalCancelBtn = document.getElementById("modalCancelBtn");

// Low-level modal opener. Resolves with:
//  - an object keyed by each field's `name` (when `fields` is given), or null if cancelled
//  - a boolean (when `fields` is omitted — plain confirm dialog)
function openModal({ title, message = null, fields = null, confirmText = "OK", cancelText = "Cancel", danger = false }) {
  return new Promise((resolve) => {
    modalTitleEl.textContent = title || "";
    modalBodyEl.innerHTML = "";
    modalConfirmBtn.textContent = confirmText;
    modalCancelBtn.textContent = cancelText;
    modalConfirmBtn.classList.toggle("danger", !!danger);

    if (message) {
      const p = document.createElement("p");
      p.className = "modal-message";
      p.textContent = message;
      modalBodyEl.appendChild(p);
    }

    const inputs = [];
    if (fields) {
      fields.forEach((f, i) => {
        const label = document.createElement("label");
        label.textContent = f.label;
        label.setAttribute("for", "modalField" + i);
        modalBodyEl.appendChild(label);
        const input = document.createElement("input");
        input.type = f.type || "text";
        input.id = "modalField" + i;
        input.value = f.value ?? "";
        if (f.placeholder) input.placeholder = f.placeholder;
        modalBodyEl.appendChild(input);
        inputs.push(input);
      });
    }

    function finish(result) {
      modalOverlay.classList.remove("show");
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      modalOverlay.removeEventListener("mousedown", onOverlayMouseDown);
      modalConfirmBtn.removeEventListener("click", onConfirm);
      modalCancelBtn.removeEventListener("click", onCancel);
      document.removeEventListener("keydown", onKeydown);
      resolve(result);
    }

    function onConfirm() {
      if (fields) {
        const values = {};
        fields.forEach((f, i) => { values[f.name] = inputs[i].value; });
        finish(values);
      } else {
        finish(true);
      }
    }
    function onCancel() {
      finish(fields ? null : false);
    }
    function onOverlayMouseDown(e) {
      if (e.target === modalOverlay) onCancel();
    }
    function onKeydown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      } else if (e.key === "Enter" && document.activeElement && document.activeElement.tagName === "INPUT") {
        e.preventDefault();
        onConfirm();
      }
    }

    modalConfirmBtn.addEventListener("click", onConfirm);
    modalCancelBtn.addEventListener("click", onCancel);
    modalOverlay.addEventListener("mousedown", onOverlayMouseDown);
    document.addEventListener("keydown", onKeydown);

    modalOverlay.classList.add("show");
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => {
      if (inputs[0]) {
        inputs[0].focus();
        inputs[0].select();
      } else {
        modalConfirmBtn.focus();
      }
    });
  });
}

// Drop-in replacement for confirm(message) — resolves true/false.
function modalConfirm(message, opts = {}) {
  return openModal({
    title: message,
    confirmText: opts.confirmText || "Delete",
    cancelText: opts.cancelText || "Cancel",
    danger: opts.danger !== false,
  });
}

// Drop-in replacement for prompt(label, defaultValue) as well as a multi-field
// version. Pass a single field descriptor for one input (resolves to the string
// value, or null if cancelled — matching prompt()'s contract), or an array of
// field descriptors for several inputs at once (resolves to a values object, or
// null if cancelled).
function modalPrompt(title, fieldOrFields, opts = {}) {
  const isMulti = Array.isArray(fieldOrFields);
  const fields = isMulti ? fieldOrFields : [{ name: "value", ...fieldOrFields }];
  return openModal({
    title,
    fields,
    confirmText: opts.confirmText || "Save",
    cancelText: opts.cancelText || "Cancel",
  }).then((result) => {
    if (result === null) return null;
    return isMulti ? result : result.value;
  });
}

// ---------- Shared drag-handle / move-buttons row reordering (desktop drag, mobile ▲▼) ----------
function createRowDragHandle() {
  const handle = document.createElement("span");
  handle.className = "row-drag-handle";
  return handle;
}

function createRowMoveButtons(getIndex, onMove) {
  const wrap = document.createElement("span");
  wrap.className = "row-move-btns";

  const upBtn = document.createElement("button");
  upBtn.type = "button";
  upBtn.className = "move-btn";
  upBtn.textContent = "▲";
  upBtn.addEventListener("click", () => onMove(getIndex(), "up"));

  const downBtn = document.createElement("button");
  downBtn.type = "button";
  downBtn.className = "move-btn";
  downBtn.textContent = "▼";
  downBtn.addEventListener("click", () => onMove(getIndex(), "down"));

  wrap.appendChild(upBtn);
  wrap.appendChild(downBtn);
  return wrap;
}

function makeRowDraggable(li, listEl, rowSelector, onDrop) {
  li.draggable = isDesktopViewport();
  li.addEventListener("dragstart", () => {
    li.dataset.justDragged = "1";
    setTimeout(() => li.classList.add("row-dragging"), 0);
  });
  li.addEventListener("dragend", () => {
    li.classList.remove("row-dragging");
    onDrop();
    setTimeout(() => {
      delete li.dataset.justDragged;
    }, 0);
  });
  if (!listEl.dataset.rowDragBound) {
    listEl.dataset.rowDragBound = "1";
    listEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      const dragging = listEl.querySelector(rowSelector + ".row-dragging");
      if (!dragging) return;
      const rows = [...listEl.querySelectorAll(rowSelector + ":not(.row-dragging)")];
      const after = rows.reduce(
        (closest, row) => {
          const box = row.getBoundingClientRect();
          const offset = e.clientY - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) return { offset, element: row };
          return closest;
        },
        { offset: Number.NEGATIVE_INFINITY, element: null }
      ).element;
      if (after == null) listEl.appendChild(dragging);
      else listEl.insertBefore(dragging, after);
    });
  }
}

// Lets a bulk-select list row be toggled by tapping anywhere on it, not just the
// checkbox — while leaving buttons, the drag handle, move buttons, and an
// in-progress drag/reorder untouched.
function makeRowTapSelectable(li, checkbox, listEl) {
  li.addEventListener("click", (e) => {
    if (li.dataset.justDragged === "1") return;
    if (e.target === checkbox) return;
    if (e.target.closest("button, a, .row-drag-handle, .row-move-btns")) return;
    if (!listEl.classList.contains("bulk-mode")) return;
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event("change"));
  });
}

// ---------- Notices (add / edit / delete) ----------
const NOTICES_COL = collection(db, "notices");

async function renderNotices() {
  noticeList.innerHTML = "";
  noticeDeleteSelectedBtn.style.display = "none";
  try {
    const q = query(NOTICES_COL, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach((docSnap) => items.push({ id: docSnap.id, data: docSnap.data() }));

    if (items.some((it) => it.data.order === undefined)) {
      await Promise.all(items.map((it, index) => updateDoc(doc(db, "notices", it.id), { order: index })));
      items.forEach((it, index) => (it.data.order = index));
    }
    items.sort((a, b) => a.data.order - b.data.order);

    async function persistNoticeOrder() {
      const ids = [...noticeList.children].map((li) => li.dataset.id);
      await Promise.all(ids.map((id, index) => updateDoc(doc(db, "notices", id), { order: index })));
    }

    items.forEach((item) => {
      const { id, data } = item;
      const li = document.createElement("li");
      li.dataset.id = id;

      li.appendChild(createRowDragHandle());

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = id;
      checkbox._noticeData = data;
      checkbox.addEventListener("change", updateDeleteSelectedVisibility);
      li.appendChild(checkbox);
      makeRowTapSelectable(li, checkbox, noticeList);

      const span = document.createElement("span");
      span.textContent = data.text || "";
      li.appendChild(span);

      const actions = document.createElement("div");
      actions.className = "row-actions";
      li.appendChild(actions);

      actions.appendChild(
        createRowMoveButtons(
          () => [...noticeList.children].indexOf(li),
          async (index, direction) => {
            const sibling = direction === "up" ? li.previousElementSibling : li.nextElementSibling;
            if (!sibling) return;
            if (direction === "up") noticeList.insertBefore(li, sibling);
            else noticeList.insertBefore(sibling, li);
            await persistNoticeOrder();
          }
        )
      );

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", async () => {
        const previousText = data.text || "";
        const updated = await modalPrompt("Edit Notice", { label: "Notice text", value: previousText });
        if (updated === null) return;
        const trimmed = updated.trim();
        if (!trimmed) return;
        try {
          await updateDoc(doc(db, "notices", id), { text: trimmed });
          await renderNotices();
          showUndoToast("Notice updated.", async () => {
            await updateDoc(doc(db, "notices", id), { text: previousText });
            await renderNotices();
          });
        } catch (err) {
          noticeStatus.textContent = "Edit failed: " + (err.code || err.message);
          noticeStatus.className = "msg error";
          console.error(err);
        }
      });
      actions.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        if (!(await modalConfirm("Delete this notice?"))) return;
        try {
          await deleteDoc(doc(db, "notices", id));
          await renderNotices();
          showUndoToast("Notice deleted.", async () => {
            await setDoc(doc(db, "notices", id), data);
            await renderNotices();
          });
        } catch (err) {
          noticeStatus.textContent = "Delete failed: " + (err.code || err.message);
          noticeStatus.className = "msg error";
          console.error(err);
        }
      });
      actions.appendChild(deleteBtn);

      makeRowDraggable(li, noticeList, "li", persistNoticeOrder);
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
  const checked = noticeList.querySelectorAll('input[type="checkbox"]:checked');
  noticeDeleteSelectedBtn.style.display = checked.length ? "block" : "none";
  noticeSelectedCount.textContent = checked.length ? checked.length + " selected" : "";
}

noticeSelectModeBtn.addEventListener("click", () => {
  const enabling = !noticeList.classList.contains("bulk-mode");
  noticeList.classList.toggle("bulk-mode", enabling);
  noticeSelectModeBtn.textContent = enabling ? "Cancel" : "Select";
  if (!enabling) {
    noticeList.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    updateDeleteSelectedVisibility();
  }
});
setupSelectAll(noticeList, noticeSelectAllBtn, noticeSelectModeBtn);


noticeDeleteSelectedBtn.addEventListener("click", async () => {
  const checked = noticeList.querySelectorAll('input[type="checkbox"]:checked');
  if (checked.length === 0) return;
  if (!(await modalConfirm("Delete " + checked.length + " selected notice(s)?"))) return;

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
    const newDoc = await addDoc(NOTICES_COL, { text: value, createdAt: serverTimestamp(), order: -Date.now() });
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

// ---------- Gallery images (add / delete / select / reorder) ----------
const GALLERY_DEFAULTS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => "/images/image" + n + ".jpg");

function updateGalleryDeleteSelectedVisibility() {
  const checked = galleryRowsContainer.querySelectorAll('input[type="checkbox"]:checked');
  galleryDeleteSelectedBtn.style.display = checked.length ? "block" : "none";
  gallerySelectedCount.textContent = checked.length ? checked.length + " selected" : "";
}

function createGalleryRow(url) {
  const li = document.createElement("li");

  li.appendChild(createRowDragHandle());

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", updateGalleryDeleteSelectedVisibility);
  li.appendChild(checkbox);
  makeRowTapSelectable(li, checkbox, galleryRowsContainer);

  const input = document.createElement("input");
  input.type = "text";
  input.value = url || "";
  input.placeholder = "https://... or /images/...";
  li.appendChild(input);

  const actions = document.createElement("div");
  actions.className = "row-actions";
  li.appendChild(actions);

  actions.appendChild(
    createRowMoveButtons(
      () => [...galleryRowsContainer.children].indexOf(li),
      (index, direction) => {
        const sibling = direction === "up" ? li.previousElementSibling : li.nextElementSibling;
        if (!sibling) return;
        if (direction === "up") galleryRowsContainer.insertBefore(li, sibling);
        else galleryRowsContainer.insertBefore(sibling, li);
      }
    )
  );

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    const nextSibling = li.nextSibling;
    const parent = li.parentNode;
    li.remove();
    updateGalleryDeleteSelectedVisibility();
    showUndoToast("Photo removed — click Save Gallery to publish.", () => {
      parent.insertBefore(li, nextSibling);
      updateGalleryDeleteSelectedVisibility();
    });
  });
  actions.appendChild(deleteBtn);

  makeRowDraggable(li, galleryRowsContainer, "li", () => {});
  return li;
}

function renderGalleryRows(urls) {
  galleryRowsContainer.innerHTML = "";
  galleryDeleteSelectedBtn.style.display = "none";
  gallerySelectedCount.textContent = "";
  urls.forEach((url) => galleryRowsContainer.appendChild(createGalleryRow(url)));
}

function currentGalleryUrls() {
  return [...galleryRowsContainer.querySelectorAll("li input[type=\"text\"]")]
    .map((input) => input.value.trim())
    .filter((v) => v);
}

async function loadGallery() {
  try {
    const snap = await getDoc(SITE_DOC);
    const stored = snap.exists() && Array.isArray(snap.data().galleryImages) ? snap.data().galleryImages : [];
    const urls = stored.length ? stored : GALLERY_DEFAULTS;
    renderGalleryRows(urls);
    previousGalleryUrls = urls;
  } catch (err) {
    galleryStatus.textContent = "Could not load gallery: " + (err.code || err.message);
    galleryStatus.className = "msg error";
    console.error(err);
  }
}

galleryAddBtn.addEventListener("click", () => {
  const url = galleryImageInput.value.trim();
  if (!url) {
    galleryAddStatus.textContent = "Enter a photo URL first.";
    galleryAddStatus.className = "msg error";
    return;
  }
  galleryRowsContainer.appendChild(createGalleryRow(url));
  galleryImageInput.value = "";
  galleryAddStatus.textContent = "Photo added — click Save Gallery to publish.";
  galleryAddStatus.className = "msg success";
});

gallerySelectModeBtn.addEventListener("click", () => {
  const enabling = !galleryRowsContainer.classList.contains("bulk-mode");
  galleryRowsContainer.classList.toggle("bulk-mode", enabling);
  gallerySelectModeBtn.textContent = enabling ? "Cancel" : "Select";
  if (!enabling) {
    galleryRowsContainer.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    updateGalleryDeleteSelectedVisibility();
  }
});
setupSelectAll(galleryRowsContainer, gallerySelectAllBtn, gallerySelectModeBtn);

galleryDeleteSelectedBtn.addEventListener("click", async () => {
  const checked = galleryRowsContainer.querySelectorAll('input[type="checkbox"]:checked');
  if (!checked.length) return;
  if (!(await modalConfirm("Delete " + checked.length + " selected photo(s)?"))) return;
  const removed = [...checked].map((cb) => {
    const li = cb.closest("li");
    return { li, nextSibling: li.nextSibling, parent: li.parentNode };
  });
  removed.forEach(({ li }) => li.remove());
  updateGalleryDeleteSelectedVisibility();
  showUndoToast(removed.length + " photo(s) removed — click Save Gallery to publish.", () => {
    removed.forEach(({ li, nextSibling, parent }) => parent.insertBefore(li, nextSibling));
    updateGalleryDeleteSelectedVisibility();
  });
});

gallerySaveBtn.addEventListener("click", async () => {
  const values = currentGalleryUrls();
  if (!values.length) {
    galleryStatus.textContent = "Add at least one photo URL.";
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
      renderGalleryRows(previousValues);
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
  const checked = videoAdminList.querySelectorAll('input[type="checkbox"]:checked');
  videoDeleteSelectedBtn.style.display = checked.length ? "block" : "none";
  videoSelectedCount.textContent = checked.length ? checked.length + " selected" : "";
}

videoSelectModeBtn.addEventListener("click", () => {
  const enabling = !videoAdminList.classList.contains("bulk-mode");
  videoAdminList.classList.toggle("bulk-mode", enabling);
  videoSelectModeBtn.textContent = enabling ? "Cancel" : "Select";
  if (!enabling) {
    videoAdminList.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    updateVideoDeleteSelectedVisibility();
  }
});
setupSelectAll(videoAdminList, videoSelectAllBtn, videoSelectModeBtn);


async function renderVideos() {
  videoAdminList.innerHTML = "";
  videoDeleteSelectedBtn.style.display = "none";
  try {
    const q = query(VIDEOS_COL, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach((docSnap) => items.push({ id: docSnap.id, data: docSnap.data() }));

    if (items.some((it) => it.data.order === undefined)) {
      await Promise.all(items.map((it, index) => updateDoc(doc(db, "videos", it.id), { order: index })));
      items.forEach((it, index) => (it.data.order = index));
    }
    items.sort((a, b) => a.data.order - b.data.order);

    async function persistVideoOrder() {
      const ids = [...videoAdminList.children].map((li) => li.dataset.id);
      await Promise.all(ids.map((id, index) => updateDoc(doc(db, "videos", id), { order: index })));
    }

    items.forEach((item) => {
      const { id, data } = item;
      const li = document.createElement("li");
      li.dataset.id = id;

      li.appendChild(createRowDragHandle());

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = id;
      checkbox._videoData = data;
      checkbox.addEventListener("change", updateVideoDeleteSelectedVisibility);
      li.appendChild(checkbox);
      makeRowTapSelectable(li, checkbox, videoAdminList);

      const span = document.createElement("span");
      span.textContent = data.title || "";
      li.appendChild(span);

      const actions = document.createElement("div");
      actions.className = "row-actions";
      li.appendChild(actions);

      actions.appendChild(
        createRowMoveButtons(
          () => [...videoAdminList.children].indexOf(li),
          async (index, direction) => {
            const sibling = direction === "up" ? li.previousElementSibling : li.nextElementSibling;
            if (!sibling) return;
            if (direction === "up") videoAdminList.insertBefore(li, sibling);
            else videoAdminList.insertBefore(sibling, li);
            await persistVideoOrder();
          }
        )
      );

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", async () => {
        const previousTitle = data.title || "";
        const previousUrl = data.url || "";
        const updated = await modalPrompt("Edit Video", [
          { name: "title", label: "Title", value: previousTitle },
          { name: "url", label: "Video/Post URL", value: previousUrl },
        ]);
        if (updated === null) return;
        const title = updated.title.trim();
        const url = updated.url.trim();
        if (!title || !url) return;
        try {
          await updateDoc(doc(db, "videos", id), { title, url });
          await renderVideos();
          showUndoToast("Video updated.", async () => {
            await updateDoc(doc(db, "videos", id), { title: previousTitle, url: previousUrl });
            await renderVideos();
          });
        } catch (err) {
          videoStatus.textContent = "Edit failed: " + (err.code || err.message);
          videoStatus.className = "msg error";
          console.error(err);
        }
      });
      actions.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        if (!(await modalConfirm("Delete this video?"))) return;
        try {
          await deleteDoc(doc(db, "videos", id));
          await renderVideos();
          showUndoToast("Video deleted.", async () => {
            await setDoc(doc(db, "videos", id), data);
            await renderVideos();
          });
        } catch (err) {
          videoStatus.textContent = "Delete failed: " + (err.code || err.message);
          videoStatus.className = "msg error";
          console.error(err);
        }
      });
      actions.appendChild(deleteBtn);

      makeRowDraggable(li, videoAdminList, "li", persistVideoOrder);
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
  if (!(await modalConfirm("Delete " + checked.length + " selected video(s)?"))) return;

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
    const newDoc = await addDoc(VIDEOS_COL, { title, url, createdAt: serverTimestamp(), order: -Date.now() });
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
    li._rowRef = row;

    li.appendChild(createRowDragHandle());

    const span = document.createElement("span");
    span.textContent =
      row.exam + " — " + [row.syllabus, row.datesheet, row.result].filter(Boolean).join(" | ");
    li.appendChild(span);

    const actions = document.createElement("div");
    actions.className = "row-actions";
    li.appendChild(actions);

    actions.appendChild(
      createRowMoveButtons(
        () => [...syllabusRowList.children].indexOf(li),
        (i, direction) => moveSyllabusRow(i, direction)
      )
    );

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editSyllabusRow(index));
    actions.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteSyllabusRow(index));
    actions.appendChild(deleteBtn);

    makeRowDraggable(li, syllabusRowList, "li", persistSyllabusRowOrder);
    syllabusRowList.appendChild(li);
  });
}

async function persistSyllabusRowOrder() {
  const session = getSelectedSession();
  session.rows = [...syllabusRowList.children].map((li) => li._rowRef);
  try {
    await saveSyllabusSession(session);
    renderSyllabusRows();
  } catch (err) {
    syllabusStatus.textContent = "Reorder failed: " + (err.code || err.message);
    syllabusStatus.className = "msg error";
    console.error(err);
  }
}

async function moveSyllabusRow(index, direction) {
  const session = getSelectedSession();
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= session.rows.length) return;
  const rows = session.rows;
  [rows[index], rows[targetIndex]] = [rows[targetIndex], rows[index]];
  try {
    await saveSyllabusSession(session);
    renderSyllabusRows();
  } catch (err) {
    [rows[index], rows[targetIndex]] = [rows[targetIndex], rows[index]];
    syllabusStatus.textContent = "Reorder failed: " + (err.code || err.message);
    syllabusStatus.className = "msg error";
    console.error(err);
  }
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

  const updated = await modalPrompt("Edit Row", [
    { name: "exam", label: "Exam name", value: row.exam },
    { name: "syllabus", label: "Syllabus (paste a link, or type text/NA)", value: row.syllabus },
    { name: "datesheet", label: "Datesheet (paste a link, or type text/date)", value: row.datesheet },
    { name: "result", label: "Result (paste a link, or type text/NA)", value: row.result },
  ]);
  if (updated === null) return;

  session.rows[index] = {
    exam: updated.exam.trim(),
    syllabus: updated.syllabus.trim(),
    datesheet: updated.datesheet.trim(),
    result: updated.result.trim(),
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
  if (!(await modalConfirm("Delete this row?"))) return;
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
  const added = await modalPrompt("Add Row", [
    { name: "exam", label: "Exam name", value: "" },
    { name: "syllabus", label: "Syllabus (paste a link, or type text/NA)", value: "NA" },
    { name: "datesheet", label: "Datesheet (paste a link, or type text/date)", value: "NA" },
    { name: "result", label: "Result (paste a link, or type text/NA)", value: "NA" },
  ]);
  if (added === null || !added.exam.trim()) return;
  const exam = added.exam;
  const syllabus = added.syllabus.trim() ? added.syllabus : "NA";
  const datesheet = added.datesheet.trim() ? added.datesheet : "NA";
  const result = added.result.trim() ? added.result : "NA";

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
  const label = await modalPrompt("New Syllabus Session", { label: "Session label (e.g. 2026-27)", value: "" });
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
  if (!(await modalConfirm('Delete session "' + session.id + '"? This removes it from the live site.'))) return;
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

// Roll numbers: `rollNumber` is whatever the admin typed (may be empty).
// `autoRollNumber` is system-assigned and kept in sync by recomputeAutoRollNumbers()
// for every active student who hasn't been given one manually. The admin's
// number always wins when present; auto numbers just fill the gaps in A–Z
// order and quietly shift out of the way if a manual number is later typed
// into one of their slots.
function effectiveRollNumber(student) {
  const manual = (student.rollNumber || "").trim();
  return manual || student.autoRollNumber || "";
}

function normalizeRollNumber(value) {
  const n = parseInt(value, 10);
  return isNaN(n) ? null : n;
}

// True if `rollNumber` (as a number) is already taken by another active
// student's *manually* assigned roll number. Auto numbers don't block —
// they yield instead (handled in recomputeAutoRollNumbers).
async function isManualRollNumberTaken(rollNumber, excludeId) {
  const n = normalizeRollNumber(rollNumber);
  if (n === null) return false;
  const snap = await getDocs(STUDENTS_COL);
  let taken = false;
  snap.forEach((d) => {
    if (d.id === excludeId) return;
    const data = d.data();
    if (data.deletedDate) return;
    if (normalizeRollNumber(data.rollNumber) === n) taken = true;
  });
  return taken;
}

// Gives an auto number to any active student who has never had one — sorted
// A–Z among just those students — and otherwise leaves every existing
// assignment untouched. An already-numbered active student's number is
// permanent for as long as they're active: it's what appears in every past
// weekly PDF table they're part of, so changing it after the fact would
// retroactively collide with anyone (active or since-deleted) they've ever
// shared a table with. Deletions free up nothing on purpose — the next new
// student just gets the next never-used number instead.
async function recomputeAutoRollNumbers() {
  const snap = await getDocs(STUDENTS_COL);
  const active = [];
  snap.forEach((d) => {
    const data = d.data();
    if (!data.deletedDate) active.push({ id: d.id, ...data });
  });

  // Numbers already held by a currently-active student (manual or auto) —
  // off-limits to everyone else while that student is active.
  const claimedByActive = new Set();
  active.forEach((s) => {
    const manual = normalizeRollNumber(s.rollNumber);
    const n = manual !== null ? manual : normalizeRollNumber(s.autoRollNumber);
    if (n !== null) claimedByActive.add(n);
  });

  const needsAuto = active
    .filter((s) => !(s.rollNumber || "").trim() && !s.autoRollNumber)
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  let next = 1;
  const updates = [];
  needsAuto.forEach((s) => {
    while (claimedByActive.has(next)) next++;
    const assigned = String(next).padStart(2, "0");
    updates.push(updateDoc(doc(db, "students", s.id), { autoRollNumber: assigned }));
    claimedByActive.add(next);
    next++;
  });

  await Promise.all(updates);
}

function updateStudentDeleteSelectedVisibility() {
  const checked = studentList.querySelectorAll('input[type="checkbox"]:checked');
  studentDeleteSelectedBtn.style.display = checked.length ? "block" : "none";
  studentSelectedCount.textContent = checked.length ? checked.length + " selected" : "";
}

studentSelectModeBtn.addEventListener("click", () => {
  const enabling = !studentList.classList.contains("bulk-mode");
  studentList.classList.toggle("bulk-mode", enabling);
  studentSelectModeBtn.textContent = enabling ? "Cancel" : "Select";
  if (!enabling) {
    studentList.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    updateStudentDeleteSelectedVisibility();
  }
});
setupSelectAll(studentList, studentSelectAllBtn, studentSelectModeBtn);


async function renderStudents() {
  studentList.innerHTML = "";
  studentDeleteSelectedBtn.style.display = "none";
  try {
    await recomputeAutoRollNumbers();
    const q = query(STUDENTS_COL, orderBy("name", "asc"));
    const snap = await getDocs(q);
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.deletedDate) return; // soft-deleted — kept for history, hidden from management
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = docSnap.id;
      checkbox._studentData = data;
      checkbox.addEventListener("change", updateStudentDeleteSelectedVisibility);
      li.appendChild(checkbox);
      makeRowTapSelectable(li, checkbox, studentList);

      const roll = effectiveRollNumber(data);
      const span = document.createElement("span");
      span.textContent =
        data.name + (roll ? " (Roll " + roll + (data.rollNumber ? "" : ", auto") + ")" : "");
      li.appendChild(span);

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", async () => {
        const previousName = data.name || "";
        const previousRoll = data.rollNumber || "";
        const updated = await modalPrompt("Edit Student", [
          { name: "name", label: "Student name", value: previousName },
          {
            name: "roll",
            label: "Roll number (optional — leave blank for automatic A–Z numbering)",
            value: previousRoll,
          },
        ]);
        if (updated === null) return;
        const name = updated.name.trim();
        if (!name) return;
        const rollNumber = updated.roll.trim();
        if (rollNumber && (await isManualRollNumberTaken(rollNumber, docSnap.id))) {
          studentStatus.textContent = "Roll number " + rollNumber + " is already assigned to another student.";
          studentStatus.className = "msg error";
          return;
        }
        try {
          const update = { name, rollNumber };
          if (rollNumber !== previousRoll) update.autoRollNumber = deleteField();
          await updateDoc(doc(db, "students", docSnap.id), update);
          await renderStudents();
          showUndoToast("Student updated.", async () => {
            const undo = { name: previousName, rollNumber: previousRoll };
            if (rollNumber !== previousRoll) undo.autoRollNumber = deleteField();
            await updateDoc(doc(db, "students", docSnap.id), undo);
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
        if (!(await modalConfirm("Delete this student?"))) return;
        const deletedId = docSnap.id;
        try {
          // Soft delete: keep the student doc (with a deletedDate) so past
          // attendance/PDF history stays intact, but stop them appearing in
          // the Students list or in attendance marking from here on.
          const deletedDate = todayISO();
          await updateDoc(doc(db, "students", deletedId), { deletedDate });
          await renderStudents();
          showUndoToast("Student deleted.", async () => {
            await updateDoc(doc(db, "students", deletedId), { deletedDate: deleteField() });
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
  if (!(await modalConfirm("Delete " + checked.length + " selected student(s)?"))) return;

  studentDeleteSelectedBtn.disabled = true;
  studentStatus.textContent = "Deleting...";
  studentStatus.className = "msg";
  try {
    const deleted = [];
    const deletedDate = todayISO();
    for (const cb of checked) {
      deleted.push({ id: cb.dataset.id, data: cb._studentData });
      // Soft delete: keep the doc (with deletedDate) so past attendance/PDF
      // history stays intact; they just drop out of active lists from here.
      await updateDoc(doc(db, "students", cb.dataset.id), { deletedDate });
    }
    studentStatus.textContent = "Selected students deleted.";
    studentStatus.className = "msg success";
    await renderStudents();
    showUndoToast(deleted.length + " student(s) deleted.", async () => {
      for (const item of deleted) {
        await updateDoc(doc(db, "students", item.id), { deletedDate: deleteField() });
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
  if (rollNumber && (await isManualRollNumberTaken(rollNumber, null))) {
    studentStatus.textContent = "Roll number " + rollNumber + " is already assigned to another student.";
    studentStatus.className = "msg error";
    return;
  }
  studentAddBtn.disabled = true;
  studentStatus.textContent = "Adding...";
  studentStatus.className = "msg";
  try {
    // joinedDate marks the first day this student is counted for attendance.
    // No retroactive records are written for dates before this — earlier
    // attendance simply never included them.
    const joinedDate = todayISO();
    const newDoc = await addDoc(STUDENTS_COL, {
      name,
      rollNumber,
      joinedDate,
      createdAt: serverTimestamp(),
    });
    studentNameInput.value = "";
    studentRollInput.value = "";

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

// A student counts for a given date only from their joinedDate onward, and
// only up to (and including) their deletedDate if they've since been removed.
// Missing joinedDate/deletedDate = always active (covers students created
// before this system existed).
function isStudentActiveOnDate(student, dateStr) {
  if (student.joinedDate && dateStr < student.joinedDate) return false;
  if (student.deletedDate && dateStr > student.deletedDate) return false;
  return true;
}

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
  studentsCache
    .filter((student) => isStudentActiveOnDate(student, currentAttendanceDate))
    .forEach((student) => {
    const li = document.createElement("li");

    const roll = effectiveRollNumber(student);
    const span = document.createElement("span");
    span.textContent = student.name + (roll ? " (Roll " + roll + ")" : "");
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
  const name = await modalPrompt("Mark as Holiday", { label: "Holiday name", value: "" });
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
  const checked = attendanceRangeList.querySelectorAll('input[type="checkbox"]:checked');
  attendanceDeleteSelectedBtn.style.display = checked.length ? "block" : "none";
  attendanceSelectedCount.textContent = checked.length ? checked.length + " selected" : "";
}

attendanceSelectModeBtn.addEventListener("click", () => {
  const enabling = !attendanceRangeList.classList.contains("bulk-mode");
  attendanceRangeList.classList.toggle("bulk-mode", enabling);
  attendanceSelectModeBtn.textContent = enabling ? "Cancel" : "Select";
  if (!enabling) {
    attendanceRangeList.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    updateAttendanceDeleteSelectedVisibility();
  }
});
setupSelectAll(attendanceRangeList, attendanceSelectAllBtn, attendanceSelectModeBtn);


function summarizeAttendanceDoc(data, totalStudents) {
  if (data.holiday) return "Holiday: " + data.holiday;
  const records = data.records || {};
  const present = Object.values(records).filter((v) => v === "present").length;
  const absent = Math.max(totalStudents - present, 0);
  return present + " present, " + absent + " absent";
}

async function renderAttendanceRange(fromDate, toDate) {
  attendanceRangeList.innerHTML = "";
  attendanceDeleteSelectedBtn.style.display = "none";
  attendanceRangeResults.style.display = "none";
  attendanceSelectAllBtn.textContent = "Select All"; // fresh list is always fully unchecked
  try {
    const q = query(
      ATTENDANCE_COL,
      where(documentId(), ">=", fromDate),
      where(documentId(), "<=", toDate)
    );
    const [snap, studentsSnap] = await Promise.all([getDocs(q), getDocs(STUDENTS_COL)]);
    const totalStudents = studentsSnap.size;

    const docMap = {};
    snap.forEach((d) => (docMap[d.id] = d.data()));

    // Every date in the range gets a row, even ones nobody ever opened — those
    // default to "no holiday, nobody marked present" so they show (and export)
    // as fully absent right away, instead of only appearing once someone visits
    // Mark Attendance for that specific day.
    const docs = [];
    const cursor = new Date(fromDate + "T00:00:00");
    const end = new Date(toDate + "T00:00:00");
    while (cursor <= end) {
      const yyyy = cursor.getFullYear();
      const mm = String(cursor.getMonth() + 1).padStart(2, "0");
      const dd = String(cursor.getDate()).padStart(2, "0");
      const id = `${yyyy}-${mm}-${dd}`;
      docs.push({ id, data: docMap[id] || { holiday: null, records: {} } });
      cursor.setDate(cursor.getDate() + 1);
    }

    if (docs.length === 0) {
      attendanceRangeStatus.textContent = "Pick a valid date range.";
      attendanceRangeStatus.className = "msg";
      return;
    }
    attendanceRangeStatus.textContent = "";
    attendanceRangeResults.style.display = "block";

    docs.forEach(({ id, data }) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.id = id;
      checkbox._attendanceData = data;
      checkbox.addEventListener("change", updateAttendanceDeleteSelectedVisibility);
      li.appendChild(checkbox);
      makeRowTapSelectable(li, checkbox, attendanceRangeList);

      const span = document.createElement("span");
      span.textContent = id + " — " + summarizeAttendanceDoc(data, totalStudents);
      li.appendChild(span);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", async () => {
        if (!(await modalConfirm("Delete attendance for " + id + "?"))) return;
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
  if (!(await modalConfirm("Delete " + checked.length + " selected date(s) of attendance?"))) return;

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

    await recomputeAutoRollNumbers();
    const studentsSnap = await getDocs(query(STUDENTS_COL, orderBy("name", "asc")));
    const students = [];
    studentsSnap.forEach((d) => students.push({ id: d.id, ...d.data() }));
    students.sort((a, b) => {
      const rollA = parseInt(effectiveRollNumber(a), 10);
      const rollB = parseInt(effectiveRollNumber(b), 10);
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

    let pageInitialized = false;
    let cursorY = margin;
    const tableGap = 20; // gap between stacked tables on the same page

    function newPage() {
      if (pageInitialized) pdf.addPage();
      pageInitialized = true;
      drawPageFrame();
      cursorY = margin;
    }

    // First page + title block
    newPage();
    {
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

      cursorY = titleTop + 34 + 26;
    }

    // A student's cell for a given date is:
    //  - "blank" ('_') if the date falls before they joined, or after they
    //    were deleted — a transition period within a table that also covers
    //    dates where they were active.
    //  - their actual present/absent status otherwise.
    function studentDateStatus(student, dateId, dayData) {
      if (student.joinedDate && dateId < student.joinedDate) return "blank";
      if (student.deletedDate && dateId > student.deletedDate) return "blank";
      return (dayData.records || {})[student.id] || "absent";
    }

    // A student's row is only drawn in a table (weekly row) if at least one
    // date in that table falls within their active span — so they simply
    // don't appear in tables entirely before they joined or entirely after
    // they were deleted.
    function studentsForGroup(allStudents, groupDates) {
      const groupMin = groupDates[0].id;
      const groupMax = groupDates[groupDates.length - 1].id;
      return allStudents.filter((s) => {
        if (s.joinedDate && groupMax < s.joinedDate) return false;
        if (s.deletedDate && groupMin > s.deletedDate) return false;
        return true;
      });
    }

    dateGroups.forEach((groupDates) => {
      const dateColW = Math.max(minDateColW, (tableWidth - rollColW - nameColW) / groupDates.length);
      const groupStudents = studentsForGroup(students, groupDates);
      if (groupStudents.length === 0) return;

      // Not enough room for a header + at least one row? start a new page for this group's table
      if (cursorY + rowH * 2 > pageHeight - pageMargin - 10) {
        newPage();
      }

      let idx = 0;
      while (idx < groupStudents.length) {
        // how many student rows fit below the header starting at cursorY
        let y = cursorY + rowH;
        let rowsThatFit = 0;
        while (idx + rowsThatFit < groupStudents.length && y + rowH <= pageHeight - pageMargin - 10) {
          y += rowH;
          rowsThatFit++;
        }
        if (rowsThatFit === 0) {
          newPage();
          continue;
        }

        const tableTop = cursorY;
        drawHeaderRow(tableTop, groupDates, dateColW);
        const bodyTop = tableTop + rowH;
        const chunkEnd = idx + rowsThatFit;
        const bodyBottom = bodyTop + rowsThatFit * rowH;

        pdf.setFont("times", "normal");
        pdf.setFontSize(9);
        for (let i = idx; i < chunkEnd; i++) {
          const student = groupStudents[i];
          const rowY = bodyTop + (i - idx) * rowH;
          let x = margin;
          pdf.rect(x, rowY, rollColW, rowH);
          pdf.text(effectiveRollNumber(student) || "-", x + rollColW / 2, rowY + rowH / 2 + 3, { align: "center" });
          x += rollColW;
          pdf.rect(x, rowY, nameColW, rowH);
          const nameLines = pdf.splitTextToSize(student.name || "", nameColW - 6);
          pdf.text(nameLines[0] || "", x + 4, rowY + rowH / 2 + 3);
          x += nameColW;

          groupDates.forEach(({ id, data }) => {
            if (!data.holiday) {
              pdf.rect(x, rowY, dateColW, rowH);
              const status = studentDateStatus(student, id, data);
              const cellText = status === "present" ? "Present" : status === "absent" ? "Absent" : "_";
              if (status === "present") pdf.setTextColor(30, 140, 40);
              else if (status === "absent") pdf.setTextColor(192, 57, 43);
              else pdf.setTextColor(110, 110, 110);
              pdf.text(cellText, x + dateColW / 2, rowY + rowH / 2 + 3, { align: "center" });
              pdf.setTextColor(0, 0, 0);
            }
            x += dateColW;
          });
        }

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

        idx = chunkEnd;
        cursorY = bodyBottom;

        if (idx < groupStudents.length) {
          newPage();
        }
      }

      cursorY += tableGap;
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
  const checked = blogPostList.querySelectorAll('input[type="checkbox"]:checked');
  blogDeleteSelectedBtn.style.display = checked.length ? "block" : "none";
  blogSelectedCount.textContent = checked.length ? checked.length + " selected" : "";
}

blogSelectModeBtn.addEventListener("click", () => {
  const enabling = !blogPostList.classList.contains("bulk-mode");
  blogPostList.classList.toggle("bulk-mode", enabling);
  blogSelectModeBtn.textContent = enabling ? "Cancel" : "Select";
  if (!enabling) {
    blogPostList.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    updateBlogDeleteSelectedVisibility();
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
  removeBtn.addEventListener("click", () => {
    const nextSibling = row.nextSibling;
    const parent = row.parentNode;
    row.remove();
    showUndoToast("Block removed.", () => {
      parent.insertBefore(row, nextSibling);
    });
  });

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
// Dragging is desktop-only; on mobile the ▲▼ buttons handle reordering instead.
function isDesktopViewport() {
  return window.matchMedia("(min-width: 768px)").matches;
}
function updateBlockDraggability() {
  document
    .querySelectorAll(".blog-block-row, .blog-button-row, #noticeList li, #videoAdminList li, #syllabusRowList li")
    .forEach((row) => {
      row.draggable = isDesktopViewport();
    });
}
window.addEventListener("resize", updateBlockDraggability);

function makeBlockRowDraggable(row) {
  row.draggable = isDesktopViewport();
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
    if (type === "button") {
      const inputs = row.querySelectorAll("input");
      const text = inputs[0].value.trim();
      const url = inputs[1].value.trim();
      if (text && url) blocks.push({ type: "button", text, url });
      return;
    }
    const field = row.querySelector("textarea, input");
    const value = field.value.trim();
    if (value) blocks.push({ type, value });
  });
  return blocks;
}

function addButtonRow(text, url) {
  const row = document.createElement("div");
  row.className = "blog-block-row blog-button-row blog-dynamic-row";
  row.dataset.blockType = "button";

  const handle = document.createElement("span");
  handle.className = "blog-block-drag-handle";
  handle.textContent = "⠿";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Button text";
  textInput.value = text || "";
  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.placeholder = "https://...";
  urlInput.value = url || "";

  row.appendChild(handle);
  row.appendChild(textInput);
  row.appendChild(urlInput);
  row.appendChild(createBlockControls(row));

  makeBlockRowDraggable(row);
  blogBlocksContainer.appendChild(row);
}

blogAddButtonBtn.addEventListener("click", () => addButtonRow());
addTextBlockRow();
addButtonRow();

function collectButtons() {
  const buttons = [];
  blogBlocksContainer.querySelectorAll(".blog-button-row").forEach((row) => {
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
  addTextBlockRow();
  addButtonRow();
}

function fillBlogForm(data) {
  blogTitleInput.value = data.title || "";
  blogDateInput.value = data.date || "";

  blogBlocksContainer.innerHTML = "";
  const hasInlineButtons = Array.isArray(data.contentBlocks) && data.contentBlocks.some((b) => b.type === "button");
  if (Array.isArray(data.contentBlocks) && data.contentBlocks.length) {
    data.contentBlocks.forEach((b) => {
      if (b.type === "image") addImageBlockRow(b.value);
      else if (b.type === "button") addButtonRow(b.text, b.url);
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

  // Posts saved before buttons could be placed inline still keep their buttons in the
  // separate `buttons` field — append those at the end, same as before. Once resaved,
  // their position becomes whatever the editor drags them to, via contentBlocks above.
  if (!hasInlineButtons) {
    const buttons = Array.isArray(data.buttons) && data.buttons.length
      ? data.buttons
      : data.buttonText && data.buttonUrl
      ? [{ text: data.buttonText, url: data.buttonUrl }]
      : [];
    if (buttons.length) buttons.forEach((b) => addButtonRow(b.text, b.url));
    else addButtonRow();
  }
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
      makeRowTapSelectable(li, checkbox, blogPostList);

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
        blogAddBtn.dataset.editingDate = data.date || "";
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
        if (!(await modalConfirm('Delete "' + (data.title || "this post") + '"?'))) return;
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
  if (!(await modalConfirm("Delete " + checked.length + " selected post(s)?"))) return;

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
  const contentBlocks = collectContentBlocks();
  const buttons = collectButtons();
  const editingId = blogAddBtn.dataset.editingId;
  const manualDate = blogDateInput.value.trim();
  const date = manualDate || (editingId ? blogAddBtn.dataset.editingDate || formatReadable(todayISO()) : formatReadable(todayISO()));

  if (!title || contentBlocks.length === 0) {
    blogStatus.textContent = "Title and at least one content block are required.";
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
      delete blogAddBtn.dataset.editingDate;
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
      const existingSnap = await getDocs(BLOG_POSTS_COL);
      let maxNum = 25; // continues after the 25 static legacy posts
      existingSnap.forEach((d) => {
        const n = parseInt(d.id, 10);
        if (!isNaN(n) && n > maxNum) maxNum = n;
      });
      const newId = String(maxNum + 1);
      await setDoc(doc(db, "blogPosts", newId), { ...postData, createdAt: serverTimestamp() });
      clearBlogForm();
      blogStatus.textContent = "Post added.";
      blogStatus.className = "msg success";
      await renderBlogPosts();
      showUndoToast("Post added.", async () => {
        await deleteDoc(doc(db, "blogPosts", newId));
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

// ---------- Results (terms + students) ----------
const RESULT_TERMS_COL = collection(db, "resultTerms");

const DEFAULT_RESULT_TERM = {
  id: "2025-26-term-1",
  order: 2025,
  status: "active",
  term: "Term - 1",
  session: "2025-26",
  setCode: "Set-A 3/22",
  date: "27 July 2025",
  maxMarks: 100,
  students: [
    { roll: 7, name: "Riya", marks: 88.5, percentage: 88.5, rank: 1 },
    { roll: 1, name: "Anshika", marks: 82.5, percentage: 82.5, rank: 2 },
    { roll: 2, name: "Aryan", marks: 57, percentage: 57, rank: 3 },
  ],
};

let resultTermsCache = [];
let selectedResultTermId = null;

function populateResultTermSelect() {
  resultTermSelect.innerHTML = "";
  resultTermsCache.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.term + " — " + t.session + (t.status === "active" ? " (Latest)" : "");
    resultTermSelect.appendChild(opt);
  });
}

function getSelectedResultTerm() {
  return resultTermsCache.find((t) => t.id === selectedResultTermId);
}

async function saveResultTerm(term) {
  await setDoc(doc(db, "resultTerms", term.id), {
    order: term.order,
    status: term.status,
    term: term.term,
    session: term.session,
    setCode: term.setCode,
    date: term.date,
    maxMarks: term.maxMarks,
    students: term.students,
  });
}

function fillResultDetailsForm(term) {
  resultTermNameInput.value = term.term || "";
  resultSessionInput.value = term.session || "";
  resultSetCodeInput.value = term.setCode || "";
  resultDateInput.value = term.date || "";
  resultMaxMarksInput.value = term.maxMarks || "";
  resultTermStatusDisplay.textContent =
    term.status === "active"
      ? "This is the LATEST term — shown on the public Check Result search."
      : "This term is ARCHIVED — visible in the Results Archive, still searchable by roll/name.";
}

function previewResultId(term, student) {
  const parts = String(term.session || "").split("-");
  const sessionShort = (parts[0] || "").slice(-2) + (parts[1] || "").padStart(2, "0");
  const isTest = /test/i.test(term.term || "");
  const typeCode = isTest ? "TS" : "TM";
  const termNumMatch = String(term.term || "").match(/\d+/);
  const termNum = termNumMatch ? termNumMatch[0] : "1";
  const rollPadded = String(student.roll).padStart(2, "0");
  return (sessionShort + typeCode + termNum + rollPadded).toUpperCase();
}

function renderResultStudents() {
  resultStudentList.innerHTML = "";
  resultDeleteSelectedBtn.style.display = "none";
  resultSelectedCount.textContent = "";
  const term = getSelectedResultTerm();
  if (!term) return;

  term.students.forEach((student, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.index = index;
    checkbox.addEventListener("change", () => {
      const checked = resultStudentList.querySelectorAll('input[type="checkbox"]:checked');
      resultDeleteSelectedBtn.style.display = checked.length ? "block" : "none";
      resultSelectedCount.textContent = checked.length ? checked.length + " selected" : "";
    });
    li.appendChild(checkbox);
    makeRowTapSelectable(li, checkbox, resultStudentList);

    const span = document.createElement("span");
    span.textContent =
      "Roll " + student.roll + " — " + student.name + " — " + student.marks + " marks (" + student.percentage + "%, Rank " + student.rank + ")" +
      " [ID: " + (student.resultId || previewResultId(term, student)) + "]";
    li.appendChild(span);

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", async () => {
      const previous = { ...student };
      const updated = await modalPrompt("Edit Student Result", [
        { name: "roll", label: "Roll No.", value: student.roll },
        { name: "name", label: "Name", value: student.name },
        { name: "marks", label: "Marks", value: student.marks },
      ]);
      if (updated === null) return;
      const { roll, name, marks } = updated;

      const marksNum = parseFloat(marks);
      const maxMarksNum = parseFloat(term.maxMarks);
      const percentage =
        !isNaN(marksNum) && maxMarksNum
          ? Math.round(((marksNum / maxMarksNum) * 100) * 100) / 100
          : student.percentage;

      term.students[index] = {
        roll: parseFloat(roll) || roll,
        name: name.trim(),
        marks: parseFloat(marks) || marks,
        percentage,
        rank: student.rank,
      };
      recalculateRanks(term);
      try {
        await saveResultTerm(term);
        renderResultStudents();
        showUndoToast("Student updated.", async () => {
          term.students[index] = previous;
          recalculateRanks(term);
          await saveResultTerm(term);
          renderResultStudents();
        });
      } catch (err) {
        resultStudentStatus.textContent = "Save failed: " + (err.code || err.message);
        resultStudentStatus.className = "msg error";
        console.error(err);
      }
    });
    li.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      if (!(await modalConfirm("Delete this student's result?"))) return;
      const removed = term.students[index];
      term.students.splice(index, 1);
      recalculateRanks(term);
      try {
        await saveResultTerm(term);
        renderResultStudents();
        showUndoToast("Student deleted.", async () => {
          term.students.splice(index, 0, removed);
          recalculateRanks(term);
          await saveResultTerm(term);
          renderResultStudents();
        });
      } catch (err) {
        resultStudentStatus.textContent = "Delete failed: " + (err.code || err.message);
        resultStudentStatus.className = "msg error";
        console.error(err);
      }
    });
    li.appendChild(deleteBtn);

    resultStudentList.appendChild(li);
  });
}

resultSelectModeBtn.addEventListener("click", () => {
  const enabling = !resultStudentList.classList.contains("bulk-mode");
  resultStudentList.classList.toggle("bulk-mode", enabling);
  resultSelectModeBtn.textContent = enabling ? "Cancel" : "Select";
  if (!enabling) {
    resultStudentList.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
    resultDeleteSelectedBtn.style.display = "none";
    resultSelectedCount.textContent = "";
  }
});
setupSelectAll(resultStudentList, resultSelectAllBtn, resultSelectModeBtn);

resultDeleteSelectedBtn.addEventListener("click", async () => {
  const checked = resultStudentList.querySelectorAll('input[type="checkbox"]:checked');
  if (checked.length === 0) return;
  if (!(await modalConfirm("Delete " + checked.length + " selected student result(s)?"))) return;

  const term = getSelectedResultTerm();
  const indexes = Array.from(checked).map((cb) => parseInt(cb.dataset.index, 10)).sort((a, b) => b - a);
  const removed = indexes.map((i) => ({ index: i, student: term.students[i] }));
  indexes.forEach((i) => term.students.splice(i, 1));
  recalculateRanks(term);

  try {
    await saveResultTerm(term);
    renderResultStudents();
    showUndoToast(removed.length + " student(s) deleted.", async () => {
      removed
        .slice()
        .reverse()
        .forEach((r) => term.students.splice(r.index, 0, r.student));
      recalculateRanks(term);
      await saveResultTerm(term);
      renderResultStudents();
    });
  } catch (err) {
    resultStudentStatus.textContent = "Delete failed: " + (err.code || err.message);
    resultStudentStatus.className = "msg error";
    console.error(err);
  }
});

function recalculateRanks(term) {
  const sorted = term.students.slice().sort((a, b) => (parseFloat(b.marks) || 0) - (parseFloat(a.marks) || 0));
  let rank = 0;
  let prevMarks = null;
  let seen = 0;
  sorted.forEach((student) => {
    seen++;
    const marksVal = parseFloat(student.marks) || 0;
    if (marksVal !== prevMarks) {
      rank = seen;
      prevMarks = marksVal;
    }
    student.rank = rank;
  });
}

resultAddStudentBtn.addEventListener("click", async () => {
  const term = getSelectedResultTerm();
  const roll = resultRollInput.value.trim();
  const name = resultNameInput.value.trim();
  const marks = resultMarksInput.value.trim();

  if (!roll || !name || !marks) {
    resultStudentStatus.textContent = "Roll, Name, and Marks are required.";
    resultStudentStatus.className = "msg error";
    return;
  }

  const marksNum = parseFloat(marks);
  const maxMarksNum = parseFloat(term.maxMarks);

  // Simple sanity check — catches typos like 730 instead of 73.
  if (isNaN(marksNum) || marksNum < 0 || (maxMarksNum && marksNum > maxMarksNum)) {
    resultStudentStatus.textContent = maxMarksNum
      ? `Marks must be between 0 and ${maxMarksNum}.`
      : "Marks must be a valid non-negative number.";
    resultStudentStatus.className = "msg error";
    return;
  }

  const percentage =
    !isNaN(marksNum) && maxMarksNum
      ? Math.round(((marksNum / maxMarksNum) * 100) * 100) / 100
      : "";

  // Quick visual double-check before it's saved, since there's no second
  // person reviewing entered marks.
  const confirmLabel = maxMarksNum
    ? `Add ${name} — Roll ${roll} — ${marksNum}/${maxMarksNum} (${percentage}%)?`
    : `Add ${name} — Roll ${roll} — ${marksNum} marks?`;
  if (!(await modalConfirm(confirmLabel))) return;

  const newStudent = {
    roll: parseFloat(roll) || roll,
    name,
    marks: parseFloat(marks) || marks,
    percentage,
    rank: 0,
  };
  term.students.push(newStudent);
  recalculateRanks(term);

  try {
    await saveResultTerm(term);
    resultRollInput.value = "";
    resultNameInput.value = "";
    resultMarksInput.value = "";
    renderResultStudents();
    resultStudentStatus.textContent = "Student added.";
    resultStudentStatus.className = "msg success";
    showUndoToast("Student added.", async () => {
      term.students.pop();
      recalculateRanks(term);
      await saveResultTerm(term);
      renderResultStudents();
    });
  } catch (err) {
    term.students.pop();
    recalculateRanks(term);
    resultStudentStatus.textContent = "Could not add: " + (err.code || err.message);
    resultStudentStatus.className = "msg error";
    console.error(err);
  }
});

async function loadResultTerms() {
  try {
    const q = query(RESULT_TERMS_COL, orderBy("order", "desc"));
    const snap = await getDocs(q);
    resultTermsCache = [];
    snap.forEach((d) => {
      const data = d.data();
      resultTermsCache.push({
        id: d.id,
        order: data.order,
        status: data.status,
        term: data.term,
        session: data.session,
        setCode: data.setCode,
        date: data.date,
        maxMarks: data.maxMarks,
        students: Array.isArray(data.students) ? data.students : [],
      });
    });
    if (resultTermsCache.length === 0) {
      resultTermsCache.push({ ...DEFAULT_RESULT_TERM, students: DEFAULT_RESULT_TERM.students.map((s) => ({ ...s })) });
    }
    populateResultTermSelect();
    selectedResultTermId = resultTermsCache[0].id;
    resultTermSelect.value = selectedResultTermId;
    fillResultDetailsForm(getSelectedResultTerm());
    renderResultStudents();
  } catch (err) {
    resultStatus.textContent = "Could not load results: " + (err.code || err.message);
    resultStatus.className = "msg error";
    console.error(err);
  }
}

resultTermSelect.addEventListener("change", () => {
  selectedResultTermId = resultTermSelect.value;
  const term = getSelectedResultTerm();
  fillResultDetailsForm(term);
  renderResultStudents();
});

resultSaveDetailsBtn.addEventListener("click", async () => {
  const term = getSelectedResultTerm();
  if (!term) return;
  const previous = {
    term: term.term,
    session: term.session,
    setCode: term.setCode,
    date: term.date,
    maxMarks: term.maxMarks,
    order: term.order,
  };

  term.term = resultTermNameInput.value.trim();
  term.session = resultSessionInput.value.trim();
  term.setCode = resultSetCodeInput.value.trim();
  const manualResultDate = resultDateInput.value.trim();
  if (manualResultDate) term.date = manualResultDate;
  else if (!term.date) term.date = formatReadable(todayISO());
  term.maxMarks = parseFloat(resultMaxMarksInput.value) || resultMaxMarksInput.value.trim();
  const yearMatch = term.session.match(/\d{4}/);
  if (yearMatch) term.order = parseInt(yearMatch[0], 10);

  if (!term.term || !term.session) {
    resultDetailsStatus.textContent = "Term Name and Session are required.";
    resultDetailsStatus.className = "msg error";
    Object.assign(term, previous);
    return;
  }

  try {
    await saveResultTerm(term);
    populateResultTermSelect();
    resultTermSelect.value = term.id;
    resultDetailsStatus.textContent = "Term details saved.";
    resultDetailsStatus.className = "msg success";
    showUndoToast("Term details updated.", async () => {
      Object.assign(term, previous);
      await saveResultTerm(term);
      populateResultTermSelect();
      resultTermSelect.value = term.id;
      fillResultDetailsForm(term);
    });
  } catch (err) {
    Object.assign(term, previous);
    resultDetailsStatus.textContent = "Save failed: " + (err.code || err.message);
    resultDetailsStatus.className = "msg error";
    console.error(err);
  }
});

resultNewTermBtn.addEventListener("click", async () => {
  const newTermInfo = await modalPrompt("New Term", [
    { name: "termName", label: "Term name (e.g. Term - 2)", value: "" },
    { name: "session", label: "Session (e.g. 2025-26)", value: "" },
  ]);
  if (!newTermInfo || !newTermInfo.termName.trim() || !newTermInfo.session.trim()) return;
  const termName = newTermInfo.termName;
  const session = newTermInfo.session;

  const slug = (termName.trim() + "-" + session.trim()).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (resultTermsCache.some((t) => t.id === slug)) {
    resultStatus.textContent = "A term with that name/session already exists.";
    resultStatus.className = "msg error";
    return;
  }
  const yearMatch = session.match(/\d{4}/);
  const order = yearMatch ? parseInt(yearMatch[0], 10) : Date.now();

  const newTerm = {
    id: slug,
    order,
    status: "archived",
    term: termName.trim(),
    session: session.trim(),
    setCode: "",
    date: "",
    maxMarks: 100,
    students: [],
  };

  try {
    await saveResultTerm(newTerm);
    resultTermsCache.push(newTerm);
    resultTermsCache.sort((a, b) => b.order - a.order);
    populateResultTermSelect();
    selectedResultTermId = slug;
    resultTermSelect.value = slug;
    fillResultDetailsForm(newTerm);
    renderResultStudents();
    resultStatus.textContent = "Term created (archived — publish it when ready).";
    resultStatus.className = "msg success";
    showUndoToast('Term "' + termName + '" created.', async () => {
      await deleteDoc(doc(db, "resultTerms", slug));
      resultTermsCache = resultTermsCache.filter((t) => t.id !== slug);
      if (resultTermsCache.length === 0) {
        resultTermsCache.push({ ...DEFAULT_RESULT_TERM, students: DEFAULT_RESULT_TERM.students.map((s) => ({ ...s })) });
      }
      populateResultTermSelect();
      selectedResultTermId = resultTermsCache[0].id;
      resultTermSelect.value = selectedResultTermId;
      fillResultDetailsForm(getSelectedResultTerm());
      renderResultStudents();
    });
  } catch (err) {
    resultStatus.textContent = "Could not create term: " + (err.code || err.message);
    resultStatus.className = "msg error";
    console.error(err);
  }
});

resultDeleteTermBtn.addEventListener("click", async () => {
  const term = getSelectedResultTerm();
  if (!term) return;
  if (!(await modalConfirm('Delete "' + term.term + " — " + term.session + '"? This removes it entirely, including from the archive.'))) return;
  const deletedTerm = { ...term, students: term.students.map((s) => ({ ...s })) };

  try {
    await deleteDoc(doc(db, "resultTerms", term.id));
    resultTermsCache = resultTermsCache.filter((t) => t.id !== term.id);
    if (resultTermsCache.length === 0) {
      resultTermsCache.push({ ...DEFAULT_RESULT_TERM, students: DEFAULT_RESULT_TERM.students.map((s) => ({ ...s })) });
    }
    populateResultTermSelect();
    selectedResultTermId = resultTermsCache[0].id;
    resultTermSelect.value = selectedResultTermId;
    fillResultDetailsForm(getSelectedResultTerm());
    renderResultStudents();
    resultStatus.textContent = "Term deleted.";
    resultStatus.className = "msg success";
    showUndoToast('Term "' + deletedTerm.term + '" deleted.', async () => {
      await saveResultTerm(deletedTerm);
      await loadResultTerms();
    });
  } catch (err) {
    resultStatus.textContent = "Delete failed: " + (err.code || err.message);
    resultStatus.className = "msg error";
    console.error(err);
  }
});

resultPublishBtn.addEventListener("click", async () => {
  const term = getSelectedResultTerm();
  if (!term) return;
  if (term.status === "active") {
    resultStatus.textContent = "This term is already the latest.";
    resultStatus.className = "msg";
    return;
  }
  const previouslyActive = resultTermsCache.find((t) => t.status === "active");

  try {
    term.status = "active";
    await saveResultTerm(term);
    if (previouslyActive) {
      previouslyActive.status = "archived";
      await saveResultTerm(previouslyActive);
    }
    populateResultTermSelect();
    resultTermSelect.value = term.id;
    fillResultDetailsForm(term);
    resultStatus.textContent = '"' + term.term + " — " + term.session + '" is now the latest published result.';
    resultStatus.className = "msg success";
    showUndoToast("Published as latest.", async () => {
      term.status = "archived";
      await saveResultTerm(term);
      if (previouslyActive) {
        previouslyActive.status = "active";
        await saveResultTerm(previouslyActive);
      }
      populateResultTermSelect();
      resultTermSelect.value = selectedResultTermId;
      fillResultDetailsForm(getSelectedResultTerm());
    });
  } catch (err) {
    resultStatus.textContent = "Publish failed: " + (err.code || err.message);
    resultStatus.className = "msg error";
    console.error(err);
  }
});
