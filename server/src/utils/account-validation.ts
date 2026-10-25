export type PublicRole = "PRODUCTEUR" | "DISTRIBUTEUR";

export const isPublicRole = (value: string): value is PublicRole =>
  value === "PRODUCTEUR" || value === "DISTRIBUTEUR";

export const validateUsername = (value: string): string | null => {
  if (value.length < 4 || value.length > 30) {
    return "L'identifiant doit contenir entre 4 et 30 caractères.";
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
    return "L'identifiant contient des caractères non autorisés.";
  }

  return null;
};

export const validatePassword = (value: string): string | null => {
  if (value.length < 10) return "Le mot de passe doit contenir au moins 10 caractères.";
  if (!/[A-Z]/.test(value)) return "Le mot de passe doit contenir une majuscule.";
  if (!/[a-z]/.test(value)) return "Le mot de passe doit contenir une minuscule.";
  if (!/[0-9]/.test(value)) return "Le mot de passe doit contenir un chiffre.";
  return null;
};
