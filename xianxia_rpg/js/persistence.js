// persistence.js (COMPLETADO)

const STORAGE_KEY_USERS = 'xx_users';
const STORAGE_KEY_SESSIONS = 'xx_session';

// Carga usuarios
function loadUsers() {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

// Guarda usuarios
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

// Carga datos de personaje/juego para un usuario específico
export function loadPlayerData(username) {
    const users = loadUsers();
    return users[username] || {};
}

// Guarda datos de personaje/juego para un usuario específico
export function savePlayerData(username, data) {
    const users = loadUsers();
    users[username] = data;
    saveUsers(users);
}

// Registro
export function registerUser(username, password) {
    const users = loadUsers();
    if (users[username]) {
        return { success: false, message: 'El usuario ya existe.' };
    }

    if (password.length < 6) {
        return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    users[username] = {
        password,
        character: null // Usamos 'character' en lugar de 'profile' para ser consistente con character.js
    };
    saveUsers(users);
    return { success: true, message: 'Cuenta creada. Ahora puedes iniciar sesión.' };
}

// Login
export function loginUser(username, password) {
    const users = loadUsers();
    const u = users[username];
    if (!u) {
        return { success: false, message: 'Usuario no encontrado.' };
    }
    if (u.password !== password) {
        return { success: false, message: 'Contraseña incorrecta.' };
    }
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify({ username }));
    return { success: true, username };
}

// Logout
export function logoutUser() {
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
}

// Sesión actual
export function getCurrentSession() {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// Obtiene solo el nombre de usuario (necesario para character.js)
export function getCurrentUsername() {
    const session = getCurrentSession();
    return session ? session.username : null;
}
