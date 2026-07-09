export function formatRoleLabel(roleName) {
  if (!roleName || typeof roleName !== "string") return null;
  const s = roleName.trim();
  if (!s) return null;
  if (s === s.toUpperCase()) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function userRoleLabel(user) {
  return formatRoleLabel(user?.role_name);
}
