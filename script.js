document.addEventListener('DOMContentLoaded', () => {
  const getBtn = document.getElementById('getBtn');
  const scareOverlay = document.getElementById('scareOverlay');
  const scareVideo = document.getElementById('scare-video');
  const scareSound = document.getElementById('scare-sound');
  const mainContainer = document.getElementById('mainContainer');
  const mainImage = document.getElementById('mainImage');

  let scareActive = false;

  // Video URL from your server
  const videoUrl = "https://freedownload.moy.su/videoscreamer/video.mp4";
  
  // Set video source
  scareVideo.src = videoUrl;
  scareVideo.preload = "auto";

  // Play scare function
  function playScare() {
    if (scareActive) return;
    
    scareActive = true;
    
    // Hide main content
    mainContainer.style.display = 'none';
    
    // Show scare overlay
    scareOverlay.classList.add('active');
    
    // Try to play video
    scareVideo.muted = false;
    scareVideo.volume = 1.0;
    
    const playPromise = scareVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('Video playing successfully');
      }).catch(error => {
        console.log('Video play failed:', error);
        // Try with muted first
        scareVideo.muted = true;
        scareVideo.play().then(() => {
          console.log('Video playing muted');
          // Unmute after start
          setTimeout(() => {
            scareVideo.muted = false;
          }, 100);
        }).catch(err => {
          console.log('Muted play also failed:', err);
          // If video still fails, use image fallback
          useImageFallback();
        });
      });
    }
    
    // Play sound
    scareSound.volume = 1.0;
    scareSound.currentTime = 0;
    scareSound.play().catch(error => {
      console.log('Sound error:', error);
    });
    
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Fullscreen error:', err);
      });
    }
    
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([1000, 500, 1000]);
    }
    
    // Hide scare after 4 seconds
    setTimeout(() => {
      stopScare();
    }, 4000);
  }

  // Fallback if video doesn't work
  function useImageFallback() {
    // Hide video
    scareVideo.style.display = 'none';
    
    // Create and show scary image
    const scaryImg = document.createElement('img');
    scaryImg.src = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    scaryImg.style.width = '100%';
    scaryImg.style.height = '100%';
    scaryImg.style.objectFit = 'cover';
    scaryImg.style.position = 'absolute';
    scaryImg.style.top = '0';
    scaryImg.style.left = '0';
    
    scareOverlay.appendChild(scaryImg);
  }

  // Stop scare function
  function stopScare() {
    if (!scareActive) return;
    
    scareActive = false;
    
    // Stop video and sound
    scareVideo.pause();
    scareVideo.currentTime = 0;
    scareVideo.style.display = 'block';
    
    // Remove any fallback images
    const fallbackImg = scareOverlay.querySelector('img');
    if (fallbackImg) {
      fallbackImg.remove();
    }
    
    scareSound.pause();
    scareSound.currentTime = 0;
    
    // Hide scare overlay
    scareOverlay.classList.remove('active');
    
    // Show main content
    mainContainer.style.display = 'block';
    
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    
    // Change button text
    getBtn.textContent = "TRY AGAIN?";
    
    // Restore original text after 2 seconds
    setTimeout(() => {
      getBtn.textContent = "GET ELEPHANT";
    }, 2000);
  }

  // Event listeners
  getBtn.addEventListener('click', playScare);
  
  // Click on image also triggers scare
  mainImage.addEventListener('click', playScare);
  
  // Escape key stops scare
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && scareActive) {
      stopScare();
    }
  });
  
  // Click on scare overlay stops scare
  scareOverlay.addEventListener('click', (e) => {
    if (scareActive && e.target === scareOverlay) {
      stopScare();
    }
  });
  
  // Handle video errors
  scareVideo.addEventListener('error', () => {
    console.log('Video failed to load');
  });
  
  // Handle sound errors
  scareSound.addEventListener('error', () => {
    console.log('Sound failed to load');
  });
  
  // Preload video on page load
  window.addEventListener('load', () => {
    // Load video
    scareVideo.load();
    
    // Try to preload by playing a tiny bit and pausing
    setTimeout(() => {
      scareVideo.muted = true;
      scareVideo.play().then(() => {
        scareVideo.pause();
        scareVideo.currentTime = 0;
        scareVideo.muted = false;
      }).catch(err => {
        console.log('Video preload failed');
      });
    }, 1000);
  });
});