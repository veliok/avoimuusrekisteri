import { getTargetData, getActivityData } from "../main.js";

export function renderTarget(container, id) {
  const section = document.createElement("div");
  section.className = "content";

  const targetData = getTargetData();

  // Get all target ids
  const target = targetData.find(t => Array.isArray(t.id) && t.id.includes(Number(id)));
  // Case where target is not found
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

  if (target?.name) targetName.textContent = target.name;

  // Filter repetitive titles and units out
  function customFilter(words) {
    if (!Array.isArray(words)) return [];
    let result = new Set();

    for (const word of words) {
      if (word.includes(", kansanedustaja")) {
        result.add(word.split(",")[0].trim());
        result.add("Kansanedustaja");
      } else if (word.includes("Johto") || word.includes("Eduskuntaryhmä")) {
        continue;
      } else result.add(word);
    }

    return [...result]; 
  }

  const organizations = customFilter(target?.organization);
  const departments = customFilter(target?.department);
  const units = customFilter(target?.unit);
  const titles = customFilter(target?.title);

  organization.innerHTML = `<b>Organisaatiot: </b>` + organizations.join(', ');
  department.innerHTML = `<b>Osastot: </b>` + departments.join(', ');
  unit.innerHTML = `<b>Yksiköt: </b>` + units.join(', ');
  title.innerHTML = `<b>Tittelit: </b>` + titles.join(', ');
  count.innerHTML = `<b>Yhteydenottojen määrä: </b>` + activities.length;
  error.textContent = "Henkilöllä ei yhteydenottoja";

  targetList.appendChild(targetName);

  // Display elements only if there is data
  if (organizations.length > 0) targetList.appendChild(organization);
  if (departments.length > 0) targetList.appendChild(department);
  if (units.length > 0) targetList.appendChild(unit);
  if (titles.length > 0) targetList.appendChild(title);
  targetList.appendChild(count);
  if (activities.length === 0) targetList.appendChild(error);

  // Make list from activities
  activities.forEach(activity => {
    const li = document.createElement("li");
    targetList.appendChild(li);

    const name = document.createElement("h3");
    const customer = document.createElement("p");
    const date = document.createElement("p");
    const project = document.createElement("p");
    const topic = document.createElement("p");

    name.textContent = activity.companyName;
    date.innerHTML = "<b>Ilmoituspäivä: </b>" + activity.date;

    li.appendChild(name);
    li.appendChild(date);

    if (activity.customer) {
      customer.innerHTML = "<b>Asiakas: </b>" + activity.customer;
      li.appendChild(customer);
    }
    if (activity.topic) {
      topic.innerHTML = "<b>Aihe: </b>" + activity.topic;
      li.appendChild(topic);
    }
    if (activity.project) {
      project.innerHTML = "<b>Osana projektia: </b>" + activity.project;
      li.appendChild(project);
    }
  });

  section.appendChild(targetList);
  container.appendChild(section);
}

function findActivities(id) {
  // Since target has multiple ids, the same topic can appear multiple times for the same target
  // Detect duplicate topics for target
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
        customer: activity.customer ?? null,
        topic: activity.topic ?? null
      });
    });
    return acc;
  }, []);
  return result;
}