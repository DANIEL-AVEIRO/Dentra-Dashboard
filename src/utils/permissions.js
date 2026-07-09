/**
 * Role permission checks (mirrors backend role + user_permissions).
 */

export function can(user, permission) {
  if (!user) return false;
  if (!permission) return true;

  if (user.is_superuser) return true;

  if (permission === "is_staff") return Boolean(user.is_staff);
  if (permission === "is_superuser") return Boolean(user.is_superuser);
  if (permission === "is_developer") return Boolean(user.is_developer);

  const codenames = user.permission_codenames || [];
  return codenames.includes(permission);
}

export function canAny(user, permissions) {
  if (!permissions?.length) return true;
  return permissions.some((p) => can(user, p));
}

export function filterNavSections(sections, user) {
  if (!user) return [];

  return sections
    .map((section) => {
      const items = section.items.filter((item) => {
        if (item.permission && !can(user, item.permission)) return false;
        return true;
      });

      if (!items.length) return null;
      return { ...section, items };
    })
    .filter(Boolean);
}
