let taskBoard = (function () {

        let startSite = {

                init: function () {

                        this.cacheDomHeader();
                        this.cacheDomMain();
                        this.cacheDomFooter();
                        this.renderTemplates();
                        notes.expiredNote();
                },
                cacheDomHeader: function () {

                        this.header = document.getElementById('title');
                },
                cacheDomMain: function () {

                        this.main = document.getElementById('newTask');
                },
                cacheDomFooter: function () {

                        this.footer = document.getElementById('notes');
                },
                renderTemplates: function () {

                        this.header.innerHTML = boardTitleTemplate();
                        this.main.innerHTML = createTaskTemplate();
                        this.footer.innerHTML = '';
                        notes.displayLocalStorage();
                        for (let i = 0; i < notes.notesArray.length; i++) {
                                if (notes.notesArray[i].justPosted === 'invisi') {
                                        this.footer.innerHTML += Mustache.to_html(displayNoteTemplate(), notes.notesArray[i]);
                                        setTimeout(() => {
                                                document.getElementById(notes.notesArray[i].title + 1).setAttribute('style', 'transition:0.4s ease-in; opacity:1;');
                                        }, 1);
                                        setTimeout(() => {
                                                notes.notesArray[i].justPosted = 'visi';
                                                notes.saveLocalStorage();
                                        }, 400);
                                } else if (notes.notesArray[i].justPosted === 'visi') {
                                        this.footer.innerHTML += Mustache.to_html(displayNoteTemplate(), notes.notesArray[i]);
                                        notes.saveLocalStorage();
                                }
                        }
                },
                createNote: function () {

                        notes.cacheTemplate();
                        notes.validateContent();
                },
                removeNote: function (id) {

                        for (let i = 0; i < notes.notesArray.length; i++) {
                                if (notes.notesArray[i].title === id) {

                                        notes.notesArray.splice(i, 1);
                                        document.getElementById(id + 1).setAttribute('style', 'transition:0.4s ease-out; opacity:0;');
                                        notes.expired[i].setAttribute('style', 'transition:0.4s ease-out; opacity:0;');

                                        setTimeout(() => {
                                                notes.saveLocalStorage();
                                                this.renderTemplates();
                                                notes.expiredNote();
                                        }, 500);
                                }
                        }
                },
        }

        let notes = {

                notesArray: [{
                        title: "Example",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla molestie tortor vitae gravida aliquam. Pellentesque ultrices sapien at felis hendrerit vestibulum. In hac habitasse platea dictumst. Suspendisse sit amet lorem id leo varius sodales. Ut sit amet massa ligula. Mauris sit amet tortor nec tellus tincidunt scelerisque. Aliquam eget mauris vel nunc cursus placerat.",
                        date: '08/09/2018',
                        time: '11:11',
                        justPosted: 'visi'
                },
                {
                        title: "Example2",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla molestie tortor vitae gravida aliquam. Pellentesque ultrices sapien at felis hendrerit vestibulum. In hac habitasse platea dictumst. Suspendisse sit amet lorem id leo varius sodales. Ut sit amet massa ligula. Mauris sit amet tortor nec tellus tincidunt scelerisque. Aliquam eget mauris vel nunc cursus placerat.",
                        date: '08/11/2018',
                        time: '11:11',
                        justPosted: 'visi'
                },
                {
                        title: "Example3",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla molestie tortor vitae gravida aliquam. Pellentesque ultrices sapien at felis hendrerit vestibulum. In hac habitasse platea dictumst. Suspendisse sit amet lorem id leo varius sodales. Ut sit amet massa ligula. Mauris sit amet tortor nec tellus tincidunt scelerisque. Aliquam eget mauris vel nunc cursus placerat.",
                        date: '08/09/2018',
                        time: '11:11',
                        justPosted: 'visi'
                },
                ],
                NoteConstractor: function (title, text, date, time) {

                        this.title = title;
                        this.text = text;
                        this.date = date;
                        this.time = time;
                        this.justPosted = 'invisi';

                        return notes.notesArray.push({ title: this.title, text: this.text, date: this.date, time: this.time, justPosted: this.justPosted });

                },
                cacheTemplate: function () {
                        this.inputTitle = document.getElementById('titleTask').value;
                        this.inputTask = document.getElementById('textTask').value;
                        this.inputDate = document.getElementById('dateTask').value;
                        this.inputTime = document.getElementById('timeTask').value;
                        this.input = document.getElementsByClassName('inputValidation');
                        this.alert = document.getElementsByClassName('alertNotification');
                        this.dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\\.]\d{4}$/g;
                        this.timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g;

                                                        //--------Start of Cache Date and Time Input for validation--------//
                        this.day = this.inputDate.split('/')[0];
                        this.month = this.inputDate.split('/')[1];
                        this.year = this.inputDate.split('/')[2];
                        this.hour = this.inputTime.split(':')[0];
                        this.minute = this.inputTime.split(':')[1];
                        this.d = new Date(this.year, (this.month - 1), this.day, (new Date().getHours()), (new Date().getMinutes()), (new Date().getSeconds()), (new Date().getMilliseconds()));
                        this.h = new Date(this.year, (this.month - 1), this.day, this.hour, this.minute);
                        this.currentDate = new Date();
                                                        //--------END Of Cache Date and Time Input for validation--------//
                },
                validateContent: function () {
                        //--------Start of all inputs are fill up--------//

                        for (let i = 0; i < this.input.length; i++) {
                                if (this.input[i].value === '') {
                                        this.alert[i].setAttribute('style', 'display:block');
                                        return this.alert[i].innerHTML = '* Please enter details';
                                } else {
                                        this.alert[i].innerHTML = '';
                                        this.alert[i].setAttribute('style', 'display:none');
                                }
                        }
                        //--------END Of all inputs are fill up--------//

                        //--------Start of Title is not taken--------//
                        for (let k = 0; k < notes.notesArray.length; k++) {
                                if (notes.notesArray[k].title === this.inputTitle) {
                                        this.alert[0].setAttribute('style', 'display:block');
                                        return this.alert[0].innerHTML = 'Title is already in use,</br> please chose another title';
                                } else {
                                        this.alert[0].setAttribute('style', 'display:none');
                                        this.alert[0].innerHTML = '';
                                }
                        }
                        //--------END Of Title is not taken--------//

                        //--------Start of date matches dateRegex and Current Date and Time--------//

                        if (!this.inputDate.match(this.dateRegex)) {

                                this.alert[2].setAttribute('style', 'display:block');
                                return this.alert[2].innerHTML = '* Invalid date please use dd/mm/yyyy';

                        } else if (this.d < this.currentDate) {

                                this.alert[2].setAttribute('style', 'display:block');
                                return this.alert[2].innerHTML = '* Please, add a task for the future';

                        } else if (this.h < this.currentDate) {

                                this.alert[3].setAttribute('style', 'display:block');
                                return this.alert[3].innerHTML = '* This hour is already in the past';
                        }
                        else {
                                this.alert[2].setAttribute('style', 'display:none');
                                this.alert[2].innerHTML = '';
                        }
                        if (!this.inputTime.match(this.timeRegex)) {

                                this.alert[3].setAttribute('style', 'display:block');
                                return this.alert[3].innerHTML = '* Invalid time please use 00:00';

                        } else {
                                this.alert[3].setAttribute('style', 'display:none');
                                this.alert[3].innerHTML = '';
                        }
                        //--------END Of date matches dateRegex and Current Year--------//

                        this.newNote = new this.NoteConstractor(this.inputTitle, this.inputTask, this.inputDate, this.inputTime);
                        this.saveLocalStorage();
                        startSite.init();
                },
                saveLocalStorage: function () {

                        let temp = JSON.stringify(notes.notesArray);
                        localStorage.setItem(this.note, temp);
                },
                displayLocalStorage: function () {

                        this.note = 'note';
                        if (localStorage.getItem(this.note)) {
                                let temp = localStorage.getItem(this.note);
                                temp = JSON.parse(temp);
                                notes.notesArray = temp;
                        }
                },
                expiredNote: function () {

                        this.expired = document.getElementsByClassName('expiredDate');

                        if (this.expired) {     // On editTask this.expired will be undefined

                                for (let i = 0; i < notes.notesArray.length; i++) {

                                        const noteDay = notes.notesArray[i].date.split('/')[0];
                                        const noteMonth = notes.notesArray[i].date.split('/')[1];
                                        const noteYear = notes.notesArray[i].date.split('/')[2];
                                        const noteHour = notes.notesArray[i].time.split(':')[0];
                                        const noteMin = notes.notesArray[i].time.split(':')[1];
                                        this.expiredDate = new Date(noteYear, (noteMonth - 1), noteDay, noteHour, noteMin, (new Date().getSeconds()), (new Date().getMilliseconds()));
                                        this.currentDate2 = new Date();

                                        if (this.expiredDate < this.currentDate2) {

                                                this.expired[i].setAttribute('style', 'margin-bottom: -25px;');
                                                this.expired[i].innerHTML = '* This note has <strong>Expired</strong>';
                                        } else {
                                                this.expired[i].setAttribute('style', 'display:none;');
                                                this.expired[i].innerHTML = '';
                                        }
                                }
                        }

                },
        }

        let editTask = {

                arr: [],

                noteToEdit: function (id) {

                        for (let i = 0; i < notes.notesArray.length; i++) {

                                if (notes.notesArray[i].title + 2 === id) {

                                        editTask.arr.push(notes.notesArray[i]);
                                        notes.notesArray.splice(i, 1);

                                        setTimeout(() => {
                                                this.init();
                                        }, 500);
                                }
                        }
                },
                init: function () {

                        this.cacheDomHeader();
                        this.cacheDomMain();
                        this.cacheDomFooter();
                        this.renderEditNote();
                },
                cacheDomHeader: function () {

                        this.header = document.getElementById('title');
                },
                cacheDomMain: function () {

                        this.main = document.getElementById('newTask');
                },
                cacheDomFooter: function () {

                        this.footer = document.getElementById('notes');
                },
                renderEditNote: function () {

                        this.header.innerHTML = boardTitleTemplate();
                        this.main.innerHTML = Mustache.to_html(editTaskTemplate(), editTask.arr[0]);
                        this.footer.innerHTML = '';
                },
                updateTask: function () {

                        this.arr.splice(0, 1);

                        if (startSite.createNote()) {

                                startSite.saveLocalStorage();
                                startSite.init();
                        }
                }
        }

        startSite.init();

        return {
                startSite: startSite,
                editTask: editTask
        }
})();
