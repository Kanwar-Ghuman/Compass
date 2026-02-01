export const ADMIN_EMAILS = ["mcdabg1236@gmail.com"];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === email.toLowerCase()
  );
}

export type UserRole = "admin" | "student" | "guest";

export function getUserRole(email: string | null | undefined): UserRole {
  if (!email) return "guest";
  return isAdminEmail(email) ? "admin" : "student";
}
