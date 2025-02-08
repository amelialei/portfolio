import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');


function filterProjectsByYear(projects, year) {
    return projects.filter(project => project.year === year);
  }

let selectedIndex = -1;


function renderPieChart(projectsGiven) {
  let legend = d3.select('.legend');
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  let svg = d3.select('svg');

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
  let arcs = arcData.map((d) => arcGenerator(d));

  arcs.forEach((arc, i) => {
    svg.append('path')
      .attr('d', arc)
      .attr('fill', colors(i)) 
      .style('cursor', 'pointer') 
      .on('click', function () {
        selectedIndex = selectedIndex === i ? -1 : i;
        console.log(selectedIndex);
  
        legend.selectAll('li')
        .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');
        
        console.log(legend.selectAll('li'));
        svg.selectAll('path')
          .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');
          
        if (selectedIndex === -1) {
          renderProjects(projects, projectsContainer, 'h2'); 
        } else {
          let selectedYear = data[selectedIndex].label; 
          filteredProjects = projects.filter((p) => p.year === selectedYear);
          renderProjects(filteredProjects, projectsContainer, 'h2'); 
        }

      });

    
  });
  
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', `legend-item ${idx === selectedIndex ? 'selected' : ''}`)
      .html(`<span class="swatch"></span>${d.label} <em>(${d.value})</em>`);
      // html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
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
