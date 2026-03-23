# IGS Convention Centre - Fix All HTML Pages
# ============================================
# Double-click karke run karo, ya:
# Right-click → "Run with PowerShell"

$email = "sreeganesamahal@gmail.com"
$folder = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = Get-ChildItem -Path $folder -Filter "*.html"
$fixed = 0

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  IGS Convention Centre - Email Fix Script" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Folder: $folder"
Write-Host "  Files found: $($files.Count)"
Write-Host ""

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $original = $content

    # Fix 1: Remove Cloudflare email decode script
    $content = $content -replace '<script[^>]+email-decode\.min\.js[^>]*></script>', ''

    # Fix 2: Replace Cloudflare obfuscated email links (with icon inside)
    $content = [regex]::Replace(
        $content,
        '<a\s+href="[^"]*email-protection[^"]*"[^>]*>(\s*<i[^>]*></i>\s*)?(\s*<span[^>]*>[^<]*</span>|\s*\[email[^\]]*\]|\s*sreeganesamahal[^<]*)?</a>',
        "<a href=`"mailto:$email`"><i class=`"fas fa-envelope`"></i> $email</a>"
    )

    # Fix 3: Replace any remaining __cf_email__ spans
    $content = [regex]::Replace(
        $content,
        '<span[^>]+__cf_email__[^>]*>[^<]*</span>',
        $email
    )

    # Fix 4: Replace entire obfuscated anchor (catch-all)
    $content = [regex]::Replace(
        $content,
        '<a[^>]+__cf_email__[^>]*>[^<]*</a>',
        "<a href=`"mailto:$email`"><i class=`"fas fa-envelope`"></i> $email</a>"
    )

    # Write if changed
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "  FIXED: $($file.Name)" -ForegroundColor Green
        $fixed++
    } else {
        Write-Host "  OK:    $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Done! $fixed / $($files.Count) files updated." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Now run in Command Prompt:" -ForegroundColor White
Write-Host '  git add .' -ForegroundColor Green
Write-Host '  git commit -m "fix: email fixed on all pages"' -ForegroundColor Green
Write-Host '  git push origin main' -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to close"
