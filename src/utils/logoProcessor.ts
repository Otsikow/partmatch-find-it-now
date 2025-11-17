const MAX_IMAGE_DIMENSION = 512;
const COLOR_DISTANCE_THRESHOLD = 48;
const EDGE_FADE_DISTANCE = 24;

type RGB = { r: number; g: number; b: number };

const CAR_LOGOS = [
  'toyota', 'honda', 'nissan', 'hyundai', 'kia', 'mazda', 'mitsubishi', 'subaru',
  'suzuki', 'infiniti', 'lexus', 'acura', 'genesis', 'isuzu', 'daewoo', 'ssangyong',
  'mahindra', 'tata', 'bmw', 'mercedes-benz', 'audi', 'volkswagen', 'porsche',
  'jaguar', 'land-rover', 'volvo', 'peugeot', 'renault', 'citroen', 'skoda',
  'seat', 'fiat', 'alfa-romeo', 'lancia', 'ferrari', 'lamborghini', 'maserati',
  'bentley', 'rolls-royce', 'vauxhall', 'opel', 'mini', 'smart', 'saab', 'dacia',
  'tesla', 'ford', 'chevrolet', 'cadillac', 'gmc', 'dodge', 'chrysler', 'jeep',
  'ram', 'buick', 'lincoln'
] as const;

export const CAR_LOGO_COUNT = CAR_LOGOS.length;

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  return { width, height };
}

export const removeLogoBackground = async (imageUrl: string): Promise<string> => {
  try {
    console.log('Processing logo:', imageUrl);
    
    // Load the image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Create canvas and draw image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const { width, height } = resizeImageIfNeeded(canvas, ctx, img);
    
    const baseImageData = ctx.getImageData(0, 0, width, height);
    const hasAlpha = baseImageData.data.some((value, index) => index % 4 === 3 && value < 250);

    if (hasAlpha) {
      // Already transparent, no processing needed
      return canvas.toDataURL('image/png', 1.0);
    }

    const backgroundColors = collectBackgroundColors(baseImageData);
    const cleanedImageData = createTransparencyMask(baseImageData, backgroundColors);

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = width;
    outputCanvas.height = height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) throw new Error('Could not get output canvas context');

    outputCtx.putImageData(cleanedImageData, 0, 0);

    return outputCanvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Error processing logo:', error);
    // Return original URL if processing fails
    return imageUrl;
  }
};

const collectBackgroundColors = (imageData: ImageData): RGB[] => {
  const width = imageData.width;
  const height = imageData.height;
  const maxX = Math.max(width - 1, 0);
  const maxY = Math.max(height - 1, 0);

  const samplePoints = [
    { x: 0, y: 0 },
    { x: maxX, y: 0 },
    { x: 0, y: maxY },
    { x: maxX, y: maxY },
    { x: Math.floor(width / 2), y: 0 },
    { x: Math.floor(width / 2), y: maxY },
    { x: 0, y: Math.floor(height / 2) },
    { x: maxX, y: Math.floor(height / 2) }
  ];

  const colors = samplePoints.map((point) => getPixelColor(imageData, point.x, point.y));

  const averageColor = colors.reduce<RGB>((acc, color) => ({
    r: acc.r + color.r / colors.length,
    g: acc.g + color.g / colors.length,
    b: acc.b + color.b / colors.length,
  }), { r: 0, g: 0, b: 0 });

  colors.push(averageColor);
  return colors;
};

const getPixelColor = (imageData: ImageData, x: number, y: number): RGB => {
  const index = (y * imageData.width + x) * 4;
  const { data } = imageData;
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
  };
};

const colorDistance = (a: RGB, b: RGB) => {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

const createTransparencyMask = (imageData: ImageData, backgroundColors: RGB[]): ImageData => {
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    const pixel: RGB = { r: data[i], g: data[i + 1], b: data[i + 2] };
    const minDistance = backgroundColors.reduce((min, color) => Math.min(min, colorDistance(pixel, color)), Infinity);

    if (minDistance <= COLOR_DISTANCE_THRESHOLD) {
      data[i + 3] = 0;
    } else if (minDistance <= COLOR_DISTANCE_THRESHOLD + EDGE_FADE_DISTANCE) {
      const fadeRatio = (minDistance - COLOR_DISTANCE_THRESHOLD) / EDGE_FADE_DISTANCE;
      data[i + 3] = Math.max(0, Math.min(255, Math.round(data[i + 3] * fadeRatio)));
    }
  }
  return imageData;
};

export const processAllCarLogos = async (
  onProgress?: (processed: number, total: number) => void,
): Promise<Record<string, string>> => {
  const processedLogos: Record<string, string> = {};

  for (let i = 0; i < CAR_LOGOS.length; i++) {
    const logo = CAR_LOGOS[i];
    try {
      const originalUrl = `/car-logos/${logo}.png`;
      const processedUrl = await removeLogoBackground(originalUrl);
      processedLogos[logo] = processedUrl;
      console.log(`Processed: ${logo}`);
    } catch (error) {
      console.error(`Failed to process ${logo}:`, error);
      processedLogos[logo] = `/car-logos/${logo}.png`;
    }
    onProgress?.(i + 1, CAR_LOGOS.length);
  }

  return processedLogos;
};
