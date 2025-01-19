// Główne zmienne do obsługi obrazów
let mainImage = null; // Obraz główny
let overlayImage = null; // Obraz nakładki
let overlayContainer = null; // Kontener nakładki

// Funkcja do inicjalizacji elementów
function initialize() {
    mainImage = document.getElementById('mainImage');
    overlayImage = document.getElementById('overlayImage');
    overlayContainer = document.getElementById('overlayContainer');

    // Przesuwanie nakładki
    makeOverlayDraggable();

    // Obsługa ładowania obrazów
    document.getElementById('mainImageInput').addEventListener('change', (e) => loadImage(e.target, mainImage));
    document.getElementById('overlayImageInput').addEventListener('change', (e) => loadImage(e.target, overlayImage));

    // Zapis obrazu
    document.getElementById('saveButton').addEventListener('click', saveImage);
}

// Wymuszanie poprawnego rozszerzenia pliku
function forceFileExtension(filename, extension = '.jpg') {
    if (!filename.endsWith(extension)) {
        return filename + extension;
    }
    return filename;
}

// Ładowanie obrazów (głównego i nakładki)
function loadImage(inputElement, targetImage) {
    const file = inputElement.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();

        // Poprawne przypisanie MIME typu
        img.src = event.target.result;
        img.onload = function () {
            targetImage.src = forceFileExtension(file.name);
            targetImage.style.display = 'block'; // Wyświetlenie obrazu
        };
    };

    reader.readAsDataURL(file);
}

// Funkcja zapisywania obrazu (głównego + nakładki)
function saveImage() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Rozmiary obrazu głównego
    canvas.width = mainImage.naturalWidth;
    canvas.height = mainImage.naturalHeight;

    // Rysowanie głównego obrazu na płótnie
    context.drawImage(mainImage, 0, 0, canvas.width, canvas.height);

    // Dodanie nakładki, jeśli istnieje
    if (overlayImage) {
        const overlayDimensions = overlayContainer.getBoundingClientRect();
        const mainDimensions = mainImage.getBoundingClientRect();

        const offsetX = overlayDimensions.left - mainDimensions.left;
        const offsetY = overlayDimensions.top - mainDimensions.top;

        const scale = mainImage.naturalWidth / mainDimensions.width;

        context.drawImage(
            overlayImage,
            offsetX * scale,
            offsetY * scale,
            overlayDimensions.width * scale,
            overlayDimensions.height * scale
        );
    }

    // Tworzenie pliku z poprawnym rozszerzeniem
    const filename = forceFileExtension('finalImage', '.jpg');

    // Eksport jako JPEG i pobranie pliku
    const dataURL = canvas.toDataURL('image/jpeg');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    a.click();
}

// Funkcja umożliwiająca przeciąganie nakładki
function makeOverlayDraggable() {
    let isDragging = false;
    let offsetX, offsetY;

    overlayContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = overlayContainer.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const container = document.getElementById('editorContainer');
            const containerRect = container.getBoundingClientRect();

            const newX = e.clientX - containerRect.left - offsetX;
            const newY = e.clientY - containerRect.top - offsetY;

            // Ustawianie nowych pozycji nakładki
            overlayContainer.style.left = Math.max(0, Math.min(containerRect.width - overlayContainer.offsetWidth, newX)) + 'px';
            overlayContainer.style.top = Math.max(0, Math.min(containerRect.height - overlayContainer.offsetHeight, newY)) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Uruchomienie aplikacji po załadowaniu strony
document.addEventListener('DOMContentLoaded', initialize);
