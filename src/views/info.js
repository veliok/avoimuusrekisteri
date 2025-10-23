export function renderInfo(container) {
  const section = document.createElement("div");
  section.className = "content-info";

  const info_box = document.createElement("div");
  info_box.id = "info-title";
  const title = document.createElement("h1");
  const desc = document.createElement("p");
  const sub_title = document.createElement("h3");
  const sub_desc = document.createElement("p");
  const footer = document.createElement("footer");

  title.textContent = "Tietoa sivusta";
  desc.innerHTML = `Tämä sivusto hyödyntää Suomen <a href="https://avoimuusrekisteri.fi/" target="_blank">Avoimuusrekisterin</a>
      avointa rajapintaa. Palvelu kokoaa rekisteristä haetut tiedot.`;
  sub_title.textContent = "Kuka ylläpitää Avoimuusrekisteriä?";
  sub_desc.innerHTML = `Rekisterin ylläpidosta vastaa Valtiontalouden tarkastusvirasto (VTV). 
  Avoimuusrekisteristä säädetään avoimuusrekisterilaissa (430/2023).`;
  footer.innerHTML = `<a href="https://github.com/veliok/avoimuusrekisteri">github.com/veliok/avoimuusrekisteri</a>`;

  info_box.append(title, desc, sub_title, sub_desc);
  section.append(info_box);
  container.appendChild(section);
  container.appendChild(footer);
}