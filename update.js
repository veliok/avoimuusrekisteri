/*
    update.js
    Fetch data from Finnish Transparency Register api and filter it to more web usable form.

    Writes files to data/:
    companies.json  - Every company registered in the transparency register.
    targets.json    - Every target registered, consists of personnel, departments, units, etc.                 
    activities.json - List of contact activities grouped by company.

    Files home page statistics:
    company_stats.json - Sum of topics and targets contacted by company.
    target_stats.json  - Sum of companies and topics target has been contacted by.
*/
import * as fs from "fs"
import * as path from "path"

async function update() {
  const [company, targets, activity] = await Promise.all([
    fetchEndpoint("/open-data-register-notification"),
    fetchEndpoint("/open-data-target/targets"),
    fetchEndpoint("/open-data-activity-notification")
  ]);

  const companyData = filterCompanyData(company);
  const targetData = filterTargetData(targets);
  const activityData = filterActivityData(activity);
  const companyStats = makeCompanyStats(activityData);
  const targetStats = makeTargetStats(activityData, targetData);

  writeJson("companies.json", companyData);
  writeJson("targets.json", targetData);
  writeJson("activities.json", activityData);
  writeJson("company_stats.json", companyStats);
  writeJson("target_stats.json", targetStats);
}

// Create data/ if it doesn't exist and write file
async function writeJson(filename, data) {
  const dir = "data";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log("File written:", filePath);
}

async function fetchEndpoint(endpoint) {
  const url = "https://public.api.avoimuusrekisteri.fi" + endpoint;
  try {
    const response = await fetch(url);
    if (!response.ok) { throw new Error(`Response status: ${response.status}`) };
      const data = await response.json();
      console.log("Data downloaded for: ", endpoint);
      return data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

// Filter redundant data and trim company name to contain only finnish
function filterCompanyData(data) {
  const parsed = data.map(item => ({
    id: item?.companyId  || null,
    name: item.companyName?.split(/\s-\s|(?<!-),|;/)[0].trim() || null,
    industry: item.mainIndustry,
    description: item.description,
  }))

  parsed.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
  })

  return parsed;
}

// Group ids by target name and sort by name
// Data from api is structured in way that one person has multiple different ids.
function filterTargetData(data) {
  const persons = new Map();

  data.forEach(item => {
    if (item.fi.name.length > 1) {  // Group ids for named targets
      if (!persons.has(item.fi.name)) {
        persons.set(item.fi.name, {
          id: [item.id],
          organization: item.fi.organization != "-" ? [item.fi.organization] : [],
          department: item.fi.department != "-" ? [item.fi.department] : [],
          unit: item.fi.unit != "-" ? [item.fi.unit] : [],
          title: item.fi.title != "-" ? [item.fi.title] : [],
          name: item.fi.name
        });
      } else {
        const person = persons.get(item.fi.name);

        // Add organizations, departments, units and titles only once
        person.id.push(item.id);
        if (item.fi.organization != "-" && !person.organization.includes(item.fi.organization)) {
          person.organization.push(item.fi.organization);
        }
        if (item.fi.department != "-" && !person.department.includes(item.fi.department)) {
          person.department.push(item.fi.department);
        }
        if (item.fi.title != "-" && !person.title.includes(item.fi.title)) {
          person.title.push(item.fi.title);
        }
        if (item.fi.unit != "-" && !person.unit.includes(item.fi.unit)) {
          person.unit.push(item.fi.unit);
        }
      }  
    } else {  // Add targets without name - units, departments etc.
      persons.set(item.id, {
        id: item.id,
        organization: item.fi.organization != "-" ? item.fi.organization : "",
        department: item.fi.department != "-" ? item.fi.department : "",
        unit: item.fi.unit != "-" ? item.fi.unit : "",
        title: item.fi.title != "-" ? item.fi.title : "",
        name: item.fi.name != "-" ? item.fi.name : ""
      })
    }
  })

  const filteredArray = Array.from(persons.values());
  // Sort by surname
  filteredArray.sort((a, b) => {
    if (a.name.split(" ")[1] < b.name.split(" ")[1]) return -1;
    if (a.name.split(" ")[1] > b.name.split(" ")[1]) return 1;
  })
  
  return filteredArray;
}

// Group activities by company
function filterActivityData(data) {
  const activities = new Map();

  data.forEach(item => {
    const key = item.companyId || item.otherCompanyId || item.companyName;

    // Add company to map if it has activity>0, single entry for each company
    if (!activities.has(key) && item.topics.length > 0) {
      activities.set(key, {
        companyId: item.companyId || null,
        otherCompanyId: item.otherCompanyId || null,
        name: item.companyName?.split(/\s-\s|(?<!-),|;/)[0].trim() || null,
        activities: []
      });
    }

    const company = activities.get(key);
    
    // Go through each topic, add to company activities if topic has targets
    (item.topics).forEach(topic => {
      if (topic.contactedTargets.length > 0) {
        company.activities.push({
          date: item.activityNotificationDate || item.createdAt || null,
          topic: topic.contactTopicOther || null,
          project: topic.contactTopicProject?.fi || topic.contactTopicProject?.en || null,
          targets: (topic.contactedTargets).map(t => t.contactedTargetId)
        });
      }
    });
  });

  return Array.from(activities.values());
}

// Company activity and topic count
function makeCompanyStats(data) {
  const stats = data.map(item => ({
    id: item?.companyId,
    name: item.name,
    activities: item.activities.length,
    targets: item.activities.flatMap(a => a.targets || []).length
  }))

  const sorted = stats.sort((a, b) => {
    if (a.activities < b.activities) return 1;
    if (a.activities > b.activities) return -1;
  });

  return sorted;
}

// Unique topics each target has been targeted with by companies
function makeTargetStats(activityData, targetData) {
  const stats = new Map();

  targetData.forEach(target => {
    const ids = Array.isArray(target.id) ? target.id : [target.id];

    // Ensure each company and topic gets counted only once with Set
    const companies = new Set();
    const topics = new Set();

    if (target.name.length > 1) { // Do not include departments without person name
      activityData.forEach(company => {
        company.activities.forEach(activity => {
          const match = activity.targets.some(targetId => ids.includes(targetId));

          if (match) {
            companies.add(company.name);
            topics.add(JSON.stringify({
              topic: activity.topic || null,
            }));
          }
        });
      });
      
      stats.set(target.name, {
        name: target.name,
        contactCompanyCount: companies.size,
        topicCount: topics.size
      });
    }
  });
  
  const sorted = Array.from(stats.values()).sort((a, b) => {
    if (a.topicCount < b.topicCount) return 1;
    if (a.topicCount > b.topicCount) return -1;
  });

  return sorted;
}

update()