// Create a simple favicon.ico in public directory
// This creates a 16x16 and 32x32 ICO file programmatically

const fs = require('fs');
const path = require('path');

// Simple ICO header and data for a wood/fire icon
// This is a minimal ICO file with 16x16 and 32x32 icons
const icoData = Buffer.from([
  0x00, 0x00, 0x01, 0x00, 0x02, 0x00, // ICO header: reserved, type, count
  
  // Icon 1: 16x16
  0x10, 0x10, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00, // width, height, colors, reserved, planes, bpp
  0x00, 0x04, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00, // size, offset
  
  // Icon 2: 32x32  
  0x20, 0x20, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00, // width, height, colors, reserved, planes, bpp
  0x00, 0x10, 0x00, 0x00, 0x1A, 0x04, 0x00, 0x00, // size, offset
  
  // Simple bitmap data for 16x16 icon (wood brown color)
  ...Array(16 * 16 * 4).fill(0).map((_, i) => {
    const pixel = Math.floor(i / 4);
    const component = i % 4;
    if (component === 3) return 255; // alpha
    if (component === 0) return 139; // red (wood brown)
    if (component === 1) return 69;  // green
    if (component === 2) return 19;  // blue
    return 0;
  }),
  
  // Simple bitmap data for 32x32 icon
  ...Array(32 * 32 * 4).fill(0).map((_, i) => {
    const pixel = Math.floor(i / 4);
    const component = i % 4;
    if (component === 3) return 255; // alpha
    if (component === 0) return 139; // red (wood brown)
    if (component === 1) return 69;  // green  
    if (component === 2) return 19;  // blue
    return 0;
  })
]);

// Write the ICO file
const publicDir = path.join(__dirname, 'public');
const faviconPath = path.join(publicDir, 'favicon.ico');

fs.writeFileSync(faviconPath, icoData);
console.log('favicon.ico created in public directory');