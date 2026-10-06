Add-Type -AssemblyName System.Drawing

$width = 1280
$height = 800
$bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# 1. Dark Background
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 14, 20))
$g.FillRectangle($bgBrush, 0, 0, $width, $height)

# Grid
$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(18, 24, 34), 1)
for ($x = 0; $x -lt $width; $x += 60) {
    $g.DrawLine($gridPen, $x, 0, $x, $height)
}
for ($y = 0; $y -lt $height; $y += 60) {
    $g.DrawLine($gridPen, 0, $y, $width, $y)
}

# Typography
$titleFont = New-Object System.Drawing.Font('Segoe UI', 28, [System.Drawing.FontStyle]::Bold)
$subFont = New-Object System.Drawing.Font('Segoe UI', 15, [System.Drawing.FontStyle]::Bold)
$leadFont = New-Object System.Drawing.Font('Segoe UI', 12, [System.Drawing.FontStyle]::Regular)
$itemTitleFont = New-Object System.Drawing.Font('Segoe UI', 12.5, [System.Drawing.FontStyle]::Bold)
$itemDescFont = New-Object System.Drawing.Font('Segoe UI', 10.5, [System.Drawing.FontStyle]::Regular)
$cardTitleFont = New-Object System.Drawing.Font('Segoe UI', 11.5, [System.Drawing.FontStyle]::Bold)
$cardDescFont = New-Object System.Drawing.Font('Segoe UI', 9.5, [System.Drawing.FontStyle]::Regular)
$badgeFont = New-Object System.Drawing.Font('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)

# Brushes & Pens
$sageBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(82, 183, 136))
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(241, 245, 249))
$mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(148, 163, 184))
$cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(19, 24, 34))
$itemBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(28, 33, 45))
$tabActiveBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(28, 33, 45))
$tabInactiveBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(13, 16, 23))
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(43, 53, 72), 1)
$checkPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(11, 14, 20), 2.2)
$checkPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$checkPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$tabBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(56, 69, 92), 1)

# Left Hero Column
$g.DrawString('SensoryShield', $titleFont, $sageBrush, 65, 55)
$g.DrawString('AuDHD Visual Filter & Cognitive Declutter', $subFont, $whiteBrush, 65, 110)
$g.DrawString('A local-first browser extension for YouTube & Facebook sensory comfort.', $leadFont, $mutedBrush, 65, 145)

$heroBullets = @(
    @('100% Local-First & Zero Telemetry', 'Runs entirely in your browser with zero remote data transfer.'),
    @('Silent Element Collapse', 'Quietly hides target clickbait without visual flashes or layout jumps.'),
    @('Sensory Shock Guard', 'Stops thumbnail hover autoplay and unexpected motion triggers.'),
    @('Calm Titles (Sentence Case)', 'Normalizes screaming ALL CAPS titles and removes clickbait emojis.'),
    @('Muted Visuals Mode', 'Soothing 45% desaturation until hovered for focused browsing.'),
    @('Rejection & Dysregulation Shield', 'Hides comment sections to protect against online flame wars.'),
    @('Gentle Time Anchor (30m)', 'Subtle breathing reminders to support ADHD time-blindness.')
)

$bY = 205
foreach ($b in $heroBullets) {
    # Draw Green Bullet Circle
    $g.FillEllipse($sageBrush, 65, ($bY + 2), 22, 22)
    
    # Draw Checkmark Vector
    $g.DrawLine($checkPen, 71, ($bY + 13), 75, ($bY + 17))
    $g.DrawLine($checkPen, 75, ($bY + 17), 82, ($bY + 8))

    # Text
    $g.DrawString($b[0], $itemTitleFont, $whiteBrush, 98, $bY)
    $g.DrawString($b[1], $itemDescFont, $mutedBrush, 98, ($bY + 22))
    $bY += 66
}

# Right Column (Mockup of SensoryShield Popup)
$cardX = 740
$cardY = 45
$cardW = 475
$cardH = 710

$g.FillRectangle($cardBrush, $cardX, $cardY, $cardW, $cardH)
$g.DrawRectangle($borderPen, $cardX, $cardY, $cardW, $cardH)

$g.DrawString('SensoryShield', $itemTitleFont, $whiteBrush, $cardX + 22, $cardY + 16)
$g.DrawString('AuDHD Visual Filter & Calm Browsing', $cardDescFont, $mutedBrush, $cardX + 22, $cardY + 36)

# Status Badge
$badgeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(27, 56, 43))
$g.FillRectangle($badgeBg, $cardX + $cardW - 75, $cardY + 18, 55, 22)
$g.DrawRectangle($borderPen, $cardX + $cardW - 75, $cardY + 18, 55, 22)
$g.DrawString('Active', $badgeFont, $sageBrush, $cardX + $cardW - 66, $cardY + 22)

# Master Switch
$g.FillRectangle($itemBrush, $cardX + 18, $cardY + 66, $cardW - 36, 44)
$g.DrawRectangle($borderPen, $cardX + 18, $cardY + 66, $cardW - 36, 44)
$g.DrawString('Shield Protection', $cardTitleFont, $whiteBrush, $cardX + 30, $cardY + 72)
$g.DrawString('Silent collapse of target content', $cardDescFont, $mutedBrush, $cardX + 30, $cardY + 89)

$g.FillRectangle($sageBrush, $cardX + $cardW - 60, $cardY + 76, 28, 16)
$whiteCirc = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g.FillEllipse($whiteCirc, $cardX + $cardW - 46, $cardY + 78, 12, 12)

# Tab Bar
$tabY = $cardY + 120
$g.FillRectangle($tabActiveBrush, $cardX + 18, $tabY, 215, 28)
$g.DrawRectangle($tabBorderPen, $cardX + 18, $tabY, 215, 28)
$g.DrawString('Sensory Controls', $cardDescFont, $whiteBrush, $cardX + 60, $tabY + 6)

$g.FillRectangle($tabInactiveBrush, $cardX + 240, $tabY, 215, 28)
$g.DrawRectangle($borderPen, $cardX + 240, $tabY, 215, 28)
$g.DrawString('Filter Keywords', $cardDescFont, $mutedBrush, $cardX + 295, $tabY + 6)

# Feature Toggle Rows in Popup
$popupFeatures = @(
    @('Hide Shorts & Reels', 'Cuts rapid dopamine-trapping micro loops'),
    @('Mute Red Badges', 'Removes jarring red notification dots'),
    @('Block Hover Autoplay', 'No unexpected motion or startle response'),
    @('Calm Titles', 'Converts ALL CAPS clickbait to sentence case'),
    @('Mute Thumbnails', 'Gentle 45% desaturation until hovered'),
    @('Hide Comments', 'Emotional dysregulation & flame-war shield'),
    @('Dim Watch Sidebar', 'Calm focus on current video'),
    @('Time Anchor (30m)', 'Subtle break & breathing checkpoint')
)

$rowY = $tabY + 38
foreach ($p in $popupFeatures) {
    $g.FillRectangle($itemBrush, $cardX + 18, $rowY, $cardW - 36, 44)
    $g.DrawRectangle($borderPen, $cardX + 18, $rowY, $cardW - 36, 44)
    $g.DrawString($p[0], $cardTitleFont, $whiteBrush, $cardX + 30, $rowY + 6)
    $g.DrawString($p[1], $cardDescFont, $mutedBrush, $cardX + 30, $rowY + 24)
    
    $g.FillRectangle($sageBrush, $cardX + $cardW - 58, $rowY + 14, 26, 15)
    $g.FillEllipse($whiteCirc, $cardX + $cardW - 46, $rowY + 16, 11, 11)
    
    $rowY += 50
}

# Footer
$g.DrawString('🌱 Help fund woodlands: buymeacoffee.com/pavcieslakm', $cardDescFont, $sageBrush, $cardX + 24, $cardY + $cardH - 30)

$outDir = $PSScriptRoot
$outPng = Join-Path $outDir 'sensory-shield-screenshot-1280x800.png'
$outJpg = Join-Path $outDir 'sensory-shield-screenshot-1280x800.jpg'

$bmp.Save($outPng, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($outJpg, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$checkPen.Dispose()
$whiteCirc.Dispose()
$gridPen.Dispose()
$g.Dispose()
$bmp.Dispose()

Write-Host "Generated clean screenshot with vector bullets: $outPng"
