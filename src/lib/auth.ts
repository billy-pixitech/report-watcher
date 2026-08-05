const KEY = "rm_user";

export function getUser(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function signIn(username: string) {
  window.localStorage.setItem(KEY, username);
}

export function signOut() {
  window.localStorage.removeItem(KEY);
}
