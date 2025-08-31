const apiBase = '';

const addProjectBtn = document.getElementById('addProjectBtn');
const filterInput = document.getElementById('filter');
const tbody = document.getElementById('projectsTbody');
const dialog = document.getElementById('projectDialog');
const projectForm = document.getElementById('projectForm');
const searchInput = document.getElementById('search');

async function fetchProjects() {
  const regiao = filterInput.value.trim();
  const url = new URL(`${apiBase}/api/projects`, window.location.origin);
  // Always filter by the fixed missionary id provided
  url.searchParams.set('missionary_id', 'c425f8f9-b9f9-44b3-80a7-2cd6e361eb42');
  if (regiao) url.searchParams.set('regiao', regiao);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Falha ao carregar projetos');
  const json = await res.json();
  renderProjects(json.data || []);
}

function renderProjects(items) {
  tbody.innerHTML = '';
  items.forEach((p, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${String(idx + 1).padStart(2, '0')}</td><td>${p.nome}</td><td>${p.regiao}</td><td>${new Date(p.data_criacao).toLocaleDateString('pt-BR')}</td><td><button class="arrow-btn" data-project-id="${p.project_id}">→</button></td>`;
    tbody.appendChild(tr);
    
    // Add click event to the arrow button
    const arrowBtn = tr.querySelector('.arrow-btn');
    arrowBtn.addEventListener('click', () => goToProject(p.project_id));
  });
}

async function createProject(data) {
  const res = await fetch(`${apiBase}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar projeto');
}

filterInput.addEventListener('input', () => {
  fetchProjects().catch(() => {});
});

if (searchInput) {
  searchInput.addEventListener('input', () => {
    // Usa o mesmo filtro por região para simplificar
    if (filterInput) filterInput.value = searchInput.value;
    fetchProjects().catch(() => {});
  });
}

addProjectBtn.addEventListener('click', () => {
  dialog.showModal();
});

projectForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await createProject({ nome: document.getElementById('p_nome').value, regiao: document.getElementById('p_regiao').value, descricao: document.getElementById('p_desc').value });
    dialog.close();
    projectForm.reset();
    await fetchProjects();
  } catch (err) {
    alert(err.message);
  }
});

function goToProject(projectId) {
  // Always use the fixed project ID as requested
  window.location.href = `/web/project.html?id=1d2d4a48-52de-4331-a5ef-7a1e2230e344`;
}

// Initialize - load projects immediately
fetchProjects().catch(console.error);