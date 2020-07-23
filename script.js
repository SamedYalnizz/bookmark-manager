const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks =[];


// Show Modal, Focus on Input 

function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click',()=> modal.classList.remove('show-modal'));
window.addEventListener('click', (event) => (event.target=== modal ? modal.classList.remove('show-modal') : false));

// Validate Form
function validateForm(nameValue, urlValue){
    const urlExpression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(urlExpression);
    if(!nameValue || !urlValue){
        alert('Please submit values for both fields.');
        return false;
    }
    if(!urlValue.match(regex)){
        alert('Please provide a valid web address')
        return false;
    }
    //Valid
    return true;


}

// Build Bookmarks DOM
function buildBookmarks() {
    //Build items
    //Remove all bookmark elements
    bookmarksContainer.textContent = '';
    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;
        
        const item = document.createElement('div')
        item.classList.add('item');

        //const Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times-circle');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        //Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //Favion
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Fetch Bookmarks from LocalStorage
function fetchBookmarksFromLocalStorage(){
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarks = [
            {
                name: 'Github',
                url: 'https://github.com'
            }
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Handle Data from Form
function storeBookmark(event){
    event.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`;
    }
    validateForm(nameValue, urlValue);

    if(!validateForm(nameValue, urlValue)) {
        return false;
    }
    const bookmark ={
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    console.log(bookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarksFromLocalStorage();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Delete Bookmark
function deleteBookmark(url) {
    //Inefficient data structure
    bookmarks.forEach((bookmark, i) =>{
        if(bookmark.url === url){
            bookmarks.splice(i, 1);
        }
    });
    // Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarksFromLocalStorage();

    console.log('delete url:', url);
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarksFromLocalStorage();