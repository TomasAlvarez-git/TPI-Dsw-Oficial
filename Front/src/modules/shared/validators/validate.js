export const required = (message = 'Campo obligatorio') => (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0 || message;
  }

  return (value !== null && value !== undefined && value !== '') || message;
};

/**
 * Valida la longitud mínima.
 */
export const minLength = (min, message) => (value) => {
  if (!value) return true; // Dejar pasar vacíos (eso lo maneja required)

  return value.length >= min || message || `Mínimo ${min} caracteres`;
};

/**
 * Valida formato de email.
 */
export const isEmail = (message = 'Email inválido') => (value) => {
  if (!value) return true;

  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  return regex.test(value) || message;
};

/**
 * Valida que el valor coincida con otro (para confirmar password).
 */
export const matches = (targetValue, message = 'Los valores no coinciden') => (value) => {
  return value === targetValue || message;
};

export default { required, minLength, isEmail, matches };