export function isEventInScrollableContainer(event) {
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