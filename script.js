document.getElementById('saveAsBtn').addEventListener('click', function () {
    const editorContainer = document.getElementById('editorContainer');

    // Wymuszamy format pliku PNG
    domtoimage.toBlob(editorContainer, {
        quality: 1,
        bgcolor: '#fff',
        format: 'png' // Wymuszamy zapis jako PNG
    })
        .then(function (blob) {
            // Tworzymy poprawny obiekt Blob z określonym typem MIME
            const imageBlob = new Blob([blob], { type: 'image/png' });
            const date = new Date();
            const timestamp =
                date.getFullYear() +
                ('0' + (date.getMonth() + 1)).slice(-2) +
                ('0' + date.getDate()).slice(-2) +
                '_' +
                ('0' + date.getHours()).slice(-2) +
                ('0' + date.getMinutes()).slice(-2);
            const filename = `Sklejka_${timestamp}.png`;

            if (/iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent)) {
                // Specjalna obsługa dla systemów Apple
                const url = URL.createObjectURL(imageBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.type = 'image/png'; // Wymuszamy typ MIME
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }, 100);
            } else {
                // Standardowa obsługa dla innych systemów
                const url = URL.createObjectURL(imageBlob);
                const link = document.createElement('a');
                link.download = filename;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
            }
        })
        .catch(function (error) {
            console.error('Błąd podczas zapisywania:', error);
            alert('Wystąpił błąd podczas zapisywania zdjęcia.');
        });
});
