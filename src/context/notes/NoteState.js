import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const authToken = localStorage.getItem('token'); // Retrieve the token from localStorage

  const [notes, setNotes] = useState([]);

  // Get all Notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": authToken
        }
      });

      if (response.ok) {
        const json = await response.json();
        setNotes(json);
      } else {
        console.error('Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error during getNotes:', error);
    }
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": authToken
        },
        body: JSON.stringify({ title, description, tag })
      });

      if (response.ok) {
        const note = await response.json();
        setNotes((prevNotes) => [...prevNotes, note]);
      } else {
        console.error('Failed to add note');
      }
    } catch (error) {
      console.error('Error during addNote:', error);
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": authToken
        }
      });

      if (response.ok) {
        const newNotes = notes.filter((note) => note._id !== id);
        setNotes(newNotes);
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error during deleteNote:', error);
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": authToken
        },
        body: JSON.stringify({ title, description, tag })
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === id ? { ...note, ...updatedNote } : note
          )
        );
      } else {
        console.error('Failed to edit note');
      }
    } catch (error) {
      console.error('Error during editNote:', error);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
