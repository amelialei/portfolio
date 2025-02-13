let data = [];

async function loadData() {
  data = await d3.csv('loc.csv');
  console.log(data);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
});

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
}

let commits = d3.groups(data, (d) => d.commit);

function processCommits() {
    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/amelialei/portfolio/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          writable: false,
          configurable: false,
          enumerable: false,
        });
  
        return ret;
      });
}

function displayStats() {
    // Process commits first
    processCommits();
  
    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    // Add total commits
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);
  
    
    // Number of files
    const totalFiles = d3.groups(data, (d) => d.file).length;
    dl.append('dt').text('Total files');
    dl.append('dd').text(totalFiles);

    // Maximum file length (longest file)
    const longestFile = d3.max(d3.rollups(data, (v) => v.length, (d) => d.file), (d) => d[1]);
    dl.append('dt').text('Longest file (lines)');
    dl.append('dd').text(longestFile);

    // Average file length
    const avgFileLength = d3.mean(d3.rollups(data, (v) => v.length, (d) => d.file), (d) => d[1]);
    dl.append('dt').text('Average file length');
    dl.append('dd').text(avgFileLength.toFixed(2));

    // Most active time of day
    const workByPeriod = d3.rollups(
        data,
        (v) => v.length,
        (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
    );
    const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
    dl.append('dt').text('Most active period');
    dl.append('dd').text(maxPeriod || 'Unknown');
  }

async function loadData() {
    displayStats()    
    processCommits();
    console.log(commits);
}
