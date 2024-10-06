import React, { useState } from 'react';
import { ArrowRight, Download } from 'lucide-react';

function App() {
  // State hooks to manage selected file, converted image URL, and conversion info
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImageUrl, setConvertedImageUrl] = useState(null);
  const [conversionInfo, setConversionInfo] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const from = file.type.includes('jpeg') ? 'JPG' : 'PNG'; //current format
      const to = from === 'JPG' ? 'PNG' : 'JPG'; //target format
      const size = (file.size / 1024).toFixed(2) + ' KB'; //size
      setConversionInfo({ from, to, size });
    }
  };

  const handleConvert = () => {
    if (!selectedFile) {
      alert('Please select an image file.');
      return;
    }

    //FileReader to read a file
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      const from = selectedFile.type.includes('jpeg') ? 'jpg' : 'png';

      // Send a message to the Chrome extension to convert the image
      chrome.runtime.sendMessage(
        { action: 'convertImage', imageUrl, from },
        (response) => {
          setConvertedImageUrl(response.dataURL); // Set the converted image URL
        }
      );
    };
    reader.readAsDataURL(selectedFile); // Read the selected file as a data URL
  };

  return (
    <div className='w-full max-w-sm p-4 mx-auto text-gray-100 bg-gray-900 '>
      <h1 className='mb-6 text-2xl font-bold text-center'>
        Image Format Converter
      </h1>
      <div className='space-y-4'>
        <input
          type='file'
          onChange={handleFileChange}
          accept='image/*'
          className='w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700'
        />
        {conversionInfo && (
          <p className='text-sm text-center text-gray-400'>
            Converting from {conversionInfo.from} to {conversionInfo.to}
            <br />
            Image size: {conversionInfo.size}
          </p>
        )}
        <button
          onClick={handleConvert}
          className='flex items-center justify-center w-full px-4 py-2 space-x-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700'
        >
          <span>Convert</span>
          <ArrowRight className='w-5 h-5' />
        </button>
        {convertedImageUrl && (
          <div className='space-y-4 text-center'>
            <h2 className='text-xl font-semibold text-gray-200'>
              Converted Image
            </h2>
            <a
              href={convertedImageUrl}
              download={`converted_image.${conversionInfo?.to.toLowerCase()}`}
              className='inline-flex items-center px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700'
            >
              <Download className='w-5 h-5 mr-2' />
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
