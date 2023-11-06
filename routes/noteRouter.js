const express = require("express");
const router = express.Router();
const notesController = require("../controllers/noteController");
const auth = require("../middleware/auth");

router.get("/all", auth, notesController.getAllNotes);
router.post("/add", auth, notesController.addNote);
router.patch("/update", auth, notesController.updateNote);
router.delete("/delete", auth, notesController.deleteNote);

module.exports = router;
