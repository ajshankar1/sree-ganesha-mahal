/* ============================================================
   SREE GANESHA MAHAL — Gallery with Lightbox & Filters
   HOW TO ADD IMAGES: Add .jpg files to /images/gallery/ 
   and add entries in the galleryImages array below.
   ============================================================ */

const galleryImages = [
  { src: 'images/gallery/wedding.jpg',      alt: 'Grand Wedding Ceremony',     category: 'wedding' },
  { src: 'images/gallery/reception.jpg',    alt: 'Wedding Reception Hall',      category: 'reception' },
  { src: 'images/gallery/engagement.jpg',   alt: 'Engagement Ceremony',         category: 'engagement' },
  { src: 'images/gallery/Mehandi.jpg',      alt: 'Mehendi Celebration',         category: 'engagement' },
  { src: 'images/gallery/haldi.jpg',        alt: 'Haldi Ceremony',              category: 'wedding' },
  { src: 'images/gallery/valaikappu.jpg',   alt: 'Valaikappu Function',         category: 'wedding' },
  { src: 'images/gallery/gettogether.jpg',  alt: 'Family Get Together',         category: 'decorations' },
  { src: 'images/gallery/naming.jpg',       alt: 'Naming Ceremony',             category: 'decorations' },
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

    if (window.initScrollReveal) window.initScrollReveal();

    galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        openLightbox(index);
      });
    });
  }

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

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

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
