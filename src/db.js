const mapNoteStore = {};

const featureStore = {};

const findEntity = (store) => (entityId) => store[entityId] || null;

const findMapNote = (noteId) => findEntity(mapNoteStore)(noteId);

const findFeatures = (noteId) => {
  const features = findEntity(featureStore)(noteId);

  return features;
};

const findMapNotes = () => Object.values(mapNoteStore);

const mapNoteExists = (noteId) => noteId in mapNoteStore;

const removeMapNote = (noteId) => {
  if (mapNoteExists(noteId)) {
    delete mapNoteStore[noteId];
    return true;
  }

  return false;
};

const saveFeatures = (noteId, features) => {
  featureStore[noteId] = features;
};

const saveMapNote = (newMapNote) => {
  const randomId = Date.now();
  const mapNote = { ...newMapNote, id: randomId };
  mapNoteStore[randomId] = mapNote;

  return mapNote;
};

module.exports = {
  findMapNote,
  findMapNotes,
  saveMapNote,
  findFeatures,
  saveFeatures,
  removeMapNote,
  mapNoteExists,
};

// MOCK SEEDING
// const mockMapNote = (id = Date.now()) => ({
//   id,
//   title: `Title: ${id}`,
//   body: Array(20).fill(`the body is here for ${id}`),
// });

// const mockMapNotes = Array(20)
//   .fill("")
//   .map((_, i) => mockMapNote(i + Date.now()));

// mockMapNotes.forEach(saveMapNote);
