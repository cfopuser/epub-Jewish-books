document.addEventListener('DOMContentLoaded', () => {
    const bookGrid = document.getElementById('book-grid');
    const categoryNav = document.getElementById('category-nav');
    const searchInput = document.getElementById('search-input');
    const loader = document.getElementById('loader');
    const noResultsDiv = document.getElementById('no-results');

    let allBooks = [];
    let activeCategory = 'הכל';

    // Fetch book data from the JSON file
    async function fetchBooks() {
        try {
            const response = await fetch('data/books.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allBooks = await response.json();
            loader.style.display = 'none';
            displayCategories();
            displayBooks(allBooks);
        } catch (error) {
            console.error("Could not fetch books:", error);
            loader.style.display = 'none';
            bookGrid.innerHTML = '<p style="text-align: center; color: red;">שגיאה בטעינת הספרים. נסו לרענן את הדף.</p>';
        }
    }

    // Render the book cards
    function displayBooks(books) {
        bookGrid.innerHTML = '';
        noResultsDiv.style.display = 'none';

        if (books.length === 0) {
            noResultsDiv.style.display = 'block';
            return;
        }

        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';

            card.innerHTML = `
                <div>
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-category">${book.category}${book.subcategory ? ' / ' + book.subcategory : ''}</p>
                </div>
                <a href="${book.downloadUrl}" class="download-btn" download>הורדה</a>
            `;
            bookGrid.appendChild(card);
        });
    }

    // Create and display the category navigation
    function displayCategories() {
        const categories = ['הכל', ...new Set(allBooks.map(book => book.category))];
        const navList = document.createElement('ul');
        
        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category;
            li.dataset.category = category;
            if (category === activeCategory) {
                li.classList.add('active');
            }
            navList.appendChild(li);
        });
        categoryNav.appendChild(navList);
    }
    
    // Filter books based on search term and category
    function filterBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        
        let filtered = allBooks;

        // Filter by category
        if (activeCategory !== 'הכל') {
            filtered = filtered.filter(book => book.category === activeCategory);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(book => 
                book.title.toLowerCase().includes(searchTerm) ||
                book.category.toLowerCase().includes(searchTerm) ||
                (book.subcategory && book.subcategory.toLowerCase().includes(searchTerm))
            );
        }
        
        // Add a loading animation effect
        bookGrid.classList.add('loading');
        setTimeout(() => {
            displayBooks(filtered);
            bookGrid.classList.remove('loading');
        }, 300); // Small delay for smooth transition
    }

    // Event Listeners
    searchInput.addEventListener('input', filterBooks);

    categoryNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            document.querySelectorAll('#category-nav li').forEach(li => li.classList.remove('active'));
            e.target.classList.add('active');
            activeCategory = e.target.dataset.category;
            filterBooks();
        }
    });

    // Initial load
    fetchBooks();
});