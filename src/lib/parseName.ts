export function parseName(name: string): string {
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];

  const firstNameInitial = firstName.charAt(0).toUpperCase();
  const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() : "";

  if (nameParts.length > 1) {
    return `${firstNameInitial}${lastNameInitial}`;
  } else {
    return firstNameInitial;
  }
}
