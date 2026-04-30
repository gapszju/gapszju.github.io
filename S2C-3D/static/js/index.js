window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    if (!dropdown || !button) return;
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        if (!dropdown || !button) return;
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    if (!button) return;
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Copied';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Copied';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (!scrollButton) return;
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

function renderQualitativeScene(scene, scenes, activeIndex) {
    const tabs = document.getElementById('scene-tabs');
    const inputGrid = document.getElementById('input-grid');
    const video = document.getElementById('result-video');
    const image = document.getElementById('result-image');
    const switchBtn = document.getElementById('switch-to-video-btn');
    const caption = document.getElementById('qr-caption');
    if (!tabs || !inputGrid || !video || !image || !switchBtn || !caption) return;

    tabs.querySelectorAll('.scene-tab').forEach((btn, idx) => {
        btn.classList.toggle('is-active', idx === activeIndex);
    });

    inputGrid.innerHTML = '';
    inputGrid.classList.toggle('many', (scene.inputs || []).length > 4);
    (scene.inputs || []).forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${scene.title} input view ${i + 1}`;
        img.loading = 'lazy';
        img.addEventListener('click', () => {
            inputGrid.querySelectorAll('img').forEach((im) => im.classList.remove('active'));
            img.classList.add('active');
            image.src = src;
            image.style.display = 'block';
            video.style.display = 'none';
            video.pause();
            switchBtn.disabled = false;
        });
        inputGrid.appendChild(img);
    });

    // Default to video mode for each scene
    inputGrid.querySelectorAll('img').forEach((im) => im.classList.remove('active'));
    image.style.display = 'none';
    image.src = '';
    video.style.display = 'block';
    switchBtn.disabled = true;

    if (video.src !== scene.video) {
        video.src = scene.video;
        video.load();
    }
    video.play().catch(() => {});

    const n = (scene.inputs || []).length;
    caption.textContent = `${scene.title} • Generated with only ${n} input images.`;
}

function setupQualitativeResults() {
    const manifest = window.S2C_RESULTS_MANIFEST;
    const tabs = document.getElementById('scene-tabs');
    if (!tabs || !manifest || !Array.isArray(manifest.scenes) || manifest.scenes.length === 0) return;

    const scenes = manifest.scenes;
    tabs.innerHTML = '';

    scenes.forEach((scene, idx) => {
        const btn = document.createElement('button');
        btn.className = 'scene-tab' + (idx === 0 ? ' is-active' : '');
        btn.textContent = scene.title || `Scene ${idx + 1}`;
        btn.addEventListener('click', () => renderQualitativeScene(scene, scenes, idx));
        tabs.appendChild(btn);
    });

    const switchBtn = document.getElementById('switch-to-video-btn');
    const inputGrid = document.getElementById('input-grid');
    const video = document.getElementById('result-video');
    const image = document.getElementById('result-image');
    if (switchBtn && inputGrid && video && image) {
        switchBtn.addEventListener('click', () => {
            image.style.display = 'none';
            image.src = '';
            video.style.display = 'block';
            video.play().catch(() => {});
            inputGrid.querySelectorAll('img').forEach((im) => im.classList.remove('active'));
            switchBtn.disabled = true;
        });
    }

    renderQualitativeScene(scenes[0], scenes, 0);
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

    // Setup qualitative results block from PPT-exported assets
    setupQualitativeResults();

})
