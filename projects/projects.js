import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const legend = d3.select('.legend');
const colors = d3.scaleOrdinal(d3.schemeTableau10);
let svg = d3.select('svg');

let selectedIndex = -1;

function filterProjectsByYear(projects, year) {
    return projects.filter(project => project.year === year);
  }


function renderPieChart(projectsGiven) {
  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let arcData = sliceGenerator(data);

arcData.forEach((d, idx) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(idx)) 
      .style('cursor', 'pointer') 
      .on('click', function () {
        selectedIndex = selectedIndex === idx ? -1 : idx;
  
        svg.selectAll('path')
          .attr('class', (_, i) => i === selectedIndex ? 'selected' : '');
          if (selectedIndex === -1) {
            renderProjects(projects, projectsContainer, 'h2'); 
          } else {
            let selectedYear = data[selectedIndex].label; 
            let filteredProjects = filterProjectsByYear(projects, selectedYear); 
            renderProjects(filteredProjects, projectsContainer, 'h2'); 
          }
      });
  });
  
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch" style="background-color:${colors(idx)};"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', function () {
        selectedIndex = selectedIndex === idx ? -1 : idx;
  
        svg.selectAll('path')
          .attr('class', (_, i) => i === selectedIndex ? 'selected' : '');
      });
  });
}

renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  let query = event.target.value.toLowerCase();

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});
