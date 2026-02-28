export function getClientUserId() {
  try {
    const key = "enphisim-user-id";
    const saved = localStorage.getItem(key);
    if (saved) return saved;

    const generated = `user_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, generated);
    return generated;
  } catch (err) {
    return "anonymous";
  }
}
