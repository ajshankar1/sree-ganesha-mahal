/* ============================================================
   SREE GANESHA MAHAL — Gallery with Lightbox & Filters
   HOW TO ADD IMAGES: Add .jpg files to /images/gallery/ 
   and add entries in the galleryImages array below.
   ============================================================ */

/* 
  HOW TO ADD GALLERY IMAGES:
  Add objects to this array with:
  - src: path to image in /images/gallery/
  - alt: description of the image
  - category: one of "wedding","reception","engagement","decorations","dining","stage","lighting"
*/
const galleryImages = [
  { src: 'images/gallery/wedding-1.jpg', alt: 'Grand Wedding Ceremony', category: 'wedding' },
  { src: 'images/gallery/wedding-2.jpg', alt: 'Wedding Mandapam', category: 'wedding' },
  { src: 'images/gallery/wedding-3.jpg', alt: 'Wedding Rituals', category: 'wedding' },
  { src: 'images/gallery/reception-1.jpg', alt: 'Wedding Reception Hall', category: 'reception' },
  { src: 'images/gallery/reception-2.jpg', alt: 'Reception Stage Setup', category: 'reception' },
  { src: 'images/gallery/engagement-1.jpg', alt: 'Engagement Ceremony', category: 'engagement' },
  { src: 'images/gallery/engagement-2.jpg', alt: 'Ring Exchange', category: 'engagement' },
  { src: 'images/gallery/decor-1.jpg', alt: 'Floral Decorations', category: 'decorations' },
  { src: 'images/gallery/decor-2.jpg', alt: 'Marigold Mandapam', category: 'decorations' },
  { src: 'images/gallery/decor-3.jpg', alt: 'Stage Floral Arch', category: 'decorations' },
  { src: 'images/gallery/dining-1.jpg', alt: 'Dining Hall Setup', category: 'dining' },
  { src: 'images/gallery/dining-2.jpg', alt: 'Traditional Feast', category: 'dining' },
  { src: 'images/gallery/stage-1.jpg', alt: 'Wedding Stage', category: 'stage' },
  { src: 'images/gallery/stage-2.jpg', alt: 'Decorated Stage', category: 'stage' },
  { src: 'images/gallery/lighting-1.jpg', alt: 'Lighting Setup', category: 'lighting' },
  { src: 'images/gallery/lighting-2.jpg', alt: 'LED Decor', category: 'lighting' },
];

let currentIndex = 0;
let filteredImages = [...galleryImages];

function initGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;

  const filterBtns = document.querySelectorAll('.filter-btn');
  let activeFilter = 'all';

  function renderGallery(images) {
    galleryGrid.innerHTML = images.map((img, i) => `
      <div class="gallery-item reveal" data-index="${i}" data-category="${img.category}">
        <img src="${img.src}" alt="${img.alt}" loading="lazy">
        <div class="gallery-overlay">
          <i class="fas fa-expand"></i>
        </div>
      </div>
    `).join('');

    // Re-init scroll reveal
    if (window.initScrollReveal) window.initScrollReveal();

    // Bind lightbox clicks
    galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        openLightbox(index);
      });
    });
  }

  // Filter logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      if (activeFilter === 'all') {
        filteredImages = [...galleryImages];
      } else {
        filteredImages = galleryImages.filter(img => img.category === activeFilter);
      }
      renderGallery(filteredImages);
    });
  });

  renderGallery(filteredImages);
}

/* === LIGHTBOX === */
function openLightbox(index) {
  currentIndex = index;
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  updateLightboxImage();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightboxImage() {
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  if (!lightboxImg) return;
  const img = filteredImages[currentIndex];
  if (!img) return;
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  if (lightboxCaption) lightboxCaption.textContent = img.alt;
}

function lightboxPrev() {
  currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
  updateLightboxImage();
}

function lightboxNext() {
  currentIndex = (currentIndex + 1) % filteredImages.length;
  updateLightboxImage();
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev')?.addEventListener('click', lightboxPrev);
  document.getElementById('lightboxNext')?.addEventListener('click', lightboxNext);

  // Close on overlay click
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initLightbox();
});
