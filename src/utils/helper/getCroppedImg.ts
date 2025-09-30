export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  type: 'avatar' | 'background',
): Promise<{ file: File; base64: string }> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }

      const file = new File([blob], `cropped-${type}.jpg`, { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ file, base64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }, 'image/jpeg');
  });
};
