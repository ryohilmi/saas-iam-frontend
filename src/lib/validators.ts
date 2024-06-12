export function validateEmail(email: string): string | undefined {
  if (!email) {
    return "Email can't be empty";
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return "Wrong email format";
  }

  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return "Password can't be empty";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  return undefined;
}
