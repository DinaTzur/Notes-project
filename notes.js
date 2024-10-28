const addBox = document.querySelector(".add-box"),
wrapper = document.querySelector(".wrapper"),
grid = document.querySelector(".grid"),
popupBox = document.querySelector(".popup-box"),
popupTitle = document.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
colorTag = popupBox.querySelector("select"),
addBtn = popupBox.querySelector("button");
filterText = document.querySelector(".filter-text"),
filterDateStart = document.querySelector(".filter-date-start"),
filterDateEnd = document.querySelector(".filter-date-end")
filterColor = document.querySelector(".filter-color")

const monthes = ["January", "February", "March", "April", "May", "June", "July",
               "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;
let gridNotes = [];

addBox.addEventListener("click", () => {
    titleTag.focus();
    popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value= "";
    descTag.value= "";
    colorTag.selectedIndex=0;
    addBtn.innerText = "Add Note";
    popupTitle.innerText = "Add a new Note";
    popupBox.classList.remove("show");
});

filterText.addEventListener("keyup", () => {
    showNotes()
});

filterDateStart.addEventListener("change", () => {
    showNotes()
});

filterDateEnd.addEventListener("change", () => {
    showNotes()
});

filterColor.addEventListener("change", () => {
    showNotes()
});

function showNotes() {
    document.querySelectorAll(".wrapper .note").forEach(note => note.remove());
    var filter = filterText.value;
    var filterStart = filterDateStart.valueAsDate;
    var filterEnd = filterDateEnd.valueAsDate;

    var filteredNotes = (filter > "" ) ? notes.filter(x => x.title.includes(filter) || x.description.includes(filter)) : notes;
    if (filterStart){
        filteredNotes = filteredNotes.filter(x => new Date(x.fullDate) >= filterStart)
    }
    if (filterEnd){
        filterEnd.setDate(filterEnd.getDate()+1)
        filteredNotes = filteredNotes.filter(x => new Date(x.fullDate) <= filterEnd)
    }
    if(filterColor.selectedIndex>0){
        filteredNotes = filteredNotes.filter(x => x.color == filterColor.value)
    }

    filteredNotes.forEach((note, index) => {
        let liTag =`<li class="note ${note.open ? "":"closed"}" ondblclick="addToGrid(${index})" style="background-color:${note.color}">
                        <div class="details">
                            <p>${note.title}<i class="uil uil-pseudo" onclick="toggle(this, ${index})"></i></p>
                            <span>${note.description}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${index}, '${note.title}', '${note.description}', '${note.color}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        wrapper.insertAdjacentHTML("afterbegin", liTag);
    });
}

showNotes();

function addToGrid(noteId){
    var element = notes[noteId];
    if(gridNotes.indexOf(element)<0){
        gridNotes.push(notes[noteId]);
        showGrid();
    }
}
function removeFromGrid(noteId){
    gridNotes.splice(noteId, 1);
    showGrid();
}

function showGrid() {
    document.querySelectorAll(".grid .note").forEach(note => note.remove());
    gridNotes.forEach((note, index) => {
        let liTag =`<li class="note" style="background-color:${note.color}">
                        <div class="details">
                            <p>${note.title}<i class="uil uil-times" onclick="removeFromGrid(${index})"></i></p>
                            <span>${note.description}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                        </div>
                    </li>`;
        grid.insertAdjacentHTML("afterbegin", liTag);
    });    
}


function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if(!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function toggle(element, noteId){
    notes[noteId].open = notes[noteId].open ? false : true;
    var noteElement = element.parentElement.parentElement.parentElement;

    if(notes[noteId].open){
        noteElement.classList.remove("closed");
    }
    else{
        noteElement.classList.add("closed");
    }

    localStorage.setItem("notes", JSON.stringify(notes));
}

function updateNote(noteId, title, desc, color) {
    debugger
    isUpdate = true;
    updateId = noteId;
    addBox.click();
    titleTag.value = title
    descTag.value = desc
    colorTag.value = color
    addBtn.innerText = "Update Note";
    popupTitle.innerText = "Update a Note";
    console.log(noteId, title, desc);
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let noteTitle = titleTag.value,
    noteDesc = descTag.value;

    if(noteTitle || noteDesc){
        let dateObj = new Date();
        month = monthes[dateObj.getMonth()],
        day = dateObj.getDate(),
        year = dateObj.getFullYear(),
        hour =  dateObj.getHours(),
        minutes =  dateObj.getMinutes(),

        noteInfo = {
            title: noteTitle, 
            description: noteDesc,
            color: colorTag.value,
            date: `${month} ${day}, ${year}, ${hour<10 ? "0" + hour : hour}:${minutes<10 ? "0" + minutes : minutes}`,
            fullDate: dateObj
        }
        if(!isUpdate) {
            noteInfo.open = false;
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }

        localStorage.setItem("notes", JSON.stringify(notes));
        closeIcon.click();
        showNotes();
    }
});