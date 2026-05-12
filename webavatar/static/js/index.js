const demoFrameWrap = document.getElementById('demo-frame-wrap');
let demoPlaceholder = document.getElementById('demo-placeholder');
const demoTabs = document.querySelectorAll('.demo-tab');
let demoFrame = null;

function setActiveTab(modelName) {
  demoTabs.forEach((tab) => {
    const isActive = tab.dataset.model === modelName;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

function ensurePlaceholder() {
  if (!demoPlaceholder) {
    demoPlaceholder = document.createElement('div');
    demoPlaceholder.id = 'demo-placeholder';
    demoPlaceholder.className = 'demo-placeholder';
    demoPlaceholder.textContent = 'Select a subject to load the WebGPU viewer.';
  }

  if (!demoPlaceholder.parentNode) {
    demoFrameWrap.appendChild(demoPlaceholder);
  }
}

function clearDemo() {
  setActiveTab('');

  if (demoFrame) {
    demoFrame.remove();
    demoFrame = null;
  }

  ensurePlaceholder();
}

function loadDemo(modelName) {
  const url = `https://webavatar.pages.dev/?model=${modelName}.npz&pose=${modelName}_poses.json`;

  setActiveTab(modelName);

  if (!demoFrame) {
    demoPlaceholder.remove();
    demoFrame = document.createElement('iframe');
    demoFrame.className = 'demo-frame';
    demoFrame.loading = 'lazy';
    demoFrame.allow = 'webgpu; fullscreen';
    demoFrame.title = 'Interactive WebAvatar viewer';
    demoFrameWrap.appendChild(demoFrame);
  }

  demoFrame.src = url;
}

demoTabs.forEach((tab) => {
  if (!tab.classList.contains('is-active')) {
    tab.setAttribute('aria-selected', 'false');
  }

  tab.addEventListener('click', () => {
    if (tab.dataset.model) {
      loadDemo(tab.dataset.model);
    } else {
      clearDemo();
    }
  });
});
