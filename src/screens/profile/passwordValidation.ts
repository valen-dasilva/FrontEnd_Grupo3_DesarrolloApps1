export interface PasswordValidationResult {
  valid: boolean;
  errorTitle?: string;
  errorMessage?: string;
}

export function validatePasswordChange(
  actual: string,
  nueva: string,
  confirmar: string
): PasswordValidationResult {
  if (!actual.trim() || !nueva.trim() || !confirmar.trim()) {
    return {
      valid: false,
      errorTitle: 'Campos incompletos',
      errorMessage: 'Por favor completá todos los campos.',
    };
  }

  if (nueva.length < 6) {
    return {
      valid: false,
      errorTitle: 'Contraseña muy corta',
      errorMessage: 'La nueva contraseña debe tener al menos 6 caracteres.',
    };
  }

  if (nueva !== confirmar) {
    return {
      valid: false,
      errorTitle: 'No coinciden',
      errorMessage: 'Las contraseñas nuevas no coinciden.',
    };
  }

  return { valid: true };
}