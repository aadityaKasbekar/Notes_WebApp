/**
* A utility class for managing notes.
*/
export default class NotesAPI {

    /**
    * Retrieves all notes from local storage and sorts them by the 'updated' timestamp in descending order.
    * @returns {Array} An array of notes sorted by 'updated' timestamp.
    */
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    /**
    * Loads existing notes from a JSON file asynchronously.
    * @returns {Promise<Array>} A promise that resolves to an array of notes sorted by 'updated' timestamp, or rejects with an error if the request fails.
    */
    static loadAllExsistingNotes() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', '/data/notes.json');
            xhr.onload = function () {
                const status = this.status;
                const responseText = this.responseText;

                if (status === 200) {
                    const notes = JSON.parse(responseText);
                    const sortedNotes = notes.sort((a, b) => {
                        return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
                    });
                    resolve(sortedNotes);
                } else {
                    reject(new Error('Failed to load notes'));
                }
            };
            xhr.onerror = function () {
                reject(new Error('Failed to make the request'));
            };
            xhr.send();
        });
    }

    /**
    * Saves a note to local storage. If a note with the same ID exists, it updates it; otherwise, it creates a new note.
    * @param {Object} noteToSave - The note object to save.
    */
    static saveNote(noteToSave) {
        const notes = NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);

        // Edit/Update
        if (existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.actionItem = noteToSave.actionItem
            existing.actionItem2 = noteToSave.actionItem2
            existing.actionItem3 = noteToSave.actionItem3
            existing.actionItem4 = noteToSave.actionItem4
            existing.updated = new Date().toISOString();
        } else {
            noteToSave.id = Math.floor(Math.random() * 1000000);
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
        }

        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

    /**
    * Deletes a note from local storage based on its ID.
    * @param {number} id - The ID of the note to delete.
    */
    static deleteNote(id) {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);

        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    }
}