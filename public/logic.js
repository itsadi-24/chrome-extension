chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'convertImage') {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const newFormat = request.from === 'jpg' ? 'image/png' : 'image/jpeg';
      const dataURL = canvas.toDataURL(newFormat);
      sendResponse({ dataURL: dataURL });
    };
    img.src = request.imageUrl;
    return true;
  }
});
