import React from "react";
import { data } from "./data"
import Split from "react-split"
import { nanoid } from "nanoid"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import "./style.css"

export default function App() {
    const [notes, setNotes] = React.useState(() => {
        return JSON.parse(localStorage.getItem("notes")) || []
    });
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    // const [state,setState] = React.useState(()=>console.log(111))

    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    })

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(preNotes => [newNote, ...preNotes]);
        setCurrentNoteId(newNote.id);
    }

    function updateNote(text) {
        setNotes(oldNotes => {
            const newArray = [];
            for (let i = 0; i < oldNotes.length; i++) {
                if (oldNotes[i].id === currentNoteId) {
                    newArray.unshift({ ...oldNotes[i], body: text })
                } else {
                    newArray.push(oldNotes[i]);
                }
            }
            return newArray;
        })
        // setNotes(oldNotes => {

        // })
    }
    // setNotes(oldNotes => oldNotes.map(oldNote => {
    //     return oldNote.id === currentNoteId
    //         ? { ...oldNote, body: text }
    //         : oldNote
    // }))
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }

    function deleteNotes(event, noteID) {
        setNotes(oldNotes=>{
            const newArr = [...oldNotes];
            // console.log(newArr.filter(note=>note.id!==currentNoteId));
            return newArr.filter(note=>note.id!==noteID);
        })
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={findCurrentNote()}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNotes={deleteNotes}
                        />
                        {
                            currentNoteId &&
                            notes.length > 0 &&
                            <Editor
                                currentNote={findCurrentNote()}
                                updateNote={updateNote}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>you have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >Create one now</button>
                    </div>
            }
        </main>
    )
}