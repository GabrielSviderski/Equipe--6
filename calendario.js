document.addEventListener('DOMContentLoaded', function() {
    const mesesContainer = document.getElementById('meses');
    const currentYearElement = document.getElementById('current-year');
    let currentYear = new Date().getFullYear();
    const nomeMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    let selectedDate = null;
    const notes = {};

    function generateCalendario(year) {
        mesesContainer.innerHTML = '';
        for (let i = 0; i < 12; i++) {
            const mesDiv = document.createElement('div');
            mesDiv.className = 'month-container';
            mesDiv.innerHTML = `<div class="month-year"><h2>${nomeMeses[i]}</h2></div><div class="calendario" data-mes="${i}"></div>`;
            mesesContainer.appendChild(mesDiv);
            const calendarioDiv = mesDiv.querySelector('.calendario');
            generateDays(calendarioDiv, i, year);
        }
    }

    function generateDays(calendarioDiv, month, year) {
        const diasNoMes = new Date(year, month + 1, 0).getDate();
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const diaDiv = document.createElement('div');
            diaDiv.textContent = dia;
            diaDiv.addEventListener('click', function() {
                if (selectedDate) {
                    document.querySelector('.calendario div.selected')?.classList.remove('selected');
                }
                diaDiv.classList.add('selected');
                selectedDate = new Date(year, month, dia);
                displayNoteForSelectedDate();
            });
            calendarioDiv.appendChild(diaDiv);
        }
    }

    function displayNoteForSelectedDate() {
        const noteContentDiv = document.getElementById('note-content');
        const dateKey = selectedDate.toDateString();
        if (notes[dateKey]) {
            noteContentDiv.innerHTML = `<strong>${dateKey}</strong><br>${notes[dateKey]}`;
        } else {
            noteContentDiv.innerHTML = "Nenhuma anotação para esta data.";
        }
    }

    document.getElementById('save-note').addEventListener('click', function() {
        if (selectedDate) {
            const noteText = document.getElementById('note').value;
            const dateKey = selectedDate.toDateString();
            notes[dateKey] = noteText;
            displayNoteForSelectedDate();
            document.getElementById('note').value = '';
        } else {
            alert("Selecione uma data antes de salvar uma anotação.");
        }
    });

    document.getElementById('download-notes').addEventListener('click', function() {
        const notesBlob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(notesBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'notas.json';
        link.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('reset-notes').addEventListener('click', function() {
        document.querySelectorAll('.calendario div').forEach(div => {
            div.classList.remove('present', 'absent', 'selected');
        });
        Object.keys(notes).forEach(key => delete notes[key]);
        document.getElementById('note').value = '';
        document.getElementById('note-content').innerHTML = "Nenhuma anotação para esta data.";
    });

    document.getElementById('confirm-participation').addEventListener('click', function() {
        if (selectedDate) {
            const dateKey = selectedDate.toDateString();
            notes[dateKey] = (notes[dateKey] || '') + " - Presença confirmada";
            displayNoteForSelectedDate();
            document.querySelector(`.calendario div.selected`).classList.add('present');
        }
    });

    document.getElementById('mark-absence').addEventListener('click', function() {
        if (selectedDate) {
            const dateKey = selectedDate.toDateString();
            notes[dateKey] = (notes[dateKey] || '') + " - Falta";
            displayNoteForSelectedDate();
            document.querySelector(`.calendario div.selected`).classList.add('absent');
        }
    });

    document.getElementById('prev-year').addEventListener('click', function() {
        currentYear--;
        currentYearElement.textContent = currentYear;
        generateCalendario(currentYear);
    });

    document.getElementById('next-year').addEventListener('click', function() {
        currentYear++;
        currentYearElement.textContent = currentYear;
        generateCalendario(currentYear);
    });

    generateCalendario(currentYear);
});