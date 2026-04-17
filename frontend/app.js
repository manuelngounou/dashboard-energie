// Affiche le message de bienvenue
function displayWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent = 'Visualisez vos données énergétiques !';
}

displayWelcomeMessage();

const API_URL = "http://localhost:5000";

// Charger les statistiques (total + moyenne)
async function loadStats() {
    try {
        const total = await fetch(`${API_URL}/stats/total-kwh`).then(r => r.json());
        const moyenne = await fetch(`${API_URL}/stats/moyenne-kwh`).then(r => r.json());

        document.getElementById("total-kwh").textContent = total.total_kwh ?? 0;
        document.getElementById("moyenne-kwh").textContent = moyenne.moyenne_kwh ?? 0;

    } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
    }
}

// Charger les consommations
async function loadConsommations() {
    try {
        const data = await fetch(`${API_URL}/consommations`).then(r => r.json());
        const tbody = document.getElementById("table-consommations");

        tbody.innerHTML = "";

        data.forEach(c => {
            const row = `
                <tr>
                    <td>${c.date_mesure}</td>
                    <td>${c.kwh}</td>
                    <td>${c.appareil ?? ""}</td>
                    <td>${c.commentaire ?? ""}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des consommations :", error);
    }
}

loadStats();
loadConsommations();
