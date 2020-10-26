const express = require("express");
const corsMiddleware = require("cors");

const db = require("./db");

const { PORT = 8008 } = process.env;
const { API_ORIGIN = `http://localhost:${PORT}` } = process.env;

const api = express();

const getNote = (req, res) => {
  const mapNote = db.findMapNote(req.noteId);

  if (mapNote) return res.json(mapNote);
  res.sendStatus(404);
};

const createNote = (req, res) => {
  const newMapNote = db.saveMapNote(req.body);
  res
    .status(201)
    .header("Location", `${API_ORIGIN}/notes/${newMapNote.id}`)
    .json(newMapNote);
};

const removeNote = (req, res) => {
  const success = db.removeMapNote(req.noteId);
  const status = success ? 204 : 404;

  res.sendStatus(status);
};

const getNoteFeatures = (req, res) => res.json(db.findFeatures(req.noteId));

const updateNoteFeatures = (req, res) => {
  const { body, noteId } = req;

  db.saveFeatures(noteId, body);

  res
    .status(201)
    .header("Location", `${API_ORIGIN}/notes/${noteId}/features`)
    .send();
};

const getNotesCollection = (_, res) => res.json(db.findMapNotes());

const noteFeaturesController = express.Router({ mergeParams: true });
noteFeaturesController
  .route("/")
  .get(getNoteFeatures)
  .put(express.json(), updateNoteFeatures);

const noteController = express.Router({ mergeParams: true });
const ensureNoteExists = (req, res, next) => {
  const { noteId } = req.params;
  if (!db.mapNoteExists(noteId)) return res.sendStatus(404);

  req.noteId = noteId;
  next();
};
noteController.use(ensureNoteExists);
noteController.route("/").get(getNote).delete(removeNote);

const notesController = express.Router({ mergeParams: true });
notesController
  .route("/")
  .get(getNotesCollection)
  .post(express.json(), createNote);

api.use(corsMiddleware());

api.use("/notes", notesController);
api.use("/notes/:noteId", noteController);
api.use("/notes/:noteId/features", noteFeaturesController);

const errorHandler = (error, req, res, next) => {
  console.log(error);
  res.sendStatus(500);
};
api.use(errorHandler);

api.listen(PORT, (err) => console.log(err || `API listening on ${PORT}`));
