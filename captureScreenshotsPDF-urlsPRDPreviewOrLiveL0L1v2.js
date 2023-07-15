const puppeteer = require('puppeteer');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function captureScreenshotsFromUrls(urls) {
  const browser = await puppeteer.launch();
  const screenshots = [];
  const timestamp = getFormattedDateAndTime();
  const credentials = {
    username: 'user',
    password: 'RedirectT0Protect',
  };

  try {
    const folderPath = `SS_Urls_PRDPrevOrLive_${timestamp}`;
    const pdfName = `${timestamp}`;

    for (const urlData of urls) {
      const page = await browser.newPage();
      const { url, requiresAuth } = urlData;

      if (requiresAuth) {
        await page.authenticate(credentials);
      }

      await page.goto(url);

      const { filename, url: capturedUrl } = await captureScreenshot(page, url, folderPath);
      screenshots.push({ filename, url: capturedUrl });

      await page.close();
    }

    await createPdf(screenshots, folderPath, pdfName);
    console.log(`PDF created: ${path.join(folderPath, `${pdfName}.pdf`)}`);
  } catch (error) {
    console.error('Error capturing screenshots from URLs:', error);
  }

  await browser.close();
}

// Add this function to get the formatted date and time
function getFormattedDateAndTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

async function captureScreenshot(page, url, folderPath) {
  // Handle cookie consent
  await page.goto(url);
  await page.waitForSelector('pex-cookie-consent');
  await page.evaluate(() => {
    document.querySelector('pex-cookie-consent').style.display = 'none';
  });

  // Scroll to reveal elements
  await scrollPage(page); // Initial scroll
  await scrollPage(page); // Scroll again to trigger additional reveal animations

  // Modify CSS style of .sticky-nav element
  await page.evaluate(() => {
    const stickyNav = document.querySelector('.sticky-nav');
    if (stickyNav) {
      stickyNav.style.position = 'relative';
    }

    const pexPopup = document.querySelector('pex-popup');
    if (pexPopup) {
      pexPopup.style.display = 'none';
    }
  });

  // Remove data-aos attribute from all elements
  await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-aos]');
    for (const element of elements) {
      element.removeAttribute('data-aos');
    }
  });

  // Set viewport width to match document width
  const width = await page.evaluate(() => document.documentElement.offsetWidth);
  await page.setViewport({ width: 1440, height: 800 }); // Adjust the height as needed

  // Get page title
  const title = await page.title();
  const cleanTitle = title.replace(/[^\w\s]/gi, ''); // Remove special characters from title

  // Create folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Capture full-page screenshot
  const filename = path.join(folderPath, `${cleanTitle}.jpg`);
  await page.screenshot({ path: filename, fullPage: true, type: 'jpeg' });

  return { filename, url };
}

async function scrollPage(page) {
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
  await page.waitForTimeout(1000); // Adjust the delay between scrolls as needed (in milliseconds)
}

async function createPdf(screenshots, folderPath, timestamp) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const margin = 50; // Adjust the margin size as needed
  const pageWidth = 600; // Adjust the page width as needed

  for (const screenshot of screenshots) {
    const { filename, url } = screenshot;
    const imageBytes = fs.readFileSync(filename);
    const image = await pdfDoc.embedJpg(imageBytes);

    const imageWidth = image.width;
    const imageHeight = image.height;

    const scaleFactor = (pageWidth - margin * 2) / imageWidth;
    const scaledWidth = imageWidth * scaleFactor;
    const scaledHeight = imageHeight * scaleFactor;

    const pageHeight = scaledHeight + margin * 2;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const imageX = margin;
    const imageY = margin;

    page.drawImage(image, {
      x: imageX,
      y: imageY,
      width: scaledWidth,
      height: scaledHeight,
    });

    page.drawText(url, {
      x: margin + 50,
      y: margin + scaledHeight + 30,
      font,
      size: 10,
    });

    // Add timestamp below the URL
    const timestampText = getFormattedDateAndTimeForPDF(); // Get the formatted timestamp for the screenshot
    page.drawText(timestampText, {
      x: margin + 50,
      y: margin + scaledHeight + 15, // Adjust the position as needed
      font,
      size: 10,
    });
  }

  const pdfBytes = await pdfDoc.save();

  const pdfFilename = `screenshots_${timestamp.replace(/:/g, '-')}.pdf`; // Replace colons in timestamp for filename
  const pdfPath = path.join(folderPath, pdfFilename);

  fs.writeFileSync(pdfPath, pdfBytes);
  console.log(`PDF created: ${pdfPath}`);
}

function getFormattedDateAndTimeForPDF() {
  const now = new Date();
  const year = now.getFullYear();
  const month = padZero(now.getMonth() + 1);
  const day = padZero(now.getDate());
  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

function padZero(num) {
  return num.toString().padStart(2, '0');
}

// Provide a list of URLs to capture screenshots from, along with a flag indicating if authentication is required
const urls = [
  { url: 'https://ucbcares.co.uk/en/', requiresAuth: false },
  { url: 'https://ucbcares-uk.ucb-apps.be/preview/patients/epilepsy/en/content/1028337504', requiresAuth: true },
  // Add more URLs as needed
];

captureScreenshotsFromUrls(urls);
