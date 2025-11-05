window.onload = function() {
    // Stato dell'applicazione
    let exams = [];

    // Elementi del DOM
    const addExamForm = document.getElementById('add-exam-form');
    const examName = document.getElementById('exam-name');
    const examGrade = document.getElementById('exam-grade');
    const examCFU = document.getElementById('exam-cfu');
    
    const addCertForm = document.getElementById('add-cert-form');
    const certName = document.getElementById('cert-name');
    const certCFU = document.getElementById('cert-cfu');
    
    const examsList = document.getElementById('exams-list');
    const noExamsRow = document.getElementById('no-exams-row');

    const weightedAverageEl = document.getElementById('weighted-average');
    const totalCfuEl = document.getElementById('total-cfu');
    
    const totalDegreeCfuInput = document.getElementById('total-degree-cfu');
    const desiredGradeInput = document.getElementById('desired-grade');
    const calculateProjectionBtn = document.getElementById('calculate-projection-btn');
    const projectionResultEl = document.getElementById('projection-result');
    const overviewSection = document.getElementById('overview-section');
    const cfuProgressFill = document.getElementById('cfu-progress-fill');
    const cfuProgressText = document.getElementById('cfu-progress-text');
    const projectedGradeEl = document.getElementById('projected-grade');
    const projectedNoteEl = document.getElementById('projected-note');

    // Funzione per renderizzare la lista degli esami
    function renderExams() {
        examsList.innerHTML = ''; // Pulisce la lista
        if (exams.length === 0) {
            examsList.appendChild(noExamsRow);
        } else {
            // Contatori separati: uno per le attività (grade === null) e uno per gli esami con voto
            let activityCounter = 0;
            let examCounter = 0;
            exams.forEach((exam, index) => {
                    const tr = document.createElement('tr');
                    tr.className = 'border-b border-gray-200 last:border-b-0 fade-in';

                    // Determina i contatori e il nome di default in modo sicuro
                    if (exam.grade === null) {
                        activityCounter += 1;
                    } else {
                        examCounter += 1;
                    }
                    const defaultName = exam.name || (exam.grade === null ? `Attività ${activityCounter}` : `Esame ${examCounter}`);

                    // Nome (uso textContent per evitare XSS)
                    const tdName = document.createElement('td');
                    tdName.className = 'py-2 px-2 font-medium text-gray-800';
                    tdName.textContent = defaultName;
                    tr.appendChild(tdName);

                    // Voto
                    const tdGrade = document.createElement('td');
                    tdGrade.className = 'py-2 px-2 text-center';
                    const gradeSpan = document.createElement('span');
                    if (exam.grade === null) {
                        gradeSpan.className = 'text-gray-500 font-medium';
                        gradeSpan.textContent = 'Idoneità';
                    } else {
                        gradeSpan.className = 'text-indigo-600 font-semibold';
                        gradeSpan.textContent = (exam.grade > 30 ? '30 e Lode' : String(exam.grade));
                    }
                    tdGrade.appendChild(gradeSpan);
                    tr.appendChild(tdGrade);

                    // CFU
                    const tdCfu = document.createElement('td');
                    tdCfu.className = 'py-2 px-2 text-center text-green-600 font-semibold';
                    tdCfu.textContent = `${exam.cfu} CFU`;
                    tr.appendChild(tdCfu);

                    // Azione (bottone Rimuovi)
                    const tdAction = document.createElement('td');
                    tdAction.className = 'py-2 px-2 text-center';
                    const btn = document.createElement('button');
                    btn.dataset.index = String(index);
                    btn.className = 'remove-btn text-red-500 hover:text-red-700 text-sm font-medium';
                    btn.type = 'button';
                    btn.textContent = 'Rimuovi';
                    tdAction.appendChild(btn);
                    tr.appendChild(tdAction);

                    examsList.appendChild(tr);
            });
        }
    }

    // Salvataggio e caricamento su localStorage
    function saveExams() {
        try {
            const raw = JSON.stringify(exams);
            localStorage.setItem('unicalc_exams', raw);
        } catch (err) {
            // Non bloccante: se localStorage non è disponibile, silenzia
            console.warn('Impossibile salvare su localStorage', err);
        }
    }

    function loadExams() {
        try {
            const raw = localStorage.getItem('unicalc_exams');
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                // validate minimal shape
                exams = parsed.map(item => ({
                    name: typeof item.name === 'string' ? item.name : '',
                    grade: item.grade === null ? null : (Number.isFinite(item.grade) ? item.grade : (isNaN(parseInt(item.grade, 10)) ? null : parseInt(item.grade, 10))),
                    cfu: parseInt(item.cfu, 10) || 0
                })).filter(it => Number.isInteger(it.cfu) && it.cfu > 0);
            }
        } catch (err) {
            console.warn('Impossibile leggere da localStorage', err);
        }
    }

    // Funzione per calcolare e aggiornare la media e i CFU
    function updateSummary() {
        if (exams.length === 0) {
            weightedAverageEl.textContent = '0.00';
            totalCfuEl.textContent = '0';
            return;
        }

        const totalCfu = exams.reduce((sum, exam) => sum + exam.cfu, 0);
        
        const gradedExams = exams.filter(exam => exam.grade !== null);
        const sumOfProducts = gradedExams.reduce((sum, exam) => sum + (Math.min(exam.grade, 30) * exam.cfu), 0);
        const totalGradedCfu = gradedExams.reduce((sum, exam) => sum + exam.cfu, 0);
        
        const weightedAverage = totalGradedCfu > 0 ? sumOfProducts / totalGradedCfu : 0;

        weightedAverageEl.textContent = weightedAverage.toFixed(2);
        totalCfuEl.textContent = totalCfu;

        // Aggiorna overview (se l'utente ha inserito i CFU totali di laurea)
        updateOverview();
    }

    // Computa e aggiorna la sezione overview
    function updateOverview() {
        const totalDegreeCfu = parseInt(totalDegreeCfuInput.value, 10);
        const currentCfu = exams.reduce((sum, exam) => sum + exam.cfu, 0);

        if (isNaN(totalDegreeCfu) || totalDegreeCfu <= 0) {
            // nascondi overview finché l'utente non fornisce il totale dei CFU di laurea
            overviewSection.classList.add('hidden');
            return;
        }

        // mostra overview
        overviewSection.classList.remove('hidden');

        // CFU progress bar
        const percent = Math.min(100, Math.round((currentCfu / totalDegreeCfu) * 100));
        cfuProgressFill.style.width = percent + '%';
        cfuProgressText.textContent = `${currentCfu} / ${totalDegreeCfu} CFU (${percent}%)`;

        // Proiezione voto di laurea
        const gradedExams = exams.filter(exam => exam.grade !== null);
        const sumOfProducts = gradedExams.reduce((sum, exam) => sum + (Math.min(exam.grade, 30) * exam.cfu), 0);
        const totalGradedCfu = gradedExams.reduce((sum, exam) => sum + exam.cfu, 0);
        const weightedAverage = totalGradedCfu > 0 ? sumOfProducts / totalGradedCfu : 0;

        if (totalGradedCfu === 0) {
            projectedGradeEl.textContent = '';
            projectedNoteEl.textContent = 'Inserisci almeno un esame con voto per vedere la proiezione.';
        } else {
            // Formula: Voto di laurea = (Media Ponderata / 30) * 110
            const projected = (weightedAverage / 30) * 110;
            // Limita il voto proiettato tra 66 e 110
            const displayed = Math.max(66, Math.min(110, projected));
            projectedGradeEl.textContent = displayed.toFixed(2);
            projectedNoteEl.textContent = `Basato sulla media ponderata attuale ${weightedAverage.toFixed(2)} su 30.`;
        }
    }

    // Gestione dell'aggiunta di un esame
    addExamForm.onsubmit = function(e) {
        if (e && e.preventDefault) e.preventDefault();

        const name = examName.value.trim();
        const grade = parseInt(examGrade.value, 10);
        const cfu = parseInt(examCFU.value, 10);

        // In alcune università la lode al 30 vale come 31 o addirittura 32 quindi accettiamo fino a 32
        if (isNaN(grade) || grade < 18 || grade > 32) {
            alert('Per favore, inserisci un voto tra 18 e 32.');
            return;
        }

        if (isNaN(cfu) || cfu < 1) {
            alert('Per favore, inserisci un numero di CFU valido.');
            return;
        }

    exams.push({ name, grade, cfu });
    saveExams();
        exams.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        renderExams();
        updateSummary();
        addExamForm.reset();
        examName.focus();
        return false;
    };

    // Gestione dell'aggiunta di un'attività
    addCertForm.onsubmit = function(e) {
        if (e && e.preventDefault) e.preventDefault();

        const name = certName.value.trim();
        const cfu = parseInt(certCFU.value, 10);

        if (isNaN(cfu) || cfu < 1) {
            alert('Per favore, inserisci un numero di CFU valido.');
            return;
        }

    exams.push({ name, grade: null, cfu });
    saveExams();
        exams.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        renderExams();
        updateSummary();
        addCertForm.reset();
        certName.focus();
        return false;
    };


    // Gestione della rimozione di un esame (event delegation) using onclick
    examsList.onclick = function(e) {
        e = e || window.event;
        const target = e.target || e.srcElement;
        if (target && target.classList && target.classList.contains('remove-btn')) {
            const indexToRemove = parseInt(target.dataset.index, 10);
            exams.splice(indexToRemove, 1);
            saveExams();
            renderExams();
            updateSummary();
        }
    };

    // Gestione del calcolo della proiezione using onclick
    calculateProjectionBtn.onclick = function() {
        const totalDegreeCfu = parseInt(totalDegreeCfuInput.value, 10);
        const desiredGrade = parseInt(desiredGradeInput.value, 10);

        if (isNaN(totalDegreeCfu) || isNaN(desiredGrade) || totalDegreeCfu <= 0 || desiredGrade < 66 || desiredGrade > 110) {
            projectionResultEl.textContent = '';
            const p = document.createElement('p');
            p.className = 'text-red-600 font-medium';
            p.textContent = 'Per favore, inserisci i CFU totali e un voto di laurea desiderato validi.';
            projectionResultEl.appendChild(p);
            return;
        }

        const currentCfu = exams.reduce((sum, exam) => sum + exam.cfu, 0);
        const currentSumOfProducts = exams
            .filter(exam => exam.grade !== null)
            .reduce((sum, exam) => sum + (Math.min(exam.grade, 30) * exam.cfu), 0);

        // CFU già completi
        if (currentCfu >= totalDegreeCfu) {
            projectionResultEl.textContent = '';
            const p = document.createElement('p');
            p.className = 'text-yellow-600 font-medium';
            p.textContent = 'Hai già acquisito tutti i CFU necessari.';
            projectionResultEl.appendChild(p);
            return;
        }

        // Formula: Voto di laurea = (Media Ponderata / 30) * 110
        // Formula inversa: Media Ponderata Target = (Voto Laurea Desiderato / 110) * 30
        const targetWeightedAverage = (desiredGrade / 110) * 30;

        // (currentSumOfProducts + futureSumOfProducts) / totalDegreeCfu = targetWeightedAverage
        const neededTotalSumOfProducts = targetWeightedAverage * totalDegreeCfu;
        const futureSumOfProducts = neededTotalSumOfProducts - currentSumOfProducts;
        const remainingCfu = totalDegreeCfu - currentCfu;

        const requiredFutureAverage = futureSumOfProducts / remainingCfu;

        projectionResultEl.textContent = '';
        const container = document.createElement('div');
        container.className = 'p-4 rounded-lg fade-in';

        const heading = document.createElement('h4');
        heading.className = 'font-bold text-lg';

        const message = document.createElement('p');
        message.className = 'mt-2';

        const note = document.createElement('p');
        note.className = 'text-sm mt-1';

        // Blocco di voto impossibile
        if (requiredFutureAverage > 30) {
            container.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg fade-in';
            heading.textContent = 'Obiettivo Difficile';
            message.textContent = `Per laurearti con ${desiredGrade}, dovresti mantenere una media di `;
            const strongAvg = document.createElement('strong');
            strongAvg.className = 'text-xl';
            strongAvg.textContent = requiredFutureAverage.toFixed(2);
            message.appendChild(strongAvg);
            message.appendChild(document.createTextNode(` sui prossimi `));
            const strongCfu = document.createElement('strong');
            strongCfu.textContent = String(remainingCfu);
            message.appendChild(strongCfu);
            message.appendChild(document.createTextNode(' CFU.'));
            note.textContent = 'Questo risultato è matematicamente impossibile. Prova a ricalibrare il tuo obiettivo.';

        // Blocco di voto raggiungibile
        } else if (requiredFutureAverage < 18) {
            container.className = 'bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg fade-in';
            heading.textContent = 'Obiettivo Raggiungibile';
            message.textContent = `Per laurearti con ${desiredGrade}, ti basta mantenere una media di `;
            const strongAvg = document.createElement('strong');
            strongAvg.className = 'text-xl';
            strongAvg.textContent = requiredFutureAverage.toFixed(2);
            message.appendChild(strongAvg);
            message.appendChild(document.createTextNode(` sui prossimi `));
            const strongCfu = document.createElement('strong');
            strongCfu.textContent = String(remainingCfu);
            message.appendChild(strongCfu);
            message.appendChild(document.createTextNode(' CFU.'));
            note.textContent = 'Puoi farcela senza problemi.';

        // Blocco di voto standard
        } else {
            container.className = 'bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg fade-in';
            heading.textContent = 'Il Tuo Obiettivo';
            message.textContent = `Per laurearti con ${desiredGrade}, dovrai mantenere una media del `;
            const strongAvg = document.createElement('strong');
            strongAvg.className = 'text-xl';
            strongAvg.textContent = requiredFutureAverage.toFixed(2);
            message.appendChild(strongAvg);
            message.appendChild(document.createTextNode(' sui prossimi '));
            const strongCfu = document.createElement('strong');
            strongCfu.textContent = String(remainingCfu);
            message.appendChild(strongCfu);
            message.appendChild(document.createTextNode(' CFU.'));
        }

        container.appendChild(heading);
        container.appendChild(message);
        if (note.textContent) container.appendChild(note);
        projectionResultEl.appendChild(container);

        return false;
    };

    // Aggiorna overview quando l'utente modifica i CFU totali di laurea
    totalDegreeCfuInput.oninput = function() {
        updateOverview();
    };

    // Carica dati persistenti e inizializza (assicurati che l'overview sia nascosta se non ci sono CFU totali di laurea)
    loadExams();
    renderExams();
    updateSummary();
    updateOverview();

};