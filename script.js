/* =========================================================
   Babita Classes — Shared JavaScript
   Used by: index.html and blog.html
   ========================================================= */



/* ---------- Light/Dark Mode Toggle ---------- */
(function () {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle.textContent = "☀️";
    } else {
      root.removeAttribute("data-theme");
      themeToggle.textContent = "🌙";
    }
  }

  applyTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light");

  themeToggle.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
})();

/* ---------- Menu Toggle ---------- */
(function () {
  const toggleBtn = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    nav.classList.toggle("show");
    toggleBtn.classList.toggle("open");
  });

  // Close when any nav link is clicked
  document.querySelectorAll("#mainNav a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("show");
      toggleBtn.classList.remove("open");
    });
  });

  // Close when clicking outside the header/nav area
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target) && e.target !== toggleBtn) {
      nav.classList.remove("show");
      toggleBtn.classList.remove("open");
    }
  });
})();

/* ---------- Welcome Popup ---------- */
(function () {
  const closeBtn = document.getElementById("popupCloseUnique");
  const overlay = document.getElementById("popupOverlayUnique");

  // Open popup (if you want to trigger it on page load or a button)
  if (overlay) {
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // lock scroll
  }

  if (closeBtn) {
    closeBtn.onclick = function () {
      overlay.style.display = "none";
      document.body.style.overflow = ""; // restore scroll
    };
  }
})();

/* ---------- Scroll-to-Top Button ---------- */
(function () {
  const topBtn = document.getElementById("topBtn");
  if (!topBtn) return;

  window.addEventListener("scroll", function () {
    topBtn.style.display =
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
        ? "block"
        : "none";
  });

  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ---------- Share Button ---------- */
(function () {
  const shareBtn = document.getElementById("shareBtn");
  if (!shareBtn) return;

  shareBtn.addEventListener("click", async function () {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Babita Classes",
          text: "Check out Babita Classes website!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing not supported on this browser. Copy the link instead!");
    }
  });
})();

/* ---------- Modal (Blog) ---------- */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "flex";
    document.body.style.overflow = "hidden"; // lock scroll
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "none";
    document.body.style.overflow = ""; // restore scroll
  }
}

// Close modal when clicking outside the modal box
window.addEventListener("click", function (event) {
  // Blog modals
  document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
    if (event.target === overlay) {
      overlay.style.display = "none";
      document.body.style.overflow = ""; // restore scroll
    }
  });

  // Welcome popup
  const welcomeOverlay = document.getElementById("popupOverlayUnique");
  if (welcomeOverlay && event.target === welcomeOverlay) {
    welcomeOverlay.style.display = "none";
    document.body.style.overflow = ""; // restore scroll
  }
});
/* ----- Lifted Animation For Babita Classes Website ----- */
// Animate sections, faculty cards, and QR codes every time they scroll into view
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".section, .faculty-card, .qrcode, .blog-card, .GeneratedMarquee, .notice-board, .slide fade");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.2 } // trigger when 20% of element is visible
  );

  elements.forEach((el) => observer.observe(el));
});


/* ---------- Homepage: Anchor Buttons smooth-scroll ---------- */
(function () {
  document.querySelectorAll(".anchor-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = btn.getAttribute("data-target");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

/* ---------- Homepage: Links Grid ---------- */
(function () {
  const linksGrid = document.getElementById("links-grid");
  if (!linksGrid) return;

  const allLinks = [
    { label: "Home", url: "#home" },
    { label: "Blog", url: "https://babitaclasses.vercel.app/blog.html" },
    { label: "Results", url: "https://babitaclasses.vercel.app/result.html" },
    { label: "Function Videos", url: "#videos" },
    { label: "Our Faculty", url: "#faculty" },
    { label: "Write a Review", url: "https://g.page/r/CaFJqT5K-agpEAI/review" },
    { label: "What's New", url: "#WhatsNew" },
    { label: "Our Services", url: "#OurServices" },
    { label: "FAQs", url: "#faq" },
    { label: "Films by Babita Classes", url: "https://www.youtube.com/watch?v=s_aT2HMHW68&list=PLMTBETejRGZf72ts_UC53rO1wVm88TAKd" },
    { label: "Navigation (Home anchor All Links)", url: "#links" },
    { label: "Syllabus, Datesheet & Results", url: "#syllabus" },
    { label: "Terms & Conditions", url: "https://drive.google.com/uc?export=download&id=1fJxtiwyud6oNEQ4xecHO3fUf0GvcOnQw" },
    { label: "From Director's Desk", url: "#fromdirectorsdesk" },
    { label: "News Article in Swatantra Prabhat Kanpur", url: "https://3a17rk.mimo.run/Blog.html/" },
    { label: "Book Appointment (WhatsApp)", url: "https://wa.link/x6klar" },
    { label: "Contact Form", url: "https://forms.gle/wL59oarRVWdysP9u8" },
    { label: "Admission Form", url: "https://forms.gle/S234T8QQgLCSvd5GA" },
    { label: "Live Chat (Tawk.to)", url: "https://tawk.to/chat/61443488d326717cb681ea86/1ffp6qehd" },
    { label: "Email", url: "mailto:babitaclasses7@gmail.com" },
    { label: "WhatsApp", url: "https://wa.link/oqxekr" },
    { label: "WhatsApp Share", url: "https://api.whatsapp.com/send?text=https://babitaclasses.website2.me/" },
    { label: "Call", url: "tel:91 7388311148" },
    { label: "GORGON (2024)", url: "https://youtu.be/iSzXQCMCOsk?si=UHO6tTXp7PJvqmiG" },
    { label: "VIDYA (2022)", url: "https://youtu.be/s_aT2HMHW68" },
    { label: "PT Videos (Facebook)", url: "https://fb.watch/6Wo4_b00UF/" },
    { label: "MYSTERIOUS THIEF (2023)", url: "https://youtu.be/0BWsukdcsro" },
    { label: "YouTube: Behind The Scenes of Gorgon", url: "https://youtu.be/qQeHVqT0PP4?si=iiidejJBVEgnNgec" },
    { label: "Facebook Page", url: "https://www.facebook.com/babitaclasses" },
    { label: "Instagram", url: "https://www.instagram.com/babitaclasses" },
    { label: "YouTube Channel", url: "https://youtube.com/channel/UCHFpmflS9Fl-uu6lasO7tQQ" },
    { label: "Google Search", url: "https://www.google.com/search?q=%23babitaclasses" },
    { label: "Justdial", url: "https://jsdl.in/DT-35XUCII7NPA" },
    { label: "QR Code (Download)", url: "https://drive.google.com/uc?export=download&id=16FkbkFryh3mgBVIDRv2NgTDARwgFEVOk" },
    { label: "Get Directions (Google Maps)", url: "https://www.google.com/maps/dir//Babita+Classes/data=!4m8!4m7!1m0!1m5!1m1!1s0x399c47f6a85c1aa7:0x29a8f94a3ea949a1!2m2!1d80.32515819999999!2d26.445072999999997" },
  ];

  // Wrap the link-filter input so the clear button positions correctly
  const linkFilter = document.getElementById("link-filter");
  if (!linkFilter) return;

  const wrapper = document.createElement("div");
  wrapper.style.cssText = "position: relative; display: block; width: 100%;";
  linkFilter.parentNode.insertBefore(wrapper, linkFilter);
  wrapper.appendChild(linkFilter);
  linkFilter.style.paddingRight = "34px";
  linkFilter.style.width = "100%";
  linkFilter.style.boxSizing = "border-box";

  // Inject clear button
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "×";
  clearBtn.className = "bc-link-clear";
  wrapper.appendChild(clearBtn);

  function renderLinks(filter) {
    linksGrid.innerHTML = "";
    // Keyword search: split by spaces, every word must appear somewhere
    const keywords = (filter || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
    const list = allLinks.filter(function (l) {
      return (
        keywords.length === 0 ||
        keywords.every(k =>
          (l.label && l.label.toLowerCase().includes(k)) ||
          (l.url && l.url.toLowerCase().includes(k))
        )
      );
    });
    list.forEach(function (l) {
      const a = document.createElement("a");
      a.className = "url-btn";
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = l.label;
      linksGrid.appendChild(a);
    });
    if (list.length === 0) {
      const p = document.createElement("div");
      p.className = "muted";
      p.textContent = "No links match the filter.";
      linksGrid.appendChild(p);
    }
    // Show/hide clear button
    clearBtn.style.display = (filter || "").length > 0 ? "block" : "none";
  }

  renderLinks();

  linkFilter.addEventListener("input", function () {
    renderLinks(linkFilter.value);
  });

  // Enter key: open the first visible link button
  linkFilter.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    const firstBtn = linksGrid.querySelector("a.url-btn");
    if (firstBtn) window.open(firstBtn.href, "_blank", "noopener");
  });

  // Clear button
  clearBtn.addEventListener("click", function () {
    linkFilter.value = "";
    renderLinks("");
    linkFilter.focus();
  });

  // Ctrl+L shortcut to focus filter
  document.addEventListener("keydown", function (e) {
    if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      linkFilter.focus();
    }
  });
})();


/* ---------- Search Bar (both pages) ---------- */
(function () {
  const input = document.getElementById("searchInput");
  if (!input) return;

  // Inject clear button
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "×";
  clearBtn.className = "bc-search-clear";
  clearBtn.style.cssText = `
    display: none;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
    padding: 0 4px;
    z-index: 2;
  `;
  const wrapper = document.createElement("div");
wrapper.style.cssText = "position: relative; display: block; width: 100%;";
input.parentNode.insertBefore(wrapper, input);
wrapper.appendChild(input);
wrapper.appendChild(clearBtn);
input.style.paddingRight = "30px";
input.style.width = "100%";
input.style.boxSizing = "border-box";

  const listItems = document.getElementById("searchList")
    ? document.getElementById("searchList").getElementsByTagName("li")
    : [];

  function filterItems(value) {
    const keywords = value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    for (let i = 0; i < listItems.length; i++) {
      const txt = listItems[i].textContent.toLowerCase();
      const matches = keywords.length === 0 || keywords.every(k => txt.includes(k));
      listItems[i].style.display = matches ? "" : "none";
    }
    clearBtn.style.display = value.length > 0 ? "block" : "none";
  }

  input.addEventListener("keyup", function (e) {
    filterItems(input.value);

    // Enter key: navigate to the first visible matching item
    if (e.key === "Enter") {
      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].style.display !== "none") {
          const link = listItems[i].querySelector("a");
          if (link) {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#")) {
              const target = document.getElementById(href.substring(1));
              if (target) target.scrollIntoView({ behavior: "smooth" });
            } else if (href) {
              window.open(href, link.target || "_self");
            }
          }
          break;
        }
      }
    }
  });

  clearBtn.addEventListener("click", function () {
    input.value = "";
    filterItems("");
    input.focus();
  });

  // Auto-scroll to card on link click
  document.querySelectorAll("#searchList a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.getElementById(href.substring(1));
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();

/* ---------- Search Bar (Functions List) ---------- */
(function () {
  const videoInput = document.getElementById('videoSearch');
  const videoListEl = document.getElementById('videoList');
  if (!videoInput || !videoListEl) return;

  const videoItems = videoListEl.getElementsByTagName('li');

  // Inject clear button
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "×";
  clearBtn.className = "bc-search-clear";
  clearBtn.style.cssText = `
    display: none;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
    padding: 0 4px;
    z-index: 2;
  `;
  videoInput.parentNode.style.cssText += "position: relative; display: block;";
  videoInput.style.paddingRight = "30px";
  videoInput.parentNode.insertBefore(clearBtn, videoInput.nextSibling);

  function filterVideoItems(value) {
    const keywords = value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    for (let i = 0; i < videoItems.length; i++) {
      const txt = videoItems[i].textContent.toLowerCase();
      const matches = keywords.length === 0 || keywords.every(k => txt.includes(k));
      videoItems[i].style.display = matches ? '' : 'none';
    }
    clearBtn.style.display = value.length > 0 ? "block" : "none";
  }

  videoInput.addEventListener('input', function () {
    filterVideoItems(videoInput.value);
  });

  videoInput.addEventListener('keydown', function (e) {
    if (e.key !== "Enter") return;
    for (let i = 0; i < videoItems.length; i++) {
      if (videoItems[i].style.display !== 'none') {
        const link = videoItems[i].querySelector("a");
        if (link) {
          const href = link.getAttribute("href");
          if (href && href.startsWith("#")) {
            const target = document.getElementById(href.substring(1));
            if (target) target.scrollIntoView({ behavior: "smooth" });
          } else if (href) {
            window.open(href, link.target || "_self");
          }
        }
        break;
      }
    }
  });

  clearBtn.addEventListener("click", function () {
    videoInput.value = "";
    filterVideoItems("");
    videoInput.focus();
  });
})();



/* ----- Slideshow ----- */

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Dot controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "flex";
  dots[slideIndex-1].className += " active";
}

// Auto-play (optional)
setInterval(() => { plusSlides(1); }, 4000);

// Swipe support for mobile
const slideshow = document.querySelector('.slideshow-container');
let startX = 0;
slideshow.addEventListener('touchstart', e => startX = e.touches[0].clientX);
slideshow.addEventListener('touchend', e => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) plusSlides(1);     // swipe left → next
  else if (endX - startX > 50) plusSlides(-1); // swipe right → prev
});
/* ---------- Syllabus Section: Collapse/Expand ---------- */
(function () {
  const toggleBtn = document.getElementById("syllabusToggleBtn");
  const toggleWrap = document.getElementById("syllabusToggleWrap");
  const anchor = document.getElementById("syllabusToggleAnchor");
  const collapseBox = document.getElementById("syllabusCollapse");
  if (!toggleBtn || !toggleWrap || !anchor || !collapseBox) return;

  let isExpanded = false;

  toggleBtn.addEventListener("click", function () {
    isExpanded = !isExpanded;

    if (isExpanded) {
      // Move the button to the end of the collapsible content first, so it
      // travels down with the expanding sessions instead of staying put.
      collapseBox.appendChild(toggleWrap);
      collapseBox.classList.add("expanded");
      collapseBox.style.maxHeight = collapseBox.scrollHeight + "px";
      toggleBtn.textContent = "Show Less Sessions ▴";
      toggleBtn.setAttribute("aria-expanded", "true");
    } else {
      // Capture the height BEFORE collapsing, then compensate the scroll
      // position by that same amount, at the same time — one combined
      // motion instead of a reflow-jump followed by a second correction.
      const collapseHeight = collapseBox.scrollHeight;
      anchor.parentNode.insertBefore(toggleWrap, anchor);
      collapseBox.style.maxHeight = collapseHeight + "px";
      requestAnimationFrame(function () {
        collapseBox.style.maxHeight = "0px";
      });
      collapseBox.classList.remove("expanded");
      toggleBtn.textContent = "Show More Sessions ▾";
      toggleBtn.setAttribute("aria-expanded", "false");
      window.scrollBy({ top: -collapseHeight, left: 0, behavior: "smooth" });
    }
  });

  // Keep the expanded panel's height accurate if the viewport is resized
  // (e.g. rotating a phone), so content never gets clipped.
  window.addEventListener("resize", function () {
    if (isExpanded) {
      collapseBox.style.maxHeight = collapseBox.scrollHeight + "px";
    }
  });
})();
