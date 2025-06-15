document.addEventListener("DOMContentLoaded", function() {
    // Initialize track manager
    const trackManager = new TrackManager();
    
    // Initialize form handler
    const formHandler = new FormHandler(trackManager);
    
    // Initialize UI controls
    const uiControls = new UIControls(trackManager);
    
    // Initialize infinite scroll for compositions
    const compCont = document.querySelector('.comp-cont');
    let isLoading = false;

    if (compCont) {
        compCont.addEventListener('scroll', () => {
            if (!isLoading && compCont.scrollTop + compCont.clientHeight >= compCont.scrollHeight - 100) {
                isLoading = true;
                // Load more compositions if needed
                // loadMoreCompositions();
                isLoading = false;
            }
        });
    }
});
