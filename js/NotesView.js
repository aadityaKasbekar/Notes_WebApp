/**
* Represents the view for managing notes.
*/
export default class NotesView {

    /**
    * Constructs a new instance of NotesView.
    * @param {HTMLElement} root - The root HTML element where the notes view will be rendered.
    * @param {Object} options - Optional configuration options.
    * @param {Function} options.onNoteSelect - Callback function triggered when a note is selected.
    * @param {Function} options.onNoteAdd - Callback function triggered when a new note is added.
    * @param {Function} options.onNoteEdit - Callback function triggered when a note is edited.
    * @param {Function} options.onNoteDelete - Callback function triggered when a note is deleted.
    */
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;

        // Rendering the initial structure of the notes view
        this.root.innerHTML = `
            <div class="notes__sidebar">
                <button class="notes__add" type="button">Add Note</button>
                <div class="notes__list"></div>
            </div>
            <div class="notes__preview">
                <input class="notes__title" type="text" placeholder="New Note...">
                <div class="checkbox-wrapper-11">
                    <input id="02-11" type="checkbox" name="r" value="2">
                    <label for="02-11">
                        <input class="notes__actionItem" type="text" placeholder="New Action Item...">
                    </label>
                </div>
                <div class="checkbox-wrapper-11">
                    <input id="02-11" type="checkbox" name="r" value="2">
                    <label for="02-11">
                        <input class="notes__actionItem2" type="text" placeholder="New Action Item...">
                    </label>
                </div>
                <div class="checkbox-wrapper-11">
                    <input id="02-11" type="checkbox" name="r" value="2">
                    <label for="02-11">
                        <input class="notes__actionItem3" type="text" placeholder="New Action Item...">
                    </label>
                </div>
                <div class="checkbox-wrapper-11">
                    <input id="02-11" type="checkbox" name="r" value="2">
                    <label for="02-11">
                        <input class="notes__actionItem4" type="text" placeholder="New Action Item...">
                    </label>
                </div>
                <textarea class="notes__body">Take Note...</textarea>
            </div>
        `;

        // Attaching event listeners
        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");
        const inpActionItem = this.root.querySelector(".notes__actionItem");
        const inpActionItem2 = this.root.querySelector(".notes__actionItem2");
        const inpActionItem3 = this.root.querySelector(".notes__actionItem3");
        const inpActionItem4 = this.root.querySelector(".notes__actionItem4");

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inpTitle, inpBody, inpActionItem, inpActionItem2, inpActionItem3, inpActionItem4].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();
                const updatedActionItem = inpActionItem.value.trim();
                const updatedActionItem2 = inpActionItem2.value.trim();
                const updatedActionItem3 = inpActionItem3.value.trim();
                const updatedActionItem4 = inpActionItem4.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody, updatedActionItem, updatedActionItem2, updatedActionItem3, updatedActionItem4);
            });
        });

        // Hiding the note preview by default
        this.updateNotePreviewVisibility(false);
    }

    /**
    * Generates HTML markup for a note list item.
    * @param {number} id - The ID of the note.
    * @param {string} title - The title of the note.
    * @param {string} body - The body/content of the note.
    * @param {Date} updated - The date when the note was last updated.
    * @returns {string} HTML markup for the note list item.
    * @private
    */
    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    /**
    * Updates the note list with the provided notes.
    * @param {Array<Object>} notes - An array of note objects.
    */
    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list");

        // Empty the existing list
        notesListContainer.innerHTML = "";

        // Populate the list with new notes
        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));
            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Attach event listeners to each note list item for selection and deletion
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");
                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }

    /**
    * Updates the UI to display the details of the currently active note.
    * @param {Object} note - The currently active note object.
    */
    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;
        this.root.querySelector(".notes__actionItem").value = note.actionItem;
        this.root.querySelector(".notes__actionItem2").value = note.actionItem2;
        this.root.querySelector(".notes__actionItem3").value = note.actionItem3;
        this.root.querySelector(".notes__actionItem4").value = note.actionItem4;

        // Remove the 'selected' class from all list items
        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        // Add the 'selected' class to the currently active note's list item
        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    /**
    * Toggles the visibility of the note preview section.
    * @param {boolean} visible - Indicates whether the note preview should be visible or hidden.
    */
    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}