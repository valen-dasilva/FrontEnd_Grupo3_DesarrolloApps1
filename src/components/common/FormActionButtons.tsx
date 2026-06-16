import React from 'react';
import { CustomButton } from '@/components/CustomButton';

type Props = {
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
  saveTitle?: string;
  cancelTitle?: string;
};

export function FormActionButtons({
  loading,
  onSave,
  onCancel,
  saveTitle = 'Guardar Cambios',
  cancelTitle = 'Cancelar',
}: Props) {
  return (
    <>
      <CustomButton
        title={loading ? 'Guardando...' : saveTitle}
        variant="primary"
        onPress={onSave}
        disabled={loading}
      />
      <CustomButton
        title={cancelTitle}
        variant="outline"
        onPress={onCancel}
        disabled={loading}
      />
    </>
  );
}
