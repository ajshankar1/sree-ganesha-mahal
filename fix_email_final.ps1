# IGS Convention Centre - Final Email Fix
# Right-click → "Run with PowerShell"

$email = "sreeganesamahal@gmail.com"
$folder = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  IGS Convention Centre - Final Email Fix" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# index.html is already fixed (downloaded separately) - skip it
$files = Get-ChildItem -Path $folder -Filter "*.html" | Where-Object { $_.Name -ne "index.html" }
$fixed = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content

    # Remove Cloudflare decode script
    $content = $content -replace '<script[^>]+email-decode\.min\.js[^>]*></script>', ''

    # Fix email-protection links (with icon)
    $content = [regex]::Replace(
        $content,
        '<a\s+href="[^"]*(?:email-protection|cdn-cgi)[^"]*"[^>]*>(?:<i[^>]*></i>\s*)?(?:<span[^>]*>[^<]*</span>|\[[^\]]*\]|[^<]*)</a>',
        "<a href=`"mailto:$email`"><i class=`"fas fa-envelope`"></i> $email</a>"
    )

    # Fix __cf_email__ class anchors
    $content = [regex]::Replace(
        $content,
        '<a[^>]+__cf_email__[^>]*>[^<]*</a>',
        "<a href=`"mailto:$email`"><i class=`"fas fa-envelope`"></i> $email</a>"
    )

    # Fix leftover __cf_email__ spans
    $content = [regex]::Replace(
        $content,
        '<span[^>]+__cf_email__[^>]*>[^<]*</span>',
        $email
    )

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "  FIXED: $($file.Name)" -ForegroundColor Green
        $fixed++
    } else {
        Write-Host "  OK:    $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "  $fixed files updated." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Now run:" -ForegroundColor White
Write-Host '  git add .' -ForegroundColor Green
Write-Host '  git commit -m "fix: calendar + email fixed all pages"' -ForegroundColor Green
Write-Host '  git push origin main' -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
Read-Host "Press Enter to close"
