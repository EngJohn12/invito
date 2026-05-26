// --- 1. SELEZIONE DEGLI ELEMENTI DEL DOM ---
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const step4 = document.getElementById('step-4');
const step5 = document.getElementById('step-5');

const btnYes = document.getElementById('yes-btn');
const btnNo = document.getElementById('no-btn');
const btnToStep3 = document.getElementById('to-step-3');
const btnToStep4 = document.getElementById('to-step-4');
const foodBtns = document.querySelectorAll('.food-btn');

const datePicker = document.getElementById('date-picker');
const timePicker = document.getElementById('time-picker');
const summaryText = document.getElementById('summary-text');


// --- 2. LOGICA DEL PULSANTE "NO" ---
btnNo.addEventListener('mouseover', () => {
    // Otteniamo le dimensioni del contenitore genitore (la card)
    const container = document.getElementById('card-container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    // Calcoliamo i limiti massimi in cui il pulsante può muoversi
    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;

    // Generiamo coordinate casuali all'interno della card
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    // Applichiamo la nuova posizione assoluta
    btnNo.style.position = 'absolute';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
});

// Evita che il click da mobile (se si riesce a premerlo) faccia qualcosa
btnNo.addEventListener('click', (e) => {
    e.preventDefault();
});


// --- 3. LOGICA DI NAVIGAZIONE TRA LE FASI ---

// Funzione per cambiare schermata
function goToStep(currentStep, nextStep) {
    currentStep.classList.add('hidden');
    currentStep.classList.remove('active');
    
    nextStep.classList.remove('hidden');
    nextStep.classList.add('active');
}

// Da Fase 1 a Fase 2 (Ha cliccato SÌ)
btnYes.addEventListener('click', () => {
    goToStep(step1, step2);
});

// Da Fase 2 a Fase 3
btnToStep3.addEventListener('click', () => {
    goToStep(step2, step3);
});

// Da Fase 3 a Fase 4 (Controllo della data)
btnToStep4.addEventListener('click', () => {
    // Controllo per assicurarsi che abbia scelto un giorno
    if (!datePicker.value) {
        alert("Devi scegliere un giorno! 📅");
        return;
    }
    goToStep(step3, step4);
});


// --- 4. SCELTA CIBO E NOTIFICA DISCORD ---
foodBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Recupero dei dati inseriti
        const selectedDate = datePicker.value;
        const selectedTime = timePicker.options[timePicker.selectedIndex].text;
        const selectedFood = e.target.getAttribute('data-food'); 

        // Formattazione della data in formato italiano
        const dateObj = new Date(selectedDate);
        const formattedDate = dateObj.toLocaleDateString('it-IT', { 
            day: 'numeric', month: 'long', year: 'numeric' 
        });

        // Testo per la schermata finale visibile all'utente
        summaryText.innerHTML = `Ci vediamo il <strong>${formattedDate}</strong>, <strong>${selectedTime.toLowerCase()}</strong>.<br>Il menu prevede: <strong>${selectedFood}</strong>! 😋`;

        // ---------------------------------------------------------
        // INIZIO SEZIONE DISCORD: INSERISCI QUI IL TUO WEBHOOK
        // ---------------------------------------------------------
        const webhookURL = "https://discord.com/api/webhooks/1508568144145420421/E-PZGg3Lin4W6P39BPZ3xrMgMIJygCMzugpwUpYerFplDpYMRJwfqvDd9903qlrsH7OE";

        // Costruzione del messaggio per Discord
        const payload = {
            content: `🚨 **NUOVO APPUNTAMENTO CONFERMATO!** 🚨\n\n📅 **Quando:** ${formattedDate}\n⏰ **Ora:** ${selectedTime}\n🍕 **Cibo:** ${selectedFood}\n\n*Preparati!* 😎`
        };

        // Invio silenzioso della notifica
        fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(() => console.log("Notifica Discord inviata!"))
        .catch(err => console.error("Errore Discord:", err));
        // ---------------------------------------------------------
        // FINE SEZIONE DISCORD
        // ---------------------------------------------------------

        // Passaggio all'ultima schermata trionfale
        goToStep(step4, step5);
    });
});
