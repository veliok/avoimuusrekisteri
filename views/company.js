import { getCompanyData, getActivityData } from "../main.js";

export function renderCompany(container, id) {
  const section = document.createElement("div");
  section.className = "content";

  const companyData = getCompanyData();
  const activityData = getActivityData();

  const company = companyData.find(company => company.id === id);
  const companyActivity = activityData.find(company => company.companyId === id);

  const companyList = document.createElement("ul");
  const companyName = document.createElement("h1");
  const industry = document.createElement("p");
  const description = document.createElement("p");
  const error = document.createElement("h3");

  companyList.id = "company-list";
  companyName.id = "content-title";
  companyName.textContent = company.name;
  industry.innerHTML = `<b>Toimiala: </b>` + (company ? company.industry : null); 
  description.innerHTML = `<b>Kuvaus: </b>` + (company ? company.description : null);
  error.textContent = "Yrityksellä ei aktiivisuutta";
  console.log(companyActivity)
  if (companyActivity) {
    companyActivity.activities.forEach(activity => {
      const li = document.createElement("li");
      companyList.appendChild(li);
        
      const date = document.createElement("p");
      const project = document.createElement("p");
      const topic = document.createElement("p");
      const targets = document.createElement("p");
        
      date.innerHTML = "<b>Ilmoituspäivä: </b>" + activity.date;
      targets.innerHTML = "<b>Yhteyshenkilöiden määrä: </b>" + activity.targets.length;
      project.innerHTML = "<b>Osana projektia: </b>" + activity.project;
      topic.innerHTML = "<b>Aihe: </b>" + activity.topic;
        
      li.appendChild(date);
      if (activity.project) li.appendChild(project);
      if (activity.topic) li.appendChild(topic);
      li.appendChild(targets);
    })
  }

  section.appendChild(companyName);
  section.appendChild(industry);
  section.appendChild(description);
  if (!companyActivity || companyActivity.activities.length === 0) section.appendChild(error);
  section.appendChild(companyList);
  container.appendChild(section);
}