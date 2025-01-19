// Zmienne globalne
let isDraggingOverlay = false;
let overlayStartX, overlayStartY;
let mainImageOffset = { x: 0, y: 0 };
let mainImageScale = 1;
let overlayImageScale = 1;
let overlayRotation = 0;

// Elementy DOM
const overlayContainer = document.getElementById('overlayContainer');
const mainImage = document.getElementById('mainImage');
const overlayImage = document.getElementById('overlayImage');
const shadow = document.getElementById('shadow');

// Funkcja ładująca szablony do selecta
function loadSavedTemplates() {
  const select = document.getElementById('templateSelect');
  select.innerHTML = '';
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('template_')) {
      const templateName = key.replace('template_', '');
      const option = new Option(templateName, templateName);
      select.add(option);
    }
  }
}

// Funkcja aktualizacji cienia
function updateShadow() {
  const overlay = document.getElementById('overlayContainer');
  const shadow = document.getElementById('shadow');
  const borderWidth = parseInt(getComputedStyle(overlay).borderWidth);

  shadow.style.width = (overlay.offsetWidth + borderWidth * 2) + 'px';
  shadow.style.height = (overlay.offsetHeight + borderWidth * 2) + 'px';
  shadow.style.left = (overlay.offsetLeft - borderWidth) + 'px';
  shadow.style.top = (overlay.offsetTop - borderWidth) + 'px';
  shadow.style.backgroundColor = 'rgba(0, 0, 0, 0.66)';
  shadow.style.filter = 'blur(10px)';

  if (overlayContainer.classList.contains('sklejka')) {
    shadow.classList.add('sklejka');
    shadow.classList.remove('skos');
  } else if (overlayContainer.classList.contains('skos')) {
    shadow.classList.add('skos');
    shadow.classList.remove('sklejka');
  } else {
    shadow.classList.remove('sklejka', 'skos');
  }
}

// Obsługa przycisków kolorów
document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const color = this.dataset.color;
    overlayContainer.style.borderColor = color;
    document.getElementById('borderColor').value = color;
  });
});

// Obsługa obrotu nakładki
document.getElementById('rotationAngle').addEventListener('input', function(e) {
  overlayRotation = parseInt(e.target.value);
  document.getElementById('rotationAngleInput').value = overlayRotation;
  overlayContainer.style.transform = `rotate($${overlayRotation}deg) scale($$ {overlayImageScale})`;
  shadow.style.transform = `rotate(${overlayRotation}deg)`;
  updateShadow();
});

// Obsługa przeciągania nakładki
overlayContainer.addEventListener('mousedown', function(e) {
  isDraggingOverlay = true;
  overlayStartX = e.clientX - overlayContainer.offsetLeft;
  overlayStartY = e.clientY - overlayContainer.offsetTop;
});

document.addEventListener('mousemove', function(e) {
  if (isDraggingOverlay) {
    let newX = e.clientX - overlayStartX;
    let newY = e.clientY - overlayStartY;

    const maxX = editorContainer.offsetWidth - overlayContainer.offsetWidth;
    const maxY = editorContainer.offsetHeight - overlayContainer.offsetHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    overlayContainer.style.left = newX + 'px';
    overlayContainer.style.top = newY + 'px';
    updateShadow();
  }
});

document.addEventListener('mouseup', function() {
  isDraggingOverlay = false;
});

// Obsługa strzałek dla głównego zdjęcia
const MOVE_STEP = 10;
document.querySelectorAll('#mainImageNav .arrow').forEach(arrow => {
  arrow.addEventListener('click', function() {
    const direction = this.classList[1];
    switch (direction) {
      case 'up':
        mainImageOffset.y -= MOVE_STEP;
        break;
      case 'down':
        mainImageOffset.y += MOVE_STEP;
        break;
      case 'left':
        mainImageOffset.x -= MOVE_STEP;
        break;
      case 'right':
        mainImageOffset.x += MOVE_STEP;
        break;
    }
    updateMainImagePosition();
  });
});

// Obsługa strzałek dla nakładki
document.querySelectorAll('#overlayImageNav .arrow').forEach(arrow => {
  arrow.addEventListener('click', function() {
    const direction = this.classList[1];
    const transform = window.getComputedStyle(overlayImage).transform;
    const matrix = new DOMMatrix(transform);
    const step = 20;

    let x = matrix.m41 || 0;
    let y = matrix.m42 || 0;

    switch (direction) {
      case 'up':
        y -= step;
        break;
      case 'down':
        y += step;
        break;
      case 'left':
        x -= step;
        break;
      case 'right':
        x += step;
        break;
    }

    overlayImage.style.transform = `translate($${x}px,$$ {y}px) scale(${overlayImageScale})`;
  });
});

// Obsługa skalowania
document.getElementById('mainImageScale').addEventListener('input', function(e) {
  mainImageScale = e.target.value / 100;
  this.nextElementSibling.textContent = e.target.value + '%';
  updateMainImagePosition();
});

document.getElementById('overlayImageScale').addEventListener('input', function(e) {
  overlayImageScale = e.target.value / 100;
  this.nextElementSibling.textContent = e.target.value + '%';
  overlayImage.style.transform = `scale(${overlayImageScale})`;
});

// Obsługa wielkości nakładki
function updateOverlaySize(value) {
  document.getElementById('overlaySize').value = value;
  document.getElementById('overlaySizeInput').value = value;
  if (!overlayContainer.classList.contains('sklejka') && !overlayContainer.classList.contains('skos')) {
    overlayContainer.style.width = value + 'px';
    overlayContainer.style.height = value + 'px';
  }
  updateShadow();
}

document.getElementById('overlaySize').addEventListener('input', e => updateOverlaySize(e.target.value));
document.getElementById('overlaySizeInput').addEventListener('input', e => updateOverlaySize(e.target.value));

// Obsługa grubości ramki
document.getElementById('borderWidth').addEventListener('input', function(e) {
  const value = e.target.value;
  overlayContainer.style.border = `$${value}px solid$$ {document.getElementById('borderColor').value}`;
  updateShadow();
});

document.getElementById('borderWidthInput').addEventListener('input', function(e) {
  const value = e.target.value;
  overlayContainer.style.border = `$${value}px solid$$ {document.getElementById('borderColor').value}`;
  updateShadow();
});

// Obsługa cienia
document.getElementById('shadowToggle').addEventListener('change', function(e) {
  if (this.checked) {
    shadow.style.display = 'block';
    updateShadow();
  } else {
    shadow.style.display = 'none';
  }
});

// Obsługa kształtu nakładki
document.querySelectorAll('[data-shape]').forEach(btn => {
  btn.addEventListener('click', function() {
    // Usuń active ze wszystkich przycisków
    document.querySelectorAll('[data-shape]').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const shape = this.dataset.shape;
    // Reset wszystkich transformacji i klas
    overlayContainer.classList.remove('circle', 'square', 'sklejka', 'skos');
    overlayContainer.style.transform = 'none';
    shadow.style.transform = 'none';
    overlayImage.style.transform = 'none';

    if (shape === 'circle') {
      overlayContainer.classList.add('circle');
      shadow.style.borderRadius = '50%';
      updateOverlayRotation();
    } else if (shape === 'square') {
      overlayContainer.classList.add('square');
      shadow.style.borderRadius = '0';
      updateOverlayRotation();
    } else if (shape === 'sklejka') {
      overlayContainer.classList.add('sklejka');
      overlayContainer.style.width = '50%';
      overlayContainer.style.height = '100%';
      overlayContainer.style.left = '0';
      overlayContainer.style.top = '0';
      updateOverlayRotation();
    } else if (shape === 'skos') {
      overlayContainer.classList.add('skos');
      shadow.style.borderRadius = '0';
      overlayContainer.style.width = '50%';
      overlayContainer.style.height = '100%';
      overlayContainer.style.top = '0';
      overlayContainer.style.left = '0';
    }
    updateShadow();
  });
});

// Autodopasowanie zdjęcia
document.getElementById('autoFitBtn').addEventListener('click', function() {
  mainImageOffset = { x: 0, y: 0 };
  mainImageScale = 1;
  document.getElementById('mainImageScale').value = 100;
  mainImage.style.width = '100%';
  mainImage.style.height = '100%';
  mainImage.style.objectFit = 'contain';
  updateMainImagePosition();
});

// Wczytywanie zdjęć
document.getElementById('mainImageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    // Sprawdź i wymusz odpowiedni typ MIME
    const imageType = file.type || 'image/jpeg'; // Domyślny typ jeśli nie jest określony

    const reader = new FileReader();
    reader.onload = function(e) {
      mainImage.src = e.target.result;
      mainImage.style.display = 'block';
      // Dodajemy atrybut type
      mainImage.setAttribute('type', imageType);

      mainImage.onload = function() {
        mainImageOffset = { x: 0, y: 0 };
        mainImageScale = 1;
        document.getElementById('mainImageScale').value = 100;
        mainImage.style.width = '100%';
        mainImage.style.height = '100%';
        mainImage.style.objectFit = 'cover';
        updateMainImagePosition();
      };
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('overlayImageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      overlayImage.src = e.target.result;
      overlayImage.style.display = 'block';
      overlayImage.style.width = '100%';
      overlayImage.style.height = '100%';
      overlayImage.style.objectFit = 'cover';
    };
    reader.readAsDataURL(file);
  }
});
