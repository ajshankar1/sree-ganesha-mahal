# IGS Convention Centre - Fix Email Color (All Pages)
# Right-click → "Run with PowerShell"

$email = "sreeganesamahal@gmail.com"
$folder = Split-Path -Parent $MyInvocation.MyCommand.Path

# Exact replacement — plain mailto → styled gold link with envelope icon
$oldPlain   = '<a href="mailto:sreeganesamahal@gmail.com">sreeganesamahal@gmail.com</a>'
$oldWithIcon = '<a href="mailto:sreeganesamahal@gmail.com"><i class="fas fa-envelope"></i> sreeganesamahal@gmail.com</a>'
$newStyled  = '<a href="mailto:sreeganesamahal@gmail.com" style="color:var(--gold,#C9A84C);"><i class="fas fa-envelope"></i> sreeganesamahal@gmail.com</a>'

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  IGS - Fix Email Color on All Pages" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

$files = Get-ChildItem -Path $folder -Filter "*.html"
$fixed = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content

    # Fix 1: plain email link (no icon, no color)
    $content = $content.Replace($oldPlain, $newStyled)

    # Fix 2: email with icon but no color
    $content = $content.Replace($oldWithIcon, $newStyled)

    # Fix 3: catch any remaining __cf_email__ or email-protection (missed earlier)
    $content = [regex]::Replace(
        $content,
        '<a[^>]*(?:email-protection|__cf_email__)[^>]*>.*?</a>',
        $newStyled
    )

    # Fix 4: remove leftover Cloudflare decode script if any
    $content = $content -replace '<script[^>]+email-decode\.min\.js[^>]*></script>', ''

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "  FIXED: $($file.Name)" -ForegroundColor Green
        $fixed++
    } else {
        Write-Host "  OK:    $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "  $fixed / $($files.Count) files updated." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Now run:" -ForegroundColor White
Write-Host '  git add .' -ForegroundColor Green
Write-Host '  git commit -m "fix: email color consistent on all pages"' -ForegroundColor Green
Write-Host '  git push origin main' -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
Read-Host "Press Enter to close"
