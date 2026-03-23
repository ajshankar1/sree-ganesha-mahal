@echo off
echo ===================================================
echo   IGS Convention Centre - Email Fix Script
echo ===================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$email = 'sreeganesamahal@gmail.com'; ^
$folder = Split-Path -Parent $MyInvocation.MyCommand.Path; ^
$files = Get-ChildItem -Path $folder -Filter '*.html'; ^
$fixed = 0; ^
foreach ($file in $files) { ^
  $content = Get-Content $file.FullName -Raw -Encoding UTF8; ^
  $original = $content; ^
  $content = $content -replace '<script[^>]+email-decode\.min\.js[^>]*></script>', ''; ^
  $content = $content -replace '<a\s+href=""[^""]*email-protection[^""]*""[^>]*>.*?</a>', ('<a href=""mailto:' + $email + '""><i class=""fas fa-envelope""></i> ' + $email + '</a>'); ^
  $content = [regex]::Replace($content, '<a\s+href=""[^""]*email-protection[^""]*""[^>]*>.*?</a>', ('<a href=""mailto:' + $email + '""><i class=""fas fa-envelope""></i> ' + $email + '</a>')); ^
  $content = [regex]::Replace($content, '<span[^>]+__cf_email__[^>]*>.*?</span>', $email); ^
  if ($content -ne $original) { ^
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline; ^
    Write-Host ('  FIXED: ' + $file.Name) -ForegroundColor Green; ^
    $fixed++ ^
  } else { ^
    Write-Host ('  OK:    ' + $file.Name) -ForegroundColor Gray ^
  } ^
}; ^
Write-Host ''; ^
Write-Host ('Done! ' + $fixed + ' files updated.') -ForegroundColor Yellow"

echo.
echo ===================================================
echo   Now run these commands:
echo   git add .
echo   git commit -m "fix: email fixed on all pages"
echo   git push origin main
echo ===================================================
pause
