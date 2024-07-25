document.addEventListener('DOMContentLoaded', () => {
    initializeMemories();
    initializeMovies();
    loadMemories();
    loadMovies();
});

function showTab(tabName) {
    const memoriesTab = document.getElementById('memories');
    const moviesTab = document.getElementById('movies');

    if (tabName === 'memories') {
        memoriesTab.style.display = 'block';
        moviesTab.style.display = 'none';
    } else {
        memoriesTab.style.display = 'none';
        moviesTab.style.display = 'block';
    }
}

function initializeMemories() {
    for (let i = 0; i < 6; i++) {
        addMemoryBox();
    }
}

function initializeMovies() {
    for (let i = 0; i < 6; i++) {
        addMovieBox();
    }
}

function addMemoryBox() {
    const container = document.getElementById('memoriesContainer');
    const memoryBox = document.createElement('div');
    memoryBox.classList.add('memoryBox');

    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    imageInput.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.onclick = function() {
                    openModal(e.target.result);
                };
                img.style.width = '300px'; // Default size
                img.style.height = 'auto'; // Maintain aspect ratio
                img.draggable = true; // Make image draggable
                memoryBox.insertBefore(img, textBox);
                imageInput.style.display = 'none';
                deleteButton.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    };

    const textBox = document.createElement('textarea');
    textBox.placeholder = 'Write your memory here...';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Image';
    deleteButton.classList.add('deleteButton');
    deleteButton.style.display = 'none';
    deleteButton.onclick = function() {
        const img = memoryBox.querySelector('img');
        if (img) {
            memoryBox.removeChild(img);
            imageInput.value = '';
            imageInput.style.display = 'block';
            deleteButton.style.display = 'none';
        }
    };

    memoryBox.appendChild(imageInput);
    memoryBox.appendChild(textBox);
    memoryBox.appendChild(deleteButton);

    container.appendChild(memoryBox);
}

function addMovieBox() {
    const container = document.getElementById('moviesContainer');
    const movieBox = document.createElement('div');
    movieBox.classList.add('movieBox');

    const movieInput = document.createElement('input');
    movieInput.type = 'text';
    movieInput.placeholder = 'Movie title';

    const favoriteLineBox = document.createElement('textarea');
    favoriteLineBox.placeholder = 'Your favorite line from this movie...';

    movieBox.appendChild(movieInput);
    movieBox.appendChild(favoriteLineBox);

    container.appendChild(movieBox);
}

function openModal(src) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = src;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

async function saveMemories() {
    const memoriesContainer = document.getElementById('memoriesContainer');
    const memoryBoxes = memoriesContainer.querySelectorAll('.memoryBox');
    const memories = [];

    memoryBoxes.forEach(memoryBox => {
        const img = memoryBox.querySelector('img');
        const text = memoryBox.querySelector('textarea').value;

        memories.push({
            imgSrc: img ? img.src : '',
            text: text
        });
    });

    const response = await fetch('http://localhost:3000/saveMemories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(memories)
    });

    if (response.ok) {
        alert('Memories saved!');
    } else {
        alert('Error saving memories.');
    }
}

async function loadMemories() {
    const response = await fetch('http://localhost:3000/loadMemories');
    if (!response.ok) {
        alert('Error loading memories.');
        return;
    }

    const memories = await response.json();
    if (!memories) return;

    const memoriesContainer = document.getElementById('memoriesContainer');
    memoriesContainer.innerHTML = '';

    memories.forEach(memory => {
        const memoryBox = document.createElement('div');
        memoryBox.classList.add('memoryBox');

        const imageInput = document.createElement('input');
        imageInput.type = 'file';
        imageInput.accept = 'image/*';
        imageInput.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.onclick = function() {
                        openModal(e.target.result);
                    };
                    img.style.width = '300px'; // Default size
                    img.style.height = 'auto'; // Maintain aspect ratio
                    img.draggable = true; // Make image draggable
                    memoryBox.insertBefore(img, textBox);
                    imageInput.style.display = 'none';
                    deleteButton.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        };

        const textBox = document.createElement('textarea');
        textBox.value = memory.text;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Image';
        deleteButton.classList.add('deleteButton');
        deleteButton.style.display = memory.imgSrc ? 'block' : 'none';
        deleteButton.onclick = function() {
            const img = memoryBox.querySelector('img');
            if (img) {
                memoryBox.removeChild(img);
                imageInput.value = '';
                imageInput.style.display = 'block';
                deleteButton.style.display = 'none';
            }
        };

        if (memory.imgSrc) {
            const img = document.createElement('img');
            img.src = memory.imgSrc;
            img.onclick = function() {
                openModal(memory.imgSrc);
            };
            img.style.width = '300px'; // Default size
            img.style.height = 'auto'; // Maintain aspect ratio
            img.draggable = true; // Make image draggable
            memoryBox.appendChild(img);
            imageInput.style.display = 'none';
        }

        memoryBox.appendChild(imageInput);
        memoryBox.appendChild(textBox);
        memoryBox.appendChild(deleteButton);

        memoriesContainer.appendChild(memoryBox);
    });
}

async function saveMovies() {
    const moviesContainer = document.getElementById('moviesContainer');
    const movieBoxes = moviesContainer.querySelectorAll('.movieBox');
    const movies = [];

    movieBoxes.forEach(movieBox => {
        const movie = movieBox.querySelector('input').value;
        const favoriteLine = movieBox.querySelector('textarea').value;

        movies.push({
            movie: movie,
            favoriteLine: favoriteLine
        });
    });

    const response = await fetch('http://localhost:3000/saveMovies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movies)
    });

    if (response.ok) {
        alert('Movies saved!');
    } else {
        alert('Error saving movies.');
    }
}

async function loadMovies() {
    const response = await fetch('http://localhost:3000/loadMovies');
    if (!response.ok) {
        alert('Error loading movies.');
        return;
    }

    const movies = await response.json();
    if (!movies) return;

    const moviesContainer = document.getElementById('moviesContainer');
    moviesContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieBox = document.createElement('div');
        movieBox.classList.add('movieBox');

        const movieInput = document.createElement('input');
        movieInput.type = 'text';
        movieInput.value = movie.movie;

        const favoriteLineBox = document.createElement('textarea');
        favoriteLineBox.value = movie.favoriteLine;

        movieBox.appendChild(movieInput);
        movieBox.appendChild(favoriteLineBox);

        moviesContainer.appendChild(movieBox);
    });
}
