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
  const auxiliary = document.createElement("p");
  const member = document.createElement("p");
  const industry = document.createElement("p");
  const description = document.createElement("p");
  const count = document.createElement("p");
  const error = document.createElement("h3");

  companyList.id = "company-list";
  companyName.id = "content-title";

  if (company) {
    companyName.textContent = company.name;

    const auxiliaries = company.auxiliary ?? [];
    const memberships = company.membership ?? [];
    auxiliary.innerHTML = `<b>Aputoiminimet: </b>` + auxiliaries.join(', ');
    member.innerHTML = `<b>Jäsenenä: </b>` + memberships.join(', '); 

    industry.innerHTML = `<b>Toimiala: </b>` + (company.industry ?? ""); 
    description.innerHTML = `<b>Kuvaus: </b>` + (company.description ?? "");
    count.innerHTML = `<b>Aktiivisuuksien määrä: </b>` + (companyActivity.activities.length);
    error.textContent = "Yrityksellä ei aktiivisuutta";
  }

  if (companyActivity) {
    companyActivity.activities.forEach(activity => {
      const li = document.createElement("li");
      companyList.appendChild(li);
        
      const date = document.createElement("p");
      const customer = document.createElement("p");
      const project = document.createElement("p");
      const topic = document.createElement("p");
      const targets = document.createElement("p");
        
      date.innerHTML = "<b>Ilmoituspäivä: </b>" + activity.date;
      targets.innerHTML = "<b>Yhteyshenkilöiden määrä: </b>" + activity.targets.length;
        
      li.appendChild(date);
      if (activity.customer) {
        customer.innerHTML = "<b>Asiakas: </b>" + activity.customer; 
        li.appendChild(customer);
      }
      if (activity.project) {
         project.innerHTML = "<b>Osana projektia </b>" + activity.project;
        li.appendChild(project);
      }
      if (activity.topic) {
        topic.innerHTML = "<b>Aihe: </b>" + activity.topic;
        li.appendChild(topic);
      }
      li.appendChild(targets);
    })
  }

  section.appendChild(companyName);
  if (company?.auxiliary?.length > 0) section.appendChild(auxiliary);
  if (company?.industry?.length > 0) section.appendChild(industry);
  if (company?.description?.length > 0) section.appendChild(description);
  if (company?.membership?.length > 0) section.appendChild(member);
  if (companyActivity?.activities?.length === 0) section.appendChild(error);
  if (companyActivity?.activities?.length > 0) section.appendChild(count);
  section.appendChild(companyList);
  container.appendChild(section);
}