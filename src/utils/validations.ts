export const isEmail = (email: string) => {
  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return emailRegex.test(email);
}

export const validatePassword = (password: string, confirmedPassword: string): { isInvalid: boolean, description: string } => {
  const MIN = 3;
  const MAX = 15;

  let description = '';
  let isInvalid = false;

  if (password !== confirmedPassword) {
    description = `Password and confirmed password does not match`
    isInvalid = true
    return {
      description,
      isInvalid
    }
  }

  if (password.length < MIN) description += `- A password has to be at least ${MIN} characters long.\n`;
  if (password.length > MAX) description += `- A password has to be between ${MIN} and ${MAX} characters long.\n`;

  if (description.includes('\n')) description.replace('\n', '');

  if (description.length > 0) isInvalid = true

  return {
    isInvalid,
    description
  }
  
}