// Sections: imports, configuration, logic, render/exports

// frontend/src/utils/userIdentity.js
export function getClientUserId() {
  // Try to get from localStorage first
  let userId = localStorage.getItem('sessionId');
  
  // If not found, generate a new one
  if (!userId) {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    userId = Array.from(array, dec => dec.toString(16)).join('');
    localStorage.setItem('sessionId', userId);
  }
  
  return userId;
}
