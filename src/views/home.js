import { getTargetStats, getCompanyStats } from "../main.js";

export function renderHome(container) {
  const section = document.createElement("div");
  section.className = "content-info";

  const highlight = document.createElement("div");
  const description = document.createElement("p");

  highlight.id = "highlight-box";

  description.innerHTML = `Avoimuusrekisteri kerää tietoa eduskuntaan ja ministeriöihin kohdistuvasta vaikuttamistyöstä.
  Tällä sivustolla voit tutkia avoimuusrekisterin tietoja helposti luettavassa muodossa.<br><br>
  <b>Vaikuttamiskohteet</b> on lista eduskunnan ja ministeriöiden henkilöstöstä.<br>
  <b>Vaikuttajat</b> on lista avoimuusrekisteriin rekisteröityneistä organisaatioista.<br>`

  highlight.appendChild(description);
  section.appendChild(highlight);
  container.appendChild(section);

  /*
    Statistics
  */
  const statistics_box = document.createElement("div");
  statistics_box.id = "statistics-container";
  const title = document.createElement("h1");
  const titleT = document.createElement("h2");
  const titleC = document.createElement("h2");
  title.textContent = "Suurimmat kohteet ja vaikuttajat";
  titleT.textContent = "Vaikuttamiskohteet";
  titleC.textContent = "Organisaatiot";

  const targetList = document.createElement("ul");
  const companyList = document.createElement("ul");
  targetList.id = "target-list";
  companyList.id = "company-list";

  section.appendChild(title);
  statistics_box.appendChild(targetList);
  statistics_box.appendChild(companyList);
  targetList.appendChild(titleT);
  companyList.appendChild(titleC);

  const targetStats = getTargetStats();
  const companyStats = getCompanyStats();

  // Get first 10 targets and append to targetList
  targetStats.slice(0, 10).forEach(target => {
    const li = document.createElement("li");
    targetList.appendChild(li);

    const name = document.createElement("h4");
    const company = document.createElement("p");
    const topic = document.createElement("p");

    name.textContent = target.name;
    company.innerHTML = "<b>Yhteydessä olleet toimijat: </b>" + target.contactCompanyCount;
    topic.innerHTML = "<b>Yhteydenottojen määrä: </b>" + target.topicCount;
    
    li.appendChild(name);
    li.appendChild(company);
    li.appendChild(topic);
  })

  // Get first 10 companies and append to companyList
  companyStats.slice(0, 10).forEach(company => {
    const li = document.createElement("li");
    companyList.appendChild(li);

    const name = document.createElement("h4");
    const activities = document.createElement("p");
    const targets = document.createElement("p");

    name.textContent = company.name;
    activities.innerHTML = "<b>Tapahtumailmoitusten määrä: </b>" + company.activities;
    targets.innerHTML = "<b>Vaikuttamiskohteiden määrä: </b>" + company.targets;

    li.appendChild(name);
    li.appendChild(activities);
    li.appendChild(targets);
  })

  section.appendChild(statistics_box);
  container.appendChild(section);
}