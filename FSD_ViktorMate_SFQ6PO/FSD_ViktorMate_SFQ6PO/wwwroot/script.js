const apiUrl = 'https://localhost:7011/api/users';

// Load users from backend using Fetch API, GET
async function loadUsers() {
  const response = await fetch(apiUrl);
  const users = await response.json();
  const tbody = document.querySelector('#userTable tbody');
  tbody.innerHTML = ''; // clear old rows

  users.forEach(user => {
    const tr = document.createElement('tr');
    const birthDate = new Date(user.birthDate).toLocaleDateString()
    //Format registrationDate
    const regDate = new Date(user.registrationDate);
    const year = regDate.getFullYear();
    const month = String(regDate.getMonth() + 1).padStart(2, '0');
    const day = String(regDate.getDate()).padStart(2, '0');
    const hours = String(regDate.getHours()).padStart(2, '0');
    const minutes = String(regDate.getMinutes()).padStart(2, '0');
    const regDateFormatted = `${year}. ${month}. ${day} ${hours}:${minutes}`;
    
    tr.innerHTML = `
      <td data-label="ID">${user.id}</td>
      <td data-label="Full Name">${user.fullName}</td>
      <td data-label="Email">${user.email}</td>
      <td data-label="Date of Birth">${birthDate}</td>
      <td data-label="Registration Date">${regDateFormatted}</td>
      <td>
      
        <button onclick="editUser(${user.id})"><i class="fa fa-edit" style="font-size: 18px"></i> Edit</button>
      
        <button onclick="deleteUser(${user.id})"><i class="fa fa-trash" style="font-size: 18px"></i> Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

//Delete user by id, DELETE
async function deleteUser(id) { 
  document.getElementById('deleteUserId').value = id;
  openDeleteModal();
}

function openDeleteModal() {
  document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none';
}

async function confirmDeleteUser() {
  const id = document.getElementById('deleteUserId').value;

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showToast('User deleted');
      loadUsers();
    } else {
      showToast('Failed to delete user', 'error');
    }
  } catch (error) {
    console.error('Delete error:', error);
    showToast('Error deleting user', 'error');
  }

  closeDeleteModal();
}

//Add new user, POST
function openCreateModal() {
  document.getElementById('createModal').style.display = 'flex';
  setTimeout(() => {
    document.getElementById('createFullName').focus();
  }, 10)
}

function closeCreateModal() {
  document.getElementById('createModal').style.display = 'none';
}

async function addUser(event) {
  event.preventDefault();

  const user = {
    fullName: document.getElementById('createFullName').value,
    email: document.getElementById('createEmail').value,
    birthDate: document.getElementById('createBirthDate').value,
    registrationDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString()
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      showToast('User added successfully!');
      document.getElementById('createUserForm').reset();
      closeCreateModal();
      loadUsers();
    } else {
      showToast('Failed to add user', 'error');
    }
  } catch (error) {
    showToast('Error adding user', 'error');
    console.error(error);
  }
}


//Edit user, PUT
async function editUser(id) {
  const res = await fetch(`${apiUrl}/${id}`);
  const user = await res.json();

  document.getElementById('editUserId').value = user.id;
  document.getElementById('editFullName').value = user.fullName;
  document.getElementById('editEmail').value = user.email;
  document.getElementById('editBirthDate').value = user.birthDate.split('T')[0]; // yyyy-mm-dd
  document.getElementById('editRegistrationDate').value = user.registrationDate;

  openEditModal();
}

function openEditModal() {
  document.getElementById('editModal').style.display = 'flex';
  setTimeout(() => {
    document.getElementById('editFullName').focus();
  }, 10)
}

function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}


document.getElementById('editUserForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const id = document.getElementById('editUserId').value;
  const updatedUser = {
    id: parseInt(id),
    fullName: document.getElementById('editFullName').value,
    email: document.getElementById('editEmail').value,
    birthDate: document.getElementById('editBirthDate').value,
    registrationDate: document.getElementById('editRegistrationDate').value // Preserve old value
  };

  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedUser)
  });

  closeEditModal();
  loadUsers();
});

// Search bar functionality
document.getElementById('searchInput').addEventListener('input', function () {
  const filter = this.value.toLowerCase();
  const rows = document.querySelectorAll('#userTable tbody tr');

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? '' : 'none';
  });
});

// Table sort by rows
function sortTable(columnIndex) {
  const table = document.getElementById('userTable');
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.rows);
  const isAscending = table.dataset.sortDirection !== 'asc';
  table.dataset.sortDirection = isAscending ? 'asc' : 'desc';

  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].innerText;
    const cellB = b.cells[columnIndex].innerText;

    const isDateColumn = columnIndex === 3 || columnIndex === 4;
    const valA = isDateColumn ? new Date(cellA) : cellA.toLowerCase();
    const valB = isDateColumn ? new Date(cellB) : cellB.toLowerCase();

    return isAscending ? valA > valB ? 1 : -1 : valA < valB ? 1 : -1;
  });

  rows.forEach(row => tbody.appendChild(row));
}

// Toast messages functionality
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.getElementById('toastContainer').appendChild(toast);

  // Remove toast after animation ends (3s + fadeOut)
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Close modals when ESC is pressed
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    // Close all modals if they are open
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.style.display === 'flex') {
        modal.style.display = 'none';
      }
    });
  }
});

// Utility function to setup click outside close for modals
function enableClickOutsideToClose(modalId, closeModalFunc) {
  const modal = document.getElementById(modalId);
  
  modal.addEventListener('click', (event) => {
    // If the click target IS the modal itself (overlay), close it
    if (event.target === modal) {
      closeModalFunc();
    }
  });
}

// Call this for each modal you want this behavior on:
enableClickOutsideToClose('editModal', closeEditModal);
enableClickOutsideToClose('createModal', closeCreateModal);
enableClickOutsideToClose('deleteModal', closeDeleteModal);

// Dark mode toggle functionality
const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const icon = document.getElementById('darkModeIcon');

  // Save user preference in localStorage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
    icon.classList.remove('fa-moon-o');
    icon.classList.add('fa-sun-o'); // Sun icon for light mode
  } else {
    localStorage.removeItem('darkMode');
    icon.classList.remove('fa-sun-o');
    icon.classList.add('fa-moon-o'); // Moon icon for dark mode
  }
});

// On page load, apply saved preference
window.addEventListener('DOMContentLoaded', () => {
  const icon = document.getElementById('darkModeIcon');
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    icon.classList.remove('fa-moon-o');
    icon.classList.add('fa-sun-o');
  }
});

// Set maximum birth date to today
document.addEventListener('DOMContentLoaded', () => {
  const birthDateInput = document.getElementById('createBirthDate');
  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
  birthDateInput.setAttribute('max', today);
  const editBirthDateInput = document.getElementById('editBirthDate');
  editBirthDateInput.setAttribute('max', today);
});



document.getElementById('createUserForm').addEventListener('submit', addUser);


// Initial load
loadUsers();