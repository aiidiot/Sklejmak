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

// Poprawiona wersja kodu - ładowanie obrazów i zapis plików

// Funkcja do wczytywania obrazów do odpowiednich elementów <img>
function loadImage(event, imgElementId) {
    const input = event.target;
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imgElement = document.getElementById(imgElementId);
            imgElement.src = e.target.result;
            imgElement.style.display = 'block'; // Upewnij się, że obraz jest widoczny po wczytaniu
        };

        reader.readAsDataURL(file); // Wczytaj obraz jako Data URL
    } else {
        alert('Nie wybrano pliku obrazu!');
    }
}

// Funkcja do zapisu połączonego obrazu jako pliku
function saveImage() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Pobierz elementy obrazów
    const mainImage = document.getElementById('mainImage');
    const overlayImage = document.getElementById('overlayImage');

    // Sprawdź, czy obrazy są załadowane
    if (!mainImage.src || !overlayImage.src) {
        alert('Upewnij się, że oba obrazy zostały wczytane.');
        return;
    }

    // Ustaw wymiary canvasa na rozmiary głównego obrazu
    canvas.width = mainImage.naturalWidth;
    canvas.height = mainImage.naturalHeight;

    // Narysuj główny obraz
    context.drawImage(mainImage, 0, 0);

    // Narysuj obraz nakładki w odpowiednim miejscu
    const overlayRect = overlayImage.getBoundingClientRect();
    const mainRect = mainImage.getBoundingClientRect();

    const scale = mainImage.naturalWidth / mainRect.width;

    const x = (overlayRect.left - mainRect.left) * scale;
    const y = (overlayRect.top - mainRect.top) * scale;
    const width = overlayRect.width * scale;
    const height = overlayRect.height * scale;

    context.drawImage(overlayImage, x, y, width, height);

    // Zapisz wynik jako plik
    const link = document.createElement('a');
    link.download = 'combined_image.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
}

// Podpięcie zdarzeń do elementów po załadowaniu DOM
window.onload = function () {
    document.getElementById('mainImageInput').addEventListener('change', (e) => loadImage(e, 'mainImage'));
    document.getElementById('overlayImageInput').addEventListener('change', (e) => loadImage(e, 'overlayImage'));
    document.getElementById('saveButton').addEventListener('click', saveImage);
};


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
