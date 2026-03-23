"""
IGS Convention Centre — Fix All HTML Pages
==========================================
Yeh script saari HTML files mein:
1. Cloudflare email obfuscation hata dega
2. Real email (sreeganesamahal@gmail.com) show karega
3. Cloudflare decode script tag remove karega

HOW TO RUN:
-----------
1. Yeh file apne Desktop/SGM folder mein copy karo
2. Command Prompt mein:
   cd "C:\\Users\\Welcome\\Desktop\\SGM"
   python fix_all_pages.py
3. Output dekho — har file ka status print hoga
4. Git push karo:
   git add .
   git commit -m "fix: email obfuscation removed from all pages"
   git push origin main
"""

import os
import re

FOLDER = os.path.dirname(os.path.abspath(__file__))
EMAIL = "sreeganesamahal@gmail.com"

# Top bar HTML to insert if missing
TOP_BAR_HTML = '''<div class="top-bar">
  <div class="container">
    <div class="top-bar-info">
      <a href="tel:+919841608160"><i class="fas fa-phone"></i> +91 98416 08160</a>
      <a href="mailto:sreeganesamahal@gmail.com"><i class="fas fa-envelope"></i> sreeganesamahal@gmail.com</a>
      <span><i class="fas fa-map-marker-alt"></i> 51/4A,4B Ambai Road, Palayamkottai, Tirunelveli</span>
    </div>
    <div class="top-bar-social">
      <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
      <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
      <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
      <a href="https://wa.me/919841608160" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
    </div>
  </div>
</div>'''

def fix_file(filepath):
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    changes = []

    # ── FIX 1: Remove Cloudflare email-decode script tag ──
    cf_script = '<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>'
    if cf_script in content:
        content = content.replace(cf_script, '')
        changes.append("Cloudflare decode script removed")

    # ── FIX 2: Replace ALL <a href="/cdn-cgi/l/email-protection"...> tags ──
    # Pattern: <a href="/cdn-cgi/l/email-protection" class="__cf_email__" ...>...(any content)...</a>
    # Also handles: <a href="..." class="__cf_email__" ...>
    cf_email_link_pattern = re.compile(
        r'<a\s+href="[^"]*email-protection[^"]*"[^>]*>.*?</a>',
        re.IGNORECASE | re.DOTALL
    )
    if cf_email_link_pattern.search(content):
        content = cf_email_link_pattern.sub(
            f'<a href="mailto:{EMAIL}"><i class="fas fa-envelope"></i> {EMAIL}</a>',
            content
        )
        changes.append("Cloudflare email link replaced with real email")

    # ── FIX 3: Replace standalone __cf_email__ spans ──
    cf_span_pattern = re.compile(
        r'<span[^>]+class="[^"]*__cf_email__[^"]*"[^>]*>.*?</span>',
        re.IGNORECASE | re.DOTALL
    )
    if cf_span_pattern.search(content):
        content = cf_span_pattern.sub(EMAIL, content)
        changes.append("Cloudflare email span replaced")

    # ── FIX 4: Replace old mailto links with wrong/old email ──
    old_email_pattern = re.compile(
        r'href="mailto:[^"]*@[^"]*"',
        re.IGNORECASE
    )
    def fix_mailto(m):
        if EMAIL in m.group():
            return m.group()  # Already correct
        return f'href="mailto:{EMAIL}"'
    
    new_content, count = old_email_pattern.subn(fix_mailto, content)
    if count > 0 and new_content != content:
        content = new_content
        changes.append(f"Old mailto email fixed ({count} instance(s))")

    # ── FIX 5: Check if top-bar exists, add if missing ──
    if 'class="top-bar"' not in content and 'top-bar' not in content:
        # Insert top bar after <body> tag
        content = content.replace('<body>', '<body>\n' + TOP_BAR_HTML, 1)
        changes.append("Top bar ADDED (was missing)")

    # ── Write if changed ──
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✅ {filename}")
        for c in changes:
            print(f"     → {c}")
    else:
        print(f"  ⬜ {filename} — no changes needed")

    return content != original


def main():
    print("=" * 55)
    print("  IGS Convention Centre — Email Fix Script")
    print("=" * 55)
    print(f"  Folder: {FOLDER}\n")

    html_files = [f for f in os.listdir(FOLDER) if f.endswith('.html')]
    html_files.sort()

    if not html_files:
        print("  ❌ No HTML files found! Check folder path.")
        return

    print(f"  Found {len(html_files)} HTML files\n")

    fixed_count = 0
    for filename in html_files:
        filepath = os.path.join(FOLDER, filename)
        if fix_file(filepath):
            fixed_count += 1

    print(f"\n{'=' * 55}")
    print(f"  Done! {fixed_count}/{len(html_files)} files updated.")
    print(f"\n  Now run:")
    print(f'  git add .')
    print(f'  git commit -m "fix: email obfuscation removed from all pages"')
    print(f'  git push origin main')
    print("=" * 55)


if __name__ == "__main__":
    main()
