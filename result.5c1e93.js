/* =========================================================
   Babita Classes — Result Checker Script
   Used by: result.html only
   Data below is entered manually from the official Term - 1
   (2025-26) rank sheet. Add new terms/sessions as new objects
   inside the RESULT_DATA array below when new results are
   declared — nothing else in this file needs to change.

   Result ID format: {SessionShort}TM{TermNumber}{Roll(2-digit)}
   e.g. Session 2025-26, Term 1, Roll 1 -> 2526TM101
   ========================================================= */

(function () {
  /* ---------- Result Data ---------- */
  // To add a new term's results in future, copy this object,
  // update term/session/date/setCode and the students array.
  // Result IDs are generated automatically below — do not add
  // them here manually.
  const RESULT_DATA = [
    {
      term: "Term - 1",
      session: "2025-26",
      setCode: "Set-A 3/22",
      date: "27 July 2025",
      maxMarks: 100,
      students: [
        { roll: 7, name: "Riya",    marks: 88.5, percentage: 88.5, rank: 1 },
        { roll: 1, name: "Anshika", marks: 82.5, percentage: 82.5, rank: 2 },
        { roll: 2, name: "Aryan",   marks: 57,   percentage: 57,   rank: 3 }
      ]
    }
  ];

  /* ---------- Result ID generation + lookup index ---------- */
  function computeResultId(term, student) {
    const parts = String(term.session).split("-");
    const sessionShort =
      (parts[0] || "").slice(-2) + (parts[1] || "").padStart(2, "0");
    const isTest = /test/i.test(term.term);
    const typeCode = isTest ? "TS" : "TM";
    const termNumMatch = String(term.term).match(/\d+/);
    const termNum = termNumMatch ? termNumMatch[0] : "1";
    const rollPadded = String(student.roll).padStart(2, "0");
    return (sessionShort + typeCode + termNum + rollPadded).toUpperCase();
  }

  const RESULT_INDEX = {};
  RESULT_DATA.forEach(function (term) {
    term.students.forEach(function (student) {
      student.resultId = computeResultId(term, student);
      RESULT_INDEX[student.resultId] = { term: term, student: student };
    });
  });

  /* ---------- Firebase: load the published (admin-managed) result + archive ----------
     If nothing has been published yet, the hardcoded RESULT_DATA above stays in effect
     as a safe fallback — nothing here can break the existing checker. */
  (async function () {
    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js");
      const { getFirestore, collection, query, orderBy, getDocs } = await import(
        "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js"
      );

      const firebaseConfig = {
        apiKey: "AIzaSyCeIXfg73jN9d6rvzkeenfUja3lyCVPWMA",
        authDomain: "babitaclasses-eb3e4.firebaseapp.com",
        projectId: "babitaclasses-eb3e4",
        storageBucket: "babitaclasses-eb3e4.firebasestorage.app",
        messagingSenderId: "191824554368",
        appId: "1:191824554368:web:bb9f7af3c4634f7616f965",
      };
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      const q = query(collection(db, "resultTerms"), orderBy("order", "desc"));
      const snap = await getDocs(q);
      if (snap.empty) return;

      const archivedTerms = [];
      let activeTerm = null;
      snap.forEach(function (docSnap) {
        const data = docSnap.data();
        const termObj = {
          term: data.term,
          session: data.session,
          setCode: data.setCode,
          date: data.date,
          maxMarks: data.maxMarks,
          students: Array.isArray(data.students) ? data.students.map(function (s) { return Object.assign({}, s); }) : [],
        };
        if (data.status === "active" && !activeTerm) {
          activeTerm = termObj;
        } else {
          archivedTerms.push(termObj);
        }
      });

      // Both "Check Your Result" (roll+name) and "Verify a Result" (Result ID) search
      // every term — current and archived — so old results stay fully checkable.
      RESULT_DATA.length = 0;
      if (activeTerm) RESULT_DATA.push(activeTerm);
      archivedTerms.forEach(function (t) { RESULT_DATA.push(t); });

      Object.keys(RESULT_INDEX).forEach(function (k) { delete RESULT_INDEX[k]; });
      RESULT_DATA.forEach(function (term) {
        term.students.forEach(function (student) {
          // Honor an admin-set Result ID if provided; otherwise auto-compute as before.
          student.resultId = student.resultId || computeResultId(term, student);
          RESULT_INDEX[student.resultId] = { term: term, student: student };
        });
      });

      // Update the "Check Your Result" header to match the currently active term
      if (activeTerm) {
        const termSessionEl = document.getElementById("resultHeaderTermSession");
        const detailsEl = document.getElementById("resultHeaderDetails");
        const dateEl2 = document.getElementById("resultHeaderDate");
        if (termSessionEl) termSessionEl.textContent = activeTerm.term + ", Session " + activeTerm.session;
        if (detailsEl) detailsEl.textContent = activeTerm.term + " (" + (activeTerm.setCode || "") + "), Session " + activeTerm.session;
        if (dateEl2) dateEl2.textContent = activeTerm.date || "";
      }

      // Archive: list past terms by name only — no student data is shown here.
      // Clicking a term opens a mini roll+name checker scoped to just that term.
      const archiveListEl = document.getElementById("resultsArchiveList");
      if (archiveListEl) {
        if (archivedTerms.length === 0) {
          archiveListEl.innerHTML = '<p class="small">No archived results yet.</p>';
        } else {
          let html = '<ul style="list-style:none; padding-left:0;">';
          archivedTerms.forEach(function (term, i) {
            html +=
              '<li style="margin-bottom:10px; border-bottom:1px solid rgba(0,0,0,0.08); padding-bottom:10px;">' +
              '<a href="javascript:void(0)" class="archive-term-toggle" data-term-index="' + i + '" style="font-weight:600;">' +
              escapeHtml(term.term) + " — Session " + escapeHtml(term.session) +
              (term.date ? " (declared " + escapeHtml(term.date) + ")" : "") +
              "</a>" +
              '<div class="archive-term-form" data-term-index="' + i + '" style="display:none; margin-top:10px;">' +
              '<form class="archive-check-form" data-term-index="' + i + '" autocomplete="off">' +
              '<div class="flex" style="flex-direction:column;align-items:stretch">' +
              '<input type="text" class="search archive-roll" placeholder="Roll Number" inputmode="numeric" style="max-width:160px">' +
              '<input type="text" class="search archive-name" placeholder="Full Name" style="margin-top:8px">' +
              "</div>" +
              '<div class="flex" style="margin-top:8px">' +
              '<button type="submit" class="btn-inline">Check</button>' +
              '<button type="button" class="btn-inline1 archive-reset-btn" style="display:none">Check Another Result</button>' +
              "</div>" +
              "</form>" +
              '<div class="archive-output" style="margin-top:10px"></div>' +
              "</div>" +
              "</li>";
          });
          html += "</ul>";
          archiveListEl.innerHTML = html;

          archiveListEl.querySelectorAll(".archive-term-toggle").forEach(function (link) {
            link.addEventListener("click", function () {
              const idx = link.dataset.termIndex;
              const form = archiveListEl.querySelector('.archive-term-form[data-term-index="' + idx + '"]');
              if (form) form.style.display = form.style.display === "none" ? "block" : "none";
            });
          });

          archiveListEl.querySelectorAll(".archive-check-form").forEach(function (form) {
            const idx = form.dataset.termIndex;
            const term = archivedTerms[idx];
            const rollInput = form.querySelector(".archive-roll");
            const nameInput = form.querySelector(".archive-name");
            const outputEl = form.parentElement.querySelector(".archive-output");
            const resetBtn = form.querySelector(".archive-reset-btn");

            form.addEventListener("submit", function (e) {
              e.preventDefault();
              const student = findResultInTerm(term, rollInput.value, nameInput.value);
              if (student) {
                outputEl.innerHTML = buildResultHTML(term, student);
                lastShownResult = { term: term, student: student };
              } else {
                outputEl.innerHTML = '<p class="small" style="color:#c0392b">No matching result found for that roll number and name in this term.</p>';
              }
              resetBtn.style.display = "inline-block";
            });

            resetBtn.addEventListener("click", function () {
              form.reset();
              outputEl.innerHTML = "";
              resetBtn.style.display = "none";
              rollInput.focus();
            });
          });
        }
      }
    } catch (err) {
      // Any failure here — keep the hardcoded fallback data untouched
      console.error("Could not load published results:", err);
    }
  })();

  // Tracks whichever result is currently on screen, so Ctrl+P / Cmd+P
  // can download the same PDF instead of triggering a browser print.
  let lastShownResult = null;

  /* ---------- Shared helpers ---------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizeName(str) {
    return String(str).trim().toLowerCase().replace(/\s+/g, " ");
  }

  function findResult(rollRaw, nameRaw) {
    const rollNum = parseInt(String(rollRaw).trim(), 10);
    const nameNorm = normalizeName(nameRaw);
    if (isNaN(rollNum) || !nameNorm) return null;

    for (let t = 0; t < RESULT_DATA.length; t++) {
      const term = RESULT_DATA[t];
      for (let s = 0; s < term.students.length; s++) {
        const student = term.students[s];
        if (student.roll === rollNum && normalizeName(student.name) === nameNorm) {
          return { term: term, student: student };
        }
      }
    }
    return null;
  }

  function findResultInTerm(term, rollRaw, nameRaw) {
    const rollNum = parseInt(String(rollRaw).trim(), 10);
    const nameNorm = normalizeName(nameRaw);
    if (isNaN(rollNum) || !nameNorm) return null;
    for (let s = 0; s < term.students.length; s++) {
      const student = term.students[s];
      if (student.roll === rollNum && normalizeName(student.name) === nameNorm) {
        return student;
      }
    }
    return null;
  }

  function findResultById(idRaw) {
    const id = String(idRaw).trim().toUpperCase();
    if (!id) return null;
    return RESULT_INDEX[id] || null;
  }

  function buildResultHTML(term, student) {
    const resultStatus = student.percentage >= 40 ? "PASS" : "FAIL";
    const statusColor = resultStatus === "PASS" ? "#2e7d32" : "#c62828";
    return (
      '<div class="card" style="padding:14px;margin-top:6px">' +
      "<h2>Result Found — " + escapeHtml(student.name) + "</h2>" +
      '<div style="overflow:auto">' +
      '<table aria-label="Result details">' +
      "<tbody>" +
      "<tr><th>Roll No.</th><td>" + escapeHtml(student.roll) + "</td></tr>" +
      "<tr><th>Student Name</th><td>" + escapeHtml(student.name) + "</td></tr>" +
      "<tr><th>Marks Obtained</th><td>" + escapeHtml(student.marks) + " / " + escapeHtml(term.maxMarks) + "</td></tr>" +
      "<tr><th>Percentage</th><td>" + escapeHtml(student.percentage) + "%</td></tr>" +
      "<tr><th>Result</th><td><strong style=\"color:" + statusColor + "\">" + resultStatus + "</strong></td></tr>" +
      "<tr><th>Rank</th><td>" + escapeHtml(student.rank) + "</td></tr>" +
      "<tr><th>Result ID</th><td>" + escapeHtml(student.resultId) + "</td></tr>" +
      "</tbody>" +
      "</table>" +
      "</div>" +
      '<div class="flex" style="margin-top:12px">' +
      '<button type="button" class="btn-inline pdf-download-btn" data-resultid="' + escapeHtml(student.resultId) + '">Download / Print Result (PDF)</button>' +
      "</div>" +
      "</div>"
    );
  }

  function renderNotFound(output) {
    output.innerHTML =
      '<div class="card" style="padding:14px;margin-top:6px">' +
      '<p class="small" style="margin:0">No result found for the entered details. Please double-check and try again. If you believe this is an error, please <a href="#contact">contact us</a>.</p>' +
      "</div>";
  }

  function renderValidationError(output, message) {
    output.innerHTML =
      '<div class="card" style="padding:14px;margin-top:6px">' +
      '<p class="small" style="margin:0">' + escapeHtml(message) + "</p>" +
      "</div>";
  }

  /* ---------- Main "Check Your Result" form ---------- */
  (function () {
    const form = document.getElementById("resultForm");
    const rollInput = document.getElementById("rollInput");
    const nameInput = document.getElementById("nameInput");
    const output = document.getElementById("resultOutput");
    const resetBtn = document.getElementById("resultResetBtn");
    if (!form || !rollInput || !nameInput || !output) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const rollVal = rollInput.value;
      const nameVal = nameInput.value;

      if (!String(rollVal).trim() || !String(nameVal).trim()) {
        renderValidationError(output, "Please enter both your roll number and your full name to check your result.");
        if (resetBtn) resetBtn.style.display = "none";
        return;
      }

      const match = findResult(rollVal, nameVal);
      if (match) {
        output.innerHTML = buildResultHTML(match.term, match.student);
        lastShownResult = match;
      } else {
        renderNotFound(output);
      }
      if (resetBtn) resetBtn.style.display = "inline-block";
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        output.innerHTML = "";
        resetBtn.style.display = "none";
        rollInput.focus();
      });
    }
  })();

  /* ---------- "Verify a Result" (by Result ID) form ---------- */
  (function () {
    const form = document.getElementById("verifyForm");
    const idInput = document.getElementById("verifyIdInput");
    const output = document.getElementById("verifyOutput");
    const resetBtn = document.getElementById("verifyResetBtn");
    if (!form || !idInput || !output) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const idVal = idInput.value;

      if (!String(idVal).trim()) {
        renderValidationError(output, "Please enter a Result ID to verify.");
        if (resetBtn) resetBtn.style.display = "none";
        return;
      }

      const match = findResultById(idVal);
      if (match) {
        output.innerHTML = buildResultHTML(match.term, match.student);
        lastShownResult = match;
      } else {
        output.innerHTML =
          '<div class="card" style="padding:14px;margin-top:6px">' +
          '<p class="small" style="margin:0">No result found for this Result ID. Please double-check the ID and try again, or <a href="#contact">contact us</a> for assistance.</p>' +
          "</div>";
      }
      if (resetBtn) resetBtn.style.display = "inline-block";
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        output.innerHTML = "";
        resetBtn.style.display = "none";
        idInput.focus();
      });
    }
  })();

  /* ---------- PDF generation (matches official result-slip format) ---------- */
  function loadImageAsDataURL(url) {
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Image fetch failed: " + url);
        return res.blob();
      })
      .then(function (blob) {
        return new Promise(function (resolve, reject) {
          const reader = new FileReader();
          reader.onloadend = function () { resolve(reader.result); };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      })
      .catch(function (err) {
        console.warn("Could not load image for PDF:", url, err);
        return null;
      });
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  async function generateResultPDF(term, student) {
    try {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("The PDF tool did not load. Please check your internet connection and try again.");
        return;
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = 210, pageHeight = 297;
      const marginX = 15;
      const contentWidth = pageWidth - marginX * 2;
      const FONT = "times"; // Times New Roman equivalent — used for every element below

      // Outer border
      doc.setDrawColor(0);
      doc.setLineWidth(0.6);
      doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

      // Logo
      const logoData = await loadImageAsDataURL("https://babitaclasses.vercel.app/images/logo.jpg");
      if (logoData) {
        doc.addImage(logoData, "JPEG", pageWidth / 2 - 12, 14, 24, 24);
      }

      let y = 46;
      doc.setFont(FONT, "bold");
      doc.setFontSize(22);
      doc.text("BABITA CLASSES", pageWidth / 2, y, { align: "center" });

      const termNumMatch = String(term.term).match(/\d+/);
      const termNum = termNumMatch ? termNumMatch[0] : "1";

      y += 8;
      doc.setFontSize(13);
      doc.text("SESSION: " + term.session, pageWidth / 2, y, { align: "center" });
      y += 7;
      doc.text("EXAMINATION: TERM " + termNum, pageWidth / 2, y, { align: "center" });
      y += 7;
      doc.text("RESULT STATEMENT", pageWidth / 2, y, { align: "center" });

      // Table
      y += 10;
      const resultStatus = student.percentage >= 40 ? "PASS" : "FAIL";
      const rows = [
        ["ROLL NO.", String(student.roll)],
        ["STUDENT NAME", student.name],
        ["MARKS OBTAINED", student.marks + " / " + term.maxMarks],
        ["PERCENTAGE", student.percentage + "%"],
        ["RESULT", resultStatus],
        ["RANK", String(student.rank)],
        ["RESULT ID", student.resultId]
      ];
      const tableX = marginX;
      const col1Width = contentWidth * 0.5;
      const col2Width = contentWidth * 0.5;
      const rowHeight = 10;

      doc.setLineWidth(0.4);
      doc.setFontSize(11);
      rows.forEach(function (row, i) {
        const rowY = y + i * rowHeight;
        doc.rect(tableX, rowY, col1Width, rowHeight);
        doc.rect(tableX + col1Width, rowY, col2Width, rowHeight);
        doc.setFont(FONT, "bold");
        doc.text(row[0], tableX + col1Width / 2, rowY + rowHeight / 2 + 3, { align: "center" });
        doc.setFont(FONT, "normal");
        doc.text(String(row[1]), tableX + col1Width + col2Width / 2, rowY + rowHeight / 2 + 3, { align: "center" });
      });

      const dateY = y + rows.length * rowHeight + 10;
      doc.setFont(FONT, "bold");
      doc.setFontSize(11);
      doc.text("Date of result declaration: " + term.date, marginX, dateY);

      // Signatures (Principal on the left, Evaluator on the right of the same row)
      const sigWidth = 30, sigHeight = 14;
      const sigGap = 6;
      const sigBlockWidth = sigWidth * 2 + sigGap;
      const sigStartX = pageWidth - marginX - sigBlockWidth;
      const sigImgY = dateY - 6;

      const principalSigData = await loadImageAsDataURL("https://babitaclasses.vercel.app/images/babita-signature.png");
      const evaluatorSigData = await loadImageAsDataURL("https://babitaclasses.vercel.app/images/shivam-signature.png");

      const principalX = sigStartX;
      const evaluatorX = sigStartX + sigWidth + sigGap;

      if (principalSigData) doc.addImage(principalSigData, "PNG", principalX, sigImgY, sigWidth, sigHeight);
      if (evaluatorSigData) doc.addImage(evaluatorSigData, "PNG", evaluatorX, sigImgY, sigWidth, sigHeight);

      const sigCaptionY1 = sigImgY + sigHeight + 4;
      const sigCaptionY2 = sigCaptionY1 + 4;
      doc.setFont(FONT, "bold");
      doc.setFontSize(9);
      doc.text("Babita Soni", principalX + sigWidth / 2, sigCaptionY1, { align: "center" });
      doc.text("(Principal)", principalX + sigWidth / 2, sigCaptionY2, { align: "center" });
      doc.text("Shivam Soni", evaluatorX + sigWidth / 2, sigCaptionY1, { align: "center" });
      doc.text("(Evaluator)", evaluatorX + sigWidth / 2, sigCaptionY2, { align: "center" });

      // QR code + verify text (bottom-left)
      const qrSize = 28;
      const qrX = marginX;
      const qrY = sigCaptionY2 + 12;
      const qrData = await loadImageAsDataURL("https://babitaclasses.vercel.app/images/verify-result-qr-code.png");
      if (qrData) {
        doc.addImage(qrData, "PNG", qrX, qrY, qrSize, qrSize);
      }
      doc.setFont(FONT, "bold");
      doc.setFontSize(8);
      doc.text("Verify your result", qrX + qrSize / 2, qrY + qrSize + 4, { align: "center" });
      doc.text("Scan QR code > Enter", qrX + qrSize / 2, qrY + qrSize + 8, { align: "center" });
      doc.text("Result ID", qrX + qrSize / 2, qrY + qrSize + 12, { align: "center" });

      // Disclaimer — normal weight, justified, spans full content width
      const disclaimerY = qrY + qrSize + 12 + 10;
      doc.setFont(FONT, "normal");
      doc.setFontSize(9);
      const disclaimer =
        "Disclaimer: The results published on this page are correct at the time of release by Babita Classes and are valid for the purposes of further academic purposes. The organization accepts no responsibility thereafter for any errors or omissions caused due to transmission via the Internet or downloading/printing by the user. No material from this website may be copied, reproduced, published, uploaded, posted, transmitted, or distributed in any manner unless expressly authorized by Babita Classes. Users are strictly prohibited from changing, modifying, or preparing derivative works from the content of this site.\n" +
        "For any discrepancy in results, clarifications, or confirmation, please address your inquiries to: Babita Classes: 1/2, Juhi Bamburahiya Colony, Kanpur, Uttar Pradesh \u2013 208014 Email: babitaclasses7@gmail.com Phone: +91-7388311148";
      const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
      doc.text(disclaimerLines, marginX, disclaimerY, { align: "justify", maxWidth: contentWidth });

      // Downloaded timestamp (bottom-left, fixed position)
      const now = new Date();
      const timestamp =
        pad2(now.getDate()) + "-" + pad2(now.getMonth() + 1) + "-" + now.getFullYear() +
        " " + pad2(now.getHours()) + ":" + pad2(now.getMinutes()) + ":" + pad2(now.getSeconds());
      doc.setFont(FONT, "bold");
      doc.setFontSize(8);
      doc.text(
        "Downloaded from https://babitaclasses.vercel.app/result on " + timestamp,
        marginX,
        pageHeight - 14
      );

      doc.save("BabitaClasses_Result_" + student.resultId + ".pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Sorry, something went wrong while generating the PDF. Please try again.");
    }
  }

  // Event delegation so the dynamically-inserted download buttons
  // (in either the main results output or the verify output) work.
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".pdf-download-btn");
    if (!btn) return;
    const id = btn.getAttribute("data-resultid");
    const rec = findResultById(id);
    if (rec) generateResultPDF(rec.term, rec.student);
  });

  // Intercept Ctrl+P / Cmd+P so a student "printing" their result gets
  // the same official PDF format instead of a browser print-out.
  document.addEventListener("keydown", function (e) {
    const isPrintShortcut = (e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P");
    if (!isPrintShortcut) return;
    e.preventDefault();
    if (lastShownResult) {
      generateResultPDF(lastShownResult.term, lastShownResult.student);
    } else {
      alert("Please look up your result first (using your roll number & name, or your Result ID), then press Ctrl+P / Cmd+P again to download it as a PDF.");
    }
  });
})();
