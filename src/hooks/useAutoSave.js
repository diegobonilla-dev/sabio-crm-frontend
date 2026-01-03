import { useEffect, useRef } from 'react';

/**
 * Serializa valores a string para comparación, excluyendo File objects
 * Los File objects no son serializables a JSON pero necesitamos detectar
 * cambios en el resto de los campos
 */
const serializeForComparison = (obj) => {
  if (obj instanceof File) {
    // Para Files, retornar un identificador único (nombre + tamaño + lastModified)
    return `__FILE__${obj.name}__${obj.size}__${obj.lastModified}`;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => serializeForComparison(item));
  }

  if (obj !== null && typeof obj === 'object') {
    const result = {};
    Object.keys(obj).forEach(key => {
      result[key] = serializeForComparison(obj[key]);
    });
    return result;
  }

  return obj;
};

/**
 * Hook para auto-guardar cambios con debounce
 * Evita loops infinitos comparando valores con JSON.stringify
 * y NO incluyendo onSave en las dependencias
 *
 * IMPORTANTE: Preserva File objects al pasar valores a onSave
 *
 * @param {Function} onSave - Función callback que se ejecuta cuando hay cambios
 * @param {any} values - Valores a observar (típicamente formValues de react-hook-form)
 * @param {number} delay - Delay en ms para el debounce (default: 300ms)
 */
export const useAutoSave = (onSave, values, delay = 300) => {
  const valuesRef = useRef(null);
  const timeoutRef = useRef(null);
  const originalValuesRef = useRef(null);

  useEffect(() => {
    // Serializar para comparación (Files se convierten en identificadores)
    const serializedForComparison = serializeForComparison(values);
    const valuesString = JSON.stringify(serializedForComparison);

    // Solo llamar onSave si los valores realmente cambiaron
    if (valuesRef.current !== valuesString) {
      valuesRef.current = valuesString;
      originalValuesRef.current = values; // Guardar valores originales con Files

      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Crear nuevo timeout
      timeoutRef.current = setTimeout(() => {
        // Pasar valores originales CON Files (NO JSON.parse)
        onSave(originalValuesRef.current);
      }, delay);
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // NO incluir onSave en dependencias para evitar loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, delay]);
};
