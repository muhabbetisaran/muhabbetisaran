document.getElementById('saveMemoriesBtn').addEventListener('click', async () => {
    const memories = [];
    document.querySelectorAll('.memory').forEach(memory => {
        const image = memory.querySelector('img').src;
        const text = memory.querySelector('textarea').value;
        memories.push({ image, text });
    });

    const response = await fetch('/api/save-memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memories })
    });

    if (response.ok) {
        alert('Memories saved successfully');
    } else {
        alert('Error saving memories');
    }
});

document.getElementById('saveMoviesBtn').addEventListener('click', async () => {
    const movies = [];
    document.querySelectorAll('.movie').forEach(movie => {
        const title = movie.querySelector('input').value;
        const quote = movie.querySelector('textarea').value;
        movies.push({ title, quote });
    });

    const response = await fetch('/api/save-movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movies })
    });

    if (response.ok) {
        alert('Movies saved successfully');
    } else {
        alert('Error saving movies');
    }
});
