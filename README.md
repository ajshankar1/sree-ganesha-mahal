# 🏛️ Sree Ganesha Mahal — Website


---

## 📝 HOW TO EDIT CONTENT (No Coding Required)

### 1. Change Phone Number
- Open `js/whatsapp.js` → change `WHATSAPP_NUMBER`
- Open every HTML file → find `+91 88700 07991` → replace with your number

### 2. Change Hall Name & Address
- Search & replace "Sree Ganesha Mahal" in all HTML files
- Find "Palayamkottai, Tirunelveli" → replace with your address

### 3. Change Images
```
images/
  hero/
    hero-main.jpg     ← Main homepage background (replace this!)
    about-hall.jpg    ← About section photo
  gallery/
    wedding-1.jpg     ← Gallery images (add as many as needed)
    reception-1.jpg
    ...
  events/
    wedding.jpg       ← Event card images
    reception.jpg
    ...
```
**Simply replace the image files** with your own photos using the same filenames.

### 4. Add Gallery Photos
Open `js/gallery.js` and add entries to the `galleryImages` array:
```javascript
{ src: 'images/gallery/my-new-photo.jpg', alt: 'My Description', category: 'wedding' },
```
Categories: `wedding`, `reception`, `engagement`, `decorations`, `dining`, `stage`, `lighting`

### 5. Change Pricing
Open `data/pricing.json` and edit the `price` values:
```json
{ "id": "basic", "price": 40000, ... }
```

### 6. Add Events
Open `data/events.json` and add a new object:
```json
{
  "event_name": "My New Event",
  "category": "Family Celebrations",
  "description": "Description here",
  "base_price": 30000,
  "image": "images/events/my-event.jpg"
}
```

### 7. Add Blog Posts
Open `data/blog.json` and add:
```json
{
  "id": 5,
  "slug": "my-blog-post-url",
  "title": "My Blog Title",
  "category": "Wedding Planning",
  "author": "Sree Ganesha Mahal Team",
  "date": "2025-01-15",
  "image": "images/blog/my-post.jpg",
  "short_description": "Short teaser text...",
  "content": "<h2>Section</h2><p>Your content here...</p>"
}
```

### 8. Add Testimonials
Open `data/testimonials.json` and add:
```json
{
  "id": 7,
  "name": "Customer Name",
  "event_type": "Wedding",
  "event_date": "January 2025",
  "rating": 5,
  "initials": "CN",
  "review": "Their review text...",
  "location": "Tirunelveli"
}
```

### 9. Update Booked Dates on Calendar
Open `data/availability.json`:
```json
{
  "booked": ["2025-03-15", "2025-03-16"],
  "tentative": ["2025-04-20"]
}
```
Format: `YYYY-MM-DD`

### 10. Add FAQs
Open `data/faq.json` and add:
```json
{
  "id": 18,
  "category": "Booking & Payment",
  "question": "Your question?",
  "answer": "Your answer here."
}
```

---

## 📊 ADMIN DASHBOARD
Access: `yourdomain.com/admin/dashboard.html`

Features:
- View all booking enquiries
- View captured leads
- Export data to CSV
- WhatsApp follow-up links

All data is stored in the visitor's browser (localStorage).
For a database-backed version, contact your developer.

---

## 🎨 CHANGE COLORS
Open `css/styles.css` → edit `:root` variables:
```css
--gold: #C9A84C;     /* Change gold accent color */
--crimson: #7B1B1B;  /* Change crimson/red color */
--ivory: #FBF6EE;    /* Change background color */
```

---

## 📞 CONTACT DETAILS TO CHANGE
Search & replace in all HTML files:
- `+91 88700 07991` → your phone
- `sreeganesamahal@gmail.com` → your email
- `45, Temple Street, Palayamkottai` → your address

---

## 📁 FILE STRUCTURE
```
sree-ganesha-mahal/
├── index.html          ← Homepage
├── about.html          ← About page
├── facilities.html     ← Facilities page
├── events.html         ← Events listing
├── gallery.html        ← Photo & video gallery
├── pricing.html        ← Packages + calculator
├── booking.html        ← Multi-step booking form
├── availability.html   ← Calendar
├── blog.html           ← Blog listing
├── blog-post.html      ← Single blog post
├── testimonials.html   ← Reviews
├── faq.html            ← FAQ page
├── contact.html        ← Contact + map
├── netlify.toml        ← Netlify config
├── css/
│   ├── styles.css      ← Main styles
│   └── animations.css  ← Scroll animations
├── js/
│   ├── main.js         ← Core functionality
│   ├── gallery.js      ← Gallery + lightbox
│   ├── price-calculator.js
│   ├── calendar.js
│   ├── form-steps.js   ← Booking form logic
│   ├── whatsapp.js
│   └── crm.js          ← Admin dashboard
├── data/               ← EDIT THESE FILES to change content
│   ├── events.json
│   ├── pricing.json
│   ├── blog.json
│   ├── testimonials.json
│   ├── faq.json
│   └── availability.json
├── images/             ← REPLACE images here
│   ├── hero/
│   ├── gallery/
│   └── events/
├── videos/             ← Add .mp4 videos here
└── admin/
    └── dashboard.html  ← Admin CRM
```

---

Built with ❤️ for Sree Ganesha Mahal, Tirunelveli
