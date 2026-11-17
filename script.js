(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const music = $("#backgroundMusic");
  const screens = $$(".screen");
  const photoCaptions = [
    "One of my favourite views.", "Just us being us.", "A little chaos, a lot of joy.",
    "Moments I wish I could pause.", "A memory worth keeping.",
    "Some memories just feel different.", "Your smile deserves its own gallery.",
    "Look at that beautiful smile."
  ];
  let currentPhoto = 0;
  let toastTimer;

  // A quiet night sky: tiny stars, no external images or libraries.
  const sky = $("#sky");
  for (let i = 0; i < 75; i++) {
    const star = document.createElement("i");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    star.style.animationDuration = `${2 + Math.random() * 4}s`;
    sky.appendChild(star);
  }

  function showScreen(id) {
    screens.forEach(screen => screen.classList.toggle("active", screen.id === id));
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id === "final") startFinalReveal();
  }

  function burst(count = 18) {
    const symbols = ["♥", "♡", "✦", "✧"];
    for (let i = 0; i < count; i++) {
      const item = document.createElement("span");
      item.className = "floating-heart";
      item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      item.style.left = `${8 + Math.random() * 84}%`;
      item.style.top = `${48 + Math.random() * 40}%`;
      item.style.fontSize = `${12 + Math.random() * 20}px`;
      item.style.animationDelay = `${Math.random() * .65}s`;
      document.body.appendChild(item);
      item.addEventListener("animationend", () => item.remove(), { once: true });
    }
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2100);
  }

  $("#openSurprise").addEventListener("click", async () => {
    // Browsers permit playback after this direct user gesture.
    try {
      await music.play();
    } catch (error) {
      showToast("Your browser blocked playback. Check the phone’s silent mode and try again.");
    }
    burst(24);
    showScreen("message");
  });

  $$("[data-next]").forEach(button => {
    button.addEventListener("click", () => {
      showScreen(button.dataset.next);
      if (button.dataset.next === "gallery") burst(8);
    });
  });

  // Gallery lightbox with previous/next controls and keyboard support.
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  const cards = $$(".photo-card");
  function openPhoto(index) {
    currentPhoto = (index + cards.length) % cards.length;
    const img = $("img", cards[currentPhoto]);
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = photoCaptions[currentPhoto];
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    $("#closeLightbox").focus();
  }
  function closePhoto() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  cards.forEach(card => card.addEventListener("click", () => openPhoto(Number(card.dataset.photo))));
  $("#closeLightbox").addEventListener("click", closePhoto);
  $("#prevPhoto").addEventListener("click", () => openPhoto(currentPhoto - 1));
  $("#nextPhoto").addEventListener("click", () => openPhoto(currentPhoto + 1));
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closePhoto(); });
  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closePhoto();
    if (event.key === "ArrowLeft") openPhoto(currentPhoto - 1);
    if (event.key === "ArrowRight") openPhoto(currentPhoto + 1);
  });

  // Tapping an envelope opens its note in the shared letter area.
  // Create the love note popup
const letterPopup = document.createElement("div");
letterPopup.className = "letter-popup";
letterPopup.hidden = true;

letterPopup.innerHTML = `
  <div class="letter-paper" role="dialog" aria-modal="true">
    <h3>For My Queen 💜</h3>
    <p id="letterMessage"></p>
    <button class="letter-close" type="button">Close note</button>
  </div>
`;

document.body.appendChild(letterPopup);

const letterMessage = $("#letterMessage", letterPopup);

function closeLetter() {
  letterPopup.hidden = true;
}

$(".letter-close", letterPopup).addEventListener("click", closeLetter);

letterPopup.addEventListener("click", event => {
  if (event.target === letterPopup) closeLetter();
});

// Tapping an envelope opens its note
$$(".envelope").forEach(envelope => {
  envelope.addEventListener("click", () => {
    $$(".envelope").forEach(item => {
      item.classList.remove("opened");
      item.setAttribute("aria-expanded", "false");
    });

    envelope.classList.add("opened");
    envelope.setAttribute("aria-expanded", "true");

    const note = envelope.dataset.note;

    $("#noteReveal").textContent = note;
    letterMessage.textContent = note;
    letterPopup.hidden = false;

    burst(7);
  });
});
  
})();
