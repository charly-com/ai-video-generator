// scripts/generate-assets.js
// Run: node scripts/generate-assets.js
// Requires: sharp (already in dependencies)

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const ROOT = path.join(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const ICONS_DIR = path.join(PUBLIC, 'icons')
const SPLASH_DIR = path.join(PUBLIC, 'splash')
const SCREENSHOTS_DIR = path.join(PUBLIC, 'screenshots')

;[ICONS_DIR, SPLASH_DIR, SCREENSHOTS_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }))

// ─── SVG helpers ─────────────────────────────────────────────────────────────

function appIconSvg(size) {
  const r = Math.round(size * 0.22)
  const fs_ = Math.round(size * 0.48)
  const cy = Math.round(size / 2 + fs_ * 0.37)
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="#0a0a0f"/>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
  <text x="${size / 2}" y="${cy}"
    font-family="Arial Black,Arial,sans-serif"
    font-size="${fs_}" font-weight="900"
    text-anchor="middle" fill="#000000">V</text>
</svg>`
}

function shortcutSvg(size, letter, color) {
  const r = Math.round(size * 0.22)
  const fs_ = Math.round(size * 0.45)
  const cy = Math.round(size / 2 + fs_ * 0.37)
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${r}" fill="#0a0a0f"/>
  <rect width="${size}" height="${size}" rx="${r}" fill="${color}" opacity="0.15"/>
  <text x="${size / 2}" y="${cy}"
    font-family="Arial Black,Arial,sans-serif"
    font-size="${fs_}" font-weight="900"
    text-anchor="middle" fill="${color}">${letter}</text>
</svg>`
}

function splashSvg(width, height) {
  const logo = Math.round(Math.min(width, height) * 0.14)
  const r = Math.round(logo * 0.22)
  const lx = (width - logo) / 2
  const ly = height / 2 - logo * 0.8
  const textY = ly + logo + logo * 0.55
  const subtextY = textY + logo * 0.45
  const fs_ = Math.round(logo * 0.5)
  const fss = Math.round(logo * 0.22)
  const cy = ly + logo * 0.72
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#0a0a0f" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#07070F"/>
  <ellipse cx="${width / 2}" cy="${height / 2}" rx="${width * 0.4}" ry="${height * 0.25}" fill="url(#glow)"/>
  <rect x="${lx}" y="${ly}" width="${logo}" height="${logo}" rx="${r}" fill="url(#g)"/>
  <text x="${width / 2}" y="${cy}"
    font-family="Arial Black,Arial,sans-serif"
    font-size="${fs_}" font-weight="900"
    text-anchor="middle" fill="#000000">V</text>
  <text x="${width / 2}" y="${textY}"
    font-family="Arial,sans-serif"
    font-size="${fss * 1.5}" font-weight="700"
    text-anchor="middle" fill="#ffffff">ViralKit</text>
  <text x="${width / 2}" y="${subtextY}"
    font-family="Arial,sans-serif"
    font-size="${fss}" font-weight="400"
    text-anchor="middle" fill="rgba(255,255,255,0.4)">AI Content Studio</text>
</svg>`
}

function ogImageSvg() {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0f"/>
      <stop offset="100%" stop-color="#12121a"/>
    </linearGradient>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
    <radialGradient id="glow" cx="30%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#0a0a0f" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <!-- Grid lines -->
  <line x1="0" y1="315" x2="1200" y2="315" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="600" y1="0" x2="600" y2="630" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <!-- Logo box -->
  <rect x="80" y="180" width="110" height="110" rx="24" fill="url(#brand)"/>
  <text x="135" y="258" font-family="Arial Black,Arial,sans-serif" font-size="68" font-weight="900" text-anchor="middle" fill="#000000">V</text>
  <!-- App name -->
  <text x="220" y="240" font-family="Arial Black,Arial,sans-serif" font-size="62" font-weight="900" fill="#ffffff">ViralKit</text>
  <!-- Tagline -->
  <text x="80" y="320" font-family="Arial,sans-serif" font-size="26" font-weight="400" fill="rgba(255,255,255,0.55)">AI Content Studio — Go viral on every platform</text>
  <!-- Features row -->
  <rect x="80" y="370" width="180" height="40" rx="8" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.25)" stroke-width="1"/>
  <text x="170" y="395" font-family="Arial,sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="#f97316">AI Video Generator</text>
  <rect x="278" y="370" width="160" height="40" rx="8" fill="rgba(168,85,247,0.12)" stroke="rgba(168,85,247,0.25)" stroke-width="1"/>
  <text x="358" y="395" font-family="Arial,sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="#a855f7">Image Studio</text>
  <rect x="456" y="370" width="180" height="40" rx="8" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.25)" stroke-width="1"/>
  <text x="546" y="395" font-family="Arial,sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="#10b981">Auto Publishing</text>
  <!-- CTA button -->
  <rect x="80" y="445" width="210" height="50" rx="25" fill="url(#brand)"/>
  <text x="185" y="476" font-family="Arial,sans-serif" font-size="18" font-weight="700" text-anchor="middle" fill="#000000">Get Started Free</text>
  <!-- Platform icons as text labels -->
  <text x="80" y="570" font-family="Arial,sans-serif" font-size="13" fill="rgba(255,255,255,0.25)">TikTok · Instagram · YouTube · X · LinkedIn · Facebook</text>
</svg>`
}

function screenshotSvg(width, height, label) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#07070F"/>
  <rect x="0" y="0" width="${width}" height="56" fill="#0a0a14"/>
  <rect x="12" y="14" width="28" height="28" rx="7" fill="url(#brand)"/>
  <text x="26" y="33" font-family="Arial Black,Arial,sans-serif" font-size="16" font-weight="900" text-anchor="middle" fill="#000">V</text>
  <text x="50" y="34" font-family="Arial,sans-serif" font-size="15" font-weight="700" fill="#fff">ViralKit</text>
  <text x="${width / 2}" y="${height / 2}" font-family="Arial,sans-serif" font-size="18" font-weight="600" text-anchor="middle" fill="rgba(255,255,255,0.2)">${label}</text>
</svg>`
}

// ─── Generation tasks ─────────────────────────────────────────────────────────

async function gen(svgString, outPath, label) {
  await sharp(Buffer.from(svgString)).png().toFile(outPath)
  console.log(`  ✓ ${label}`)
}

async function main() {
  console.log('\n🎨 Generating ViralKit public assets...\n')

  // App icons
  console.log('Icons:')
  const iconSizes = [32, 72, 96, 128, 144, 152, 180, 192, 384, 512]
  for (const size of iconSizes) {
    const name = size === 180 ? 'apple-icon-180x180.png' : `icon-${size}x${size}.png`
    await gen(appIconSvg(size), path.join(ICONS_DIR, name), name)
  }

  // Shortcut icons
  await gen(shortcutSvg(96, 'V', '#a855f7'), path.join(ICONS_DIR, 'shortcut-video.png'), 'shortcut-video.png')
  await gen(shortcutSvg(96, 'I', '#06b6d4'), path.join(ICONS_DIR, 'shortcut-image.png'), 'shortcut-image.png')
  await gen(shortcutSvg(96, 'Q', '#10b981'), path.join(ICONS_DIR, 'shortcut-queue.png'), 'shortcut-queue.png')

  // Splash screens
  console.log('\nSplash screens:')
  const splashes = [
    [2048, 2732], [1668, 2388], [1170, 2532], [1125, 2436],
  ]
  for (const [w, h] of splashes) {
    await gen(splashSvg(w, h), path.join(SPLASH_DIR, `splash-${w}x${h}.png`), `splash-${w}x${h}.png`)
  }

  // OG image
  console.log('\nMeta assets:')
  await gen(ogImageSvg(), path.join(PUBLIC, 'og-image.png'), 'og-image.png')

  // Favicon (32x32 PNG saved as .ico — browsers accept this)
  await gen(appIconSvg(32), path.join(PUBLIC, 'favicon.ico'), 'favicon.ico')

  // Screenshots
  console.log('\nScreenshots:')
  await gen(screenshotSvg(390, 844, 'ViralKit Dashboard'), path.join(SCREENSHOTS_DIR, 'mobile-home.png'), 'mobile-home.png')
  await gen(screenshotSvg(1280, 800, 'AI Studio'), path.join(SCREENSHOTS_DIR, 'desktop-studio.png'), 'desktop-studio.png')

  console.log('\n✅ All assets generated successfully!\n')
  console.log('Files written to:')
  console.log(`  public/icons/         (${iconSizes.length + 3} files)`)
  console.log('  public/splash/        (4 files)')
  console.log('  public/screenshots/   (2 files)')
  console.log('  public/og-image.png')
  console.log('  public/favicon.ico')
}

main().catch(err => {
  console.error('Error generating assets:', err.message)
  process.exit(1)
})
