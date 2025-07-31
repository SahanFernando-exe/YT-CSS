export function videoRedemension(videoElement) {
  console.log('REDEMENSION');
  videoElement.style.height = '100%';
  videoElement.style.maxHeight = 'none';

  const maxHeight = videoElement.clientHeight;
  console.log(`NEW HEIGHT: ${maxHeight}`);

  videoElement.style.maxheight = '80vh';

  const chaptersContainer = document.querySelector('.ytp-chapters-container');
  if (chaptersContainer) {
    Array.from(chaptersContainer.children).forEach(child => {
      const width = child.getBoundingClientRect().width;
      child.style.flexGrow = width;
    });
  }

  return maxHeight;
}