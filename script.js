// ── CONSTANTS ──
const COLORS = ['#4361ee','#22c55e','#ef4444','#8b5cf6','#f59e0b','#f97316','#06b6d4','#ec4899'];
const ROLE_CLASS = { Admin:'role-admin', Editor:'role-editor', Viewer:'role-viewer', Moderator:'role-moderator' };
const ROLE_ICON  = { Admin:'🛡️', Editor:'✏️', Viewer:'👁️', Moderator:'⚖️' };

// ── DEFAULT DATA (used only on very first visit) ──
const DEFAULT_USERS = [
  { id:1, first:'Ravi',  last:'Sharma', email:'ravi.sharma@example.com',  role:'Admin',     dept:'Engineering', active:true,  joined:'2025-01-15', color:'#4361ee' },
  { id:2, first:'Priya', last:'Patel',  email:'priya.patel@example.com',  role:'Editor',    dept:'Design',      active:true,  joined:'2025-02-20', color:'#22c55e' },
  { id:3, first:'Arjun', last:'Mehta',  email:'arjun.mehta@example.com',  role:'Moderator', dept:'Marketing',   active:false, joined:'2025-03-05', color:'#8b5cf6' },
  { id:4, first:'Sneha', last:'Gupta',  email:'sneha.gupta@example.com',  role:'Viewer',    dept:'Sales',       active:true,  joined:'2025-03-18', color:'#f59e0b' },
  { id:5, first:'Karan', last:'Singh',  email:'karan.singh@example.com',  role:'Admin',     dept:'DevOps',      active:true,  joined:'2025-04-02', color:'#f97316' },
  { id:6, first:'Neha',  last:'Joshi',  email:'neha.joshi@example.com',   role:'Editor',    dept:'Content',     active:false, joined:'2025-04-22', color:'#06b6d4' },
  { id:7, first:'Amit',  last:'Kumar',  email:'amit.kumar@example.com',   role:'Viewer',    dept:'Support',     active:true,  joined:'2025-05-10', color:'#ec4899' },
  { id:8, first:'Divya', last:'Nair',   email:'divya.nair@example.com',   role:'Moderator', dept:'HR',          active:true,  joined:'2025-06-01', color:'#ef4444' },
];

// ── LOCAL STORAGE FUNCTIONS ──
// Loads users from localStorage; falls back to default data on first visit
function loadUsers() {
  try {
    const saved = localStorage.getItem('uf_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  } catch (e) {
    return DEFAULT_USERS;
  }
}

// Saves the current users array into localStorage
function saveUsers() {
  localStorage.setItem('uf_users', JSON.stringify(users));
}

// Loads the last used ID so new users always get a unique ID after refresh
function loadNextId() {
  return parseInt(localStorage.getItem('uf_nextId') || '9');
}

// Saves the nextId counter into localStorage
function saveNextId() {
  localStorage.setItem('uf_nextId', String(nextId));
}

// ── STATE ──
let users      = loadUsers();
let nextId     = loadNextId();
let editingId  = null;
let deletingId = null;

// ── FILTER ──
function getFiltered() {
  const q      = document.getElementById('searchInput').value.toLowerCase();
  const role   = document.getElementById('roleFilter').value;
  const status = document.getElementById('statusFilter').value;

  return users.filter(u => {
    const name = `${u.first} ${u.last} ${u.email}`.toLowerCase();
    if (q && !name.includes(q)) return false;
    if (role && u.role !== role) return false;
    if (status === 'active'   && !u.active) return false;
    if (status === 'inactive' &&  u.active) return false;
    return true;
  });
}

// ── RENDER TABLE ──
function renderTable() {
  const filtered = getFiltered();
  const tbody    = document.getElementById('userTableBody');
  document.getElementById('tableCount').textContent =
    `${filtered.length} user${filtered.length !== 1 ? 's' : ''}`;

  if (!filtered.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">
      <div class="empty-emoji">🔍</div>
      <div class="empty-text">No users found. Try a different filter.</div>
    </td></tr>`;
    updateStats();
    updateSidebar();
    return;
  }

  tbody.innerHTML = filtered.map((u, i) => `
    <tr style="animation-delay:${i * 0.04}s">
      <td style="color:var(--ink-muted);font-size:0.75rem;font-weight:600">${String(i+1).padStart(2,'0')}</td>
      <td>
        <div class="user-cell">
          <div class="avatar" style="background:${u.color}">${u.first[0]}${u.last[0]}</div>
          <div>
            <div class="user-name">${u.first} ${u.last}</div>
            <div class="user-email">${u.email}</div>
          </div>
        </div>
      </td>
      <td><span class="role-badge ${ROLE_CLASS[u.role]}">${ROLE_ICON[u.role]} ${u.role}</span></td>
      <td>
        <div class="status-toggle">
          <button class="toggle ${u.active ? 'on' : 'off'}"
            onclick="toggleStatus(${u.id})"
            title="${u.active ? 'Deactivate' : 'Activate'}">
          </button>
          <span class="status-text ${u.active ? 'active' : 'inactive'}">
            ${u.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </td>
      <td><div class="date-cell">${formatDate(u.joined)}</div></td>
      <td>
        <div class="actions">
          <button class="action-btn view"   onclick="openProfile(${u.id})"     title="View Profile">👁️</button>
          <button class="action-btn edit"   onclick="openEditModal(${u.id})"   title="Edit">✏️</button>
          <button class="action-btn delete" onclick="openDeleteModal(${u.id})" title="Delete">🗑️</button>
        </div>
      </td>
    </tr>`).join('');

  updateStats();
  updateSidebar();
}

// ── HELPERS ──
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

function updateStats() {
  document.getElementById('statTotal').textContent    = users.length;
  document.getElementById('statActive').textContent   = users.filter(u => u.active).length;
  document.getElementById('statInactive').textContent = users.filter(u => !u.active).length;
  document.getElementById('statAdmins').textContent   = users.filter(u => u.role === 'Admin').length;
}

function updateSidebar() {
  document.getElementById('sideCount').textContent = users.length;
}

// ── TOGGLE STATUS ──
function toggleStatus(id) {
  const u = users.find(u => u.id === id);
  u.active = !u.active;
  saveUsers(); // 💾 persist to localStorage
  renderTable();
  showToast(u.active ? '✅' : '⛔', `${u.first} ${u.last} is now ${u.active ? 'Active' : 'Inactive'}`);
}

// ── ADD / EDIT ──
function openAddModal() {
  editingId = null;
  document.getElementById('formTitle').textContent = 'Add New User';
  ['fFirst','fLast','fEmail','fDept'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('fRole').value = 'Viewer';
  openModal('formModal');
}

function openEditModal(id) {
  const u = users.find(u => u.id === id);
  editingId = id;
  document.getElementById('formTitle').textContent = 'Edit User';
  document.getElementById('fFirst').value = u.first;
  document.getElementById('fLast').value  = u.last;
  document.getElementById('fEmail').value = u.email;
  document.getElementById('fRole').value  = u.role;
  document.getElementById('fDept').value  = u.dept;
  openModal('formModal');
}

function saveUser() {
  const first = document.getElementById('fFirst').value.trim();
  const last  = document.getElementById('fLast').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const role  = document.getElementById('fRole').value;
  const dept  = document.getElementById('fDept').value.trim();

  if (!first || !last || !email) { showToast('⚠️', 'Please fill in all required fields'); return; }
  if (!email.includes('@'))      { showToast('⚠️', 'Please enter a valid email'); return; }

  if (editingId) {
    const u = users.find(u => u.id === editingId);
    Object.assign(u, { first, last, email, role, dept });
    showToast('✏️', `${first} ${last} updated successfully`);
  } else {
    users.push({
      id: nextId++,
      first, last, email, role, dept,
      active: true,
      joined: new Date().toISOString().split('T')[0],
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
    saveNextId(); // 💾 persist new nextId
    showToast('✅', `${first} ${last} added successfully`);
  }

  saveUsers(); // 💾 persist users
  closeModal('formModal');
  renderTable();
}

// ── PROFILE ──
function openProfile(id) {
  const u = users.find(u => u.id === id);
  document.getElementById('pAvatar').style.background = u.color;
  document.getElementById('pAvatar').textContent      = `${u.first[0]}${u.last[0]}`;
  document.getElementById('pName').textContent        = `${u.first} ${u.last}`;
  document.getElementById('pEmail').textContent       = u.email;

  document.getElementById('pGrid').innerHTML = [
    { label:'Role',        value:`${ROLE_ICON[u.role]} ${u.role}` },
    { label:'Department',  value: u.dept || '—' },
    { label:'Status',      value: u.active ? '✅ Active' : '⛔ Inactive' },
    { label:'Joined',      value: formatDate(u.joined) },
    { label:'User ID',     value:`#${String(u.id).padStart(4,'0')}` },
    { label:'Last Active', value:'Today' },
  ].map(f => `
    <div class="profile-field">
      <div class="profile-field-label">${f.label}</div>
      <div class="profile-field-value">${f.value}</div>
    </div>`).join('');

  document.getElementById('profileRemoveBtn').onclick = () => {
    closeModal('profileModal');
    openDeleteModal(id);
  };

  openModal('profileModal');
}

// ── DELETE ──
function openDeleteModal(id) {
  deletingId = id;
  const u = users.find(u => u.id === id);
  document.getElementById('deleteMsg').innerHTML =
    `Are you sure you want to remove <strong>${u.first} ${u.last}</strong>? This action cannot be undone.`;
  openModal('deleteModal');
}

function confirmDelete() {
  const u = users.find(u => u.id === deletingId);
  users = users.filter(u => u.id !== deletingId);
  saveUsers(); // 💾 persist after delete
  closeModal('deleteModal');
  renderTable();
  showToast('🗑️', `${u.first} ${u.last} removed`);
}

// ── MODAL HELPERS ──
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ── TOAST ──
function showToast(icon, msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastMsg').textContent  = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.modal-overlay').forEach(m =>
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); })
  );
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    if (e.key === 'Enter' && document.getElementById('formModal').classList.contains('open')) saveUser();
  });
  renderTable();
});