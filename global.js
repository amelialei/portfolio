// console.log('IT’S ALIVE!');

// function $$(selector, context = document) {
//   return Array.from(context.querySelectorAll(selector));
// }

// const navLinks= $$('nav a');

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );

// currentLink?.classList.add('current');

// if (currentLink) {
//     // or if (currentLink !== undefined)
//     currentLink.classList.add('current');
// }

let pages = [
  {url: 'index.html', title: 'Home'},
  {url: 'projects/index.html', title: 'Projects'},
  {url: 'contact/index.html', title: 'Contact'},
  {url: 'https://github.com/amelialei', title: 'GitHub'},
  {url: 'resume/index.html', title: 'Resume'},
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  const ARE_WE_HOME = document.documentElement.classList.contains('home');

  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );
  
if (a.host !== location.host) {
  a.target = '_blank'
}
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select id="theme-select">
      <option value="automatic">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`
);

const select = document.getElementById('theme-select');

function setColorScheme(scheme) {
  document.documentElement.style.setProperty('color-scheme', scheme);
  localStorage.colorScheme = scheme;
}

select.addEventListener('input', function (event) {
  const value = event.target.value;
  setColorScheme(value)

  console.log('color scheme changed to', event.target.value);  
});

if ('colorScheme' in localStorage) {
  const savedScheme = localStorage.colorScheme;
  setColorScheme(savedScheme);
  select.value = savedScheme; 
} else {
  setColorScheme('automatic');
  select.value = 'automatic';
}

// Get reference to the form element
const form = document.querySelector('form');

// Add event listener for the submit event, with optional chaining
form?.addEventListener('submit', function(event) {
  // Prevent the default form submission behavior
  event.preventDefault();
  
  // Create a new FormData object from the form
  const data = new FormData(form);

  // Initialize an empty string for the query string
  let queryString = '';
  
  // Iterate over each form field
  for (let [name, value] of data) {
    // Log the form field name and value
    console.log(name, value);
    
    // Build the query string with encoded values
    queryString += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
  }

  // Remove the trailing '&' character
  queryString = queryString.slice(0, -1);

  // Build the full URL with parameters
  const url = form.action + '?' + queryString;

  // Log the constructed URL
  console.log('Constructed URL:', url);
});



