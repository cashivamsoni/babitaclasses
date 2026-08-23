/* =========================================================
   Babita Classes — Shared JavaScript
   Used by: index.html and blog.html
   ========================================================= */

/* ---------- Cleanup: remove PWA service worker/cache ---------- */
/* A service worker was briefly added for offline/PWA support and has now
   been removed. Browsers that already installed it will keep serving its
   cached (stale) version forever unless it's explicitly unregistered here. */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    registrations.forEach(function (registration) {
      registration.unregister();
    });
  });
}
if (window.caches) {
  caches.keys().then(function (names) {
    names.forEach(function (name) {
      caches.delete(name);
    });
  });
}


/* ---------- Light/Dark Mode Toggle ---------- */
(function () {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;
  const root = document.documentElement;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const themeIcon = themeToggle.querySelector("i");

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle.setAttribute("aria-label", "Switch to light mode");
      themeToggle.setAttribute("title", "Switch to light mode");
      if (themeIcon) themeIcon.className = "fa fa-sun-o";
      if (metaThemeColor) metaThemeColor.setAttribute("content", "#332900");
    } else {
      root.removeAttribute("data-theme");
      themeToggle.setAttribute("aria-label", "Switch to dark mode");
      themeToggle.setAttribute("title", "Switch to dark mode");
      if (themeIcon) themeIcon.className = "fa fa-moon-o";
      if (metaThemeColor) metaThemeColor.setAttribute("content", "#ffd919");
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

  // Close when any nav link or the theme toggle is clicked
  document.querySelectorAll("#mainNav a, #mainNav button").forEach(function (link) {
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

/* ---------- Floral Quick Menu ---------- */
(function () {
  const menu = document.getElementById("floralMenu");
  const mainBtn = document.getElementById("floralMain");
  if (!menu || !mainBtn) return;
  const mainIcon = mainBtn.querySelector("i");

  function closeMenu() {
    menu.classList.remove("open");
    mainBtn.setAttribute("aria-expanded", "false");
    if (mainIcon) mainIcon.className = "fa fa-plus";
  }

  mainBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    const isOpen = menu.classList.toggle("open");
    mainBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (mainIcon) mainIcon.className = "fa fa-plus";
  });

  // Close after tapping any petal (its own click handler still fires first)
  menu.querySelectorAll(".petal").forEach(function (petal) {
    petal.addEventListener("click", closeMenu);
  });

  // Close when tapping anywhere outside the menu
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target)) closeMenu();
  });
})();

/* ---------- Translate (English/Hindi) ---------- */
(function () {
  const translateBtn = document.getElementById("floralNewBtn");
  if (!translateBtn) return;

  translateBtn.addEventListener("click", function () {
    const onTranslatedPage = window.location.hostname.includes(".translate.goog");
    if (onTranslatedPage) {
      // Go back to the original English page
      history.back();
    } else {
      const targetUrl =
        "https://translate.google.com/translate?sl=en&tl=hi&u=" +
        encodeURIComponent(window.location.href);
      window.location.href = targetUrl;
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

/* ---------- Image Lightbox (What's New banner, Gallery, Blog post images) ---------- */
(function () {
  const overlay = document.getElementById("imgLightboxOverlay");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  const lightboxBox = overlay ? overlay.querySelector(".lightbox-box") : null;
  if (!overlay || !lightboxImg || !closeBtn || !lightboxBox) return;

  function otherOverlayOpen() {
    var stillOpen = false;
    document.querySelectorAll(".modal-overlay").forEach(function (m) {
      if (getComputedStyle(m).display !== "none") stillOpen = true;
    });
    var welcome = document.getElementById("popupOverlayUnique");
    if (welcome && getComputedStyle(welcome).display !== "none") stillOpen = true;
    return stillOpen;
  }

  function openLightbox(src, alt) {
    lightboxBox.classList.add("is-loading");
    lightboxImg.onload = function () {
      lightboxBox.classList.remove("is-loading");
    };
    lightboxImg.onerror = function () {
      lightboxBox.classList.remove("is-loading");
    };
    lightboxImg.alt = alt || "Preview";
    lightboxImg.src = src;
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // lock scroll
    if (lightboxImg.complete) {
      lightboxBox.classList.remove("is-loading"); // already cached, no need for a placeholder
    }
  }

  function closeLightbox() {
    overlay.style.display = "none";
    if (!otherOverlayOpen()) {
      document.body.style.overflow = ""; // restore scroll (unless a blog/welcome modal is still open behind it)
    }
  }

  document.addEventListener("click", function (e) {
    const img = e.target.closest(".newbanner, .slideshow-container .slide img, .modal-box img, .faculty-photo");
    if (img) openLightbox(img.src, img.alt);
  });

  closeBtn.addEventListener("click", closeLightbox);

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeLightbox();
  });
})();
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
    { label: "Blog", url: "https://babitaclasses.vercel.app/blog" },
    { label: "Results", url: "https://babitaclasses.vercel.app/result" },
    { label: "Function Videos", url: "#videos" },
    { label: "Our Faculty", url: "#faculty" },
    { label: "Write a Review", url: "https://g.page/r/CaFJqT5K-agpEAI/review" },
    { label: "What's New", url: "#WhatsNew" },
    { label: "Notice Board", url: "#noticeboard" },
    { label: "FAQs", url: "#faq" },
    { label: "Films by Babita Classes", url: "https://www.youtube.com/watch?v=s_aT2HMHW68&list=PLMTBETejRGZf72ts_UC53rO1wVm88TAKd" },
    { label: "All URLs", url: "#allurls" },
    { label: "Syllabus, Datesheet & Results", url: "#syllabus" },
    { label: "Terms & Conditions", url: "https://babitaclasses.vercel.app/legal/terms-and-conditions" },
    { label: "Privacy Policy", url: "https://babitaclasses.vercel.app/legal/privacy-policy" },
    { label: "From Director's Desk", url: "#fromdirectorsdesk" },
    { label: "News Article in Swatantra Prabhat Kanpur", url: "https://babitaclasses.vercel.app/blog" },
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
      const isInternal = l.url.startsWith("#") || l.url.includes("babitaclasses.vercel.app");
      if (!isInternal) {
        a.target = "_blank";
        a.rel = "noopener";
      }
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

    // #videoList is a max-height:200px scrollable box. If it was scrolled down
    // before typing (or from a previous search), that scroll offset stays put
    // after filtering. With a short/shorter result set, that stale offset can
    // push the remaining item(s) partly or fully past the visible/clickable
    // area — worse the fewer results there are. Reset it every time we filter.
    videoListEl.scrollTop = 0;
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

  // While searching, the keyboard stays open (input is focused). The first tap on a
  // result link ends up just closing the keyboard instead of registering the click,
  // so the link click seems to "do nothing" right after searching. Blurring on
  // touchstart/mousedown closes the keyboard a beat earlier, before the tap resolves,
  // so the click on the link fires normally.
  videoListEl.addEventListener("touchstart", function () {
    if (document.activeElement === videoInput) videoInput.blur();
  }, { passive: true });
  videoListEl.addEventListener("mousedown", function () {
    if (document.activeElement === videoInput) videoInput.blur();
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
  if (slides.length === 0) return;
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
if (slideshow) {
  let startX = 0;
  slideshow.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  slideshow.addEventListener('touchend', e => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) plusSlides(1);     // swipe left → next
    else if (endX - startX > 50) plusSlides(-1); // swipe right → prev
  });
}
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

/* ---------- Last Updated date + Marquee (from Firebase, set via admin panel) ---------- */
(function () {
  const dateEl = document.getElementById("lastUpdatedDate");
  const marqueeEl = document.getElementById("topMarquee");
  const noticeListEl = document.getElementById("noticeMarqueeList");
  const videoListEl = document.getElementById("videoList");
  const hasGalleryImgs = document.getElementById("galleryImg1");
  const galleryContainerEl = document.querySelector(".slideshow-container");
  const galleryDotsEl = document.querySelector(".dots");
  const syllabusEl = document.getElementById("syllabusDynamicSessions");
  const blogFeedEl = document.querySelector(".blog-feed");
  const searchListEl = document.getElementById("searchList");
  if (!dateEl && !marqueeEl && !noticeListEl && !videoListEl && !hasGalleryImgs && !syllabusEl && !blogFeedEl) return;

  (async function () {
    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js");
      const { getFirestore, doc, getDoc, collection, query, orderBy, getDocs } = await import(
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

      // Last updated date + marquee text (both live in site/meta)
      const snap = await getDoc(doc(db, "site", "meta"));
      if (snap.exists()) {
        const data = snap.data();
        if (dateEl && data.lastUpdated) {
          const d = new Date(data.lastUpdated + "T00:00:00");
          dateEl.textContent = d.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }
        if (marqueeEl && data.marqueeText) {
          marqueeEl.textContent = data.marqueeText;
        }

        const wnTextEl = document.getElementById("whatsNewText");
        const wnImageEl = document.getElementById("whatsNewImage");
        const wnBtnEl = document.getElementById("whatsNewBtn");
        if (wnTextEl && data.whatsNewText) wnTextEl.textContent = data.whatsNewText;
        if (wnImageEl && data.whatsNewImage) wnImageEl.src = data.whatsNewImage;
        if (wnBtnEl && data.whatsNewBtnText) wnBtnEl.textContent = data.whatsNewBtnText;
        if (wnBtnEl && data.whatsNewBtnUrl) wnBtnEl.href = data.whatsNewBtnUrl;

        if (Array.isArray(data.galleryImages) && data.galleryImages.length && galleryContainerEl) {
          const urls = data.galleryImages.filter(Boolean);
          const perSlide = 2;
          galleryContainerEl.querySelectorAll(".slide").forEach((el) => el.remove());
          const arrowRef = galleryContainerEl.querySelector(".prev") || null;
          for (let i = 0; i < urls.length; i += perSlide) {
            const slideDiv = document.createElement("div");
            slideDiv.className = "slide fade";
            urls.slice(i, i + perSlide).forEach((url, j) => {
              const img = document.createElement("img");
              img.src = url;
              img.alt = "Babita Classes gallery photo " + (i + j + 1);
              slideDiv.appendChild(img);
            });
            galleryContainerEl.insertBefore(slideDiv, arrowRef);
          }
          if (galleryDotsEl) {
            galleryDotsEl.innerHTML = "";
            const slideCount = Math.ceil(urls.length / perSlide);
            for (let i = 1; i <= slideCount; i++) {
              const dot = document.createElement("span");
              dot.className = "dot";
              dot.addEventListener("click", () => currentSlide(i));
              galleryDotsEl.appendChild(dot);
            }
          }
          slideIndex = 1;
          showSlides(1);
        }
      }

      // Notice board (latest first, or admin-set order; newest 3 get the "New" gif)
      if (noticeListEl) {
        const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
        const noticesSnap = await getDocs(q);
        if (!noticesSnap.empty) {
          const noticeDocs = [];
          noticesSnap.forEach((d) => noticeDocs.push(d));
          noticeDocs.sort((a, b) => (a.data().order ?? Infinity) - (b.data().order ?? Infinity));
          let html = "";
          let i = 0;
          noticeDocs.forEach((docSnap) => {
            const text = docSnap.data().text || "";
            const isNew = i < 3;
            html += "<a>" + text;
            if (isNew) {
              html +=
                ' <img src="https://i.imgur.com/XUQBLw8.gif" style="height:17.5px;width:50px;" alt="New" loading="lazy">';
            }
            html += "</a><br>";
            i++;
          });
          noticeListEl.innerHTML = html;
        }
      }

      // Function videos (latest first, or admin-set order)
      if (videoListEl) {
        const vq = query(collection(db, "videos"), orderBy("createdAt", "desc"));
        const videosSnap = await getDocs(vq);
        if (!videosSnap.empty) {
          const videoDocs = [];
          videosSnap.forEach((d) => videoDocs.push(d));
          videoDocs.sort((a, b) => (a.data().order ?? Infinity) - (b.data().order ?? Infinity));
          let vHtml = "";
          videoDocs.forEach((docSnap) => {
            const d = docSnap.data();
            vHtml +=
              '<li><a href="' + d.url + '" target="_blank">' + (d.title || "") + "</a></li>";
          });
          videoListEl.innerHTML = vHtml;
        }
      }

      // Syllabus sessions (2025-26 onward; older sessions stay static in the HTML)
      if (syllabusEl) {
        const sq = query(collection(db, "syllabusSessions"), orderBy("order", "desc"));
        const sessionsSnap = await getDocs(sq);
        if (!sessionsSnap.empty) {
          const cell = (val) => {
            const v = (val || "").trim();
            if (/^https?:\/\//i.test(v)) {
              return (
                '<div class="flex"><a class="btn-inline1" href="' +
                v +
                '" target="_blank" rel="noopener">Open</a></div>'
              );
            }
            return v || "NA";
          };

          let sHtml = "";
          sessionsSnap.forEach((docSnap) => {
            const data = docSnap.data();
            const rows = Array.isArray(data.rows) ? data.rows : [];
            sHtml += '<h3 style="margin-top:12px">Session ' + docSnap.id + "</h3>";
            sHtml += '<div style="overflow:auto"><table aria-label="Syllabus ' + docSnap.id + '">';
            sHtml +=
              "<thead><tr><th>Test/Exam</th><th>Syllabus</th><th>Datesheet</th><th>Result</th></tr></thead><tbody>";
            rows.forEach((row) => {
              sHtml +=
                "<tr><td>" +
                (row.exam || "") +
                "</td><td>" +
                cell(row.syllabus) +
                "</td><td>" +
                cell(row.datesheet) +
                "</td><td>" +
                cell(row.result) +
                "</td></tr>";
            });
            sHtml += "</tbody></table></div>";
          });
          syllabusEl.innerHTML = sHtml;
        }
      }

      // New blog posts (added via admin; the 25 original posts stay static in the HTML)
      if (blogFeedEl) {
        const bq = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
        const postsSnap = await getDocs(bq);
        if (!postsSnap.empty) {
          let cardsHtml = "";
          let searchHtml = "";
          let modalsHtml = "";
          const newCardIds = [];

          postsSnap.forEach((docSnap) => {
            const p = docSnap.data();
            const safeId = "blog" + docSnap.id;
            const modalId = "modal" + docSnap.id;
            newCardIds.push(safeId);

            cardsHtml +=
              '<div class="blog-card" id="' + safeId + '">' +
              "<h3>" + (p.title || "") + "</h3>" +
              "<small>" + (p.date || "") + "</small>" +
              '<p style="text-align:justify;">' + (p.previewText || "") + "</p>" +
              '<button class="read-more-btn" onclick="openModal(\'' + modalId + '\')">Read More</button>' +
              "</div>";

            searchHtml += '<li><a href="#' + safeId + '">' + (p.title || "") + "</a></li>";

            const buttons = Array.isArray(p.buttons) && p.buttons.length
              ? p.buttons
              : p.buttonText && p.buttonUrl
              ? [{ text: p.buttonText, url: p.buttonUrl }]
              : [];

            // Ordered content: new posts use contentBlocks; posts saved before this
            // feature existed fall back to fullText (as one block) + imageUrls after it.
            let blocks = Array.isArray(p.contentBlocks) && p.contentBlocks.length ? p.contentBlocks : null;
            if (!blocks) {
              blocks = [];
              if (p.fullText) blocks.push({ type: "text", value: p.fullText });
              const legacyImages = Array.isArray(p.imageUrls) && p.imageUrls.length ? p.imageUrls : p.imageUrl ? [p.imageUrl] : [];
              legacyImages.forEach((url) => blocks.push({ type: "image", value: url }));
            }

            const blocksHtml = blocks
              .map((b) => {
                if (b.type === "image") {
                  return (
                    '<img src="' + b.value + '" alt="' + (p.title || "") + '" style="max-width:100%; border-radius:8px; display:block; margin:10px auto;" loading="lazy">'
                  );
                }
                if (b.type === "button") {
                  return (
                    '<div style="margin:10px 0; text-align:center;"><a class="btn-inline" href="' + b.url + '" target="_blank" rel="noopener">' + b.text + "</a></div>"
                  );
                }
                return '<p style="text-align:justify;">' + (b.value || "").replace(/\n/g, "<br>") + "</p>";
              })
              .join("");

            // Newer posts place buttons inline within contentBlocks (above), preserving the
            // order set in the editor. Older posts saved before that only have the flat
            // `buttons` field, so render those at the end as before.
            const hasInlineButtons = blocks.some((b) => b.type === "button");
            const buttonsHtml = !hasInlineButtons && buttons.length
              ? '<div class="flex" style="margin-top:10px; flex-wrap:wrap; gap:8px;">' +
                buttons
                  .map(
                    (b) =>
                      '<a class="btn-inline" href="' + b.url + '" target="_blank" rel="noopener">' + b.text + "</a>"
                  )
                  .join("") +
                "</div>"
              : "";

            modalsHtml +=
              '<div id="' + modalId + '" class="modal-overlay">' +
              '<div class="modal-box">' +
              '<div class="modal-header">' +
              '<button class="modal-close" onclick="closeModal(\'' + modalId + '\')" aria-label="Close" title="Close"><svg class="icon-close" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5L19 19M19 5L5 19" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></button>' +
              "<h2>" + (p.title || "") + "</h2>" +
              "<small>" + (p.date || "") + "</small>" +
              "</div>" +
              blocksHtml +
              buttonsHtml +
              "</div></div>";
          });

          blogFeedEl.insertAdjacentHTML("afterbegin", cardsHtml);
          // These cards were added after the page's scroll-reveal observer already ran its
          // initial scan, so they'd otherwise stay stuck at opacity:0 forever. Reveal them directly.
          newCardIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.classList.add("visible");
          });
          if (searchListEl) searchListEl.insertAdjacentHTML("afterbegin", searchHtml);
          document.body.insertAdjacentHTML("beforeend", modalsHtml);
        }
      }
    } catch (err) {
      // Keep the fallback content already in the HTML.
    }
  })();
})();

/* =========================================================
   AI Assistant — Babita Classes
   Powered by Gemini via /api/chat (see api/chat.js). Answers
   using the current page's own content (notices, FAQs,
   mission, syllabus, faculty, contact) plus general
   knowledge, with a local rule-based fallback if the API is
   ever down or unconfigured.
   ========================================================= */

/* ---------- Hint bubble rotation ---------- */
const BC_ASSISTANT_HINTS = [
  'Need help? Ask here.',
  'Try: "what are the fees?"',
  'Ask about admissions.',
  'Curious about our syllabus?',
  'I can look things up for you.'
];
let _bcHintIndex = 0;
let _bcHintTimer = null;
let _bcHintCycleActive = false;

function bcShowNextHint() {
  const panel = document.getElementById('assistantPanel');
  if (panel && !panel.classList.contains('hidden')) return; // paused while panel is open
  const hintEl = document.getElementById('assistantHint');
  if (!hintEl) return;

  hintEl.textContent = BC_ASSISTANT_HINTS[_bcHintIndex % BC_ASSISTANT_HINTS.length];
  _bcHintIndex++;
  hintEl.classList.remove('hidden');
  hintEl.classList.remove('show');
  void hintEl.offsetHeight; // force reflow so the browser paints the "before" state first
  requestAnimationFrame(() => hintEl.classList.add('show'));

  _bcHintTimer = setTimeout(() => {
    hintEl.classList.remove('show');
    setTimeout(() => hintEl.classList.add('hidden'), 400);
    _bcHintTimer = setTimeout(bcShowNextHint, 3000);
  }, 4000);
}

function startAssistantHints() {
  if (_bcHintCycleActive) return;
  _bcHintCycleActive = true;
  clearTimeout(_bcHintTimer);
  _bcHintTimer = setTimeout(bcShowNextHint, 2000);
}
function stopAssistantHints() {
  _bcHintCycleActive = false;
  clearTimeout(_bcHintTimer);
  const hintEl = document.getElementById('assistantHint');
  if (hintEl) { hintEl.classList.remove('show'); hintEl.classList.add('hidden'); }
}

function toggleAssistant() {
  const panel = document.getElementById('assistantPanel');
  if (!panel) return;
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) {
    stopAssistantHints();
    const input = document.getElementById('assistantInput');
    if (input) input.focus();
  } else {
    startAssistantHints();
    stopAssistantSpeech();
  }
}

document.addEventListener('DOMContentLoaded', startAssistantHints);

// Close the assistant panel when clicking outside it
document.addEventListener('click', (e) => {
  const panel = document.getElementById('assistantPanel');
  const btn = document.getElementById('assistantBtn');
  if (!panel || panel.classList.contains('hidden')) return;
  if (!panel.contains(e.target) && btn && !btn.contains(e.target)) {
    panel.classList.add('hidden');
    startAssistantHints();
    stopAssistantSpeech();
  }
});

/* ---------- Message rendering ---------- */
function bcEscHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Turns phone numbers, links, and emails in an (already-escaped) reply
// into real clickable tel:/href/mailto: elements. Uses placeholder tokens
// so each pass can't re-match text already produced by an earlier pass
// (e.g. a URL already wrapped in an <a> tag from the markdown-link step).
function bcLinkify(html) {
  const placeholders = [];
  const store = (anchorHtml) => {
    placeholders.push(anchorHtml);
    return `%%BCLINK${placeholders.length - 1}%%`;
  };

  // Markdown-style [label](url), e.g. "[Admission Form](https://forms.gle/...)"
  html = html.replace(/\[([^\[\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) =>
    store(`<a href="${url}" target="_blank" rel="noopener">${label}</a>`)
  );

  // Any remaining bare URLs (trim trailing punctuation like ". ," that
  // usually belongs to the sentence, not the URL itself)
  html = html.replace(/https?:\/\/[^\s<]+/g, (url) => {
    let trail = '';
    while (url && /[.,;:!?)\]"']$/.test(url)) {
      trail = url.slice(-1) + trail;
      url = url.slice(0, -1);
    }
    return store(`<a href="${url}" target="_blank" rel="noopener">Click here</a>`) + trail;
  });

  // Indian phone numbers in the site's own format, e.g. "+91 73883 11148"
  html = html.replace(/\+91[\s-]?\d{5}[\s-]?\d{5}/g, (m) => {
    const digits = '+' + m.replace(/[^\d]/g, '');
    return store(`<a href="tel:${digits}">${m}</a>`);
  });

  // Email addresses
  html = html.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, (email) =>
    store(`<a href="mailto:${email}">${email}</a>`)
  );

  return html.replace(/%%BCLINK(\d+)%%/g, (_, i) => placeholders[Number(i)]);
}

// Same idea as bcLinkify but for plain text fed to speech synthesis — a
// spoken URL comes out as a jumble of individual letters, so replace it
// with its label (for markdown links) or "Click here" (for bare URLs)
// instead, same as what the on-screen link text ends up saying.
function bcSpeechSafeText(text) {
  return text
    .replace(/\[([^\[\]]+)\]\(https?:\/\/[^\s)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, 'Click here');
}

function appendAssistantMessage(text, sender, isLoading = false) {
  const container = document.getElementById('assistantMessages');
  if (!container) return null;
  const el = document.createElement('div');
  el.className = `assistant-msg assistant-msg-${sender}${isLoading ? ' assistant-msg-loading' : ''}`;
  if (sender === 'bot' && !isLoading) {
    // escHtml first so nothing in the reply can inject real markup, THEN add
    // our own <strong> tags for **bold** and real links — safe because the
    // only tags that can exist afterward are ones we just added ourselves.
    el.innerHTML = bcLinkify(
      bcEscHtml(text)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<span class="assistant-emphasis">$1</span>')
    );
  } else {
    el.textContent = text;
  }
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
  if (sender === 'bot' && !isLoading) {
    const plain = bcSpeechSafeText(
      text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
    );
    _lastReplyPlainText = plain;
    speakAssistantReply(plain);

  }
  return el;
}

/* ---------- Voice input (speech-to-text) ---------- */
const _bcSpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
let _bcRecognizer = null;
let _bcMicListening = false;

function initAssistantVoice() {
  const micBtn = document.getElementById('assistantMicBtn');
  if (!micBtn) return;
  if (!_bcSpeechRecognitionCtor) return; // not supported here — stay hidden

  micBtn.classList.remove('hidden');
  _bcRecognizer = new _bcSpeechRecognitionCtor();
  _bcRecognizer.continuous = false;
  _bcRecognizer.interimResults = false;
  _bcRecognizer.lang = 'en-IN';

  _bcRecognizer.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    const input = document.getElementById('assistantInput');
    if (input) input.value = transcript;
    sendAssistantMessage();
  };
  _bcRecognizer.onerror = () => setMicListening(false);
  _bcRecognizer.onend = () => setMicListening(false);
}

function setMicListening(on) {
  _bcMicListening = on;
  const micBtn = document.getElementById('assistantMicBtn');
  if (micBtn) micBtn.classList.toggle('listening', on);
}

function toggleAssistantMic() {
  if (!_bcRecognizer) return;
  if (_bcMicListening) {
    _bcRecognizer.stop();
    setMicListening(false);
  } else {
    stopAssistantSpeech(); // don't listen while it's still talking
    try {
      _bcRecognizer.start();
      setMicListening(true);
    } catch (_) { /* already started — ignore */ }
  }
}

/* ---------- Voice output (text-to-speech) ---------- */
const BC_SPEECH_CHARS_PER_SEC = 15;
let _bcSpeechFullText = '';
let _bcSpeechCharIndex = 0;
let _bcSpeechPaused = false;
let _bcSpeechStartTime = 0;
let _bcSpeechStartIndex = 0;
let _bcSpeechGeneration = 0;
let _bcCurrentUtterance = null;
let _lastReplyPlainText = '';

function replayLastAssistantReply() {
  if (!_lastReplyPlainText) return;
  speakAssistantReply(_lastReplyPlainText);
}

function _bcDetachCurrentUtterance() {
  if (_bcCurrentUtterance) {
    _bcCurrentUtterance.onstart = null;
    _bcCurrentUtterance.onend = null;
    _bcCurrentUtterance.onerror = null;
    _bcCurrentUtterance.onboundary = null;
    _bcCurrentUtterance = null;
  }
}

function speakAssistantReply(text) {
  if (!('speechSynthesis' in window)) return;
  _bcSpeechGeneration++;
  _bcDetachCurrentUtterance();
  speechSynthesis.cancel();
  _bcSpeechFullText = text;
  _bcSpeechCharIndex = 0;
  _bcSpeechPaused = false;
  _bcSpeakFrom(0);
}

function _bcSpeakFrom(charIndex) {
  const remaining = _bcSpeechFullText.slice(charIndex);
  if (!remaining) { setSpeechToggle(false); return; }
  const myGen = ++_bcSpeechGeneration;
  const utterance = new SpeechSynthesisUtterance(remaining);
  _bcCurrentUtterance = utterance;
  utterance.lang = 'en-IN';
  utterance.onboundary = (e) => {
    if (myGen !== _bcSpeechGeneration) return;
    _bcSpeechCharIndex = charIndex + e.charIndex;
  };
  utterance.onstart = () => {
    if (myGen !== _bcSpeechGeneration) return;
    _bcSpeechStartTime = Date.now();
    _bcSpeechStartIndex = charIndex;
    setSpeechToggle(true, false);
    setReplayVisible(false);
  };
  utterance.onend = () => {
    if (myGen !== _bcSpeechGeneration) return;
    if (!_bcSpeechPaused) { setSpeechToggle(false); setReplayVisible(true); }
  };
  utterance.onerror = () => {
    if (myGen !== _bcSpeechGeneration) return;
    if (!_bcSpeechPaused) setSpeechToggle(false);
  };
  speechSynthesis.speak(utterance);
}

function setSpeechToggle(visible, paused = false) {
  const btn = document.getElementById('assistantSpeechToggle');
  if (!btn) return;
  btn.classList.toggle('hidden', !visible);
  const icon = btn.querySelector('i');
  if (icon) icon.className = paused ? 'fa fa-play' : 'fa fa-pause';
  btn.setAttribute('aria-label', paused ? 'Resume reading' : 'Pause reading');
}

function setReplayVisible(visible) {
  const btn = document.getElementById('assistantReplayBtn');
  if (btn) btn.classList.toggle('hidden', !visible);
}

function toggleAssistantSpeech() {
  if (!('speechSynthesis' in window)) return;
  if (!_bcSpeechPaused) {
    const elapsedSec = (Date.now() - _bcSpeechStartTime) / 1000;
    const estimatedIndex = _bcSpeechStartIndex + Math.floor(elapsedSec * BC_SPEECH_CHARS_PER_SEC);
    _bcSpeechCharIndex = Math.max(_bcSpeechCharIndex, estimatedIndex);
    _bcSpeechPaused = true;
    _bcSpeechGeneration++;
    _bcDetachCurrentUtterance();
    speechSynthesis.cancel();
    setSpeechToggle(true, true);
  } else {
    _bcSpeechPaused = false;
    _bcSpeakFrom(_bcSpeechCharIndex);
  }
}

function stopAssistantSpeech() {
  _bcSpeechGeneration++;
  _bcDetachCurrentUtterance();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  _bcSpeechPaused = false;
  _bcSpeechFullText = '';
  _bcSpeechCharIndex = 0;
  setSpeechToggle(false);
  setReplayVisible(false);
}

document.addEventListener('DOMContentLoaded', initAssistantVoice);

/* ---------- Site context builder ----------
   Reads whatever is currently on the page (notices, FAQs,
   mission, director's desk, faculty, syllabus, contact,
   results) so the assistant's answers always match what's
   actually shown — no separate hardcoded copy to keep in sync. */
function bcText(id) {
  const el = document.getElementById(id);
  return el ? el.textContent.trim().replace(/\s+/g, ' ') : '';
}

function buildSiteContext() {
  const parts = [];

  const notice = bcText('topMarquee');
  if (notice) parts.push(`Notice board: ${notice}`);

  const whatsNew = bcText('whatsNewText');
  if (whatsNew) parts.push(`What's New: ${whatsNew}`);

  const faqEl = document.getElementById('faq');
  if (faqEl) {
    const qas = [...faqEl.querySelectorAll('details')].map(d => {
      const q = d.querySelector('summary')?.textContent.trim();
      const a = d.querySelector('p')?.textContent.trim();
      return q && a ? `Q: ${q} A: ${a}` : '';
    }).filter(Boolean);
    if (qas.length) parts.push(`FAQs:\n${qas.join('\n')}`);
  }

  const mission = bcText('mission');
  if (mission) parts.push(`Our Mission & Services: ${mission}`);

  const desk = bcText('fromdirectorsdesk');
  if (desk) parts.push(`From Director's Desk: ${desk}`);

  const facultyEl = document.getElementById('faculty');
  if (facultyEl) {
    const names = [...facultyEl.querySelectorAll('.faculty-card')]
      .map(c => c.textContent.trim().replace(/\s+/g, ' '))
      .filter(Boolean);
    if (names.length) parts.push(`Faculty:\n${names.join('\n')}`);
  }

  const syllabusSection = document.getElementById('syllabus')?.closest('.section');
  if (syllabusSection) {
    parts.push(`Syllabus/Datesheet/Results section: ${syllabusSection.textContent.trim().replace(/\s+/g, ' ').slice(0, 1500)}`);
  }

  const resultHeader = bcText('resultHeaderDetails');
  if (resultHeader) {
    parts.push(`Latest declared result: ${resultHeader}, declared on ${bcText('resultHeaderDate')}.`);
  }

  const contactEl = document.getElementById('contact');
  if (contactEl) {
    parts.push(`Contact & Social: ${contactEl.textContent.trim().replace(/\s+/g, ' ')}`);
  }

  parts.push(`Current page: ${document.title} (${location.pathname})`);

  return parts.join('\n\n');
}

/* ---------- Local fallback (used only if the API call fails) ---------- */
function localAssistantAnswer(rawQuery) {
  const q = rawQuery.toLowerCase().trim();
  if (/\b(fee|fees|admission|admissions|age)\b/.test(q)) {
    return 'Babita Classes is completely free of cost — there are no admission fees. The minimum admission age is 5 years. You can admit a child by filling the Admission Form (see the All URLs section).';
  }
  if (/\b(contact|phone|call|whatsapp|email)\b/.test(q)) {
    return 'You can call or WhatsApp us at +91 73883 11148, or email babitaclasses7@gmail.com. See the Contact section below for more options.';
  }
  if (/\b(location|address|where)\b/.test(q)) {
    return 'Babita Classes is located at 1/2, Juhi Bamburahiya Colony, Kanpur, Uttar Pradesh - 208014.';
  }
  if (/\b(result|results)\b/.test(q)) {
    return 'You can check your result on the Results page by entering your roll number and full name exactly as registered.';
  }
  return "I couldn't reach the AI service right now — please check the FAQs, Syllabus, or Contact sections on this page, or call +91 73883 11148 for help.";
}

let _bcAssistantBusy = false;
async function sendAssistantMessage() {
  if (_bcAssistantBusy) return;
  const input = document.getElementById('assistantInput');
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  appendAssistantMessage(msg, 'user');
  const loadingEl = appendAssistantMessage('Thinking…', 'bot', true);
  _bcAssistantBusy = true;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, context: buildSiteContext() })
    });
    let data = {};
    try { data = await res.json(); } catch (_) { /* non-JSON error page */ }
    if (loadingEl) loadingEl.remove();
    if (!res.ok) {
      // Fall back to local rule-based matching so a down/unconfigured API
      // doesn't leave the assistant completely useless.
      appendAssistantMessage(localAssistantAnswer(msg), 'bot');
      return;
    }
    appendAssistantMessage(data.reply || "Sorry, I couldn't generate a response.", 'bot');
  } catch (err) {
    if (loadingEl) loadingEl.remove();
    appendAssistantMessage(localAssistantAnswer(msg), 'bot');
    console.error('Assistant API error:', err);
  } finally {
    _bcAssistantBusy = false;
  }
}

// Close the assistant panel whenever the hamburger nav menu is opened,
// so the nav never ends up rendering behind the (higher z-index) panel.
(function () {
  const menuToggleBtn = document.getElementById('menuToggle');
  if (!menuToggleBtn) return;
  menuToggleBtn.addEventListener('click', function () {
    const panel = document.getElementById('assistantPanel');
    if (panel && !panel.classList.contains('hidden')) {
      panel.classList.add('hidden');
      startAssistantHints();
      stopAssistantSpeech();
    }
  });
})();

// Enter to send in the assistant panel
(function () {
  const assistantInput = document.getElementById('assistantInput');
  if (assistantInput) {
    assistantInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); sendAssistantMessage(); }
    });
  }
})();
