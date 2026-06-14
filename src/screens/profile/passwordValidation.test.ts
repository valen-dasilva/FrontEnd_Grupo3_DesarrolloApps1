import { validatePasswordChange } from './passwordValidation';

describe('validatePasswordChange', () => {
  it('falla si algún campo está vacío', () => {
    const result = validatePasswordChange('', 'nueva123', 'nueva123');
    expect(result.valid).toBe(false);
    expect(result.errorTitle).toBe('Campos incompletos');
  });

  it('falla si la nueva contraseña tiene menos de 6 caracteres', () => {
    const result = validatePasswordChange('actual123', '123', '123');
    expect(result.valid).toBe(false);
    expect(result.errorTitle).toBe('Contraseña muy corta');
  });

  it('falla si las contraseñas nuevas no coinciden', () => {
    const result = validatePasswordChange('actual123', 'nueva123', 'distinta456');
    expect(result.valid).toBe(false);
    expect(result.errorTitle).toBe('No coinciden');
  });

  it('es válido cuando todos los datos son correctos', () => {
    const result = validatePasswordChange('actual123', 'nueva123', 'nueva123');
    expect(result.valid).toBe(true);
    expect(result.errorTitle).toBeUndefined();
  });
});