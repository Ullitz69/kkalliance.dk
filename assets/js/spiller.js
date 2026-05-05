const profileTextByName = {
  "Nichlas Rasmussen": "Sikker sidste skanse med fokus på placering, kommunikation og ro i feltet.",
  "Noah Anholm": "Reaktionsstærk keeper med god energi og lyst til at sætte spillet hurtigt i gang.",
  "Marcus Nøddeskov Jensen": "Stærk forsvarsspiller der går forrest i duellerne og løfter holdets intensitet.",
  "Noah Broe": "Arbejdsom defensiv spiller med god timing i både tackling og erobringsspil.",
  "Christian Høegh Jensen": "Solid i bagkæden og stærk i nærkampene, især når kampen spidser til.",
  "Jakob Kronborg Hansen": "Alsidig forsvarer med gode løb og vilje til at tage ansvar i opbygningsspillet.",
  "Viktor Gosch": "Fysisk stærk profil i forsvaret med fokus på disciplin og struktur.",
  "Rasmus Bastegaard": "Hurtig og arbejdsom spiller der bidrager med høj intensitet gennem hele kampen.",
  "Emil Boier Olsen": "Teknisk stærk spiller med gode beslutninger i pressede situationer.",
  "Simon Da Cruz": "Dynamisk spiller med offensiv vilje og mod til at udfordre direkte.",
  "Sebastian Skovhus": "Stabil defensiv kraft med blik for detaljerne i kampens nøglesituationer.",
  "Emil Ullitz": "Kreativ midtbanespiller der skaber chancer og binder holdets spil sammen centralt.",
  "Peter Qvade Rasmussen": "Kontrollerende midtbaneprofil med overblik og præcise afleveringer.",
  "Rasmus Merling": "Energisk motor på midtbanen med stort løbepensum og taktisk disciplin.",
  "Lucas Boksa": "Arbejdsom spiller med fokus på at vinde andenbolde og sætte tempo i spillet.",
  "Frederik Rune Lindqvist": "Stærk duelspiller med god balance mellem defensivt arbejde og fremdrift.",
  "Malthe Ullitz Brodersen": "Teknisk dygtig profil med blik for kombinationsspillet omkring feltet.",
  "Daniel Nøddeskov Jensen": "Direkte angriber med sult efter mål og skarphed i afslutningsspillet.",
  "Jonas Krøll": "Offensiv spiller med gode dybdeløb og stærk timing i feltet.",
  "Tobias Nøddeskov Jensen": "Arbejdsom frontspiller som presser hårdt og skaber plads til holdkammerater.",
  "Abnor Selmani": "Teknisk offensiv profil med fart i fødderne og blik for den afgørende aflevering.",
  "Rinor Selmani": "Målrettet angriber med aggressivitet i presspillet og mod i 1v1-dueller.",
  "Lucas Lorentsen": "Alsidig offensiv spiller med høj arbejdsrate og evne til at gå på mål."
};

const params = new URLSearchParams(window.location.search);
const name = params.get("name") || "Spiller";
const number = params.get("number") || "-";
const position = params.get("position") || "Spiller";

const nameEl = document.getElementById("profile-name");
const numberEl = document.getElementById("profile-number");
const positionEl = document.getElementById("profile-position");
const textEl = document.getElementById("profile-text");

if (nameEl) {
  nameEl.textContent = name;
}

if (numberEl) {
  numberEl.textContent = number === "-" ? "#-" : `#${number}`;
}

if (positionEl) {
  positionEl.textContent = position;
}

if (textEl) {
  textEl.textContent = profileTextByName[name] || "Profiltekst kommer snart. Spilleren er en vigtig del af De Blå FC og bidrager til holdets fællesskab på og uden for banen.";
}
