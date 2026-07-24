/**
 * Role permission checks (mirrors backend role + user_permissions).
 */

export function isPlatformStaff(user) {
  return Boolean(user?.is_staff || user?.is_superuser);
}

export function isLabUser(user) {
  return Boolean(user?.laboratory_name || user?.is_lab_owner);
}

export function isLabOwner(user) {
  return Boolean(user?.is_lab_owner);
}

export function isClinicUser(user) {
  if (user?.is_clinic_user) return true;
  if (user?.laboratory_name || user?.is_lab_owner) return false;
  return Boolean(user?.clinic_id || user?.clinic_name);
}

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

function sectionVisible(section, user) {
  if (section.clinicOnly) return isClinicUser(user);
  if (section.platformOnly && section.labOwnerOnly) {
    if (isClinicUser(user)) return false;
    return isPlatformStaff(user) || isLabOwner(user);
  }
  if (section.platformOnly) {
    if (isClinicUser(user)) return false;
    return isPlatformStaff(user);
  }
  if (section.labOnly) {
    if (isClinicUser(user)) return false;
    return isLabUser(user);
  }
  if (section.labOwnerOnly) return isLabOwner(user);
  return true;
}

export function filterNavSections(sections, user) {
  if (!user) return [];

  return sections
    .map((section) => {
      if (!sectionVisible(section, user)) return null;

      const items = section.items.filter((item) => {
        if (item.permission && !can(user, item.permission)) return false;
        if (item.clinicOnly && !isClinicUser(user)) return false;
        if (item.platformOnly && !isPlatformStaff(user)) return false;
        if (item.labOnly && (isClinicUser(user) || !isLabUser(user))) return false;
        if (item.labOwnerOnly && !isLabOwner(user)) return false;
        if (item.requiresLabFlag && isLabUser(user) && user[item.requiresLabFlag] === false) {
          return false;
        }
        return true;
      });

      if (!items.length) return null;
      return { ...section, items };
    })
    .filter(Boolean);
}
