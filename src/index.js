const express = require("express");
const corsMiddleware = require("cors");

const api = express();

const reflectPath = (req, res) => res.send(req.baseUrl);

const getNote = reflectPath;
const createNote = reflectPath;
const removeNote = reflectPath;
const getNoteFeatures = reflectPath;
const updateNoteFeatures = reflectPath;
const getNotesCollection = reflectPath;

const noteFeaturesController = express.Router({ mergeParams: true });
noteFeaturesController
  .route("/")
  .get(getNoteFeatures)
  .put(express.json(), updateNoteFeatures);

const noteController = express.Router({ mergeParams: true });
noteController.route("/").get(getNote).delete(removeNote);

const notesController = express.Router({ mergeParams: true });
notesController
  .route("/")
  .get(getNotesCollection)
  .post(express.json(), createNote);

api.use(corsMiddleware({ origin: "*" }));
api.use("/notes", notesController);
api.use("/notes/:noteId", noteController);
api.use("/notes/:noteId/features", noteFeaturesController);

const errorHandler = (error, req, res, next) => {
  console.log(error);
  res.sendStatus(500);
};
api.use(errorHandler);

const { PORT = 8008 } = process.env;
api.listen(PORT, (err) => console.log(err || `API listening on ${PORT}`));
