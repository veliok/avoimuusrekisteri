import { getTargetData, getActivityData } from "../main.js";

export function renderTarget(container, id) {
  const section = document.createElement("div");
  section.className = "content";

  const targetData = getTargetData();

  // Get all target ids
  const target = targetData.find(t => Array.isArray(t.id) && t.id.includes(Number(id)));
  const ids = target ? target.id : [];
  const activities = findActivities(ids);

  const targetList = document.createElement("ul");
  const targetName = document.createElement("h1");
  const organization = document.createElement("p");
  const department = document.createElement("p");
  const unit = document.createElement("p");
  const title = document.createElement("p");
  const count = document.createElement("p");
  const error = document.createElement("h3");

  targetList.id = "target-list";
  targetName.id = "content-title";

  if (target.name) targetName.textContent = target.name;

  // Filter repetitive titles and units out
  function remove(words) {
    console.log(words);
    if(words.includes("Johto") ||
       words.includes("Eduskuntaryhmä") || 
       words.includes("kansanedustaja")) return false;
    else return true; 
  };

  const organizations = target.organization.filter(remove);
  const departments = target.department.filter(remove);
  const units = target.unit.filter(remove);
  const titles = target.title.filter(remove);

  organization.innerHTML = `<b>Organisaatiot: </b>` + organizations.join(', ');
  department.innerHTML = `<b>Osastot: </b>` + departments.join(', ');
  unit.innerHTML = `<b>Yksiköt: </b>` + units.join(', ');
  title.innerHTML = `<b>Tittelit: </b>` + titles.join(', ');
  count.innerHTML = `<b>Yhteydenottojen määrä: </b>` + activities.length;
  error.textContent = "Henkilöllä ei yhteydenottoja";

  targetList.appendChild(targetName);
  targetList.appendChild(organization);
  targetList.appendChild(department);
  targetList.appendChild(unit);
  targetList.appendChild(title);
  targetList.appendChild(count);
  if (!activities) targetList.appendChild(error);

  if (activities) {
    activities.forEach(activity => {
      const li = document.createElement("li");
      targetList.appendChild(li);

      const name = document.createElement("h3");
      const date = document.createElement("p");
      const project = document.createElement("p");
      const topic = document.createElement("p");

      name.textContent = activity.companyName;
      date.innerHTML = "<b>Ilmoituspäivä: </b>" + activity.date;
      project.innerHTML = "<b>Osana projektia: </b>" + activity.project;
      topic.innerHTML = "<b>Aihe: </b>" + activity.topic;

      li.appendChild(name);
      li.appendChild(date);
      if (activity.topic) {
        topic.innerHTML = "<b>Aihe: </b>" + activity.topic;
        li.appendChild(topic);
      }
      if (activity.project) {
        project.innerHTML = "<b>Projekti: </b>" + activity.project;
        li.appendChild(project);
      }
    })
  }

  section.appendChild(targetList);
  container.appendChild(section);
}

function findActivities(id) {
  const duplicates = new Set();
  const ids = new Set(id);

  const activityData = getActivityData();

   const result = activityData.reduce((acc, company) => {
    if (!company.activities) return acc;

    company.activities.forEach(activity => {
      if (!activity.targets?.some(t => ids.has(t))) return;

      const topic = activity.topic;
      if (duplicates.has(topic)) return;
      duplicates.add(topic);

      acc.push({
        companyName: company.name,
        date: activity.date,
        project: activity.project ?? null,
        topic: activity.topic ?? null
      });
    });
    return acc;
  }, []);
  return result;
}