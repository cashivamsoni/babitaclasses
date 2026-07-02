/* =========================================================
   Babita Classes — Result Checker Script
   Used by: result.html only
   Data below is entered manually from the official Term - 1
   (2025-26) rank sheet. Add new terms/sessions as new objects
   inside the RESULT_DATA array below when new results are
   declared — nothing else in this file needs to change.
   ========================================================= */

(function () {
  /* ---------- Result Data ---------- */
  // To add a new term's results in future, copy this object,
  // update term/session/date/setCode and the students array.
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

  const form = document.getElementById("resultForm");
  const rollInput = document.getElementById("rollInput");
  const nameInput = document.getElementById("nameInput");
  const output = document.getElementById("resultOutput");
  const resetBtn = document.getElementById("resultResetBtn");
  if (!form || !rollInput || !nameInput || !output) return;

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

  function renderNotFound() {
    output.innerHTML =
      '<div class="card" style="padding:14px;margin-top:6px">' +
      '<p class="small" style="margin:0">No result found for the entered roll number and name. Please double-check the details and try again. If you believe this is an error, please <a href="https://babitaclasses.vercel.app/#contact">contact us</a>.</p>' +
      "</div>";
  }

  function renderValidationError(message) {
    output.innerHTML =
      '<div class="card" style="padding:14px;margin-top:6px">' +
      '<p class="small" style="margin:0">' + escapeHtml(message) + "</p>" +
      "</div>";
  }

  function renderResult(match) {
    const term = match.term;
    const s = match.student;
    const resultStatus = s.percentage >= 40 ? "PASS" : "FAIL";
    const statusColor = resultStatus === "PASS" ? "#2e7d32" : "#c62828";
    output.innerHTML =
      '<div class="card" style="padding:14px;margin-top:6px">' +
      "<h2>Result Found — " + escapeHtml(s.name) + "</h2>" +
      '<div style="overflow:auto">' +
      '<table aria-label="Result details">' +
      "<tbody>" +
      "<tr><th>Roll No.</th><td>" + escapeHtml(s.roll) + "</td></tr>" +
      "<tr><th>Student Name</th><td>" + escapeHtml(s.name) + "</td></tr>" +
      "<tr><th>Marks Obtained</th><td>" + escapeHtml(s.marks) + " / " + escapeHtml(term.maxMarks) + "</td></tr>" +
      "<tr><th>Percentage</th><td>" + escapeHtml(s.percentage) + "%</td></tr>" +
      "<tr><th>Result</th><td><strong style=\"color:" + statusColor + "\">" + resultStatus + "</strong></td></tr>" +
      "<tr><th>Rank</th><td>" + escapeHtml(s.rank) + "</td></tr>" +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "</div>";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const rollVal = rollInput.value;
    const nameVal = nameInput.value;

    if (!String(rollVal).trim() || !String(nameVal).trim()) {
      renderValidationError("Please enter both your roll number and your full name to check your result.");
      if (resetBtn) resetBtn.style.display = "none";
      return;
    }

    const match = findResult(rollVal, nameVal);
    if (match) {
      renderResult(match);
    } else {
      renderNotFound();
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
