/**
 * IndexedDB Helper para persistir File objects
 *
 * Base de datos: sabio-diagnostico-images
 * Store: images
 * Clave: draftId (fincaId_userId)
 */

const DB_NAME = 'sabio-diagnostico-images';
const STORE_NAME = 'images';
const DB_VERSION = 1;

/**
 * Inicializar IndexedDB
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Guardar imágenes para un draft
 * @param {string} draftId - ID del draft (fincaId_userId)
 * @param {Object} imageFiles - Objeto con paths y Files
 */
export const saveImagesToIndexedDB = async (draftId, imageFiles) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  const data = {
    id: draftId,
    images: imageFiles,
    timestamp: Date.now()
  };

  return new Promise((resolve, reject) => {
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Cargar imágenes de un draft
 * @param {string} draftId
 * @returns {Object|null} - Objeto con imágenes o null
 */
export const loadImagesFromIndexedDB = async (draftId) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.get(draftId);
    request.onsuccess = () => resolve(request.result?.images || null);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Eliminar imágenes de un draft
 * @param {string} draftId
 */
export const deleteImagesFromIndexedDB = async (draftId) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.delete(draftId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Recolectar TODAS las imágenes del formData recursivamente
 * @param {Object} data - FormData del wizard
 * @returns {Object} - { path: File } map
 */
export const collectAllImages = (data, prefix = '', images = {}) => {
  if (!data || typeof data !== 'object') return images;

  Object.entries(data).forEach(([key, value]) => {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (value instanceof File) {
      // Es un File object
      images[currentPath] = value;
    } else if (Array.isArray(value)) {
      // Es un array
      value.forEach((item, index) => {
        collectAllImages(item, `${currentPath}[${index}]`, images);
      });
    } else if (value !== null && typeof value === 'object') {
      // Es un objeto anidado
      collectAllImages(value, currentPath, images);
    }
  });

  return images;
};

/**
 * Restaurar imágenes en formData desde un map
 * @param {Object} formData - FormData del wizard
 * @param {Object} imagesMap - { path: File } map
 * @returns {Object} - FormData con Files restaurados
 */
export const restoreImagesInFormData = (formData, imagesMap) => {
  const restored = JSON.parse(JSON.stringify(formData)); // Deep clone

  Object.entries(imagesMap).forEach(([path, file]) => {
    setNestedValue(restored, path, file);
  });

  return restored;
};

/**
 * Helper para establecer valor en path anidado
 */
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);

    if (arrayMatch) {
      const arrayKey = arrayMatch[1];
      const index = parseInt(arrayMatch[2]);
      if (!current[arrayKey]) current[arrayKey] = [];
      if (!current[arrayKey][index]) current[arrayKey][index] = {};
      current = current[arrayKey][index];
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
};
