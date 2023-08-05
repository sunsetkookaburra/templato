/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * @param {string} scope
 * @param {string | URL | Request} input
 * @param {RequestInit=} init
*/
export async function loadTemplates(scope, input, init) {
  const txt = await fetch(input, init).then(v => v.text());
  const doc = new DOMParser().parseFromString(txt, "text/html");
  doc.addEventListener("DOMContentLoaded", console.log);
  for (const template of doc.querySelectorAll("template")) {
    initTemplate(scope, template);
  }
}

/**
 * @param {string} scope
 * @param {HTMLTemplateElement} templateElement
 * */
export function initTemplate(scope, templateElement) {
  const tagName = templateElement.getAttribute("name");

  if (!tagName) {
    console.error(scope, templateElement);
    return;
  }

  const content = templateElement.content;
  const observe = templateElement.getAttribute("observe")?.split() ?? [];
  const scriptElement = content.querySelector("script");
  const script = new Function("shadow", "args", scriptElement.innerText);
  scriptElement.remove();

  const def = class extends HTMLElement {
    constructor(...args) {
      super();
      const shadow = this.attachShadow({ mode: templateElement.getAttribute("shadow") ?? "closed" });
      shadow.append(content.cloneNode(true));
      script.call(this, shadow, args);
    }
    static get observedAttributes() { return observe; }
  }

  const name = [
    scope, ...tagName.split("-")
  ].map(
    v => v.slice(0, 1).toUpperCase() + v.slice(1)
  ).join("");

  globalThis[name] = def;
  if (scope === "") {
    customElements.define(`${tagName}`, def);
  } else {
    customElements.define(`${scope}-${tagName}`, def);
  }
}

/** @type {Iterable<HTMLLinkElement> & NodeListOf<HTMLLinkElement>} */
const linksQuery = document.head.querySelectorAll(`link[rel="template"]`);
/** @type {Array<HTMLLinkElement>} */
const links = [];
for (let i = 0; i < linksQuery.length; ++i) {
  links.push(linksQuery[i]);
}

await Promise.all(links.map(el => {
  return loadTemplates(el.title, el.href);
}))
