document.addEventListener('DOMContentLoaded', () => {
  const books = [];
  const RENDER_EVENT = 'RENDER_BOOKS';
  const LOCAL_STORAGE_KEY = 'SIMPAN_BUKU';
  const formAddBooks = document.getElementById('form-tambah-buku');
  const formSearchBooks = document.getElementById('searchBook');
  const convertBookInput = (id, title, author, year, isComplete) => {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  };

  const saveData = () => {
    // cek apakah browser mendukung local storage
    if (typeof Storage == null) return;
    const convertToJSON = JSON.stringify(books);
    localStorage.setItem(LOCAL_STORAGE_KEY, convertToJSON);
  };

  const addBook = () => {
    const id = +new Date();
    const title = document.getElementById('Judul').value;
    const author = document.getElementById('Penulis').value;
    const year = document.getElementById('tahun').value;
    const isComplete = document.getElementById('checkbox').checked;
    const convertToObject = convertBookInput(
      id,
      title,
      author,
      year,
      isComplete
    );
    books.push(convertToObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };

  const findIndex = (bookId) => {
    for (let index in books) {
      if (books[index].id == bookId) {
        return index;
      }
    }
    return -1;
  };
  const deleteBook = (bookId) => {
    const indexToDelete = findIndex(bookId);
    books.splice(indexToDelete, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };

  const moveBook = (bookId, action) => {
    const findBook = books.filter((book) => book.id == bookId);
    if (findBook == null) return;
    findBook[0].isComplete = action;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };

  const makeBookElement = (bookObject) => {
    const card = document.createElement('div');
    card.classList.add('card');
    const textContentContainer = document.createElement('div');
    textContentContainer.classList.add('text-content');
    const titleElement = document.createElement('h2');
    console.log(bookObject.title);
    titleElement.innerText = bookObject.title;
    const authorElement = document.createElement('p');
    authorElement.innerText = `Penulis : ${bookObject.author}`;
    const yearElement = document.createElement('p');
    yearElement.innerText = `Tahun : ${bookObject.year}`;
    textContentContainer.append(titleElement, authorElement, yearElement);
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-group');
    const trashButton = document.createElement('button');
    trashButton.innerText = 'Hapus Buku';
    trashButton.classList.add('red');
    trashButton.addEventListener('click', () => {
      deleteBook(bookObject.id);
    });
    if (bookObject.isComplete) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('green');
      undoButton.innerText = 'Belum Selesai Dibaca';
      undoButton.addEventListener('click', (event) => {
        moveBook(bookObject.id, false);
      });
      buttonContainer.append(undoButton, trashButton);
    } else {
      const doneReadButton = document.createElement('button');
      doneReadButton.classList.add('green');
      doneReadButton.innerText = 'Selesai Dibaca';
      doneReadButton.addEventListener('click', (event) => {
        moveBook(bookObject.id, true);
      });
      buttonContainer.append(doneReadButton, trashButton);
    }
    card.append(textContentContainer, buttonContainer);
    return card;
  };

  const searchBookByTitle = (title) => {
    return books.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  };

  const loadDataFromStorage = () => {
    const serializedBooks = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parseToObject = JSON.parse(serializedBooks);
    if (parseToObject != null) {
      for (let book of parseToObject) {
        books.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  };

  formSearchBooks.addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    const filteredBooks = searchBookByTitle(searchTerm);
    const containerBelumDibaca = document.getElementById('undone-read-book');

    const containerSudahDibaca = document.getElementById('done-read-book');
    containerBelumDibaca.innerHTML = '';
    containerSudahDibaca.innerHTML = '';
    for (let book of filteredBooks) {
      const bookElement = makeBookElement(book);
      if (book.isComplete) {
        containerSudahDibaca.appendChild(bookElement);
      } else {
        containerBelumDibaca.appendChild(bookElement);
      }
    }
  });

  formAddBooks.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
    // dapatin value dari masing-masing input
  });

  document.addEventListener(RENDER_EVENT, (event) => {
    const containerBelumDibaca = document.getElementById('undone-read-book');

    const containerSudahDibaca = document.getElementById('done-read-book');
    containerBelumDibaca.innerHTML = '';
    containerSudahDibaca.innerHTML = '';
    for (let book of books) {
      const bookElement = makeBookElement(book);
      if (book.isComplete) {
        containerSudahDibaca.appendChild(bookElement);
      } else {
        containerBelumDibaca.appendChild(bookElement);
      }
    }
  });

  if (typeof Storage != null) {
    loadDataFromStorage();
  }
});
