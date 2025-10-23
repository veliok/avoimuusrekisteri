import { getTargetData } from "../main.js";

export function renderTargets(container) {
  const section = document.createElement("div");
  section.className = "content";

  const title = document.createElement("h1");
  const grid = document.createElement("div");
  title.textContent = "Henkilöt";
  grid.id = "button-grid";

  const targetData = getTargetData();

  // Add only named targets to list(persons)
  targetData.forEach(target => {
    if (target.name.length > 1) {
      const targetButton = document.createElement("button");
      targetButton.textContent = target.name;

      targetButton.addEventListener("click", () => {
        window.location.hash = `#target/${target.id[0]}`;
      });

      grid.appendChild(targetButton);
    }
  })

  section.appendChild(title);
  section.appendChild(grid);
  container.appendChild(section);
}