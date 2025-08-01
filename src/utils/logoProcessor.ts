import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 512;

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
    
    // Initialize the segmentation model
    const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
      device: 'webgpu',
    });
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/png', 1.0);
    
    // Process with segmentation model
    const result = await segmenter(imageData);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    // Create output canvas with transparency
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = width;
    outputCanvas.height = height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply mask for background removal
    const outputImageData = outputCtx.getImageData(0, 0, width, height);
    const data = outputImageData.data;
    
    // Apply sophisticated masking for logo preservation
    for (let i = 0; i < result[0].mask.data.length; i++) {
      const maskValue = result[0].mask.data[i];
      // Keep the subject (logo) and remove background
      const alpha = maskValue > 0.1 ? 255 : 0; // Threshold for clean edges
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    
    // Return processed image as data URL
    return outputCanvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Error processing logo:', error);
    // Return original URL if processing fails
    return imageUrl;
  }
};

export const processAllCarLogos = async (): Promise<Record<string, string>> => {
  const logos = [
    'toyota', 'honda', 'nissan', 'hyundai', 'kia', 'mazda', 'mitsubishi', 'subaru', 
    'suzuki', 'infiniti', 'lexus', 'acura', 'genesis', 'isuzu', 'daewoo', 'ssangyong', 
    'mahindra', 'tata', 'bmw', 'mercedes-benz', 'audi', 'volkswagen', 'porsche', 
    'jaguar', 'land-rover', 'volvo', 'peugeot', 'renault', 'citroen', 'skoda', 
    'seat', 'fiat', 'alfa-romeo', 'lancia', 'ferrari', 'lamborghini', 'maserati', 
    'bentley', 'rolls-royce', 'vauxhall', 'opel', 'mini', 'smart', 'saab', 'dacia', 
    'tesla', 'ford', 'chevrolet', 'cadillac', 'gmc', 'dodge', 'chrysler', 'jeep', 
    'ram', 'buick', 'lincoln'
  ];
  
  const processedLogos: Record<string, string> = {};
  
  for (const logo of logos) {
    try {
      const originalUrl = `/car-logos/${logo}.png`;
      const processedUrl = await removeLogoBackground(originalUrl);
      processedLogos[logo] = processedUrl;
      console.log(`Processed: ${logo}`);
    } catch (error) {
      console.error(`Failed to process ${logo}:`, error);
      processedLogos[logo] = `/car-logos/${logo}.png`;
    }
  }
  
  return processedLogos;
};
