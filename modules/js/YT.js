let scrollPosition = 0;
let isCustomScrolling = true;
let minHeight = 200;
let maxHeight = 0;
let videoSrc = '';
let playerElement = null;
let videoElement = null;
let watchPage = null;
let lastWindowScrollY = 0;

console.log("JS LOADED");

function getElements() {
    console.log("GETTING ELEMENTS");
    playerElement = document.querySelector('ytd-player #movie_player');
    videoElement = document.querySelector('ytd-player #movie_player video');
    watchPage = document.querySelector('ytd-page-manager > ytd-watch-flexy');
}


window.addEventListener('yt-navigate-finish', function(e) {
    console.log("YT-NAV-FINISH");
    getElements();
    scrollPosition = 0;
    watchPage.scrollTo(0,0);
    if (videoElement) {videoElement.addEventListener('loadedmetadata', videoRedemension, { once: true });}
});


function isEventInScrollableContainer(event) {
    if (!watchPage) return false;
    
    let current = event.target;
    while (current && current !== document.body) {
        if (current === watchPage) break; // Stop at main container
        
        const style = getComputedStyle(current);
        const isScrollable = style.overflowY === 'auto' || style.overflowY === 'scroll';
        const canScroll = current.scrollHeight > current.clientHeight;
        
        if (isScrollable && canScroll) return true;
        current = current.parentNode;
    }
    return false;
}


window.addEventListener('wheel', function(e) {
//    console.log("WHEEL");
    scrollPosition += e.deltaY;

    if (scrollPosition < 0) { scrollPosition = 0;}

    if (isEventInScrollableContainer(e)) return;

    if (!playerElement) {
        getElements();
        if (videoElement) {
console.log("caling redem");
videoRedemension();
videoElement.addEventListener('loadedmetadata', videoRedemension, { once: true });} else {return}
    }

    console.log(e.deltaY, scrollPosition, watchPage.scrollTop);

    if (videoElement.clientHeight > minHeight) {
//        console.log("CALLED1");
        watchPage.style.overflowY = 'hidden';
        const newHeight = maxHeight - scrollPosition;
        videoElement.style.cssText += `height: clamp(${minHeight}px, ${newHeight}px, ${maxHeight}px) !important;`;
    }
    else if (e.deltaY < 0 && watchPage.scrollTop ==0) {
//        console.log("CALLED3");
        watchPage.style.overflowY = 'hidden';
        const newHeight = maxHeight - scrollPosition;
        videoElement.style.cssText += `height: clamp(${minHeight}px, ${newHeight}px, ${maxHeight}px) !important;`;
    }
    else {
        watchPage.style.overflowY = 'scroll';
    }
}, { passive: false });


function videoRedemension() {
    console.log('REDEMENSION');
    videoElement.style.height = '100%';
    videoElement.style.maxheight = 'none';
    console.log(`VID: ${getComputedStyle(videoElement).getPropertyValue('height')}`);
    console.log('RESIZING');
    console.log(`OLD: ${maxHeight}`);
    maxHeight = videoElement.clientHeight;
    console.log(`NEW: ${maxHeight}`);

    let chaptersContainer = document.querySelector('.ytp-chapters-container');
    let children = Array.from(chaptersContainer.children);
    console.log(chaptersContainer.children);
    console.log(children);
    children.forEach(child => {
    const childWidth = child.getBoundingClientRect().width;
    child.style.flexGrow = childWidth;
    console.log('Child width:', childWidth); // Verify widths
  });
}