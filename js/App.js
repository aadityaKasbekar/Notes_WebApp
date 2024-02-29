import NotesView from "./NotesView.js";
import NotesAPI from "./NotesAPI.js";

/**
* Represents the main application controller.
*/
export default class App {

    /**
    * Constructs a new instance of the App.
    * @param {HTMLElement} root - The root HTML element where the application will be rendered.
    */
    constructor(root) {
        // Initialize properties
        this.notes = [];
        this.activeNote = null;

        // Instantiate the NotesView and pass event handlers
        this.view = new NotesView(root, this._handlers());

        // Load existing notes and refresh the view
        this._loadExsistingNotes();
        this._refreshNotes();
    }

    /**
    * Loads existing notes asynchronously from the API.
    * If notes are loaded successfully, sets the notes and updates the view.
    * If notes exist, sets the active note to the first note.
    */
    _loadExsistingNotes() {
        NotesAPI.loadAllExsistingNotes()
            .then(notes => {
                this._setNotes(notes);
                if (notes.length > 0) {
                    this._setActiveNote(notes[0]);
                }
            })
            .catch(error => {
                console.error('Error fetching notes:', error);
            });
    }

    /**
    * Refreshes the notes from local storage and updates the view.
    * If notes exist, sets the active note to the first note.
    */
    _refreshNotes() {
        const notes = NotesAPI.getAllNotes();
        this._setNotes(notes);
        if (notes.length > 0) {
            this._setActiveNote(notes[0]);
        }
    }

    /**
    * Sets the notes array, updates the view, and adjusts the visibility of the note preview.
    * @param {Array<Object>} notes - The array of notes to set.
    */
    _setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    /**
    * Sets the active note, updates the view to display the active note details.
    * @param {Object} note - The active note to set.
    */
    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    /**
    * Returns an object containing event handlers for the NotesView.
    * @returns {Object} An object containing event handlers.
    */
    _handlers() {
        return {
            // Event handler for when a note is selected
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);
            },
            // Event handler for when a new note is added
            onNoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "Take note...",
                    actionItem: "Add action Item here...",
                    actionItem2: "Add action Item here...",
                    actionItem3: "Add action Item here...",
                    actionItem4: "Add action Item here..."
                };
                NotesAPI.saveNote(newNote);
                this._refreshNotes();
            },
            // Event handler for when a note is edited
            onNoteEdit: (title, body, actionItem, actionItem2, actionItem3, actionItem4) => {
                NotesAPI.saveNote({
                    id: this.activeNote.id,
                    title,
                    body,
                    actionItem,
                    actionItem2,
                    actionItem3,
                    actionItem4
                });
                this._refreshNotes();
            },
            // Event handler for when a note is deleted
            onNoteDelete: noteId => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            },
        };
    }
}