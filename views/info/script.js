document.getElementById('fileInput').addEventListener('change', function(event) {
    const preview = document.getElementById('preview');
    preview.innerHTML = '';
    
    const files = event.target.files;
    
    Array.from(files).forEach(file => {
        const previewItem = document.createElement('div');
        previewItem.classList.add('preview-item');
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            previewItem.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.controls = true;
            previewItem.appendChild(video);
        }
        
        preview.appendChild(previewItem);
    });
});

document.getElementById('fileUploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData();
    const files = document.getElementById('fileInput').files;
    
    Array.from(files).forEach(file => {
        formData.append('files', file);
    });
    
    // Gửi formData đến server (thay URL bằng URL server của bạn)
    fetch('https://example.com/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
