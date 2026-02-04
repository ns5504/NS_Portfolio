(() => {
  const backdrop = document.getElementById("modalBackdrop");
  const openButtons = document.querySelectorAll("[data-modal]");
  const modals = document.querySelectorAll(".modal");

  function closeAll() {
    modals.forEach(m => {
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden", "true");
    });
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    closeAll();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  openButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      openModal(btn.getAttribute("data-modal"));
    });
  });

  // Close on backdrop click
  backdrop.addEventListener("click", closeAll);

  // Close on X click
  modals.forEach(modal => {
    const closeBtn = modal.querySelector(".modal-close");
    closeBtn?.addEventListener("click", closeAll);

    // Close if clicking outside the card
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeAll();
    });
  });

  // Close on ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
})();
// Click-to-enlarge thumbnails (Editorial modal)
document.querySelectorAll("#modal-editorial .thumb").forEach(img => {
  img.addEventListener("click", function () {
    const main = document.getElementById("editorialMain");
    const newSrc = this.getAttribute("data-large");

    // Swap main image
    main.src = newSrc;

    // Update active state
    document.querySelectorAll("#modal-editorial .thumb").forEach(t => {
      t.classList.remove("active");
    });
    this.classList.add("active");
  });
});
