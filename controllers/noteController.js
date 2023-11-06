const User = require('../models/userModel')
const Note = require('../models/noteModel')

const getAllNotes = async(req,res)=>{
    const notes = Note.find({})

    if(!notes){
        res.status(500).json({message: "There is no Note, Check again"})
    }
    try{

    const userNote = await notes.map((note)=>{
    const user = User.findById(note.user)
    return {...note,username:user.username}

    })

    res.json(userNote)
}catch(error){
    res.status(400).json(error)
}
}

const addNote = async(req,res)=>{
    const {title,text,user} =req.body
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
      }
      try{
        const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()
        if (duplicate !== null) {
          return res.status(409).json({ message: 'Duplicate note title' })
        }
      
        const noteObject = { user, title, text }
        const newNote = await Note.create(noteObject)
      
        console.log(newNote)
      
        if (newNote) { // Created
          return res.status(201).json({ message: 'New note created' })
        } else {
          return res.status(400).json({ message: 'Invalid note data received' })
        }

      }catch(error){
        res.json(error)
      }

}
/////////////////////////UPDATE NOTE

const updateNote = async(req,res)=>{

    const { id, user, title, text, completed } = req.body
  
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
      }

      try{
       
        const note = await Note.findById(id)

       if (!note) {
      return res.status(400).json({ message: 'Note not found' })
       }

      const duplicate = await Note.findOne({ title })

      if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: 'Duplicate note title' })
      }

      note.user = user
      note.title = title
      note.text = text
      note.completed = completed

    const updatedNote = await note.save()

     res.json(`'${updatedNote.title}' updated`)



}catch(error){
    res.status(400).json(error)
}
}

///////////////////DELETE NOTE
const deleteNote = async (req, res) => {
    const { id } = req.body
  
    if (!id) {
      return res.status(400).json({ message: 'Note ID required' })
    }
  
    const note = await Note.findById(id)
  
    if (!note) {
      return res.status(400).json({ message: 'Note not found' })
    }
  
    const deleted = await note.deleteOne()
  
    const reply = `Note '${deleted.title}' with ID ${deleted._id} deleted`
  
    res.json(reply)
  }
  
  module.exports = {
    getAllNotes,
    addNote,
    updateNote,
    deleteNote

  }
  
