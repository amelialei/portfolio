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
  // if (!url.startsWith('http')) {
  //   url = ARE_WE_HOME ? url : `/${url}`;
  //   url = `/portfolio${url}`;
  // }

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

export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      const data = await response.json();
      return data; 
  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement) {
      console.error("Invalid container element provided.");
      return;
  }

  containerElement.innerHTML = ''; // Clear existing content

  const projectsTitle = document.querySelector('.projects-title');
  if (projectsTitle) {
      projectsTitle.textContent = `${projects.length} Projects`;
  }

  projects.forEach(project => {
    const article = document.createElement('article');

    const heading = document.createElement(headingLevel);
    heading.textContent = project.title || 'Untitled Project';

    const img = document.createElement('img');
    img.src = project.image?.trim() || 'default-placeholder.png';
    img.alt = project.title?.trim() || 'Project image';
    img.loading = 'lazy';

    const description = document.createElement('p');
    description.textContent = project.description?.trim() || 'No description available.';

    article.appendChild(heading);
    article.appendChild(img);
    article.appendChild(description);

    containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}












