import { getElements } from "/modules/util/dom-utils.js";
import { videoRedemension } from "/modules/util/video-utils.js";
import { isEventInScrollableContainer } from "/modules/util/scroll-utils.js";


export function script() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', logic);
    } else {
      logic();
    }
}

async function logic() {
console.log("DYNAMIC PLAYER RUNNING");

let scrollPosition = 0;
let maxHeight = 0;
let minHeight = 200;
let DOMelements = await getElements({
        player: 'ytd-player #movie_player',
        video: 'ytd-player #movie_player video',
        watchPage: 'ytd-page-manager > ytd-watch-flexy'
    });

window.addEventListener('yt-navigate-finish', function(e) {
    console.log("YT-NAV-FINISH");
    scrollPosition = 0;
    DOMelements.watchPage.scrollTo(0,0);
    if (DOMelements.video) {
        DOMelements.video.addEventListener('loadedmetadata', function() {
            maxHeight = videoRedemension(DOMelements.video)
        }, 
            { once: true });}
});

window.addEventListener('wheel', function(e) {
    scrollPosition += e.deltaY;
    if (scrollPosition < 0) { scrollPosition = 0;}
    console.log(scrollPosition, e.deltaY)

    //if (isEventInScrollableContainer(e)) return;
    if (maxHeight === 0) {
        maxHeight = videoRedemension(DOMelements.video)
    }

    if (DOMelements.video.clientHeight > minHeight || (e.deltaY < 0 && DOMelements.watchPage.scrollTop == 0)) {
        console.log("custom scroll")
        DOMelements.watchPage.style.overflowY = 'hidden';
        const newHeight = maxHeight - scrollPosition;
        DOMelements.video.style.cssText += `height: clamp(${minHeight}px, ${newHeight}px, ${maxHeight}px) !important;`;
        console.log("height", maxHeight)
    }
    else {
        DOMelements.watchPage.style.overflowY = 'scroll';
    }
}, { passive: false });

}