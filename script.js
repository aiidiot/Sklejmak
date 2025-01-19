// Główne zmienne do obsługi obrazów
let mainImage = null; // Obraz główny
let overlayImage = null; // Obraz nakładki
let overlayContainer = null; // Kontener nakładki

// Funkcja do inicjalizacji elementów
function initialize() {
    mainImage = document.getElementById('mainImage');
    overlayImage = document.getElementById('overlayImage');
    overlayContainer = document.getElementById('overlayContainer');

    // Obsługa ładowania obrazów
    document.getElementById('mainImageInput').addEventListener('change', (e) => loadImage(e.target, mainImage));
    document.getElementById('overlayImageInput').addEventListener('change', (e) => loadImage(e.target, overlayImage));

    // Obsługa zapisu obrazu
    document.getElementById('saveButton').addEventListener('click', saveImage);
}

// Ładowanie obrazów
function loadImage(inputElement, targetImage) {
    const file = inputElement.files[0];
    if (!file) {
        alert('Nie wybrano pliku.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        targetImage.src = event.target.result; // Ustawienie źródła obrazu na wynik wczytywania
        targetImage.style.display = 'block'; // Wyświetlenie obrazu na ekranie
    };
    reader.readAsDataURL(file); // Odczytanie pliku jako Data URL
}

// Funkcja zapisu obrazu
function saveImage() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Rozmiary obrazu głównego
    canvas.width = mainImage.naturalWidth;
    canvas.height = mainImage.naturalHeight;

    // Rysowanie obrazu głównego
    context.drawImage(mainImage, 0, 0, canvas.width, canvas.height);

    // Dodanie nakładki, jeśli istnieje
    if (overlayImage && overlayImage.src) {
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

    // Zapis obrazu jako plik
    const dataURL = canvas.toDataURL('image/jpeg');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'finalImage.jpg';
    a.click();
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', initialize);
