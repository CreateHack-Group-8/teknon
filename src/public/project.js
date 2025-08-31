const apiBase = '';
const projectId = '1d2d4a48-52de-4331-a5ef-7a1e2230e344'; // Fixed project ID

const filterInput = document.getElementById('filter');
const personsList = document.getElementById('personsList');
const searchInput = document.getElementById('search');

async function fetchPersons() {
  const nome = filterInput.value.trim();
  const res = await fetch(`${apiBase}/api/persons-by-project/${projectId}`);
  if (!res.ok) throw new Error('Falha ao carregar pessoas');
  const json = await res.json();
  
  // Filter by name if provided
  let persons = json.data || [];
  if (nome) {
    persons = persons.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()));
  }
  
  renderPersons(persons);
}

async function fetchPersonProgress(personId) {
  try {
    const res = await fetch(`${apiBase}/api/checkpoint-progress/percentage?person_id=${personId}`);
    if (!res.ok) return 0;
    const percentage = await res.json();
    return percentage || 0;
  } catch {
    return 0;
  }
}

async function renderPersons(items) {
  personsList.innerHTML = '';
  
  for (let idx = 0; idx < items.length; idx++) {
    const p = items[idx];
    const personRow = document.createElement('div');
    personRow.className = 'person-row';
    
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('pt-BR');
    };
    

    
    // Get progress percentage for this person
    const percentage = await fetchPersonProgress(p.person_id);
    
    personRow.innerHTML = `
      <div class="person-id">${String(idx + 1).padStart(2, '0')}</div>
      <div class="person-name">${p.nome}</div>
      <div class="person-birth">${formatDate(p.data_nascimento)}</div>
      <div class="person-gender">${p.genero || 'Não informado'}</div>
      <div class="person-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%"></div>
          <span class="progress-text">${percentage}%</span>
        </div>
      </div>
    `;
    
    personsList.appendChild(personRow);
  }
}

function goBack() {
  window.location.href = '/web/';
}

filterInput.addEventListener('input', () => {
  fetchPersons().catch(() => {});
});

if (searchInput) {
  searchInput.addEventListener('input', () => {
    if (filterInput) filterInput.value = searchInput.value;
    fetchPersons().catch(() => {});
  });
}

// Initialize - load persons immediately
fetchPersons().catch(console.error);
