'use strict';

var index = require('./index-b6623f8c.js');
require('react');
import basicPlugin from 'grapesjs-blocks-basic';
import swiperPlugin from './swiper'

const txtConfirm = "Are you sure you want to clear the editor? This can't be undone.";
const themeList = [
  { name: "indigo", color: "#6366f1" },
  { name: "yellow", color: "#f59e0b" },
  { name: "red", color: "#f56565" },
  { name: "purple", color: "#9f7aea" },
  { name: "pink", color: "#ed64a6" },
  { name: "blue", color: "#4299e1" },
  { name: "green", color: "#48bb78" }
];
const colorRegex = new RegExp(/(bg|text|border|ring)-(red|yellow|green|blue|indigo|purple|green)-(\d\d\d)/, "g");
const getUpdateThemeModal = (editor) => {
  const md = editor.Modal;
  const pfx = editor.getConfig().stylePrefix;
  const container = document.createElement("div");
  const containerBody = document.createElement("div");
  containerBody.style.padding = "40px 0px";
  containerBody.style.display = "flex";
  containerBody.style.justifyContent = "center";
  let selectedTheme;
  themeList.forEach((theme) => {
    const btnColor = document.createElement("button");
    btnColor.className = "change-theme-button";
    btnColor.style.backgroundColor = theme.color;
    btnColor.onclick = () => selectedTheme = theme;
    containerBody.appendChild(btnColor);
  });
  const containerFooter = document.createElement("div");
  const btnEdit = document.createElement("button");
  btnEdit.innerHTML = "Update";
  btnEdit.className = pfx + "btn-prim " + pfx + "btn-import";
  btnEdit.style.float = "right";
  btnEdit.onclick = () => {
    updateThemeColor(editor, selectedTheme.name);
    md.close();
  };
  const btnCancel = document.createElement("button");
  btnCancel.innerHTML = "Cancel";
  btnCancel.className = pfx + "btn-prim " + pfx + "btn-import";
  btnCancel.style.float = "right";
  btnCancel.onclick = () => {
    md.close();
  };
  containerFooter.appendChild(btnEdit);
  containerFooter.appendChild(btnCancel);
  container.appendChild(containerBody);
  container.appendChild(containerFooter);
  return container;
};
const getAllComponents = (model, result = []) => {
  result.push(model);
  model.components().each((mod) => getAllComponents(mod, result));
  return result;
};
const updateThemeColor = (editor, color) => {
  const wrapper = editor.DomComponents.getWrapper();
  const componentsAll = getAllComponents(wrapper, []);
  componentsAll.forEach((c) => {
    var _a, _b;
    const { el } = c.view;
    if (typeof ((_a = el.className) == null ? void 0 : _a.baseVal) === "string" && ((_b = el.className) == null ? void 0 : _b.baseVal.match(colorRegex))) {
      el.className.baseVal = el.className.baseVal.replace(colorRegex, `$1-${color}-$3`);
      c.replaceWith(el.outerHTML);
    } else if (typeof el.className === "string" && el.className.match(colorRegex)) {
      el.className = el.className.replace(colorRegex, `$1-${color}-$3`);
      c.replaceWith(el.outerHTML);
    }
  });
};
const loadPanels = (editor, isDev) => {
  editor.on("component:selected", () => {
    const openSmBtn = editor.Panels.getButton("views", "open-sm");
    const openLayersBtn = editor.Panels.getButton("views", "open-layers");
    if ((!openLayersBtn || !openLayersBtn.get("active")) && editor.getSelected()) {
      openSmBtn && openSmBtn.set("active", 1);
    }
  });
  editor.on("load", () => {
    const blockBtn = editor.Panels.getButton("views", "open-blocks");
    blockBtn.set("active", 1);
  });
  editor.Commands.add("set-device-desktop", (e) => e.setDevice("Desktop"));
  editor.Commands.add("set-device-tablet", (e) => e.setDevice("Tablet"));
  editor.Commands.add("set-device-mobile", (e) => e.setDevice("Mobile portrait"));
  editor.Commands.add("canvas-clear", (e) => confirm(txtConfirm) && e.runCommand("core:canvas-clear"));
  const devicePanel = editor.Panels.getPanel("commands");
  devicePanel.get("buttons").add([
    { id: "deviceDesktop", command: "set-device-desktop", className: "fa fa-desktop" },
    { id: "deviceTablet", command: "set-device-tablet", className: "fa fa-tablet" },
    { id: "deviceMobile", command: "set-device-mobile", className: "fa fa-mobile" }
  ]);
  editor.Panels.removeButton("options", "export-template");
  editor.Panels.getButton("options", "sw-visibility").set("active", false);
  // if (!isDev)
    // editor.Panels.addButton("options", {
    //   id: "export-template",
    //   className: "fa fa-code",
    //   command: (e) => e.runCommand("export-template"),
    //   attributes: { title: "View Code" }
    // });
  editor.Panels.addButton("options", {
    id: "undo",
    className: "fa fa-undo",
    command: (e) => e.runCommand("core:undo"),
    attributes: { title: "Undo" }
  });
  editor.Panels.addButton("options", {
    id: "redo",
    className: "fa fa-repeat",
    command: "core:redo",
    attributes: { title: "Redo" }
  });
  // editor.Panels.addButton("options", {
  //   id: "update-theme",
  //   className: "fa fa-wrench",
  //   command: "open-update-theme",
  //   attributes: {
  //     title: "About",
  //     "data-tooltip-pos": "bottom"
  //   }
  // });
  editor.Panels.addButton("options", {
    id: "canvas-clear",
    className: "fa fa-trash",
    command: (e) => e.runCommand("canvas-clear")
  });
  editor.Panels.removeButton("options", "fullscreen");
  editor.Commands.add("open-update-theme", {
    run(_, sender) {
      sender.set("active", 0);
      const md = editor.Modal;
      md.setTitle("Change Theme");
      const container = getUpdateThemeModal(editor);
      md.setContent(container);
      md.open();
    }
  });
};

const isPath = require("is-svg-path");
const typeForm = "form";
const typeInput = "input";
const typeTextarea = "textarea";
const typeSelect = "select";
const typeCheckbox = "checkbox";
const typeRadio = "radio";
const typeButton = "button";
const typeLabel = "label";
const typeOption = "option";
const svgImage = "svg";
const fixAppearanceStyle = "-webkit-appearance: auto; -moz-appearance: none; appearance: auto;";
function loadFormComponents(editor) {
  const domc = editor.DomComponents;
  const idTrait = {
    name: "id"
  };
  const forTrait = {
    name: "for"
  };
  const nameTrait = {
    name: "name"
  };
  const placeholderTrait = {
    name: "placeholder"
  };
  const valueTrait = {
    name: "value"
  };
  const requiredTrait = {
    type: "checkbox",
    name: "required"
  };
  const checkedTrait = {
    type: "checkbox",
    name: "checked"
  };
  domc.addType(typeForm, {
    isComponent: (el) => el.tagName == "FORM",
    model: {
      defaults: {
        tagName: "form",
        droppable: ":not(form)",
        draggable: ":not(form)",
        attributes: { method: "get" },
        traits: [
          {
            type: "select",
            name: "method",
            options: [
              { value: "get", name: "GET" },
              { value: "post", name: "POST" }
            ]
          },
          {
            name: "action",
            placeholder: "Insert URL"
          },
          {
            type: "form-next",
            name: "form",
            label: "New form"
          }
        ]
      }
    },
    view: {
      events: {
        submit: (e) => e.preventDefault()
      }
    }
  });
  domc.addType(typeInput, {
    isComponent: (el) => el.tagName == "INPUT",
    model: {
      defaults: {
        tagName: "input",
        draggable: "form, form *",
        droppable: false,
        highlightable: false,
        attributes: { type: "text" },
        traits: [
          nameTrait,
          placeholderTrait,
          {
            type: "select",
            name: "type",
            options: [
              { value: "text" },
              { value: "email" },
              { value: "password" },
              { value: "number" }
            ]
          },
          requiredTrait
        ]
      }
    },
    extendFnView: ["updateAttributes"],
    view: {
      updateAttributes() {
        this.el.setAttribute("autocomplete", "off");
      }
    }
  });
  domc.addType(typeTextarea, {
    extend: typeInput,
    isComponent: (el) => el.tagName == "TEXTAREA",
    model: {
      defaults: {
        tagName: "textarea",
        attributes: {},
        traits: [nameTrait, placeholderTrait, requiredTrait]
      }
    }
  });
  domc.addType(typeOption, {
    isComponent: (el) => el.tagName == "OPTION",
    model: {
      defaults: {
        tagName: "option",
        layerable: false,
        droppable: false,
        draggable: false,
        highlightable: false
      }
    }
  });
  const createOption = (value, name) => ({
    type: typeOption,
    components: name,
    attributes: { value }
  });
  domc.addType(typeSelect, {
    extend: typeInput,
    isComponent: (el) => el.tagName == "SELECT",
    model: {
      defaults: {
        tagName: "select",
        components: [createOption("opt1", "Option 1"), createOption("opt2", "Option 2")],
        traits: [
          nameTrait,
          {
            name: "options",
            type: "select-options"
          },
          requiredTrait
        ]
      }
    },
    view: {
      events: {
        mousedown: (e) => e.preventDefault()
      }
    }
  });
  domc.addType(typeCheckbox, {
    extend: typeInput,
    isComponent: (el) => el.tagName == "INPUT" && el.type == "checkbox",
    model: {
      defaults: {
        copyable: false,
        attributes: { type: "checkbox" },
        traits: [idTrait, nameTrait, valueTrait, requiredTrait, checkedTrait]
      }
    },
    view: {
      events: {
        click: (e) => e.preventDefault()
      },
      init() {
        this.listenTo(this.model, "change:attributes:checked", this.handleChecked);
      },
      handleChecked() {
        this.el.checked = !!this.model.get("attributes").checked;
      }
    }
  });
  domc.addType(typeRadio, {
    extend: typeCheckbox,
    isComponent: (el) => el.tagName == "INPUT" && el.type == "radio",
    model: {
      defaults: {
        attributes: { type: "radio" }
      }
    }
  });
  domc.addType(typeButton, {
    extend: typeInput,
    isComponent: (el) => el.tagName == "BUTTON",
    model: {
      defaults: {
        tagName: "button",
        attributes: { type: "button" },
        traits: [
          {
            name: "text",
            changeProp: true
          },
          {
            type: "button-next",
            name: "button",
            label: "New button"
          }
        ]
      },
      init() {
        const comps = this.components();
        const tChild = comps.length === 1 && comps.models[0];
        const chCnt = tChild && tChild.is("textnode") && tChild.get("content") || "";
        const text = chCnt || this.get("text");
        this.set({ text });
        this.on("change:text", this.__onTextChange);
        text !== chCnt && this.__onTextChange();
      },
      __onTextChange() {
        this.components(this.get("text"));
      }
    },
    view: {
      events: {
        click: (e) => e.preventDefault()
      }
    }
  });
  domc.addType(typeLabel, {
    extend: "text",
    isComponent: (el) => el.tagName == "LABEL",
    model: {
      defaults: {
        tagName: "label",
        components: "Label",
        traits: [forTrait]
      }
    }
  });
  domc.addType(svgImage, {
    model: {
      defaults: {
        tagName: "svg",
        components: "Svg",
        traits: [
          {
            name: "viewBox"
          },
          {
            name: "stroke"
          },
          {
            name: "stroke-width"
          },
          {
            type: "svg-next",
            name: "svg",
            label: "Path"
          }
        ]
      }
    }
  });
  domc.addType("link", {
    model: {
      defaults: {
        traits: [
          {
            type: "href-next",
            name: "href",
            label: "New href"
          }
        ]
      }
    }
  });
  domc.addType("icon", {
    model: {
      defaults: {
        tagName: "i",
        attributes: { class: "fa-solid fa-icons" },
        traits: [
          {
            type: "text",
            name: "class",
            label: "Icon"
          }
        ]
      }
    }
  });
  const trtm = editor.TraitManager;
  trtm.addType("href-next", {
    noLabel: true,
    createInput() {
      const el = document.createElement("div");
      el.style.backgroundColor = "white";
      el.innerHTML = `
        <select class="href-next__type" style="background-color: #f1f1f1; margin-bottom: 10px; ${fixAppearanceStyle}">
          <option value="url">URL</option>
          <option value="email">Email</option>
        </select>
        <div class="href-next__url-inputs" style="background-color: #f1f1f1; margin-bottom: 10px;">
          <input class="href-next__url" placeholder="Insert URL"/>
        </div>
        <div class="href-next__email-inputs" style="background-color: #f1f1f1;">
          <input class="href-next__email" placeholder="Insert email"/>
        </div>
        <div class="href-next__newtab-inputs">
          <input style="width: auto; ${fixAppearanceStyle}" class="href-next__newtab" type="checkbox">
          <label> Open in "New Tab"</label>
        </div>
      `;
      const inputsUrl = el.querySelector(".href-next__url-inputs");
      const inputsEmail = el.querySelector(".href-next__email-inputs");
      const inputType = el.querySelector(".href-next__type");
      const inputNewTab = el.querySelector(".href-next__newtab-inputs");
      inputType.addEventListener("change", (ev) => {
        switch (ev.target.value) {
          case "url":
            inputsUrl.style.display = "";
            inputsEmail.style.display = "none";
            inputNewTab.style.display = "";
            break;
          case "email":
            inputsUrl.style.display = "none";
            inputsEmail.style.display = "";
            inputNewTab.style.display = "none";
            break;
        }
      });
      return el;
    },
    onEvent({ elInput, component }) {
      const inputType = elInput.querySelector(".href-next__type");
      let href = "";
      switch (inputType.value) {
        case "url":
          const valUrl = elInput.querySelector(".href-next__url").value;
          href = valUrl;
          const valIsNewTab = elInput.querySelector(".href-next__newtab").checked;
          if (valIsNewTab) {
            component.addAttributes({ target: "_blank" });
          } else {
            component.removeAttributes("target");
          }
          break;
        case "email":
          const valEmail = elInput.querySelector(".href-next__email").value;
          href = `mailto:${valEmail}`;
          break;
      }
      component.addAttributes({ href });
    },
    onUpdate({ elInput, component }) {
      const href = component.getAttributes().href || "";
      const inputType = elInput.querySelector(".href-next__type");
      let type = "url";
      const valIsNewTab = elInput.querySelector(".href-next__newtab");
      if (href.indexOf("mailto:") === 0) {
        const inputEmail = elInput.querySelector(".href-next__email");
        const mailTo = href.replace("mailto:", "").split("?");
        const email = mailTo[0];
        type = "email";
        inputEmail.value = email || "";
      } else {
        elInput.querySelector(".href-next__url").value = href;
      }
      valIsNewTab.checked = component.getAttributes().target === "_blank";
      inputType.value = type;
      inputType.dispatchEvent(new CustomEvent("change"));
    }
  });
  const onClickButtonClear = (src) => `const run = (e) => {
      if (e.target.getAttribute('data-gjs-type') !== 'button') {
        ${src}
      }
    };
    run(arguments[0])
  `;
  trtm.addType("button-next", {
    noLabel: true,
    createInput({ trait }) {
      const el = document.createElement("div");
      el.style.backgroundColor = "white";
      el.innerHTML = `
        <select class="button-next__type" style="background-color: #f1f1f1; margin-bottom: 10px; ${fixAppearanceStyle}">
          <option value="url">URL</option>
          <option value="email">Email</option>
          <option value="submit">Submit</option>
        </select>
        <div class="button-next__url-inputs" style="background-color: #f1f1f1; margin-bottom: 10px;">
          <input class="button-next__url" placeholder="Insert URL"/>
        </div>
        <div class="button-next__email-inputs" style="background-color: #f1f1f1;">
          <input class="button-next__email" placeholder="Insert email"/>
        </div>
        
        <div class="button-next__newtab-inputs" style="margin-bottom: 10px;">
          <input style="width: auto; ${fixAppearanceStyle}" class="button-next__newtab" type="checkbox">
          <label> Open in "New Tab"</label>
        </div>
      `;
      const inputType = el.querySelector(".button-next__type");
      const inputsUrl = el.querySelector(".button-next__url-inputs");
      inputsUrl.style.display = "";
      const inputsEmail = el.querySelector(".button-next__email-inputs");
      inputsEmail.style.display = "none";
      const inputNewTab = el.querySelector(".button-next__newtab-inputs");
      inputNewTab.style.display = "";
      inputType.addEventListener("change", (ev) => {
        const type = ev.target.value;
        switch (type) {
          case "url":
            inputsUrl.style.display = "";
            inputsEmail.style.display = "none";
            inputNewTab.style.display = "";
            break;
          case "email":
            inputsUrl.style.display = "none";
            inputsEmail.style.display = "";
            inputNewTab.style.display = "none";
            break;
          case "submit":
            inputsUrl.style.display = "none";
            inputsEmail.style.display = "none";
            inputNewTab.style.display = "none";
            break;
        }
      });
      return el;
    },
    onEvent({ elInput, component }) {
      const inputType = elInput.querySelector(".button-next__type");
      let onClickSrc = "";
      switch (inputType.value) {
        case "url":
          const valUrl = elInput.querySelector(".button-next__url").value;
          const valIsNewTab = elInput.querySelector(".button-next__newtab").checked;
          onClickSrc = valIsNewTab ? `window.open('${valUrl}', '_blank')?.focus()` : `location.href = "${valUrl}"`;
          component.addAttributes({ type: "button" });
          component.addAttributes({ "data-gjs-sub-type": "url" });
          component.addAttributes({ "data-gjs-url": valUrl });
          component.addAttributes({ "data-gjs-new-tab": valIsNewTab });
          component.removeAttributes("data-gjs-email");
          component.addAttributes({ onclick: onClickButtonClear(onClickSrc) });
          break;
        case "email":
          const valEmail = elInput.querySelector(".button-next__email").value;
          onClickSrc = `location.href = "mailto:${valEmail}"`;
          component.addAttributes({ type: "button" });
          component.addAttributes({ "data-gjs-sub-type": "email" });
          component.addAttributes({ "data-gjs-email": valEmail });
          component.removeAttributes("data-gjs-url");
          component.removeAttributes("data-gjs-new-tab");
          component.addAttributes({ onclick: onClickButtonClear(onClickSrc) });
          break;
        case "submit":
          component.addAttributes({ type: "submit" });
          component.addAttributes({ "data-gjs-sub-type": "submit" });
          component.removeAttributes("data-gjs-email");
          component.removeAttributes("data-gjs-url");
          component.removeAttributes("data-gjs-new-tab");
          component.removeAttributes("onclick");
          break;
      }
    },
    onUpdate({ elInput, component }) {
      const attrs = component.getAttributes();
      const type = attrs["data-gjs-sub-type"];
      const inputType = elInput.querySelector(".button-next__type");
      if (type === "url") {
        const inputUrl = elInput.querySelector(".button-next__url");
        const url = attrs["data-gjs-url"];
        inputUrl.value = url || "";
        const inputNewTab = elInput.querySelector(".button-next__newtab");
        const newTab = attrs["data-gjs-new-tab"];
        inputNewTab.checked = newTab || false;
      } else if (type === "email") {
        const inputEmail = elInput.querySelector(".button-next__email");
        const email = attrs["data-gjs-email"];
        inputEmail.value = email || "";
      }
      inputType.value = type || "url";
      inputType.dispatchEvent(new CustomEvent("change"));
    }
  });
  trtm.addType("svg-next", {
    noLabel: true,
    createInput() {
      const el = document.createElement("div");
      el.style.backgroundColor = "white";
      el.innerHTML = `
        <div class="svg-next__svg-inputs" style="background-color: #f1f1f1;">
          <input class="svg-next__svg" placeholder="Path"/>
        </div>
      `;
      return el;
    },
    onEvent({ elInput, component }) {
      const newPath = elInput.querySelector(".svg-next__svg").value;
      if (newPath === "" || !isPath(newPath))
        return;
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(component.toHTML(), "text/html");
      const pathEl = htmlDoc.querySelector("path");
      pathEl == null ? void 0 : pathEl.setAttribute("d", newPath);
      pathEl == null ? void 0 : pathEl.setAttribute("data-gjs-type", "svg-in");
      pathEl == null ? void 0 : pathEl.setAttribute("draggable", "true");
      component.replaceWith(htmlDoc.body.innerHTML);
    },
    onUpdate({ elInput, component }) {
      var _a;
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(component.toHTML(), "text/html");
      const path = (_a = htmlDoc.querySelector("path")) == null ? void 0 : _a.getAttribute("d");
      elInput.querySelector(".svg-next__svg").value = path;
    }
  });
  trtm.addType("form-next", {
    noLabel: true,
    createInput() {
      const el = document.createElement("div");
      el.style.backgroundColor = "white";
      el.innerHTML = `
        <div>
          <input style="width: auto; ${fixAppearanceStyle}" class="form-next__async" type="checkbox">
          <label> Async</label>
        </div>
      `;
      return el;
    },
    onEvent({ elInput, component }) {
      const valIsAsync = elInput.querySelector(".form-next__async").checked;
      component.addAttributes({ "data-gjs-async": valIsAsync });
      const content = valIsAsync ? `
          e.preventDefault()

          const params = new URLSearchParams()
          const body = new FormData(e.target)
          body.forEach(([f, v]) => params.append(f, v))

          const action = e.target.getAttribute('action')
          const method = e.target.getAttribute('method')

          fetch(action, { method, ...(method.toUpperCase() !== 'GET' ? {body} : {}) })            
            .then((e) =>  e.text().then(d => ({ok: e.ok, text: d})))
            .then(({ok, text}) => {
              let message = ok ? 'All good' : 'Something went wrong'
              let type = ok ? 'info' : 'error'
              try {
                const data = JSON.parse(text)
                if (data.message) message = data.message
              } catch(err) {}
              document.dispatchEvent(new CustomEvent('toast', {detail: {message, type}}))
            })

            for (let el of e.target.elements) el.value = null

        ` : `
          for (let el of e.target.elements) el.value = null

          e.preventDefault()
          e.target.submit()
        `;
      const onClickSrc = `
        const run = (e) => {
          ${content}
        };
        run(arguments[0])
      `;
      component.addAttributes({ onsubmit: onClickSrc });
    },
    onUpdate({ elInput, component }) {
      const attrs = component.getAttributes();
      const inputAsync = elInput.querySelector(".form-next__async");
      const isAsync = attrs["data-gjs-async"];
      inputAsync.checked = isAsync || "";
    }
  });
}

function loadTraits(editor) {
  const trm = editor.TraitManager;
  trm.addType("select-options", {
    events: {
      keyup: "onChange"
    },
    onValueChange() {
      const { model, target } = this;
      const optionsStr = model.get("value").trim();
      const options = optionsStr.split("\n");
      const optComps = new Array();
      for (let i = 0; i < options.length; i++) {
        const optionStr = options[i];
        const option = optionStr.split("::");
        optComps.push({
          type: typeOption,
          components: option[1] || option[0],
          attributes: { value: option[0] }
        });
      }
      target.components().reset(optComps);
      target.view.render();
    },
    getInputEl() {
      if (!this.$input) {
        const optionsArr = new Array();
        const options = this.target.components();
        for (let i = 0; i < options.length; i++) {
          const option = options.models[i];
          const optAttr = option.get("attributes");
          const optValue = optAttr.value || "";
          const optTxtNode = option.components().models[0];
          const optLabel = optTxtNode && optTxtNode.get("content") || "";
          optionsArr.push(`${optValue}::${optLabel}`);
        }
        this.$input = document.createElement("textarea");
        this.$input.value = optionsArr.join("\n");
      }
      return this.$input;
    }
  });
}

function loadComponents(editor) {
  loadFormComponents(editor);
}

function b5s$1() {
  return (new DOMParser().parseFromString(`<svg viewBox="0 0 24 24" style="transform: scale(0.5);height: 50px;">
  <path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z"></path>
</svg>`, 'image/svg+xml')).firstChild;
}

function b6s() {
  return (new DOMParser().parseFromString(`<svg viewBox="0 0 24 24" style="transform: scale(0.5);height: 50px;">
  <path fill="currentColor" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"></path>
</svg>`, 'image/svg+xml')).firstChild;
}

function b7s() {
  return (new DOMParser().parseFromString(`
    <svg viewBox="0 0 24 24" style="transform: scale(0.5);height: 50px;">
      <path fill="currentColor" d="M20.5,3L20.34,3.03L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21L3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19.03 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3M10,5.47L14,6.87V18.53L10,17.13V5.47M5,6.46L8,5.45V17.15L5,18.31V6.46M19,17.54L16,18.55V6.86L19,5.7V17.54Z"></path>
    </svg>
  `, 'image/svg+xml')).firstChild;
}

function b8s() {
  return (new DOMParser().parseFromString(`
  <svg viewBox="0 0 24 24" style="transform: scale(0.5);height: 50px;">
    <path fill="currentColor" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z"></path>
  </svg>
  `, 'image/svg+xml')).firstChild;
}

function b9s() {
  return (new DOMParser().parseFromString(`<svg viewBox=\"0 0 24 24\" style="transform: scale(0.5);height: 50px;">
  <path fill="currentColor" d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"></path>
</svg>`, 'image/svg+xml')).firstChild;
}

function loadBasicBlocks(editor, opt = {}) {
  let bm = editor.BlockManager;
  const category = { label: "Basic", order: 0, open: false };
  bm.add("text", {
    label: "Text",
    media: index.getSvgHtml(b8s),
    category,
    content: {
      type: "text",
      content: "Insert your text here",
      style: { padding: "10px" },
      activeOnRender: 1
    }
  });
  bm.add("link", {
    label: "Link",
    media: index.getSvgHtml(b6s),
    category,
    content: {
      type: "link",
      content: "Link",
      style: { color: "#6366f1" }
    }
  });
  bm.add("image", {
    label: "Image",
    media: index.getSvgHtml(b5s$1),
    category,
    content: {
      style: { color: "black" },
      type: "image",
      activeOnRender: 1
    }
  });
  bm.add("video", {
    label: "Video",
    media: index.getSvgHtml(b9s),
    category,
    content: {
      type: "video",
      src: "img/video2.webm",
      style: {
        height: "350px",
        width: "615px"
      }
    }
  });
  bm.add("map", {
    label: "Map",
    media: index.getSvgHtml(b7s),
    category,
    content: {
      type: "map",
      style: { height: "350px" }
    }
  });
  bm.add("icon", {
    label: "Icon",
    category,
    content: {
      type: "icon",
    }
  });
}

const source$Z = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap -m-4">
      <div class="p-4 lg:w-1/3">
        <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
          <h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
          <h1 class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Raclette Blueberry Nextious Level</h1>
          <p class="leading-relaxed mb-3">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
          <a class="text-indigo-500 inline-flex items-center">Learn More
            <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
          <div class="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
            <span class="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
              <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>1.2K
            </span>
            <span class="text-gray-400 inline-flex items-center leading-none text-sm">
              <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
              </svg>6
            </span>
          </div>
        </div>
      </div>
      <div class="p-4 lg:w-1/3">
        <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
          <h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
          <h1 class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Ennui Snackwave Thundercats</h1>
          <p class="leading-relaxed mb-3">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
          <a class="text-indigo-500 inline-flex items-center">Learn More
            <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
          <div class="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
            <span class="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
              <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>1.2K
            </span>
            <span class="text-gray-400 inline-flex items-center leading-none text-sm">
              <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
              </svg>6
            </span>
          </div>
        </div>
      </div>
      <div class="p-4 lg:w-1/3">
        <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
          <h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
          <h1 class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Selvage Poke Waistcoat Godard</h1>
          <p class="leading-relaxed mb-3">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
          <a class="text-indigo-500 inline-flex items-center">Learn More
            <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
          <div class="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
            <span class="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
              <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>1.2K
            </span>
            <span class="text-gray-400 inline-flex items-center leading-none text-sm">
              <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
              </svg>6
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  `;

function b1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"20\" y=\"43\" width=\"68\" height=\"63\" rx=\"2\" fill=\"#E2E8F0\"></rect><path d=\"M29 73a1 1 0 011-1h48a1 1 0 110 2H30a1 1 0 01-1-1zM33 78a1 1 0 011-1h40a1 1 0 110 2H34a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M48 83a1 1 0 011-1h11a1 1 0 110 2H49a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><path d=\"M37 67.5a1.5 1.5 0 011.5-1.5h32a1.5 1.5 0 010 3h-32a1.5 1.5 0 01-1.5-1.5z\" fill=\"#4A5568\"></path><rect x=\"99\" y=\"43\" width=\"68\" height=\"63\" rx=\"2\" fill=\"#E2E8F0\"></rect><path d=\"M108 73a1 1 0 011-1h48a1 1 0 010 2h-48a1 1 0 01-1-1zM112 78a1 1 0 011-1h40a1 1 0 010 2h-40a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M127 83a1 1 0 011-1h11a1 1 0 010 2h-11a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><path d=\"M116 67.5a1.5 1.5 0 011.5-1.5h32a1.5 1.5 0 010 3h-32a1.5 1.5 0 01-1.5-1.5z\" fill=\"#4A5568\"></path><rect x=\"178\" y=\"43\" width=\"68\" height=\"63\" rx=\"2\" fill=\"#E2E8F0\"></rect><path d=\"M187 73a1 1 0 011-1h48a1 1 0 010 2h-48a1 1 0 01-1-1zM191 78a1 1 0 011-1h40a1 1 0 010 2h-40a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M206 83a1 1 0 011-1h11a1 1 0 010 2h-11a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><path d=\"M195 67.5a1.5 1.5 0 011.5-1.5h32a1.5 1.5 0 010 3h-32a1.5 1.5 0 01-1.5-1.5z\" fill=\"#4A5568\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$Y = `
<section class="text-gray-600 body-font">
    <div class="container px-5 py-24 mx-auto">
      <div class="flex flex-wrap -m-4">
        <div class="p-4 md:w-1/3">
          <div class="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
            <img class="lg:h-48 md:h-36 w-full object-cover object-center" src="https://dummyimage.com/720x400" alt="blog">
            <div class="p-6">
              <h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
              <h1 class="title-font text-lg font-medium text-gray-900 mb-3">The Catalyzer</h1>
              <p class="leading-relaxed mb-3">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
              <div class="flex items-center flex-wrap ">
                <a class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">Learn More
                  <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </a>
                <span class="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                  <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>1.2K
                </span>
                <span class="text-gray-400 inline-flex items-center leading-none text-sm">
                  <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                  </svg>6
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 md:w-1/3">
          <div class="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
            <img class="lg:h-48 md:h-36 w-full object-cover object-center" src="https://dummyimage.com/721x401" alt="blog">
            <div class="p-6">
              <h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
              <h1 class="title-font text-lg font-medium text-gray-900 mb-3">The 400 Blows</h1>
              <p class="leading-relaxed mb-3">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
              <div class="flex items-center flex-wrap">
                <a class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">Learn More
                  <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </a>
                <span class="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                  <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>1.2K
                </span>
                <span class="text-gray-400 inline-flex items-center leading-none text-sm">
                  <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                  </svg>6
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 md:w-1/3">
          <div class="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
            <img class="lg:h-48 md:h-36 w-full object-cover object-center" src="https://dummyimage.com/722x402" alt="blog">
            <div class="p-6">
              <h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
              <h1 class="title-font text-lg font-medium text-gray-900 mb-3">Shooting Stars</h1>
              <p class="leading-relaxed mb-3">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
              <div class="flex items-center flex-wrap ">
                <a class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">Learn More
                  <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                  </svg>
                </a>
                <span class="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                  <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>1.2K
                </span>
                <span class="text-gray-400 inline-flex items-center leading-none text-sm">
                  <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                  </svg>6
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;

function b2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"20.5\" y=\"43.5\" width=\"67\" height=\"62\" rx=\"1.5\" fill=\"#FFFFFF\" stroke=\"#CBD5E0\"></rect><path d=\"M48.556 69h10.888c.86 0 1.556-.696 1.556-1.556V56.556c0-.86-.696-1.556-1.556-1.556H48.556c-.86 0-1.556.696-1.556 1.556v10.888c0 .86.696 1.556 1.556 1.556zm0 0l8.555-8.556L61 64.334m-8.556-5.056a1.167 1.167 0 11-2.333 0 1.167 1.167 0 012.333 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.2px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><path d=\"M26 88a1 1 0 011-1h48a1 1 0 110 2H27a1 1 0 01-1-1zM26 93a1 1 0 011-1h40a1 1 0 110 2H27a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M26 98a1 1 0 011-1h11a1 1 0 110 2H27a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><path d=\"M26 82.5a1.5 1.5 0 011.5-1.5h32a1.5 1.5 0 010 3h-32a1.5 1.5 0 01-1.5-1.5z\" fill=\"#4A5568\"></path><rect x=\"99.5\" y=\"43.5\" width=\"67\" height=\"62\" rx=\"1.5\" fill=\"#FFFFFF\" stroke=\"#CBD5E0\"></rect><path d=\"M127.556 69h10.888c.86 0 1.556-.696 1.556-1.556V56.556c0-.86-.696-1.556-1.556-1.556h-10.888c-.86 0-1.556.696-1.556 1.556v10.888c0 .86.696 1.556 1.556 1.556zm0 0l8.555-8.556 3.889 3.89m-8.556-5.056a1.166 1.166 0 11-2.333 0 1.166 1.166 0 012.333 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.2px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><path d=\"M105 88a1 1 0 011-1h48a1 1 0 010 2h-48a1 1 0 01-1-1zM105 93a1 1 0 011-1h40a1 1 0 010 2h-40a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M105 98a1 1 0 011-1h11a1 1 0 010 2h-11a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><path d=\"M105 82.5a1.5 1.5 0 011.5-1.5h32a1.5 1.5 0 010 3h-32a1.5 1.5 0 01-1.5-1.5z\" fill=\"#4A5568\"></path><rect x=\"178.5\" y=\"43.5\" width=\"67\" height=\"62\" rx=\"1.5\" fill=\"#FFFFFF\" stroke=\"#CBD5E0\"></rect><path d=\"M206.556 69h10.888c.86 0 1.556-.696 1.556-1.556V56.556c0-.86-.696-1.556-1.556-1.556h-10.888c-.86 0-1.556.696-1.556 1.556v10.888c0 .86.696 1.556 1.556 1.556zm0 0l8.555-8.556 3.889 3.89m-8.556-5.056a1.166 1.166 0 11-2.333 0 1.166 1.166 0 012.333 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.2px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><path d=\"M184 88a1 1 0 011-1h48a1 1 0 010 2h-48a1 1 0 01-1-1zM184 93a1 1 0 011-1h40a1 1 0 010 2h-40a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M184 98a1 1 0 011-1h11a1 1 0 010 2h-11a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><path d=\"M184 82.5a1.5 1.5 0 011.5-1.5h32a1.5 1.5 0 010 3h-32a1.5 1.5 0 01-1.5-1.5z\" fill=\"#4A5568\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$X = `
<section class="text-gray-600 body-font overflow-hidden">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap -m-12">
      <div class="p-12 md:w-1/2 flex flex-col items-start">
        <span class="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">CATEGORY</span>
        <h2 class="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">Roof party normcore before they sold out, cornhole vape</h2>
        <p class="leading-relaxed mb-8">Live-edge letterpress cliche, salvia fanny pack humblebrag narwhal portland. VHS man braid palo santo hoodie brunch trust fund. Bitters hashtag waistcoat fashion axe chia unicorn. Plaid fixie chambray 90's, slow-carb etsy tumeric. Cray pug you probably haven't heard of them hexagon kickstarter craft beer pork chic.</p>
        <div class="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
          <a class="text-indigo-500 inline-flex items-center">Learn More
            <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
          <span class="text-gray-400 mr-3 inline-flex items-center ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
            <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>1.2K
          </span>
          <span class="text-gray-400 inline-flex items-center leading-none text-sm">
            <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
            </svg>6
          </span>
        </div>
        <a class="inline-flex items-center">
          <img alt="blog" src="https://dummyimage.com/104x104" class="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center">
          <span class="flex-grow flex flex-col pl-4">
            <span class="title-font font-medium text-gray-900">Holden Caulfield</span>
            <span class="text-gray-400 text-xs tracking-widest mt-0.5">UI DEVELOPER</span>
          </span>
        </a>
      </div>
      <div class="p-12 md:w-1/2 flex flex-col items-start">
        <span class="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">CATEGORY</span>
        <h2 class="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">Pinterest DIY dreamcatcher gentrify single-origin coffee</h2>
        <p class="leading-relaxed mb-8">Live-edge letterpress cliche, salvia fanny pack humblebrag narwhal portland. VHS man braid palo santo hoodie brunch trust fund. Bitters hashtag waistcoat fashion axe chia unicorn. Plaid fixie chambray 90's, slow-carb etsy tumeric.</p>
        <div class="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
          <a class="text-indigo-500 inline-flex items-center">Learn More
            <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
          <span class="text-gray-400 mr-3 inline-flex items-center ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
            <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>1.2K
          </span>
          <span class="text-gray-400 inline-flex items-center leading-none text-sm">
            <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
            </svg>6
          </span>
        </div>
        <a class="inline-flex items-center">
          <img alt="blog" src="https://dummyimage.com/103x103" class="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center">
          <span class="flex-grow flex flex-col pl-4">
            <span class="title-font font-medium text-gray-900">Alper Kamu</span>
            <span class="text-gray-400 text-xs tracking-widest mt-0.5">DESIGNER</span>
          </span>
        </a>
      </div>
    </div>
  </div>
</section>
  `;

function b3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"20\" y=\"48\" width=\"70\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"36\" width=\"34\" height=\"8\" rx=\"2\" fill=\"#EBF4FF\"></rect><rect x=\"20\" y=\"58\" width=\"92\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"66\" width=\"82\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"74\" width=\"68\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"82\" width=\"18\" height=\"4\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"23\" y=\"39\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#6366F1\"></rect><path d=\"M121.5 93a.5.5 0 010 1h-101a.5.5 0 010-1h101z\" fill=\"#E2E8F0\"></path><circle cx=\"27.5\" cy=\"107.5\" r=\"7.5\" fill=\"#E2E8F0\"></circle><path d=\"M39 110a1 1 0 011-1h19a1 1 0 010 2H40a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"39\" y=\"103\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"144\" y=\"48\" width=\"70\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"144\" y=\"36\" width=\"34\" height=\"8\" rx=\"2\" fill=\"#EBF4FF\"></rect><rect x=\"144\" y=\"58\" width=\"92\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"144\" y=\"66\" width=\"82\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"144\" y=\"74\" width=\"68\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"144\" y=\"82\" width=\"18\" height=\"4\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"147\" y=\"39\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#6366F1\"></rect><path d=\"M245.5 93a.5.5 0 010 1h-101a.5.5 0 010-1h101z\" fill=\"#E2E8F0\"></path><circle cx=\"151.5\" cy=\"107.5\" r=\"7.5\" fill=\"#E2E8F0\"></circle><path d=\"M163 110a1 1 0 011-1h19a1 1 0 010 2h-19a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"163\" y=\"103\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$W = `
<section class="text-gray-600 body-font overflow-hidden">
  <div class="container px-5 py-24 mx-auto">
    <div class="-my-8 divide-y-2 divide-gray-100">
      <div class="py-8 flex flex-wrap md:flex-nowrap">
        <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
          <span class="font-semibold title-font text-gray-700">CATEGORY</span>
          <span class="mt-1 text-gray-500 text-sm">12 Jun 2019</span>
        </div>
        <div class="md:flex-grow">
          <h2 class="text-2xl font-medium text-gray-900 title-font mb-2">Bitters hashtag waistcoat fashion axe chia unicorn</h2>
          <p class="leading-relaxed">Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha lumbersexual pork belly polaroid hoodie portland craft beer.</p>
          <a class="text-indigo-500 inline-flex items-center mt-4">Learn More
            <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="py-8 flex flex-wrap md:flex-nowrap">
        <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
          <span class="font-semibold title-font text-gray-700">CATEGORY</span>
          <span class="mt-1 text-gray-500 text-sm">12 Jun 2019</span>
        </div>
        <div class="md:flex-grow">
          <h2 class="text-2xl font-medium text-gray-900 title-font mb-2">Meditation bushwick direct trade taxidermy shaman</h2>
          <p class="leading-relaxed">Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha lumbersexual pork belly polaroid hoodie portland craft beer.</p>
          <a class="text-indigo-500 inline-flex items-center mt-4">Learn More
            <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="py-8 flex flex-wrap md:flex-nowrap">
        <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
          <span class="font-semibold title-font text-gray-700">CATEGORY</span>
          <span class="text-sm text-gray-500">12 Jun 2019</span>
        </div>
        <div class="md:flex-grow">
          <h2 class="text-2xl font-medium text-gray-900 title-font mb-2">Woke master cleanse drinking vinegar salvia</h2>
          <p class="leading-relaxed">Glossier echo park pug, church-key sartorial biodiesel vexillologist pop-up snackwave ramps cornhole. Marfa 3 wolf moon party messenger bag selfies, poke vaporware kombucha lumbersexual pork belly polaroid hoodie portland craft beer.</p>
          <a class="text-indigo-500 inline-flex items-center mt-4">Learn More
            <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
  `;

function b4s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"84\" y=\"20\" width=\"70\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"84\" y=\"29\" width=\"145\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"26\" width=\"12\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"84\" y=\"35\" width=\"129\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"84\" y=\"41\" width=\"18\" height=\"3\" rx=\"1.5\" fill=\"#6366F1\"></rect><path d=\"M245.5 53a.5.5 0 010 1h-225a.5.5 0 010-1h225zM245.5 96a.5.5 0 010 1h-225a.5.5 0 010-1h225z\" fill=\"#E2E8F0\"></path><rect x=\"20\" y=\"20\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"84\" y=\"63\" width=\"70\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"84\" y=\"72\" width=\"145\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"69\" width=\"12\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"84\" y=\"78\" width=\"129\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"84\" y=\"84\" width=\"18\" height=\"3\" rx=\"1.5\" fill=\"#6366F1\"></rect><rect x=\"20\" y=\"63\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"84\" y=\"106\" width=\"70\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"84\" y=\"115\" width=\"145\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"112\" width=\"12\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"84\" y=\"121\" width=\"129\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"84\" y=\"127\" width=\"18\" height=\"3\" rx=\"1.5\" fill=\"#6366F1\"></rect><rect x=\"20\" y=\"106\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$V = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap -mx-4 -my-8">
      <div class="py-8 px-4 lg:w-1/3">
        <div class="h-full flex items-start">
          <div class="w-12 flex-shrink-0 flex flex-col text-center leading-none">
            <span class="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">Jul</span>
            <span class="font-medium text-lg text-gray-800 title-font leading-none">18</span>
          </div>
          <div class="flex-grow pl-6">
            <h2 class="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">CATEGORY</h2>
            <h1 class="title-font text-xl font-medium text-gray-900 mb-3">The 400 Blows</h1>
            <p class="leading-relaxed mb-5">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
            <a class="inline-flex items-center">
              <img alt="blog" src="https://dummyimage.com/103x103" class="w-8 h-8 rounded-full flex-shrink-0 object-cover object-center">
              <span class="flex-grow flex flex-col pl-3">
                <span class="title-font font-medium text-gray-900">Alper Kamu</span>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div class="py-8 px-4 lg:w-1/3">
        <div class="h-full flex items-start">
          <div class="w-12 flex-shrink-0 flex flex-col text-center leading-none">
            <span class="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">Jul</span>
            <span class="font-medium text-lg text-gray-800 title-font leading-none">18</span>
          </div>
          <div class="flex-grow pl-6">
            <h2 class="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">CATEGORY</h2>
            <h1 class="title-font text-xl font-medium text-gray-900 mb-3">Shooting Stars</h1>
            <p class="leading-relaxed mb-5">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
            <a class="inline-flex items-center">
              <img alt="blog" src="https://dummyimage.com/102x102" class="w-8 h-8 rounded-full flex-shrink-0 object-cover object-center">
              <span class="flex-grow flex flex-col pl-3">
                <span class="title-font font-medium text-gray-900">Holden Caulfield</span>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div class="py-8 px-4 lg:w-1/3">
        <div class="h-full flex items-start">
          <div class="w-12 flex-shrink-0 flex flex-col text-center leading-none">
            <span class="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">Jul</span>
            <span class="font-medium text-lg text-gray-800 title-font leading-none">18</span>
          </div>
          <div class="flex-grow pl-6">
            <h2 class="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">CATEGORY</h2>
            <h1 class="title-font text-xl font-medium text-gray-900 mb-3">Neptune</h1>
            <p class="leading-relaxed mb-5">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
            <a class="inline-flex items-center">
              <img alt="blog" src="https://dummyimage.com/101x101" class="w-8 h-8 rounded-full flex-shrink-0 object-cover object-center">
              <span class="flex-grow flex flex-col pl-3">
                <span class="title-font font-medium text-gray-900">Henry Letham</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  `;

function b5s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M39 70.5a1.5 1.5 0 011.5-1.5h46a1.5 1.5 0 010 3h-46a1.5 1.5 0 01-1.5-1.5zM39 76.5a1.5 1.5 0 011.5-1.5h40a1.5 1.5 0 010 3h-40a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M39 58.5a1.5 1.5 0 011.5-1.5h14a1.5 1.5 0 010 3h-14a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><path d=\"M39 64.5a1.5 1.5 0 011.5-1.5h32a1.5 1.5 0 010 3h-32a1.5 1.5 0 01-1.5-1.5z\" fill=\"#4A5568\"></path><path d=\"M20 60a3 3 0 013-3h6a3 3 0 110 6h-6a3 3 0 01-3-3z\" fill=\"#E2E8F0\"></path><circle cx=\"44\" cy=\"88\" r=\"5\" fill=\"#E2E8F0\"></circle><path d=\"M51 87.5a1.5 1.5 0 011.5-1.5h18a1.5 1.5 0 010 3h-18a1.5 1.5 0 01-1.5-1.5z\" fill=\"#4A5568\"></path><path d=\"M118 70.5a1.5 1.5 0 011.5-1.5h46a1.5 1.5 0 010 3h-46a1.5 1.5 0 01-1.5-1.5zM118 76.5a1.5 1.5 0 011.5-1.5h40a1.5 1.5 0 010 3h-40a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M118 58.5a1.5 1.5 0 011.5-1.5h14a1.5 1.5 0 010 3h-14a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><path d=\"M118 64.5a1.5 1.5 0 011.5-1.5h32a1.5 1.5 0 010 3h-32a1.5 1.5 0 01-1.5-1.5z\" fill=\"#4A5568\"></path><path d=\"M99 60a3 3 0 013-3h6a3 3 0 110 6h-6a3 3 0 01-3-3z\" fill=\"#E2E8F0\"></path><circle cx=\"123\" cy=\"88\" r=\"5\" fill=\"#E2E8F0\"></circle><path d=\"M130 87.5a1.5 1.5 0 011.5-1.5h18a1.5 1.5 0 010 3h-18a1.5 1.5 0 01-1.5-1.5z\" fill=\"#4A5568\"></path><path d=\"M197 70.5a1.5 1.5 0 011.5-1.5h46a1.5 1.5 0 010 3h-46a1.5 1.5 0 01-1.5-1.5zM197 76.5a1.5 1.5 0 011.5-1.5h40a1.5 1.5 0 010 3h-40a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M197 58.5a1.5 1.5 0 011.5-1.5h14a1.5 1.5 0 010 3h-14a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><path d=\"M197 64.5a1.5 1.5 0 011.5-1.5h32a1.5 1.5 0 010 3h-32a1.5 1.5 0 01-1.5-1.5z\" fill=\"#4A5568\"></path><path d=\"M178 60a3 3 0 013-3h6a3 3 0 110 6h-6a3 3 0 01-3-3z\" fill=\"#E2E8F0\"></path><circle cx=\"202\" cy=\"88\" r=\"5\" fill=\"#E2E8F0\"></circle><path d=\"M209 87.5a1.5 1.5 0 011.5-1.5h18a1.5 1.5 0 010 3h-18a1.5 1.5 0 01-1.5-1.5z\" fill=\"#4A5568\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$U = `
<section class="text-gray-600 body-font relative">
  <div class="absolute inset-0 bg-gray-300">
    <iframe width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0" title="map" scrolling="no" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=cyprus&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed" style="filter: grayscale(1) contrast(1.2) opacity(0.4);"></iframe>
  </div>
  <div class="container px-5 py-24 mx-auto flex">
    <div class="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
      <form style="margin: 0;">
        <h2 class="text-gray-900 text-lg mb-1 font-medium title-font">Feedback</h2>
        <p class="leading-relaxed mb-5 text-gray-600">Post-ironic portland shabby chic echo park, banjo fashion axe</p>
        <div class="relative mb-4">
          <label for="email" class="leading-7 text-sm text-gray-600">Email</label>
          <input type="email" id="email" name="email" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
        </div>
        <div class="relative mb-4">
          <label for="message" class="leading-7 text-sm text-gray-600">Message</label>
          <textarea id="message" name="message" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" required></textarea>
        </div>
        <button type="submit" class="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
        <p class="text-xs text-gray-500 mt-3">Chicharrones blog helvetica normcore iceland tousled brook viral artisan.</p>
      </form>
    </div>
  </div>
</section>
`;

function c1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"153\" y=\"30\" width=\"93\" height=\"90\" rx=\"2\" fill=\"#E2E8F0\"></rect><rect x=\"162\" y=\"101\" width=\"75\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"162\" y=\"66\" width=\"75\" height=\"30\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"162\" y=\"51\" width=\"75\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"162\" y=\"40\" width=\"40\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><path d=\"M89 71.682C89 81.546 76.5 90 76.5 90S64 81.546 64 71.682c0-3.364 1.317-6.59 3.661-8.968A12.41 12.41 0 0176.5 59a12.41 12.41 0 018.839 3.714A12.776 12.776 0 0189 71.682z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><path d=\"M76.5 75.91c2.301 0 4.167-1.894 4.167-4.228 0-2.335-1.866-4.228-4.167-4.228-2.301 0-4.167 1.893-4.167 4.228 0 2.334 1.866 4.227 4.167 4.227z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$T = `
<section class="text-gray-600 body-font relative">
  <div class="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
    <div class="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
      <iframe width="100%" height="100%" class="absolute inset-0" frameborder="0" title="map" marginheight="0" marginwidth="0" scrolling="no" src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=cyprus&ie=UTF8&t=&z=14&iwloc=B&output=embed" style="filter: grayscale(1) contrast(1.2) opacity(0.4);"></iframe>
      <div class="bg-white relative flex flex-wrap py-6 rounded shadow-md">
        <div class="lg:w-1/2 px-6">
          <h2 class="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
          <p class="mt-1">Photo booth tattooed prism, portland taiyaki hoodie neutra typewriter</p>
        </div>
        <div class="lg:w-1/2 px-6 mt-4 lg:mt-0">
          <h2 class="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
          <a class="text-indigo-500 leading-relaxed">example@email.com</a>
          <h2 class="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
          <p class="leading-relaxed">123-456-7890</p>
        </div>
      </div>
    </div>
    <div class="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
      <form style="margin: 0;">
        <h2 class="text-gray-900 text-lg mb-1 font-medium title-font">Feedback</h2>
        <p class="leading-relaxed mb-5 text-gray-600">Post-ironic portland shabby chic echo park, banjo fashion axe</p>
        <div class="relative mb-4">
          <label for="name" class="leading-7 text-sm text-gray-600">Name</label>
          <input type="text" id="name" name="name" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
        </div>
        <div class="relative mb-4">
          <label for="email" class="leading-7 text-sm text-gray-600">Email</label>
          <input type="email" id="email" name="email" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
        </div>
        <div class="relative mb-4">
          <label for="message" class="leading-7 text-sm text-gray-600">Message</label>
          <textarea id="message" name="message" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" required></textarea>
        </div>
        <button type="submit" class="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
        <p class="text-xs text-gray-500 mt-3">Chicharrones blog helvetica normcore iceland tousled brook viral artisan.</p>
      </form>
    </div>
  </div>
</section>
`;

function c2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"20\" y=\"30\" width=\"127\" height=\"90\" rx=\"2\" fill=\"#E2E8F0\"></rect><rect x=\"30\" y=\"71\" width=\"107\" height=\"39\" rx=\"2\" fill=\"#FFFFFF\"></rect><rect x=\"35\" y=\"76\" width=\"24\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"35\" y=\"83\" width=\"37\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"35\" y=\"89\" width=\"40\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"86\" y=\"76\" width=\"24\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"86\" y=\"83\" width=\"32\" height=\"3\" rx=\"1.5\" fill=\"#6366F1\"></rect><rect x=\"86\" y=\"95\" width=\"20\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"86\" y=\"102\" width=\"32\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"162\" y=\"101\" width=\"84\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"162\" y=\"66\" width=\"84\" height=\"30\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"162\" y=\"51\" width=\"84\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"162\" y=\"40\" width=\"44.8\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><path d=\"M89 49.136C89 53.91 83 58 83 58s-6-4.09-6-8.864a6.21 6.21 0 011.757-4.339A5.933 5.933 0 0183 43c1.591 0 3.117.647 4.243 1.797A6.208 6.208 0 0189 49.137z\" stroke=\"#A0AEC0\" stroke-width=\"1.6px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><path d=\"M83 51.182c1.105 0 2-.916 2-2.046s-.895-2.045-2-2.045-2 .916-2 2.045c0 1.13.895 2.046 2 2.046z\" stroke=\"#A0AEC0\" stroke-width=\"1.6px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$S = `
<section class="text-gray-600 body-font relative">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-12">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Contact Us</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify.</p>
    </div>
    <div class="lg:w-1/2 md:w-2/3 mx-auto">
      <form style="margin: 0;">
        <div class="flex flex-wrap -m-2">
          <div class="p-2 w-1/2">
            <div class="relative">
              <label for="name" class="leading-7 text-sm text-gray-600">Name</label>
              <input type="text" id="name" name="name" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
            </div>
          </div>
          <div class="p-2 w-1/2">
            <div class="relative">
              <label for="email" class="leading-7 text-sm text-gray-600">Email</label>
              <input type="email" id="email" name="email" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
            </div>
          </div>
          <div class="p-2 w-full">
            <div class="relative">
              <label for="message" class="leading-7 text-sm text-gray-600">Message</label>
              <textarea id="message" name="message" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out" required></textarea>
            </div>
          </div>
          <div class="p-2 w-full">
            <button type="submit" class="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
          </div>
          <div class="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
            <a class="text-indigo-500">example@email.com</a>
            <p class="leading-normal my-5">49 Smith St.
              <br>Saint Cloud, MN 56301
            </p>
            <span class="inline-flex">
              <a class="text-gray-500">
                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a class="ml-4 text-gray-500">
                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a class="ml-4 text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </a>
              <a class="ml-4 text-gray-500">
                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </div>
    </form>
  </div>
</section>
`;

function c3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"113\" y=\"117\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"63\" y=\"81\" width=\"140\" height=\"30\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"63\" y=\"65\" width=\"66\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"135\" y=\"65\" width=\"68\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"90\" y=\"24\" width=\"86\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"80\" y=\"33\" width=\"106\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"85\" y=\"41\" width=\"97\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$R = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">ROOF PARTY POLAROID</h2>
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Master Cleanse Reliac Heirloom</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep jianbing selfies heirloom prism food truck ugh squid celiac humblebrag.</p>
    </div>
    <div class="flex flex-wrap">
      <div class="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
        <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Shooting Stars</h2>
        <p class="leading-relaxed text-base mb-4">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
        <a class="text-indigo-500 inline-flex items-center">Learn More
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
      <div class="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
        <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">The Catalyzer</h2>
        <p class="leading-relaxed text-base mb-4">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
        <a class="text-indigo-500 inline-flex items-center">Learn More
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
      <div class="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
        <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Neptune</h2>
        <p class="leading-relaxed text-base mb-4">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
        <a class="text-indigo-500 inline-flex items-center">Learn More
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
      <div class="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
        <h2 class="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Melanchole</h2>
        <p class="leading-relaxed text-base mb-4">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
        <a class="text-indigo-500 inline-flex items-center">Learn More
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
    <button class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
  </div>
</section>
`;

function d1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"113\" y=\"120\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"81\" y=\"31\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"96\" y=\"20\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"85\" y=\"39\" width=\"97.365\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"26\" y=\"73\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"26\" y=\"79\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"26\" y=\"84\" width=\"38\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"26\" y=\"89\" width=\"24\" height=\"2\" rx=\"1\" fill=\"#6366F1\"></rect><rect x=\"20\" y=\"62\" width=\"1\" height=\"39\" rx=\"0.5\" fill=\"#CBD5E0\"></rect><rect x=\"86\" y=\"73\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"86\" y=\"79\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"86\" y=\"84\" width=\"38\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"86\" y=\"89\" width=\"24\" height=\"2\" rx=\"1\" fill=\"#6366F1\"></rect><rect x=\"80\" y=\"62\" width=\"1\" height=\"39\" rx=\"0.5\" fill=\"#CBD5E0\"></rect><rect x=\"146.136\" y=\"73\" width=\"28.636\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"146.136\" y=\"79\" width=\"34.773\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"146.136\" y=\"84\" width=\"38.864\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"146.136\" y=\"89\" width=\"24.546\" height=\"2\" rx=\"1\" fill=\"#6366F1\"></rect><rect x=\"140\" y=\"62\" width=\"1.023\" height=\"39\" rx=\"0.511\" fill=\"#CBD5E0\"></rect><rect x=\"207.136\" y=\"73\" width=\"28.636\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"207.136\" y=\"79\" width=\"34.773\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"207.136\" y=\"84\" width=\"38.864\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"207.136\" y=\"89\" width=\"24.546\" height=\"2\" rx=\"1\" fill=\"#6366F1\"></rect><rect x=\"201\" y=\"62\" width=\"1.023\" height=\"39\" rx=\"0.511\" fill=\"#CBD5E0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$Q = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap w-full mb-20">
      <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Pitchfork Kickstarter Taxidermy</h1>
        <div class="h-1 w-20 bg-indigo-500 rounded"></div>
      </div>
      <p class="lg:w-1/2 w-full leading-relaxed text-gray-500">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep jianbing selfies heirloom prism food truck ugh squid celiac humblebrag.</p>
    </div>
    <div class="flex flex-wrap -m-4">
      <div class="xl:w-1/4 md:w-1/2 p-4">
        <div class="bg-gray-100 p-6 rounded-lg">
          <img class="h-40 rounded w-full object-cover object-center mb-6" src="https://dummyimage.com/720x400" alt="content">
          <h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-4">Chichen Itza</h2>
          <p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
        </div>
      </div>
      <div class="xl:w-1/4 md:w-1/2 p-4">
        <div class="bg-gray-100 p-6 rounded-lg">
          <img class="h-40 rounded w-full object-cover object-center mb-6" src="https://dummyimage.com/721x401" alt="content">
          <h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-4">Colosseum Roma</h2>
          <p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
        </div>
      </div>
      <div class="xl:w-1/4 md:w-1/2 p-4">
        <div class="bg-gray-100 p-6 rounded-lg">
          <img class="h-40 rounded w-full object-cover object-center mb-6" src="https://dummyimage.com/722x402" alt="content">
          <h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-4">Great Pyramid of Giza</h2>
          <p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
        </div>
      </div>
      <div class="xl:w-1/4 md:w-1/2 p-4">
        <div class="bg-gray-100 p-6 rounded-lg">
          <img class="h-40 rounded w-full object-cover object-center mb-6" src="https://dummyimage.com/723x403" alt="content">
          <h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">SUBTITLE</h3>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-4">San Francisco</h2>
          <p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.</p>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function d2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"142\" y=\"32\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"32\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"142\" y=\"40\" width=\"77\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"74\" width=\"50\" height=\"44\" rx=\"2\" fill=\"#E2E8F0\"></rect><path d=\"M40.333 95h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333zm0 0l7.334-7.333L51 91m-7.333-4.333a1 1 0 11-2 0 1 1 0 012 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"24\" y=\"108\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"24\" y=\"112\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"24\" y=\"104\" width=\"10\" height=\"2\" rx=\"1\" fill=\"#6366F1\"></rect><rect x=\"79\" y=\"74\" width=\"50\" height=\"44\" rx=\"2\" fill=\"#E2E8F0\"></rect><path d=\"M99.333 95h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333zm0 0l7.334-7.333L110 91m-7.333-4.333a1 1 0 11-2 0 1 1 0 012 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"83\" y=\"108\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"83\" y=\"112\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"83\" y=\"104\" width=\"10\" height=\"2\" rx=\"1\" fill=\"#6366F1\"></rect><rect x=\"138\" y=\"74\" width=\"50\" height=\"44\" rx=\"2\" fill=\"#E2E8F0\"></rect><path d=\"M158.333 95h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333zm0 0l7.334-7.333L169 91m-7.333-4.333a1 1 0 11-2 0 1 1 0 012 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"142\" y=\"108\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"142\" y=\"112\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"142\" y=\"104\" width=\"10\" height=\"2\" rx=\"1\" fill=\"#6366F1\"></rect><rect x=\"197\" y=\"74\" width=\"50\" height=\"44\" rx=\"2\" fill=\"#E2E8F0\"></rect><path d=\"M217.333 95h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333zm0 0l7.334-7.333L228 91m-7.333-4.333a1 1 0 11-2 0 1 1 0 012 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"201\" y=\"108\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"201\" y=\"112\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"201\" y=\"104\" width=\"10\" height=\"2\" rx=\"1\" fill=\"#6366F1\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$P = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap w-full mb-20 flex-col items-center text-center">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Pitchfork Kickstarter Taxidermy</h1>
      <p class="lg:w-1/2 w-full leading-relaxed text-gray-500">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table.</p>
    </div>
    <div class="flex flex-wrap -m-4">
      <div class="xl:w-1/3 md:w-1/2 p-4">
        <div class="border border-gray-200 p-6 rounded-lg">
          <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">Shooting Stars</h2>
          <p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
        </div>
      </div>
      <div class="xl:w-1/3 md:w-1/2 p-4">
        <div class="border border-gray-200 p-6 rounded-lg">
          <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
              <circle cx="6" cy="6" r="3"></circle>
              <circle cx="6" cy="18" r="3"></circle>
              <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
            </svg>
          </div>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">The Catalyzer</h2>
          <p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
        </div>
      </div>
      <div class="xl:w-1/3 md:w-1/2 p-4">
        <div class="border border-gray-200 p-6 rounded-lg">
          <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">Neptune</h2>
          <p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
        </div>
      </div>
      <div class="xl:w-1/3 md:w-1/2 p-4">
        <div class="border border-gray-200 p-6 rounded-lg">
          <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"></path>
            </svg>
          </div>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">Melanchole</h2>
          <p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
        </div>
      </div>
      <div class="xl:w-1/3 md:w-1/2 p-4">
        <div class="border border-gray-200 p-6 rounded-lg">
          <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            </svg>
          </div>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">Bunker</h2>
          <p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
        </div>
      </div>
      <div class="xl:w-1/3 md:w-1/2 p-4">
        <div class="border border-gray-200 p-6 rounded-lg">
          <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">Ramona Falls</h2>
          <p class="leading-relaxed text-base">Fingerstache flexitarian street art 8-bit waist co, subway tile poke farm.</p>
        </div>
      </div>
    </div>
    <button class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
  </div>
</section>
`;

function d3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"113\" y=\"120\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"81\" y=\"31\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"96\" y=\"20\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"20.5\" y=\"51.5\" width=\"69\" height=\"23\" rx=\"1.5\" fill=\"#FFFFFF\" stroke=\"#CBD5E0\"></rect><rect x=\"24\" y=\"65\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"24\" y=\"69\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"28\" cy=\"59\" r=\"4\" fill=\"#C3DAFE\"></circle><rect x=\"98.5\" y=\"51.5\" width=\"69\" height=\"23\" rx=\"1.5\" fill=\"#FFFFFF\" stroke=\"#CBD5E0\"></rect><rect x=\"102\" y=\"65\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"102\" y=\"69\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"106\" cy=\"59\" r=\"4\" fill=\"#C3DAFE\"></circle><rect x=\"176.5\" y=\"51.5\" width=\"69\" height=\"23\" rx=\"1.5\" fill=\"#FFFFFF\" stroke=\"#CBD5E0\"></rect><rect x=\"180\" y=\"65\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"180\" y=\"69\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"184\" cy=\"59\" r=\"4\" fill=\"#C3DAFE\"></circle><rect x=\"20.5\" y=\"81.5\" width=\"69\" height=\"23\" rx=\"1.5\" fill=\"#FFFFFF\" stroke=\"#CBD5E0\"></rect><rect x=\"24\" y=\"95\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"24\" y=\"99\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"28\" cy=\"89\" r=\"4\" fill=\"#C3DAFE\"></circle><rect x=\"98.5\" y=\"81.5\" width=\"69\" height=\"23\" rx=\"1.5\" fill=\"#FFFFFF\" stroke=\"#CBD5E0\"></rect><rect x=\"102\" y=\"95\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"102\" y=\"99\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"106\" cy=\"89\" r=\"4\" fill=\"#C3DAFE\"></circle><rect x=\"176.5\" y=\"81.5\" width=\"69\" height=\"23\" rx=\"1.5\" fill=\"#FFFFFF\" stroke=\"#CBD5E0\"></rect><rect x=\"180\" y=\"95\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"180\" y=\"99\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"184\" cy=\"89\" r=\"4\" fill=\"#C3DAFE\"></circle></svg>", 'image/svg+xml')).firstChild;
}

const source$O = `
<section class="text-gray-600 body-font">
  <div class="container flex flex-wrap px-5 py-24 mx-auto items-center">
    <div class="md:w-1/2 md:pr-12 md:py-8 md:border-r md:border-b-0 mb-10 md:mb-0 pb-10 border-b border-gray-200">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Pitchfork Kickstarter Taxidermy</h1>
      <p class="leading-relaxed text-base">Locavore cardigan small batch roof party blue bottle blog meggings sartorial jean shorts kickstarter migas sriracha church-key synth succulents. Actually taiyaki neutra, distillery gastropub pok pok ugh.</p>
      <a class="text-indigo-500 inline-flex items-center mt-4">Learn More
        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </a>
    </div>
    <div class="flex flex-col md:w-1/2 md:pl-12">
      <h2 class="title-font font-semibold text-gray-800 tracking-wider text-sm mb-3">CATEGORIES</h2>
      <nav class="flex flex-wrap list-none -mb-1">
        <li class="lg:w-1/3 mb-1 w-1/2">
          <a class="text-gray-600 hover:text-gray-800">First Link</a>
        </li>
        <li class="lg:w-1/3 mb-1 w-1/2">
          <a class="text-gray-600 hover:text-gray-800">Second Link</a>
        </li>
        <li class="lg:w-1/3 mb-1 w-1/2">
          <a class="text-gray-600 hover:text-gray-800">Third Link</a>
        </li>
        <li class="lg:w-1/3 mb-1 w-1/2">
          <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
        </li>
        <li class="lg:w-1/3 mb-1 w-1/2">
          <a class="text-gray-600 hover:text-gray-800">Fifth Link</a>
        </li>
        <li class="lg:w-1/3 mb-1 w-1/2">
          <a class="text-gray-600 hover:text-gray-800">Sixth Link</a>
        </li>
        <li class="lg:w-1/3 mb-1 w-1/2">
          <a class="text-gray-600 hover:text-gray-800">Seventh Link</a>
        </li>
        <li class="lg:w-1/3 mb-1 w-1/2">
          <a class="text-gray-600 hover:text-gray-800">Eighth Link</a>
        </li>
      </nav>
    </div>
  </div>
</section>
`;

function d4s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"20\" y=\"59\" width=\"70\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"70\" width=\"92\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"78\" width=\"79\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"88\" width=\"24\" height=\"4\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"144\" y=\"65\" width=\"40\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"144\" y=\"74\" width=\"22\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"144\" y=\"79\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"144\" y=\"84\" width=\"19\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"180\" y=\"74\" width=\"18\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"180\" y=\"79\" width=\"24\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"180\" y=\"84\" width=\"24\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"212\" y=\"74\" width=\"18\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"212\" y=\"79\" width=\"24\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"212\" y=\"84\" width=\"24\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M128 44.5a.5.5 0 011 0v62a.5.5 0 01-1 0v-62z\" fill=\"#CBD5E0\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$N = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex flex-wrap">
    <h2 class="sm:text-3xl text-2xl text-gray-900 font-medium title-font mb-2 md:w-2/5">Kickstarter Actually Pinterest Brunch Bitters Occupy</h2>
    <div class="md:w-3/5 md:pl-6">
      <p class="leading-relaxed text-base">Taxidermy bushwick celiac master cleanse microdosing seitan. Fashion axe four dollar toast truffaut, direct trade kombucha brunch williamsburg keffiyeh gastropub tousled squid meh taiyaki drinking vinegar tacos.</p>
      <div class="flex md:mt-4 mt-6">
        <button class="inline-flex text-white bg-indigo-500 border-0 py-1 px-4 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
        <a class="text-indigo-500 inline-flex items-center ml-4">Learn More
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>
`;

function d5s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M128 44.5a.5.5 0 011 0v62a.5.5 0 01-1 0v-62z\" fill=\"#CBD5E0\"></path><rect x=\"20\" y=\"69\" width=\"70\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"78\" width=\"92\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><path d=\"M144 60a2 2 0 012-2h75a2 2 0 110 4h-75a2 2 0 01-2-2zM144 68a2 2 0 012-2h88a2 2 0 110 4h-88a2 2 0 01-2-2zM144 76a2 2 0 012-2h60a2 2 0 110 4h-60a2 2 0 01-2-2z\" fill=\"#A0AEC0\"></path><path d=\"M190 89a2 2 0 012-2h20a2 2 0 110 4h-20a2 2 0 01-2-2z\" fill=\"#6366F1\"></path><rect x=\"144\" y=\"84\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$M = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex flex-col">
    <div class="lg:w-4/6 mx-auto">
      <div class="rounded-lg h-64 overflow-hidden">
        <img alt="content" class="object-cover object-center h-full w-full" src="https://dummyimage.com/1200x500">
      </div>
      <div class="flex flex-col sm:flex-row mt-10">
        <div class="sm:w-1/3 text-center sm:pr-8 sm:py-8">
          <div class="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="flex flex-col items-center text-center justify-center">
            <h2 class="font-medium title-font mt-4 text-gray-900 text-lg">Phoebe Caulfield</h2>
            <div class="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
            <p class="text-base">Raclette knausgaard hella meggs normcore williamsburg enamel pin sartorial venmo tbh hot chicken gentrify portland.</p>
          </div>
        </div>
        <div class="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
          <p class="leading-relaxed text-lg mb-4">Meggings portland fingerstache lyft, post-ironic fixie man bun banh mi umami everyday carry hexagon locavore direct trade art party. Locavore small batch listicle gastropub farm-to-table lumbersexual salvia messenger bag. Coloring book flannel truffaut craft beer drinking vinegar sartorial, disrupt fashion axe normcore meh butcher. Portland 90's scenester vexillologist forage post-ironic asymmetrical, chartreuse disrupt butcher paleo intelligentsia pabst before they sold out four loko. 3 wolf moon brooklyn.</p>
          <a class="text-indigo-500 inline-flex items-center">Learn More
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function d6s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M93 67.5a.5.5 0 011 0v62a.5.5 0 01-1 0v-62z\" fill=\"#CBD5E0\"></path><path d=\"M106 83a2 2 0 012-2h103.337a2 2 0 110 4H108a2 2 0 01-2-2zM106 107a2 2 0 012-2h95a2 2 0 110 4h-95a2 2 0 01-2-2zM106 91a2 2 0 012-2h121a2 2 0 110 4H108a2 2 0 01-2-2zM106 99a2 2 0 012-2h82.957a2 2 0 010 4H108a2 2 0 01-2-2z\" fill=\"#A0AEC0\"></path><path d=\"M106 115a2 2 0 012-2h20a2 2 0 110 4h-20a2 2 0 01-2-2z\" fill=\"#6366F1\"></path><path d=\"M45 104a2 2 0 012-2h20a2 2 0 110 4H47a2 2 0 01-2-2z\" fill=\"#4A5568\"></path><rect x=\"37\" y=\"110\" width=\"40\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"35\" y=\"120\" width=\"44\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M33 116a1 1 0 011-1h45a1 1 0 010 2H34a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M122.889 47h20.222A2.889 2.889 0 00146 44.111V23.89a2.889 2.889 0 00-2.889-2.89h-20.222A2.889 2.889 0 00120 23.889V44.11a2.889 2.889 0 002.889 2.89zm0 0l15.889-15.889L146 38.333m-15.889-9.389a2.167 2.167 0 11-4.333 0 2.167 2.167 0 014.333 0z\" stroke=\"#A0AEC0\" stroke-width=\"2px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><circle cx=\"56.5\" cy=\"85.5\" r=\"10.5\" fill=\"#E2E8F0\"></circle></svg>", 'image/svg+xml')).firstChild;
}

const source$L = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap -mx-4 -mb-10 text-center">
      <div class="sm:w-1/2 mb-10 px-4">
        <div class="rounded-lg h-64 overflow-hidden">
          <img alt="content" class="object-cover object-center h-full w-full" src="https://dummyimage.com/1201x501">
        </div>
        <h2 class="title-font text-2xl font-medium text-gray-900 mt-6 mb-3">Buy YouTube Videos</h2>
        <p class="leading-relaxed text-base">Williamsburg occupy sustainable snackwave gochujang. Pinterest cornhole brunch, slow-carb neutra irony.</p>
        <button class="flex mx-auto mt-6 text-white bg-indigo-500 border-0 py-2 px-5 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
      </div>
      <div class="sm:w-1/2 mb-10 px-4">
        <div class="rounded-lg h-64 overflow-hidden">
          <img alt="content" class="object-cover object-center h-full w-full" src="https://dummyimage.com/1202x502">
        </div>
        <h2 class="title-font text-2xl font-medium text-gray-900 mt-6 mb-3">The Catalyzer</h2>
        <p class="leading-relaxed text-base">Williamsburg occupy sustainable snackwave gochujang. Pinterest cornhole brunch, slow-carb neutra irony.</p>
        <button class="flex mx-auto mt-6 text-white bg-indigo-500 border-0 py-2 px-5 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
      </div>
    </div>
  </div>
</section>
`;

function d7s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M41.692 86a2 2 0 012-2H114.4a2 2 0 010 4H43.692a2 2 0 01-2-2z\" fill=\"#A0AEC0\"></path><rect x=\"59\" y=\"104\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><path d=\"M35 94a2 2 0 012-2h83a2 2 0 110 4H37a2 2 0 01-2-2z\" fill=\"#A0AEC0\"></path><path d=\"M68.889 63H89.11A2.889 2.889 0 0092 60.111V39.89A2.889 2.889 0 0089.111 37H68.89A2.889 2.889 0 0066 39.889V60.11A2.889 2.889 0 0068.889 63zm0 0l15.889-15.889L92 54.333m-15.889-9.389a2.167 2.167 0 11-4.333 0 2.167 2.167 0 014.333 0z\" stroke=\"#A0AEC0\" stroke-width=\"2px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"56\" y=\"73\" width=\"46\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><path d=\"M150.692 86a2 2 0 012-2h70.707a2 2 0 010 4h-70.707a2 2 0 01-2-2z\" fill=\"#A0AEC0\"></path><rect x=\"168\" y=\"104\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><path d=\"M144 94a2 2 0 012-2h83a2 2 0 110 4h-83a2 2 0 01-2-2z\" fill=\"#A0AEC0\"></path><path d=\"M177.889 63h20.222A2.889 2.889 0 00201 60.111V39.89a2.889 2.889 0 00-2.889-2.89h-20.222A2.889 2.889 0 00175 39.889V60.11a2.889 2.889 0 002.889 2.89zm0 0l15.889-15.889L201 54.333m-15.889-9.389a2.167 2.167 0 11-4.333 0 2.167 2.167 0 014.333 0z\" stroke=\"#A0AEC0\" stroke-width=\"2px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"165\" y=\"73\" width=\"46\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$K = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col">
      <div class="h-1 bg-gray-200 rounded overflow-hidden">
        <div class="w-24 h-full bg-indigo-500"></div>
      </div>
      <div class="flex flex-wrap sm:flex-row flex-col py-6 mb-12">
        <h1 class="sm:w-2/5 text-gray-900 font-medium title-font text-2xl mb-2 sm:mb-0">Space The Final Frontier</h1>
        <p class="sm:w-3/5 leading-relaxed text-base sm:pl-10 pl-0">Street art subway tile salvia four dollar toast bitters selfies quinoa yuccie synth meditation iPhone intelligentsia prism tofu. Viral gochujang bitters dreamcatcher.</p>
      </div>
    </div>
    <div class="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4">
      <div class="p-4 md:w-1/3 sm:mb-0 mb-6">
        <div class="rounded-lg h-64 overflow-hidden">
          <img alt="content" class="object-cover object-center h-full w-full" src="https://dummyimage.com/1203x503">
        </div>
        <h2 class="text-xl font-medium title-font text-gray-900 mt-5">Shooting Stars</h2>
        <p class="text-base leading-relaxed mt-2">Swag shoivdigoitch literally meditation subway tile tumblr cold-pressed. Gastropub street art beard dreamcatcher neutra, ethical XOXO lumbersexual.</p>
        <a class="text-indigo-500 inline-flex items-center mt-3">Learn More
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
      <div class="p-4 md:w-1/3 sm:mb-0 mb-6">
        <div class="rounded-lg h-64 overflow-hidden">
          <img alt="content" class="object-cover object-center h-full w-full" src="https://dummyimage.com/1204x504">
        </div>
        <h2 class="text-xl font-medium title-font text-gray-900 mt-5">The Catalyzer</h2>
        <p class="text-base leading-relaxed mt-2">Swag shoivdigoitch literally meditation subway tile tumblr cold-pressed. Gastropub street art beard dreamcatcher neutra, ethical XOXO lumbersexual.</p>
        <a class="text-indigo-500 inline-flex items-center mt-3">Learn More
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
      <div class="p-4 md:w-1/3 sm:mb-0 mb-6">
        <div class="rounded-lg h-64 overflow-hidden">
          <img alt="content" class="object-cover object-center h-full w-full" src="https://dummyimage.com/1205x505">
        </div>
        <h2 class="text-xl font-medium title-font text-gray-900 mt-5">The 400 Blows</h2>
        <p class="text-base leading-relaxed mt-2">Swag shoivdigoitch literally meditation subway tile tumblr cold-pressed. Gastropub street art beard dreamcatcher neutra, ethical XOXO lumbersexual.</p>
        <a class="text-indigo-500 inline-flex items-center mt-3">Learn More
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>
`;

function d8s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M20 111.5a1.5 1.5 0 011.5-1.5h64a1.5 1.5 0 010 3h-64a1.5 1.5 0 01-1.5-1.5zM20 118.5a1.5 1.5 0 011.5-1.5h51a1.5 1.5 0 010 3h-51a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M20 125.5a1.5 1.5 0 011.5-1.5h18a1.5 1.5 0 010 3h-18a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><path d=\"M45.444 87h17.112A2.444 2.444 0 0065 84.556V67.444A2.444 2.444 0 0062.556 65H45.444A2.444 2.444 0 0043 67.444v17.112A2.444 2.444 0 0045.444 87zm0 0L58.89 73.556l6.11 6.11m-13.444-7.944a1.833 1.833 0 11-3.667 0 1.833 1.833 0 013.667 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.8px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"20\" y=\"101\" width=\"56\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><path d=\"M100 111.5a1.5 1.5 0 011.5-1.5h64a1.5 1.5 0 010 3h-64a1.5 1.5 0 01-1.5-1.5zM100 118.5a1.5 1.5 0 011.5-1.5h51a1.5 1.5 0 010 3h-51a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M100 125.5a1.5 1.5 0 011.5-1.5h18a1.5 1.5 0 010 3h-18a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><path d=\"M125.444 87h17.112A2.444 2.444 0 00145 84.556V67.444A2.444 2.444 0 00142.556 65h-17.112A2.444 2.444 0 00123 67.444v17.112A2.444 2.444 0 00125.444 87zm0 0l13.445-13.444 6.111 6.11m-13.444-7.944a1.834 1.834 0 11-3.667 0 1.834 1.834 0 013.667 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.8px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"100\" y=\"101\" width=\"56\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><path d=\"M180 111.5a1.5 1.5 0 011.5-1.5h64a1.5 1.5 0 010 3h-64a1.5 1.5 0 01-1.5-1.5zM180 118.5a1.5 1.5 0 011.5-1.5h51a1.5 1.5 0 010 3h-51a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M180 125.5a1.5 1.5 0 011.5-1.5h18a1.5 1.5 0 010 3h-18a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><path d=\"M205.444 87h17.112A2.444 2.444 0 00225 84.556V67.444A2.444 2.444 0 00222.556 65h-17.112A2.444 2.444 0 00203 67.444v17.112A2.444 2.444 0 00205.444 87zm0 0l13.445-13.444 6.111 6.11m-13.444-7.944a1.834 1.834 0 11-3.667 0 1.834 1.834 0 013.667 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.8px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"180\" y=\"101\" width=\"56\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"142\" y=\"23\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"23\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"142\" y=\"31\" width=\"77\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$J = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
      <h1 class="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">Slow-carb next level shoindxgoitch ethical authentic, scenester sriracha forage.</h1>
      <button class="flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-10 sm:mt-0">Button</button>
    </div>
  </div>
</section>
`;

function a1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"20\" y=\"68\" width=\"119\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"77\" width=\"92\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"206\" y=\"70\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$I = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex flex-wrap items-center">
    <div class="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
      <h1 class="title-font font-medium text-3xl text-gray-900">Slow-carb next level shoindcgoitch ethical authentic, poko scenester</h1>
      <p class="leading-relaxed mt-4">Poke slow-carb mixtape knausgaard, typewriter street art gentrify hammock starladder roathse. Craies vegan tousled etsy austin.</p>
    </div>
    <div class="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
      <form style="margin: 0;">
        <h2 class="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2>
        <div class="relative mb-4">
          <label for="full-name" class="leading-7 text-sm text-gray-600">Full Name</label>
          <input type="text" id="full-name" name="full-name" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
        </div>
        <div class="relative mb-4">
          <label for="email" class="leading-7 text-sm text-gray-600">Email</label>
          <input type="email" id="email" name="email" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
        </div>
        <button type="submit" class="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
        <p class="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
      </form>
    </div>
  </div>
</section>
`;

function a2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"151\" y=\"40\" width=\"93\" height=\"70\" rx=\"2\" fill=\"#E2E8F0\"></rect><rect x=\"20\" y=\"61\" width=\"86\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"70\" width=\"66\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"79\" width=\"106\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"87\" width=\"97\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"160\" y=\"91\" width=\"75\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"160\" y=\"76\" width=\"75\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"160\" y=\"61\" width=\"75\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"160\" y=\"50\" width=\"40\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$H = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-12">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Master Cleanse Reliac Heirloom</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep.</p>
    </div>
    <form style="margin: 0;">
      <div class="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end">
        <div class="relative flex-grow w-full">
          <label for="full-name" class="leading-7 text-sm text-gray-600">Full Name</label>
          <input type="text" id="full-name" name="full-name" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
        </div>
        <div class="relative flex-grow w-full">
          <label for="email" class="leading-7 text-sm text-gray-600">Email</label>
          <input type="email" id="email" name="email" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
        </div>
        <button type="submit" class="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
      </div>
    </form>
  </div>
</section>
`;

function a3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"90\" y=\"48\" width=\"86\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"80\" y=\"57\" width=\"106\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"85\" y=\"65\" width=\"97\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"183\" y=\"92\" width=\"44\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"111\" y=\"92\" width=\"66\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"39\" y=\"92\" width=\"66\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$G = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex items-center md:flex-row flex-col">
    <div class="flex flex-col md:pr-10 md:mb-0 mb-6 pr-0 w-full md:w-auto md:text-left text-center">
      <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">ROOF PARTY POLAROID</h2>
      <h1 class="md:text-3xl text-2xl font-medium title-font text-gray-900">Master Cleanse Reliac Heirloom</h1>
    </div>
    <div class="flex md:ml-auto md:mr-0 mx-auto items-center flex-shrink-0 space-x-4">
      <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 512 512">
          <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
        </svg>
        <span class="ml-4 flex items-start flex-col leading-none">
          <span class="text-xs text-gray-600 mb-1">GET IT ON</span>
          <span class="title-font font-medium">Google Play</span>
        </span>
      </button>
      <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 305 305">
          <path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
          <path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
        </svg>
        <span class="ml-4 flex items-start flex-col leading-none">
          <span class="text-xs text-gray-600 mb-1">Download on the</span>
          <span class="title-font font-medium">App Store</span>
        </span>
      </button>
    </div>
  </div>
</section>
`;

function a4s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"20\" y=\"68\" width=\"26\" height=\"5\" rx=\"2.5\" fill=\"#6366F1\"></rect><rect x=\"20\" y=\"77\" width=\"92\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"206\" y=\"70\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"160\" y=\"70\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$F = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap -m-4">
      <div class="lg:w-1/4 md:w-1/2 p-4 w-full">
        <a class="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/420x260">
        </a>
        <div class="mt-4">
          <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
          <h2 class="text-gray-900 title-font text-lg font-medium">The Catalyzer</h2>
          <p class="mt-1">$16.00</p>
        </div>
      </div>
      <div class="lg:w-1/4 md:w-1/2 p-4 w-full">
        <a class="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/421x261">
        </a>
        <div class="mt-4">
          <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
          <h2 class="text-gray-900 title-font text-lg font-medium">Shooting Stars</h2>
          <p class="mt-1">$21.15</p>
        </div>
      </div>
      <div class="lg:w-1/4 md:w-1/2 p-4 w-full">
        <a class="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/422x262">
        </a>
        <div class="mt-4">
          <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
          <h2 class="text-gray-900 title-font text-lg font-medium">Neptune</h2>
          <p class="mt-1">$12.00</p>
        </div>
      </div>
      <div class="lg:w-1/4 md:w-1/2 p-4 w-full">
        <a class="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/423x263">
        </a>
        <div class="mt-4">
          <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
          <h2 class="text-gray-900 title-font text-lg font-medium">The 400 Blows</h2>
          <p class="mt-1">$18.40</p>
        </div>
      </div>
      <div class="lg:w-1/4 md:w-1/2 p-4 w-full">
        <a class="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/424x264">
        </a>
        <div class="mt-4">
          <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
          <h2 class="text-gray-900 title-font text-lg font-medium">The Catalyzer</h2>
          <p class="mt-1">$16.00</p>
        </div>
      </div>
      <div class="lg:w-1/4 md:w-1/2 p-4 w-full">
        <a class="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/425x265">
        </a>
        <div class="mt-4">
          <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
          <h2 class="text-gray-900 title-font text-lg font-medium">Shooting Stars</h2>
          <p class="mt-1">$21.15</p>
        </div>
      </div>
      <div class="lg:w-1/4 md:w-1/2 p-4 w-full">
        <a class="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/427x267">
        </a>
        <div class="mt-4">
          <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
          <h2 class="text-gray-900 title-font text-lg font-medium">Neptune</h2>
          <p class="mt-1">$12.00</p>
        </div>
      </div>
      <div class="lg:w-1/4 md:w-1/2 p-4 w-full">
        <a class="block relative h-48 rounded overflow-hidden">
          <img alt="ecommerce" class="object-cover object-center w-full h-full block" src="https://dummyimage.com/428x268">
        </a>
        <div class="mt-4">
          <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">CATEGORY</h3>
          <h2 class="text-gray-900 title-font text-lg font-medium">The 400 Blows</h2>
          <p class="mt-1">$18.40</p>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function e1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M40.333 48h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333zm0 0l7.334-7.333L51 44m-7.333-4.333a1 1 0 11-2 0 1 1 0 012 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"20\" y=\"61\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"65\" width=\"13\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"57\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#CBD5E0\"></rect><path d=\"M99.333 48h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333zm0 0l7.334-7.333L110 44m-7.333-4.333a1 1 0 11-2 0 1 1 0 012 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"79\" y=\"61\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"79\" y=\"65\" width=\"13\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"79\" y=\"57\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#CBD5E0\"></rect><path d=\"M158.333 48h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333zm0 0l7.334-7.333L169 44m-7.333-4.333a1 1 0 11-2 0 1 1 0 012 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"138\" y=\"61\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"138\" y=\"65\" width=\"13\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"138\" y=\"57\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#CBD5E0\"></rect><path d=\"M217.333 48h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333zm0 0l7.334-7.333L228 44m-7.333-4.333a1 1 0 11-2 0 1 1 0 012 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"197\" y=\"61\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"197\" y=\"65\" width=\"13\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"197\" y=\"57\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#CBD5E0\"></rect><path d=\"M40.333 94h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333zm0 0l7.334-7.333L51 90m-7.333-4.333a1 1 0 11-2 0 1 1 0 012 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"20\" y=\"107\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"111\" width=\"13\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"103\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#CBD5E0\"></rect><path d=\"M99.333 94h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333zm0 0l7.334-7.333L110 90m-7.333-4.333a1 1 0 11-2 0 1 1 0 012 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"79\" y=\"107\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"79\" y=\"111\" width=\"13\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"79\" y=\"103\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#CBD5E0\"></rect><path d=\"M158.333 94h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333zm0 0l7.334-7.333L169 90m-7.333-4.333a1 1 0 11-2 0 1 1 0 012 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"138\" y=\"107\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"138\" y=\"111\" width=\"13\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"138\" y=\"103\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#CBD5E0\"></rect><path d=\"M217.333 94h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333zm0 0l7.334-7.333L228 90m-7.333-4.333a1 1 0 11-2 0 1 1 0 012 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"197\" y=\"107\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"197\" y=\"111\" width=\"13\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"197\" y=\"103\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#CBD5E0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$E = `
<section class="text-gray-600 body-font overflow-hidden">
  <div class="container px-5 py-24 mx-auto">
    <div class="lg:w-4/5 mx-auto flex flex-wrap">
      <img alt="ecommerce" class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="https://dummyimage.com/400x400">
      <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
        <form style="margin: 0;">
          <h2 class="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
          <h1 class="text-gray-900 text-3xl title-font font-medium mb-1">The Catcher in the Rye</h1>
          <div class="flex mb-4">
            <span class="flex items-center">
              <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              <span class="text-gray-600 ml-3">4 Reviews</span>
            </span>
            <span class="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
              <a class="text-gray-500">
                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a class="text-gray-500">
                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a class="text-gray-500">
                <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                </svg>
              </a>
            </span>
          </div>
          <p class="leading-relaxed">Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo juiceramps cornhole raw denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean shorts keytar banjo tattooed umami cardigan.</p>
          <div class="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
            <div class="flex items-center">
              <span class="mr-3">Color</span>
              <div class="relative">
                <select class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10" required>
                  <option>\u26AB\uFE0F</option>
                  <option>\u26AA\uFE0F</option>
                  <option>\u{1F535}</option>
                  <option>\u{1F7E3}</option>
                </select>
                <span class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                  <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </div>
            </div>
            <div class="flex ml-6 items-center">
              <span class="mr-3">Size</span>
              <div class="relative">
                <select class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10" required>
                  <option>SM</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
                <span class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                  <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div class="flex">
            <span class="title-font font-medium text-2xl text-gray-900">$58.00</span>
            <button type="submit" class="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
            <button class="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
              <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
`;

function e2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M52.792 91h26.544a3.785 3.785 0 003.792-3.778V60.778A3.785 3.785 0 0079.336 57H52.792A3.785 3.785 0 0049 60.778v26.444A3.785 3.785 0 0052.792 91zm0 0l20.856-20.778 9.48 9.445M62.272 67.389a2.839 2.839 0 01-2.844 2.833 2.839 2.839 0 01-2.844-2.833 2.839 2.839 0 012.844-2.833 2.839 2.839 0 012.844 2.833z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"133\" y=\"42\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"133\" y=\"105\" width=\"26\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"133\" y=\"35\" width=\"38\" height=\"3\" rx=\"1.5\" fill=\"#CBD5E0\"></rect><rect x=\"133\" y=\"51\" width=\"26\" height=\"3\" rx=\"1.5\" fill=\"#6366F1\"></rect><rect x=\"133\" y=\"64\" width=\"92\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><circle cx=\"241\" cy=\"108\" r=\"5\" fill=\"#E2E8F0\"></circle><path d=\"M245.5 94a.5.5 0 010 1h-112a.5.5 0 010-1h112z\" fill=\"#E2E8F0\"></path><rect x=\"200\" y=\"103\" width=\"31\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"133\" y=\"72\" width=\"82\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"133\" y=\"80\" width=\"68\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$D = `
<section class="text-gray-600 body-font overflow-hidden">
  <div class="container px-5 py-24 mx-auto">
    <div class="lg:w-4/5 mx-auto flex flex-wrap">
      <div class="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
        <form style="margin: 0;">
          <h2 class="text-sm title-font text-gray-500 tracking-widest">BRAND NAME</h2>
          <h1 class="text-gray-900 text-3xl title-font font-medium mb-4">Animated Night Hill Illustrations</h1>
          <p class="leading-relaxed mb-4">Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam inxigo juiceramps cornhole raw denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean.</p>
          <div class="flex border-t border-gray-200 py-2">
            <span class="inline-flex items-center text-gray-500">Color</span>
            <div class="ml-auto relative">
              <select class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10" required>
                <option>\u26AB\uFE0F</option>
                <option>\u26AA\uFE0F</option>
                <option>\u{1F535}</option>
                <option>\u{1F7E3}</option>
              </select>
              <span class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </div>
          </div>
          <div class="flex border-t border-gray-200 py-2">
            <span class="inline-flex items-center text-gray-500">Size</span>
            <div class="ml-auto relative">
              <select class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10" required>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
                <option>X-Large</option>
              </select>
              <span class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </div>
          </div>
          <div class="flex border-t border-b mb-6 border-gray-200 py-2">
            <span class="inline-flex items-center text-gray-500">Quantity</span>
            <div class="ml-auto relative">
              <select class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10" required>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
              <span class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </div>
          </div>
          <div class="flex">
            <span class="title-font font-medium text-2xl text-gray-900">$58.00</span>
            <button class="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
            <button class="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
              <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
      <img alt="ecommerce" class="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="https://dummyimage.com/400x400">
    </div>
  </div>
</section>
`;

function e3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"20\" y=\"37\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"112\" width=\"26\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"30\" width=\"38\" height=\"3\" rx=\"1.5\" fill=\"#CBD5E0\"></rect><rect x=\"20\" y=\"55\" width=\"26\" height=\"3\" rx=\"1.5\" fill=\"#6366F1\"></rect><path d=\"M56 56.5a1.5 1.5 0 011.5-1.5h23a1.5 1.5 0 010 3h-23a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><rect x=\"92\" y=\"55\" width=\"26\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"73\" width=\"92\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path d=\"M132.5 102a.5.5 0 010 1h-112a.5.5 0 010-1h112zM133 64v2H20v-2h113z\" fill=\"#E2E8F0\"></path><rect x=\"87\" y=\"110\" width=\"31\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"20\" y=\"81\" width=\"82\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"89\" width=\"68\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path fill=\"#6366F1\" d=\"M20 64h32v2H20z\"></path><path d=\"M187.792 92h26.544a3.785 3.785 0 003.792-3.778V61.778A3.785 3.785 0 00214.336 58h-26.544A3.785 3.785 0 00184 61.778v26.444A3.785 3.785 0 00187.792 92zm0 0l20.856-20.778 9.48 9.445m-20.856-12.278a2.838 2.838 0 01-2.844 2.833 2.838 2.838 0 01-2.844-2.833 2.838 2.838 0 012.844-2.833 2.838 2.838 0 012.844 2.833z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><circle cx=\"128\" cy=\"114\" r=\"5\" fill=\"#E2E8F0\"></circle></svg>", 'image/svg+xml')).firstChild;
}

const source$C = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <h1 class="sm:text-3xl text-2xl font-medium title-font text-center text-gray-900 mb-20">Raw Denim Heirloom Man Braid
      <br class="hidden sm:block">Selfies Wayfarers
    </h1>
    <div class="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
      <div class="p-4 md:w-1/3 flex">
        <div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div class="flex-grow pl-6">
          <h2 class="text-gray-900 text-lg title-font font-medium mb-2">Shooting Stars</h2>
          <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard ugh iceland kickstarter tumblr live-edge tilde.</p>
          <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="p-4 md:w-1/3 flex">
        <div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
          </svg>
        </div>
        <div class="flex-grow pl-6">
          <h2 class="text-gray-900 text-lg title-font font-medium mb-2">The Catalyzer</h2>
          <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard ugh iceland kickstarter tumblr live-edge tilde.</p>
          <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="p-4 md:w-1/3 flex">
        <div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="flex-grow pl-6">
          <h2 class="text-gray-900 text-lg title-font font-medium mb-2">Neptune</h2>
          <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard ugh iceland kickstarter tumblr live-edge tilde.</p>
          <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function f1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"96\" y=\"39\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><circle cx=\"26\" cy=\"90\" r=\"6\" fill=\"#C3DAFE\"></circle><rect x=\"82\" y=\"48\" width=\"102\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><path d=\"M38 94.5a1.5 1.5 0 011.5-1.5h48a1.5 1.5 0 010 3h-48a1.5 1.5 0 01-1.5-1.5zM38 101.5a1.5 1.5 0 011.5-1.5h38a1.5 1.5 0 010 3h-38a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M38 108.5a1.5 1.5 0 011.5-1.5h13a1.5 1.5 0 010 3h-13a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><rect x=\"38\" y=\"84\" width=\"43\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><circle cx=\"105\" cy=\"90\" r=\"6\" fill=\"#C3DAFE\"></circle><path d=\"M117 94.5a1.5 1.5 0 011.5-1.5h48a1.5 1.5 0 010 3h-48a1.5 1.5 0 01-1.5-1.5zM117 101.5a1.5 1.5 0 011.5-1.5h38a1.5 1.5 0 010 3h-38a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M117 108.5a1.5 1.5 0 011.5-1.5h13a1.5 1.5 0 010 3h-13a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><rect x=\"117\" y=\"84\" width=\"43\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><circle cx=\"184\" cy=\"90\" r=\"6\" fill=\"#C3DAFE\"></circle><path d=\"M196 94.5a1.5 1.5 0 011.5-1.5h48a1.5 1.5 0 010 3h-48a1.5 1.5 0 01-1.5-1.5zM196 101.5a1.5 1.5 0 011.5-1.5h38a1.5 1.5 0 010 3h-38a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M196 108.5a1.5 1.5 0 011.5-1.5h13a1.5 1.5 0 010 3h-13a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><rect x=\"196\" y=\"84\" width=\"43\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$B = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="text-center mb-20">
      <h1 class="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4">Raw Denim Heirloom Man Braid</h1>
      <p class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500s">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug.</p>
      <div class="flex mt-6 justify-center">
        <div class="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
      </div>
    </div>
    <div class="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
      <div class="p-4 md:w-1/3 flex flex-col text-center items-center">
        <div class="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10" viewBox="0 0 24 24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div class="flex-grow">
          <h2 class="text-gray-900 text-lg title-font font-medium mb-3">Shooting Stars</h2>
          <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard.</p>
          <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="p-4 md:w-1/3 flex flex-col text-center items-center">
        <div class="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10" viewBox="0 0 24 24">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
          </svg>
        </div>
        <div class="flex-grow">
          <h2 class="text-gray-900 text-lg title-font font-medium mb-3">The Catalyzer</h2>
          <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard.</p>
          <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="p-4 md:w-1/3 flex flex-col text-center items-center">
        <div class="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="flex-grow">
          <h2 class="text-gray-900 text-lg title-font font-medium mb-3">Neptune</h2>
          <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug VHS try-hard.</p>
          <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <button class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
  </div>
</section>
`;

function f2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><circle cx=\"56\" cy=\"61\" r=\"8\" fill=\"#C3DAFE\"></circle><path d=\"M20 87.5a1.5 1.5 0 011.5-1.5h65a1.5 1.5 0 010 3h-65a1.5 1.5 0 01-1.5-1.5zM27 94.5a1.5 1.5 0 011.5-1.5h51a1.5 1.5 0 010 3h-51a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M43 101.5a1.5 1.5 0 011.5-1.5h20a1.5 1.5 0 010 3h-20a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><rect x=\"25\" y=\"77\" width=\"58\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><circle cx=\"135\" cy=\"61\" r=\"8\" fill=\"#C3DAFE\"></circle><path d=\"M99 87.5a1.5 1.5 0 011.5-1.5h65a1.5 1.5 0 010 3h-65a1.5 1.5 0 01-1.5-1.5zM106 94.5a1.5 1.5 0 011.5-1.5h51a1.5 1.5 0 010 3h-51a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M122 101.5a1.5 1.5 0 011.5-1.5h20a1.5 1.5 0 010 3h-20a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><rect x=\"104\" y=\"77\" width=\"58\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><circle cx=\"214\" cy=\"61\" r=\"8\" fill=\"#C3DAFE\"></circle><path d=\"M178 87.5a1.5 1.5 0 011.5-1.5h65a1.5 1.5 0 010 3h-65a1.5 1.5 0 01-1.5-1.5zM185 94.5a1.5 1.5 0 011.5-1.5h51a1.5 1.5 0 010 3h-51a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M201 101.5a1.5 1.5 0 011.5-1.5h20a1.5 1.5 0 010 3h-20a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><rect x=\"183\" y=\"77\" width=\"58\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"81\" y=\"32\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"96\" y=\"21\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"113\" y=\"120\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$A = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex flex-wrap">
    <div class="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
      <img alt="feature" class="object-cover object-center h-full w-full" src="https://dummyimage.com/460x500">
    </div>
    <div class="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
      <div class="flex flex-col mb-10 lg:items-start items-center">
        <div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div class="flex-grow">
          <h2 class="text-gray-900 text-lg title-font font-medium mb-3">Shooting Stars</h2>
          <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
          <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="flex flex-col mb-10 lg:items-start items-center">
        <div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
          </svg>
        </div>
        <div class="flex-grow">
          <h2 class="text-gray-900 text-lg title-font font-medium mb-3">The Catalyzer</h2>
          <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
          <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="flex flex-col mb-10 lg:items-start items-center">
        <div class="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-6 h-6" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="flex-grow">
          <h2 class="text-gray-900 text-lg title-font font-medium mb-3">Neptune</h2>
          <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
          <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function f3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><circle cx=\"140\" cy=\"26\" r=\"6\" fill=\"#C3DAFE\"></circle><path d=\"M134 44a1 1 0 011-1h77a1 1 0 010 2h-77a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M134 49a1 1 0 011-1h21a1 1 0 010 2h-21a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><rect x=\"134\" y=\"37\" width=\"58\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><circle cx=\"140\" cy=\"66\" r=\"6\" fill=\"#C3DAFE\"></circle><path d=\"M134 84a1 1 0 011-1h77a1 1 0 010 2h-77a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M134 89a1 1 0 011-1h21a1 1 0 010 2h-21a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><rect x=\"134\" y=\"77\" width=\"58\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><circle cx=\"140\" cy=\"106\" r=\"6\" fill=\"#C3DAFE\"></circle><path d=\"M134 124a1 1 0 011-1h77a1 1 0 010 2h-77a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M134 129a1 1 0 011-1h21a1 1 0 010 2h-21a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><rect x=\"134\" y=\"117\" width=\"58\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><path d=\"M63.792 92h26.544a3.785 3.785 0 003.792-3.778V61.778A3.785 3.785 0 0090.336 58H63.792A3.785 3.785 0 0060 61.778v26.444A3.785 3.785 0 0063.792 92zm0 0l20.856-20.778 9.48 9.445M73.272 68.389a2.839 2.839 0 01-2.844 2.833 2.839 2.839 0 01-2.844-2.833 2.839 2.839 0 012.844-2.833 2.839 2.839 0 012.844 2.833z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$z = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex flex-wrap">
    <div class="flex flex-wrap -m-4">
      <div class="p-4 lg:w-1/2 md:w-full">
        <div class="flex border-2 rounded-lg border-gray-200 border-opacity-50 p-8 sm:flex-row flex-col">
          <div class="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-8 h-8" viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <div class="flex-grow">
            <h2 class="text-gray-900 text-lg title-font font-medium mb-3">Shooting Stars</h2>
            <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
            <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="p-4 lg:w-1/2 md:w-full">
        <div class="flex border-2 rounded-lg border-gray-200 border-opacity-50 p-8 sm:flex-row flex-col">
          <div class="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="flex-grow">
            <h2 class="text-gray-900 text-lg title-font font-medium mb-3">The Catalyzer</h2>
            <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
            <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function f4s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"20.5\" y=\"54.5\" width=\"107\" height=\"41\" rx=\"1.5\" fill=\"#FFFFFF\" stroke=\"#CBD5E0\"></rect><circle cx=\"32\" cy=\"68\" r=\"6\" fill=\"#C3DAFE\"></circle><path d=\"M44 72.5a1.5 1.5 0 011.5-1.5h68a1.5 1.5 0 010 3h-68a1.5 1.5 0 01-1.5-1.5zM44 79.5a1.5 1.5 0 011.5-1.5h54a1.5 1.5 0 010 3h-54a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M44 86.5a1.5 1.5 0 011.5-1.5h19a1.5 1.5 0 010 3h-19a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><rect x=\"44\" y=\"62\" width=\"32\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"138.5\" y=\"54.5\" width=\"107\" height=\"41\" rx=\"1.5\" fill=\"#FFFFFF\" stroke=\"#CBD5E0\"></rect><circle cx=\"150\" cy=\"68\" r=\"6\" fill=\"#C3DAFE\"></circle><path d=\"M162 72.5a1.5 1.5 0 011.5-1.5h68a1.5 1.5 0 010 3h-68a1.5 1.5 0 01-1.5-1.5zM162 79.5a1.5 1.5 0 011.5-1.5h54a1.5 1.5 0 010 3h-54a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M162 86.5a1.5 1.5 0 011.5-1.5h19a1.5 1.5 0 010 3h-19a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><rect x=\"162\" y=\"62\" width=\"32\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$y = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">ROOF PARTY POLAROID</h2>
      <h1 class="sm:text-3xl text-2xl font-medium title-font text-gray-900">Master Cleanse Reliac Heirloom</h1>
    </div>
    <div class="flex flex-wrap -m-4">
      <div class="p-4 md:w-1/3">
        <div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
          <div class="flex items-center mb-3">
            <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h2 class="text-gray-900 text-lg title-font font-medium">Shooting Stars</h2>
          </div>
          <div class="flex-grow">
            <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
            <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="p-4 md:w-1/3">
        <div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
          <div class="flex items-center mb-3">
            <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2 class="text-gray-900 text-lg title-font font-medium">The Catalyzer</h2>
          </div>
          <div class="flex-grow">
            <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
            <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div class="p-4 md:w-1/3">
        <div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
          <div class="flex items-center mb-3">
            <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
              </svg>
            </div>
            <h2 class="text-gray-900 text-lg title-font font-medium">Neptune</h2>
          </div>
          <div class="flex-grow">
            <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
            <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function f5s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"20\" y=\"78\" width=\"69\" height=\"31\" rx=\"2\" fill=\"#E2E8F0\"></rect><rect x=\"113\" y=\"41\" width=\"40\" height=\"3\" rx=\"1.5\" fill=\"#6366F1\"></rect><circle cx=\"28\" cy=\"86\" r=\"3\" fill=\"#6366F1\"></circle><rect x=\"98\" y=\"49\" width=\"70\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><path d=\"M25 93a1 1 0 011-1h54a1 1 0 110 2H26a1 1 0 01-1-1zM25 98a1 1 0 011-1h44a1 1 0 110 2H26a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M25 103a1 1 0 011-1h11a1 1 0 010 2H26a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><rect x=\"34\" y=\"84.5\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"99\" y=\"78\" width=\"69\" height=\"31\" rx=\"2\" fill=\"#E2E8F0\"></rect><circle cx=\"107\" cy=\"86\" r=\"3\" fill=\"#6366F1\"></circle><path d=\"M104 93a1 1 0 011-1h54a1 1 0 010 2h-54a1 1 0 01-1-1zM104 98a1 1 0 011-1h44a1 1 0 010 2h-44a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M104 103a1 1 0 011-1h11a1 1 0 010 2h-11a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><rect x=\"113\" y=\"84.5\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"178\" y=\"78\" width=\"69\" height=\"31\" rx=\"2\" fill=\"#E2E8F0\"></rect><circle cx=\"186\" cy=\"86\" r=\"3\" fill=\"#6366F1\"></circle><path d=\"M183 93a1 1 0 011-1h54a1 1 0 010 2h-54a1 1 0 01-1-1zM183 98a1 1 0 011-1h44a1 1 0 010 2h-44a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M183 103a1 1 0 011-1h11a1 1 0 010 2h-11a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><rect x=\"192\" y=\"84.5\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$x = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
      <div class="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="sm:w-16 sm:h-16 w-10 h-10" viewBox="0 0 24 24">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      </div>
      <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
        <h2 class="text-gray-900 text-lg title-font font-medium mb-2">Shooting Stars</h2>
        <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
        <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
    <div class="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-200 sm:flex-row flex-col">
      <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
        <h2 class="text-gray-900 text-lg title-font font-medium mb-2">The Catalyzer</h2>
        <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
        <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
      <div class="sm:w-32 sm:order-none order-first sm:h-32 h-20 w-20 sm:ml-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="sm:w-16 sm:h-16 w-10 h-10" viewBox="0 0 24 24">
          <circle cx="6" cy="6" r="3"></circle>
          <circle cx="6" cy="18" r="3"></circle>
          <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
        </svg>
      </div>
    </div>
    <div class="flex items-center lg:w-3/5 mx-auto sm:flex-row flex-col">
      <div class="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 flex-shrink-0">
        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="sm:w-16 sm:h-16 w-10 h-10" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
        <h2 class="text-gray-900 text-lg title-font font-medium mb-2">The 400 Blows</h2>
        <p class="leading-relaxed text-base">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine.</p>
        <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
    <button class="flex mx-auto mt-20 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
  </div>
</section>
`;

function f6s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><circle cx=\"88\" cy=\"28\" r=\"8\" fill=\"#C3DAFE\"></circle><path d=\"M102 28a1 1 0 011-1h68a1 1 0 010 2h-68a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M102 33a1 1 0 011-1h14a1 1 0 010 2h-14a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><rect x=\"102\" y=\"21\" width=\"40\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><circle cx=\"88\" cy=\"98\" r=\"8\" fill=\"#C3DAFE\"></circle><path d=\"M102 98a1 1 0 011-1h68a1 1 0 010 2h-68a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M102 103a1 1 0 011-1h14a1 1 0 010 2h-14a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><rect x=\"102\" y=\"91\" width=\"40\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><circle cx=\"178\" cy=\"63\" r=\"8\" fill=\"#C3DAFE\"></circle><path d=\"M80 63a1 1 0 011-1h68a1 1 0 010 2H81a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><path d=\"M80 68a1 1 0 011-1h14a1 1 0 110 2H81a1 1 0 01-1-1z\" fill=\"#6366F1\"></path><rect x=\"80\" y=\"56\" width=\"40\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"113\" y=\"120\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><path d=\"M185.5 45a.5.5 0 010 1h-105a.5.5 0 010-1h105zM185.5 80a.5.5 0 010 1h-105a.5.5 0 010-1h105z\" fill=\"#CBD5E0\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$w = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="text-center mb-20">
      <h1 class="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">Raw Denim Heirloom Man Braid</h1>
      <p class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug.</p>
    </div>
    <div class="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
      <div class="p-2 sm:w-1/2 w-full">
        <div class="bg-gray-100 rounded flex p-4 h-full items-center">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <path d="M22 4L12 14.01l-3-3"></path>
          </svg>
          <span class="title-font font-medium">Authentic Cliche Forage</span>
        </div>
      </div>
      <div class="p-2 sm:w-1/2 w-full">
        <div class="bg-gray-100 rounded flex p-4 h-full items-center">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <path d="M22 4L12 14.01l-3-3"></path>
          </svg>
          <span class="title-font font-medium">Kinfolk Chips Snackwave</span>
        </div>
      </div>
      <div class="p-2 sm:w-1/2 w-full">
        <div class="bg-gray-100 rounded flex p-4 h-full items-center">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <path d="M22 4L12 14.01l-3-3"></path>
          </svg>
          <span class="title-font font-medium">Coloring Book Ethical</span>
        </div>
      </div>
      <div class="p-2 sm:w-1/2 w-full">
        <div class="bg-gray-100 rounded flex p-4 h-full items-center">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <path d="M22 4L12 14.01l-3-3"></path>
          </svg>
          <span class="title-font font-medium">Typewriter Polaroid Cray</span>
        </div>
      </div>
      <div class="p-2 sm:w-1/2 w-full">
        <div class="bg-gray-100 rounded flex p-4 h-full items-center">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <path d="M22 4L12 14.01l-3-3"></path>
          </svg>
          <span class="title-font font-medium">Pack Truffaut Blue</span>
        </div>
      </div>
      <div class="p-2 sm:w-1/2 w-full">
        <div class="bg-gray-100 rounded flex p-4 h-full items-center">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <path d="M22 4L12 14.01l-3-3"></path>
          </svg>
          <span class="title-font font-medium">The Catcher In The Rye</span>
        </div>
      </div>
    </div>
    <button class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
  </div>
</section>
`;

function f7s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M70 61a1 1 0 011-1h58a1 1 0 011 1v8a1 1 0 01-1 1H71a1 1 0 01-1-1v-8z\" fill=\"#E2E8F0\"></path><path d=\"M80 65a1 1 0 011-1h40a1 1 0 010 2H81a1 1 0 01-1-1z\" fill=\"#4A5568\"></path><path d=\"M77 65a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#6366F1\"></path><path d=\"M136 61a1 1 0 011-1h58a1 1 0 011 1v8a1 1 0 01-1 1h-58a1 1 0 01-1-1v-8z\" fill=\"#E2E8F0\"></path><path d=\"M146 65a1 1 0 011-1h40a1 1 0 010 2h-40a1 1 0 01-1-1z\" fill=\"#4A5568\"></path><path d=\"M143 65a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#6366F1\"></path><path d=\"M70 77a1 1 0 011-1h58a1 1 0 011 1v8a1 1 0 01-1 1H71a1 1 0 01-1-1v-8z\" fill=\"#E2E8F0\"></path><path d=\"M80 81a1 1 0 011-1h40a1 1 0 010 2H81a1 1 0 01-1-1z\" fill=\"#4A5568\"></path><path d=\"M77 81a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#6366F1\"></path><path d=\"M136 77a1 1 0 011-1h58a1 1 0 011 1v8a1 1 0 01-1 1h-58a1 1 0 01-1-1v-8z\" fill=\"#E2E8F0\"></path><path d=\"M146 81a1 1 0 011-1h40a1 1 0 010 2h-40a1 1 0 01-1-1z\" fill=\"#4A5568\"></path><path d=\"M143 81a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#6366F1\"></path><path d=\"M70 93a1 1 0 011-1h58a1 1 0 011 1v8a1 1 0 01-1 1H71a1 1 0 01-1-1v-8z\" fill=\"#E2E8F0\"></path><path d=\"M80 97a1 1 0 011-1h40a1 1 0 010 2H81a1 1 0 01-1-1z\" fill=\"#4A5568\"></path><path d=\"M77 97a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#6366F1\"></path><path d=\"M136 93a1 1 0 011-1h58a1 1 0 011 1v8a1 1 0 01-1 1h-58a1 1 0 01-1-1v-8z\" fill=\"#E2E8F0\"></path><path d=\"M146 97a1 1 0 011-1h40a1 1 0 010 2h-40a1 1 0 01-1-1z\" fill=\"#4A5568\"></path><path d=\"M143 97a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#6366F1\"></path><rect x=\"81\" y=\"31\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"81\" y=\"31\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"96\" y=\"20\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"97\" y=\"39\" width=\"73\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"113\" y=\"120\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$v = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="text-center mb-20">
      <h1 class="sm:text-3xl text-2xl font-medium text-center title-font text-gray-900 mb-4">Raw Denim Heirloom Man Braid</h1>
      <p class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">Blue bottle crucifix vinyl post-ironic four dollar toast vegan taxidermy. Gastropub indxgo juice poutine, ramps microdosing banh mi pug.</p>
    </div>
    <div class="flex flex-wrap -m-4">
      <div class="p-4 lg:w-1/4 sm:w-1/2 w-full">
        <h2 class="font-medium title-font tracking-widest text-gray-900 mb-4 text-sm text-center sm:text-left">SHOOTING STARS</h2>
        <nav class="flex flex-col sm:items-start sm:text-left text-center items-center -mb-1 space-y-2.5">
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>First Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Second Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Third Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Fourth Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Fifth Link
          </a>
        </nav>
      </div>
      <div class="p-4 lg:w-1/4 sm:w-1/2 w-full">
        <h2 class="font-medium title-font tracking-widest text-gray-900 mb-4 text-sm text-center sm:text-left">THE 400 BLOWS</h2>
        <nav class="flex flex-col sm:items-start sm:text-left text-center items-center -mb-1 space-y-2.5">
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>First Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Second Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Third Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Fourth Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Fifth Link
          </a>
        </nav>
      </div>
      <div class="p-4 lg:w-1/4 sm:w-1/2 w-full">
        <h2 class="font-medium title-font tracking-widest text-gray-900 mb-4 text-sm text-center sm:text-left">THE CATALYZER</h2>
        <nav class="flex flex-col sm:items-start sm:text-left text-center items-center -mb-1 space-y-2.5">
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>First Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Second Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Third Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Fourth Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Fifth Link
          </a>
        </nav>
      </div>
      <div class="p-4 lg:w-1/4 sm:w-1/2 w-full">
        <h2 class="font-medium title-font tracking-widest text-gray-900 mb-4 text-sm text-center sm:text-left">NEPTUNE</h2>
        <nav class="flex flex-col sm:items-start sm:text-left text-center items-center -mb-1 space-y-2.5">
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>First Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Second Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Third Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Fourth Link
          </a>
          <a>
            <span class="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>Fifth Link
          </a>
        </nav>
      </div>
    </div>
    <button class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
  </div>
</section>
`;

function f8s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"81\" y=\"31\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"81\" y=\"31\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"96\" y=\"39\" width=\"73\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"96\" y=\"20\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"28\" y=\"62\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"35\" y=\"70\" width=\"23\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M32 71a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"35\" y=\"77\" width=\"16\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M32 78a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"35\" y=\"84\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M32 85a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"35\" y=\"91\" width=\"23\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M32 92a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"35\" y=\"98\" width=\"21\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M32 99a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"85\" y=\"62\" width=\"33\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"92\" y=\"70\" width=\"23\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M89 71a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"92\" y=\"77\" width=\"16\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M89 78a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"92\" y=\"84\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M89 85a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"92\" y=\"91\" width=\"23\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M89 92a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"92\" y=\"98\" width=\"21\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M89 99a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"142\" y=\"62\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"149\" y=\"70\" width=\"23\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M146 71a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"149\" y=\"77\" width=\"16\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M146 78a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"149\" y=\"84\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M146 85a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"149\" y=\"91\" width=\"23\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M146 92a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"149\" y=\"98\" width=\"21\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M146 99a2 2 0 11-3.999.001A2 2 0 01146 99z\" fill=\"#C3DAFE\"></path><rect x=\"199\" y=\"62\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"206\" y=\"70\" width=\"23\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M203 71a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"206\" y=\"77\" width=\"16\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M203 78a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"206\" y=\"84\" width=\"28\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M203 85a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"206\" y=\"91\" width=\"23\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M203 92a2 2 0 11-4 0 2 2 0 014 0z\" fill=\"#C3DAFE\"></path><rect x=\"206\" y=\"98\" width=\"21\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M203 99a2 2 0 11-3.999.001A2 2 0 01203 99z\" fill=\"#C3DAFE\"></path><rect x=\"113\" y=\"120\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$u = `
<footer class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
    <div class="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
      <a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        <span class="ml-3 text-xl">Tailblocks</span>
      </a>
      <p class="mt-2 text-sm text-gray-500">Air plant banjo lyft occupy retro adaptogen indego</p>
    </div>
    <div class="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
      <div class="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
    </div>
  </div>
  <div class="bg-gray-100">
    <div class="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
      <p class="text-gray-500 text-sm text-center sm:text-left">\xA9 2020 Tailblocks \u2014
        <a href="https://twitter.com/knyttneve" rel="noopener noreferrer" class="text-gray-600 ml-1" target="_blank">@knyttneve</a>
      </p>
      <span class="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
        <a class="text-gray-500">
          <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
            <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
            <circle cx="4" cy="4" r="2" stroke="none"></circle>
          </svg>
        </a>
      </span>
    </div>
  </div>
</footer>
`;

function z1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"61\" y=\"85\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"61\" y=\"93\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"61\" y=\"100\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"61\" y=\"107\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"61\" y=\"114\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"111\" y=\"85\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"111\" y=\"93\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"111\" y=\"100\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"111\" y=\"107\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"111\" y=\"114\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"161\" y=\"85\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"161\" y=\"93\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"161\" y=\"107\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"161\" y=\"100\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"161\" y=\"114\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"211\" y=\"85\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"211\" y=\"93\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"211\" y=\"100\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"211\" y=\"107\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"211\" y=\"114\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><path fill=\"#E2E8F0\" d=\"M0 131h266v19H0z\"></path><rect x=\"20\" y=\"139\" width=\"41\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"222\" y=\"139\" width=\"25\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><circle cx=\"29\" cy=\"94\" r=\"9\" fill=\"#6366F1\"></circle></svg>", 'image/svg+xml')).firstChild;
}

const source$t = `
<footer class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
    <div class="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left md:mt-0 mt-10">
      <a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        <span class="ml-3 text-xl">Tailblocks</span>
      </a>
      <p class="mt-2 text-sm text-gray-500">Air plant banjo lyft occupy retro adaptogen indego</p>
    </div>
    <div class="flex-grow flex flex-wrap md:pr-20 -mb-10 md:text-left text-center order-first">
      <div class="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
    </div>
  </div>
  <div class="bg-gray-100">
    <div class="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
      <p class="text-gray-500 text-sm text-center sm:text-left">\xA9 2020 Tailblocks \u2014
        <a href="https://twitter.com/knyttneve" rel="noopener noreferrer" class="text-gray-600 ml-1" target="_blank">@knyttneve</a>
      </p>
      <span class="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
        <a class="text-gray-500">
          <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
            <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
            <circle cx="4" cy="4" r="2" stroke="none"></circle>
          </svg>
        </a>
      </span>
    </div>
  </div>
</footer>
`;

function z2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"21\" y=\"85\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"21\" y=\"93\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"21\" y=\"100\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"21\" y=\"107\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"21\" y=\"114\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"71\" y=\"85\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"71\" y=\"93\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"71\" y=\"100\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"71\" y=\"107\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"71\" y=\"114\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"121\" y=\"85\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"121\" y=\"93\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"121\" y=\"107\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"121\" y=\"100\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"121\" y=\"114\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"171\" y=\"85\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"171\" y=\"93\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"171\" y=\"100\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"171\" y=\"107\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"171\" y=\"114\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><path fill=\"#E2E8F0\" d=\"M0 131h266v19H0z\"></path><rect x=\"20\" y=\"139\" width=\"41\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"222\" y=\"139\" width=\"25\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><circle cx=\"237\" cy=\"94\" r=\"9\" fill=\"#6366F1\"></circle></svg>", 'image/svg+xml')).firstChild;
}

const source$s = `
<footer class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap md:text-left text-center -mb-10 -mx-4">
      <div class="lg:w-1/6 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/6 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/6 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/6 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/6 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/6 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
    </div>
  </div>
  <div class="border-t border-gray-200">
    <div class="container px-5 py-8 flex flex-wrap mx-auto items-center">
      <form style="margin: 0;">
        <div class="flex md:flex-nowrap flex-wrap justify-center items-end md:justify-start">
          <div class="relative sm:w-64 w-40 sm:mr-4 mr-2">
            <label for="footer-field" class="leading-7 text-sm text-gray-600">Placeholder</label>
            <input type="text" id="footer-field" name="footer-field" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
          </div>
          <button type="submit" class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
          <p class="text-gray-500 text-sm md:ml-6 md:mt-0 mt-2 sm:text-left text-center">Bitters chicharrones fanny pack
            <br class="lg:block hidden">waistcoat green juice
          </p>
        </div>
      </form>
      <span class="inline-flex lg:ml-auto lg:mt-0 mt-6 w-full justify-center md:justify-start md:w-auto">
        <a class="text-gray-500">
          <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
            <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
            <circle cx="4" cy="4" r="2" stroke="none"></circle>
          </svg>
        </a>
      </span>
    </div>
  </div>
  <div class="bg-gray-100">
    <div class="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
      <p class="text-gray-500 text-sm text-center sm:text-left">\xA9 2020 Tailblocks \u2014
        <a href="https://twitter.com/knyttneve" class="text-gray-600 ml-1" target="_blank" rel="noopener noreferrer">@knyttneve</a>
      </p>
      <span class="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-500 text-sm">Enamel pin tousled raclette tacos irony</span>
    </div>
  </div>
</footer>
`;

function z3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"67\" y=\"57\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"67\" y=\"65\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"67\" y=\"72\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"67\" y=\"79\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"67\" y=\"86\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"57\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"65\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"72\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"79\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"86\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"115\" y=\"57\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"115\" y=\"65\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"115\" y=\"72\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"115\" y=\"79\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"115\" y=\"86\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"163\" y=\"57\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"163\" y=\"65\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"163\" y=\"79\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"163\" y=\"72\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"163\" y=\"86\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"211\" y=\"57\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"211\" y=\"65\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"211\" y=\"72\" width=\"16\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"211\" y=\"79\" width=\"28\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"211\" y=\"86\" width=\"23\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"199\" y=\"117\" width=\"48\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><path stroke=\"#E2E8F0\" d=\"M266 103.5H0\" fill=\"none\"></path><path d=\"M79 114a2 2 0 012-2h25a2 2 0 012 2v6a2 2 0 01-2 2H81a2 2 0 01-2-2v-6z\" fill=\"#6366F1\"></path><rect x=\"20\" y=\"112\" width=\"55\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><path fill=\"#E2E8F0\" d=\"M0 131h266v19H0z\"></path><rect x=\"20\" y=\"139\" width=\"41\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"222\" y=\"139\" width=\"25\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$r = `
<footer class="text-gray-600 body-font">
  <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
    <a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span class="ml-3 text-xl">Tailblocks</span>
    </a>
    <p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">\xA9 2020 Tailblocks \u2014
      <a href="https://twitter.com/knyttneve" class="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank">@knyttneve</a>
    </p>
    <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
      <a class="text-gray-500">
        <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      </a>
      <a class="ml-3 text-gray-500">
        <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
        </svg>
      </a>
      <a class="ml-3 text-gray-500">
        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
        </svg>
      </a>
      <a class="ml-3 text-gray-500">
        <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
          <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
          <circle cx="4" cy="4" r="2" stroke="none"></circle>
        </svg>
      </a>
    </span>
  </div>
</footer>
`;

function z4s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path stroke=\"#E2E8F0\" d=\"M266 112.5H0\" fill=\"none\"></path><circle cx=\"29\" cy=\"131\" r=\"9\" fill=\"#6366F1\"></circle><rect x=\"213\" y=\"129\" width=\"31\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"53\" y=\"129\" width=\"45\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path fill=\"#CBD5E0\" d=\"M45 120h1v22h-1z\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$q = `
<footer class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap md:text-left text-center order-first">
      <div class="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/4 md:w-1/2 w-full px-4">
        <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CATEGORIES</h2>
        <nav class="list-none mb-10">
          <li>
            <a class="text-gray-600 hover:text-gray-800">First Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Second Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Third Link</a>
          </li>
          <li>
            <a class="text-gray-600 hover:text-gray-800">Fourth Link</a>
          </li>
        </nav>
      </div>
      <div class="lg:w-1/4 md:w-1/2 w-full px-4">
        <form style="margin: 0;">
          <h2 class="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">SUBSCRIBE</h2>
          <div class="flex xl:flex-nowrap md:flex-nowrap lg:flex-wrap flex-wrap justify-center items-end md:justify-start">
            <div class="relative w-40 sm:w-auto xl:mr-4 lg:mr-0 sm:mr-4 mr-2">
              <label for="footer-field" class="leading-7 text-sm text-gray-600">Placeholder</label>
              <input type="text" id="footer-field" name="footer-field" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
            </div>
            <button type="submit" class="lg:mt-2 xl:mt-0 flex-shrink-0 inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
          </div>
          <p class="text-gray-500 text-sm mt-2 md:text-left text-center">Bitters chicharrones fanny pack
            <br class="lg:block hidden">waistcoat green juice
          </p>
        </form>
      </div>
    </div>
  </div>
  <div class="bg-gray-100">
    <div class="container px-5 py-6 mx-auto flex items-center sm:flex-row flex-col">
      <a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        <span class="ml-3 text-xl">Tailblocks</span>
      </a>
      <p class="text-sm text-gray-500 sm:ml-6 sm:mt-0 mt-4">\xA9 2020 Tailblocks \u2014
        <a href="https://twitter.com/knyttneve" rel="noopener noreferrer" class="text-gray-600 ml-1" target="_blank">@knyttneve</a>
      </p>
      <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
        <a class="text-gray-500">
          <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
          </svg>
        </a>
        <a class="ml-3 text-gray-500">
          <svg fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="0" class="w-5 h-5" viewBox="0 0 24 24">
            <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
            <circle cx="4" cy="4" r="2" stroke="none"></circle>
          </svg>
        </a>
      </span>
    </div>
  </div>
</footer>
`;

function z5s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"63.385\" y=\"76\" width=\"32.308\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"63.385\" y=\"84\" width=\"21.231\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"63.385\" y=\"91\" width=\"14.769\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"63.385\" y=\"98\" width=\"25.846\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"63.385\" y=\"105\" width=\"21.231\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"76\" width=\"32.308\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"84\" width=\"21.231\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"91\" width=\"14.769\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"98\" width=\"25.846\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"105\" width=\"21.231\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"107.692\" y=\"76\" width=\"32.308\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"163\" y=\"76\" width=\"32.308\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"107.692\" y=\"84\" width=\"21.231\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"107.692\" y=\"91\" width=\"14.769\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"107.692\" y=\"98\" width=\"25.846\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"107.692\" y=\"105\" width=\"21.231\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><path d=\"M217 86a2 2 0 012-2h25a2 2 0 012 2v6a2 2 0 01-2 2h-25a2 2 0 01-2-2v-6z\" fill=\"#6366F1\"></path><rect x=\"163\" y=\"84\" width=\"50\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><path fill=\"#E2E8F0\" d=\"M0 119h266v31H0z\"></path><circle cx=\"28.5\" cy=\"134.5\" r=\"8.5\" fill=\"#6366F1\"></circle><rect x=\"45\" y=\"133\" width=\"30\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"198\" y=\"133\" width=\"48\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$p = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex flex-wrap">
    <div class="flex w-full mb-20 flex-wrap">
      <h1 class="sm:text-3xl text-2xl font-medium title-font text-gray-900 lg:w-1/3 lg:mb-0 mb-4">Master Cleanse Reliac Heirloom</h1>
      <p class="lg:pl-6 lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep jianbing selfies heirloom.</p>
    </div>
    <div class="flex flex-wrap md:-m-2 -m-1">
      <div class="flex flex-wrap w-1/2">
        <div class="md:p-2 p-1 w-1/2">
          <img alt="gallery" class="w-full object-cover h-full object-center block" src="https://dummyimage.com/500x300">
        </div>
        <div class="md:p-2 p-1 w-1/2">
          <img alt="gallery" class="w-full object-cover h-full object-center block" src="https://dummyimage.com/501x301">
        </div>
        <div class="md:p-2 p-1 w-full">
          <img alt="gallery" class="w-full h-full object-cover object-center block" src="https://dummyimage.com/600x360">
        </div>
      </div>
      <div class="flex flex-wrap w-1/2">
        <div class="md:p-2 p-1 w-full">
          <img alt="gallery" class="w-full h-full object-cover object-center block" src="https://dummyimage.com/601x361">
        </div>
        <div class="md:p-2 p-1 w-1/2">
          <img alt="gallery" class="w-full object-cover h-full object-center block" src="https://dummyimage.com/502x302">
        </div>
        <div class="md:p-2 p-1 w-1/2">
          <img alt="gallery" class="w-full object-cover h-full object-center block" src="https://dummyimage.com/503x303">
        </div>
      </div>
    </div>
  </div>
</section>
`;

function g1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"142\" y=\"32\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"32\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"142\" y=\"40\" width=\"77\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path fill=\"#E2E8F0\" d=\"M20 61h55v27H20zM20 91h111v39H20z\"></path><path d=\"M70.556 118h10.888c.86 0 1.556-.696 1.556-1.556v-10.888c0-.86-.696-1.556-1.556-1.556H70.556c-.86 0-1.556.696-1.556 1.556v10.888c0 .86.696 1.556 1.556 1.556zm0 0l8.555-8.556L83 113.333m-8.556-5.055a1.166 1.166 0 11-2.332 0 1.166 1.166 0 012.332 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.2px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><path fill=\"#E2E8F0\" d=\"M78 61h53v27H78z\"></path><path d=\"M101.111 79h7.778A1.11 1.11 0 00110 77.889V70.11a1.11 1.11 0 00-1.111-1.11h-7.778A1.11 1.11 0 00100 70.111v7.778A1.11 1.11 0 00101.111 79zm0 0l6.111-6.111L110 75.667m-6.111-3.611a.833.833 0 11-1.666 0 .833.833 0 011.666 0zM44.111 79h7.778c.613 0 1.111-.498 1.111-1.111V70.11c0-.614-.498-1.111-1.111-1.111H44.11c-.613 0-1.111.498-1.111 1.111v7.778c0 .614.498 1.111 1.111 1.111zm0 0l6.111-6.111L53 75.667m-6.111-3.611a.833.833 0 11-1.667 0 .833.833 0 011.667 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><path fill=\"#E2E8F0\" d=\"M134 103h56v27h-56z\"></path><path d=\"M158.111 122h7.778a1.11 1.11 0 001.111-1.111v-7.778a1.11 1.11 0 00-1.111-1.111h-7.778a1.11 1.11 0 00-1.111 1.111v7.778a1.11 1.11 0 001.111 1.111zm0 0l6.111-6.111 2.778 2.778m-6.111-3.611a.833.833 0 11-1.666 0 .833.833 0 011.666 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><path fill=\"#E2E8F0\" d=\"M134 61h112v39H134zM193 103h53v27h-53z\"></path><path d=\"M215.111 122h7.778a1.11 1.11 0 001.111-1.111v-7.778a1.11 1.11 0 00-1.111-1.111h-7.778a1.11 1.11 0 00-1.111 1.111v7.778a1.11 1.11 0 001.111 1.111zm0 0l6.111-6.111 2.778 2.778m-6.111-3.611a.833.833 0 11-1.666 0 .833.833 0 011.666 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><path d=\"M184.556 87h10.888c.86 0 1.556-.696 1.556-1.556V74.556c0-.86-.696-1.556-1.556-1.556h-10.888c-.86 0-1.556.696-1.556 1.556v10.888c0 .86.696 1.556 1.556 1.556zm0 0l8.555-8.556 3.889 3.89m-8.556-5.056a1.166 1.166 0 11-2.333 0 1.166 1.166 0 012.333 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.2px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$o = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex flex-wrap">
    <div class="lg:w-2/3 mx-auto">
      <div class="flex flex-wrap w-full bg-gray-100 py-32 px-10 relative mb-4">
        <img alt="gallery" class="w-full object-cover h-full object-center block opacity-25 absolute inset-0" src="https://dummyimage.com/820x340">
        <div class="text-center relative z-10 w-full">
          <h2 class="text-2xl text-gray-900 font-medium title-font mb-2">Shooting Stars</h2>
          <p class="leading-relaxed">Skateboard +1 mustache fixie paleo lumbersexual.</p>
          <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="flex flex-wrap -mx-2">
        <div class="px-2 w-1/2">
          <div class="flex flex-wrap w-full bg-gray-100 sm:py-24 py-16 sm:px-10 px-6 relative">
            <img alt="gallery" class="w-full object-cover h-full object-center block opacity-25 absolute inset-0" src="https://dummyimage.com/542x460">
            <div class="text-center relative z-10 w-full">
              <h2 class="text-xl text-gray-900 font-medium title-font mb-2">Shooting Stars</h2>
              <p class="leading-relaxed">Skateboard +1 mustache fixie paleo lumbersexual.</p>
              <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div class="px-2 w-1/2">
          <div class="flex flex-wrap w-full bg-gray-100 sm:py-24 py-16 sm:px-10 px-6 relative">
            <img alt="gallery" class="w-full object-cover h-full object-center block opacity-25 absolute inset-0" src="https://dummyimage.com/542x420">
            <div class="text-center relative z-10 w-full">
              <h2 class="text-xl text-gray-900 font-medium title-font mb-2">Shooting Stars</h2>
              <p class="leading-relaxed">Skateboard +1 mustache fixie paleo lumbersexual.</p>
              <a class="mt-3 text-indigo-500 inline-flex items-center">Learn More
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function g2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path fill=\"#E2E8F0\" d=\"M71 84h62v38H71zM71 27h127v54H71zM136 84h62v38h-62z\"></path><path d=\"M93 54.5a1.5 1.5 0 011.5-1.5h77a1.5 1.5 0 010 3h-77a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M123 61.5a1.5 1.5 0 011.5-1.5h17a1.5 1.5 0 010 3h-17a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><rect x=\"108\" y=\"45\" width=\"50\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><path d=\"M81 103.5a1.5 1.5 0 011.5-1.5h39a1.5 1.5 0 010 3h-39a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M97 110.5a1.5 1.5 0 011.5-1.5h7a1.5 1.5 0 010 3h-7a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><rect x=\"89\" y=\"94\" width=\"26\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><path d=\"M146 103.5a1.5 1.5 0 011.5-1.5h39a1.5 1.5 0 010 3h-39a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M162 110.5a1.5 1.5 0 011.5-1.5h7a1.5 1.5 0 010 3h-7a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><rect x=\"154\" y=\"94\" width=\"26\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$n = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Master Cleanse Reliac Heirloom</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep jianbing selfies heirloom.</p>
    </div>
    <div class="flex flex-wrap -m-4">
      <div class="lg:w-1/3 sm:w-1/2 p-4">
        <div class="flex relative">
          <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/600x360">
          <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
            <h2 class="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE SUBTITLE</h2>
            <h1 class="title-font text-lg font-medium text-gray-900 mb-3">Shooting Stars</h1>
            <p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
          </div>
        </div>
      </div>
      <div class="lg:w-1/3 sm:w-1/2 p-4">
        <div class="flex relative">
          <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/601x361">
          <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
            <h2 class="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE SUBTITLE</h2>
            <h1 class="title-font text-lg font-medium text-gray-900 mb-3">The Catalyzer</h1>
            <p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
          </div>
        </div>
      </div>
      <div class="lg:w-1/3 sm:w-1/2 p-4">
        <div class="flex relative">
          <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/603x363">
          <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
            <h2 class="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE SUBTITLE</h2>
            <h1 class="title-font text-lg font-medium text-gray-900 mb-3">The 400 Blows</h1>
            <p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
          </div>
        </div>
      </div>
      <div class="lg:w-1/3 sm:w-1/2 p-4">
        <div class="flex relative">
          <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/602x362">
          <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
            <h2 class="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE SUBTITLE</h2>
            <h1 class="title-font text-lg font-medium text-gray-900 mb-3">Neptune</h1>
            <p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
          </div>
        </div>
      </div>
      <div class="lg:w-1/3 sm:w-1/2 p-4">
        <div class="flex relative">
          <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/605x365">
          <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
            <h2 class="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE SUBTITLE</h2>
            <h1 class="title-font text-lg font-medium text-gray-900 mb-3">Holden Caulfield</h1>
            <p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
          </div>
        </div>
      </div>
      <div class="lg:w-1/3 sm:w-1/2 p-4">
        <div class="flex relative">
          <img alt="gallery" class="absolute inset-0 w-full h-full object-cover object-center" src="https://dummyimage.com/606x366">
          <div class="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
            <h2 class="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE SUBTITLE</h2>
            <h1 class="title-font text-lg font-medium text-gray-900 mb-3">Alper Kamu</h1>
            <p class="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function g3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path fill=\"#E2E8F0\" d=\"M20 61h72v32H20zM97 61h72v32H97zM174 61h72v32h-72zM20 98h72v32H20zM97 98h72v32H97zM174 98h72v32h-72z\"></path><rect x=\"81\" y=\"31\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"81\" y=\"31\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"96\" y=\"20\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"97\" y=\"39\" width=\"73\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path d=\"M50.556 84h10.888c.86 0 1.556-.696 1.556-1.556V71.556c0-.86-.696-1.556-1.556-1.556H50.556c-.86 0-1.556.696-1.556 1.556v10.888c0 .86.696 1.556 1.556 1.556zm0 0l8.555-8.556L63 79.334m-8.556-5.056a1.167 1.167 0 11-2.333 0 1.167 1.167 0 012.333 0zM127.556 84h10.888c.86 0 1.556-.696 1.556-1.556V71.556c0-.86-.696-1.556-1.556-1.556h-10.888c-.86 0-1.556.696-1.556 1.556v10.888c0 .86.696 1.556 1.556 1.556zm0 0l8.555-8.556 3.889 3.89m-8.556-5.056a1.166 1.166 0 11-2.333 0 1.166 1.166 0 012.333 0zM204.556 84h10.888c.86 0 1.556-.696 1.556-1.556V71.556c0-.86-.696-1.556-1.556-1.556h-10.888c-.86 0-1.556.696-1.556 1.556v10.888c0 .86.696 1.556 1.556 1.556zm0 0l8.555-8.556 3.889 3.89m-8.556-5.056a1.166 1.166 0 11-2.333 0 1.166 1.166 0 012.333 0zM204.556 121h10.888c.86 0 1.556-.696 1.556-1.556v-10.888c0-.86-.696-1.556-1.556-1.556h-10.888c-.86 0-1.556.696-1.556 1.556v10.888c0 .86.696 1.556 1.556 1.556zm0 0l8.555-8.556 3.889 3.889m-8.556-5.055a1.166 1.166 0 11-2.332 0 1.166 1.166 0 012.332 0zM127.556 121h10.888c.86 0 1.556-.696 1.556-1.556v-10.888c0-.86-.696-1.556-1.556-1.556h-10.888c-.86 0-1.556.696-1.556 1.556v10.888c0 .86.696 1.556 1.556 1.556zm0 0l8.555-8.556 3.889 3.889m-8.556-5.055a1.166 1.166 0 11-2.332 0 1.166 1.166 0 012.332 0zM50.556 121h10.888c.86 0 1.556-.696 1.556-1.556v-10.888c0-.86-.696-1.556-1.556-1.556H50.556c-.86 0-1.556.696-1.556 1.556v10.888c0 .86.696 1.556 1.556 1.556zm0 0l8.555-8.556L63 116.333m-8.556-5.055a1.166 1.166 0 11-2.332 0 1.166 1.166 0 012.332 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.2px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$m = `
<header class="text-gray-600 body-font">
  <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span class="ml-3 text-xl">Tailblocks</span>
    </a>
    <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
      <a class="mr-5 hover:text-gray-900">First Link</a>
      <a class="mr-5 hover:text-gray-900">Second Link</a>
      <a class="mr-5 hover:text-gray-900">Third Link</a>
      <a class="mr-5 hover:text-gray-900">Fourth Link</a>
    </nav>
    <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
      <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"></path>
      </svg>
    </button>
  </div>
</header>
`;

function h1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path stroke=\"#E2E8F0\" d=\"M266 38.5H0\" fill=\"none\"></path><rect x=\"217\" y=\"14\" width=\"29\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><circle cx=\"29\" cy=\"19\" r=\"9\" fill=\"#6366F1\"></circle><rect x=\"150.132\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"171.264\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"192.396\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"129\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$l = `
<header class="text-gray-600 body-font">
  <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span class="ml-3 text-xl">Tailblocks</span>
    </a>
    <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
      <a class="mr-5 hover:text-gray-900">First Link</a>
      <a class="mr-5 hover:text-gray-900">Second Link</a>
      <a class="mr-5 hover:text-gray-900">Third Link</a>
      <a class="mr-5 hover:text-gray-900">Fourth Link</a>
    </nav>
    <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
      <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"></path>
      </svg>
    </button>
  </div>
</header>
`;

function h2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path stroke=\"#E2E8F0\" d=\"M266 38.5H0\" fill=\"none\"></path><rect x=\"141\" y=\"14\" width=\"29\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><circle cx=\"29\" cy=\"19\" r=\"9\" fill=\"#6366F1\"></circle><rect x=\"74.132\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"95.264\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"116.396\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"53\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><path fill=\"#CBD5E0\" d=\"M45 8h1v22h-1z\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$k = `
<header class="text-gray-600 body-font">
  <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <nav class="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto">
      <a class="mr-5 hover:text-gray-900">First Link</a>
      <a class="mr-5 hover:text-gray-900">Second Link</a>
      <a class="mr-5 hover:text-gray-900">Third Link</a>
      <a class="hover:text-gray-900">Fourth Link</a>
    </nav>
    <a class="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span class="ml-3 text-xl">Tailblocks</span>
    </a>
    <div class="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0">
      <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  </div>
</header>
`;

function h3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path stroke=\"#E2E8F0\" d=\"M266 38.5H0\" fill=\"none\"></path><rect x=\"217\" y=\"14\" width=\"29\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><circle cx=\"133\" cy=\"19\" r=\"9\" fill=\"#6366F1\"></circle><rect x=\"62.264\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"41.132\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"83.396\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$j = `
<header class="text-gray-600 body-font">
  <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span class="ml-3 text-xl">Tailblocks</span>
    </a>
    <nav class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
      <a class="mr-5 hover:text-gray-900">First Link</a>
      <a class="mr-5 hover:text-gray-900">Second Link</a>
      <a class="mr-5 hover:text-gray-900">Third Link</a>
      <a class="mr-5 hover:text-gray-900">Fourth Link</a>
    </nav>
    <button class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Button
      <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"></path>
      </svg>
    </button>
  </div>
</header>
`;

function h4s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path stroke=\"#E2E8F0\" d=\"M266 38.5H0\" fill=\"none\"></path><rect x=\"217\" y=\"14\" width=\"29\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><circle cx=\"29\" cy=\"19\" r=\"9\" fill=\"#6366F1\"></circle><rect x=\"129.264\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"108.132\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"150.396\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"87\" y=\"17\" width=\"16.604\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$i = `
<section class="text-gray-600 body-font">
  <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
      <img class="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
    </div>
    <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
      <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Before they sold out
        <br class="hidden lg:inline-block">readymade gluten
      </h1>
      <p class="mb-8 leading-relaxed">Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken authentic tumeric truffaut hexagon try-hard chambray.</p>
      <div class="flex justify-center">
        <button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
        <button class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button</button>
      </div>
    </div>
  </div>
</section>
`;

function r1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"133\" y=\"86\" width=\"29\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"168\" y=\"86\" width=\"29\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"133\" y=\"64\" width=\"104\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"133\" y=\"53\" width=\"72\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"133\" y=\"72\" width=\"97\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path d=\"M62.778 92h26.444A3.778 3.778 0 0093 88.222V61.778A3.778 3.778 0 0089.222 58H62.778A3.778 3.778 0 0059 61.778v26.444A3.778 3.778 0 0062.778 92zm0 0l20.778-20.778L93 80.667M72.222 68.389a2.833 2.833 0 11-5.666 0 2.833 2.833 0 015.666 0z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$h = `
<section class="text-gray-600 body-font">
  <div class="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
    <img class="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
    <div class="text-center lg:w-2/3 w-full">
      <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Microdosing synth tattooed vexillologist</h1>
      <p class="mb-8 leading-relaxed">Meggings kinfolk echo park stumptown DIY, kale chips beard jianbing tousled. Chambray dreamcatcher trust fund, kitsch vice godard disrupt ramps hexagon mustache umami snackwave tilde chillwave ugh. Pour-over meditation PBR&B pickled ennui celiac mlkshk freegan photo booth af fingerstache pitchfork.</p>
      <div class="flex justify-center">
        <button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
        <button class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button</button>
      </div>
    </div>
  </div>
</section>
`;

function r2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"136\" y=\"114\" width=\"29\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"101\" y=\"114\" width=\"29\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"81\" y=\"92\" width=\"104\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"97\" y=\"81\" width=\"72\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"85\" y=\"100\" width=\"97\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path d=\"M119.778 61h26.444A3.778 3.778 0 00150 57.222V30.778A3.778 3.778 0 00146.222 27h-26.444A3.778 3.778 0 00116 30.778v26.444A3.778 3.778 0 00119.778 61zm0 0l20.778-20.778L150 49.667m-20.778-12.278a2.833 2.833 0 11-5.666 0 2.833 2.833 0 015.666 0z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$g = `
<section class="text-gray-600 body-font">
  <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
      <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Before they sold out
        <br class="hidden lg:inline-block">readymade gluten
      </h1>
      <p class="mb-8 leading-relaxed">Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken authentic tumeric truffaut hexagon try-hard chambray.</p>
      <div class="flex justify-center">
        <button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
        <button class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button</button>
      </div>
    </div>
    <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
      <img class="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
    </div>
  </div>
</section>
`;

function r3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"20\" y=\"86\" width=\"29\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"55\" y=\"86\" width=\"29\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"20\" y=\"64\" width=\"104\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"53\" width=\"72\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"72\" width=\"97\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path d=\"M176.778 92h26.444A3.778 3.778 0 00207 88.222V61.778A3.778 3.778 0 00203.222 58h-26.444A3.778 3.778 0 00173 61.778v26.444A3.778 3.778 0 00176.778 92zm0 0l20.778-20.778L207 80.667m-20.778-12.278a2.833 2.833 0 11-5.666 0 2.833 2.833 0 015.666 0z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$f = `
<section class="text-gray-600 body-font">
  <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
      <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Knausgaard typewriter readymade marfa</h1>
      <p class="mb-8 leading-relaxed">Chillwave portland ugh, knausgaard fam polaroid iPhone. Man braid swag typewriter affogato, hella selvage wolf narwhal dreamcatcher.</p>
      <form style="margin: 0;">
        <div class="flex w-full md:justify-start justify-center items-end">
          <div class="relative mr-4 md:w-full lg:w-full xl:w-1/2 w-2/4">
            <label for="hero-field" class="leading-7 text-sm text-gray-600">Placeholder</label>
            <input type="text" id="hero-field" name="hero-field" class="w-full bg-gray-100 rounded border bg-opacity-50 border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-transparent focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
          </div>
          <button type="submit" class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
        </div>
      </form>
      <p class="text-sm mt-2 text-gray-500 mb-8 w-full">Neutra shabby chic ramps, viral fixie.</p>
      <div class="flex lg:flex-row md:flex-col">
        <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 512 512">
            <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
          </svg>
          <span class="ml-4 flex items-start flex-col leading-none">
            <span class="text-xs text-gray-600 mb-1">GET IT ON</span>
            <span class="title-font font-medium">Google Play</span>
          </span>
        </button>
        <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center lg:ml-4 md:ml-0 ml-4 md:mt-4 mt-0 lg:mt-0 hover:bg-gray-200 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 305 305">
            <path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
            <path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
          </svg>
          <span class="ml-4 flex items-start flex-col leading-none">
            <span class="text-xs text-gray-600 mb-1">Download on the</span>
            <span class="title-font font-medium">App Store</span>
          </span>
        </button>
      </div>
    </div>
    <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
      <img class="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
    </div>
  </div>
</section>
`;

function r4s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M79 88a2 2 0 012-2h25a2 2 0 012 2v6a2 2 0 01-2 2H81a2 2 0 01-2-2v-6z\" fill=\"#6366F1\"></path><rect x=\"20\" y=\"86\" width=\"55\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"20\" y=\"64\" width=\"104\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"53\" width=\"72\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"72\" width=\"97\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path d=\"M176.778 92h26.444A3.778 3.778 0 00207 88.222V61.778A3.778 3.778 0 00203.222 58h-26.444A3.778 3.778 0 00173 61.778v26.444A3.778 3.778 0 00176.778 92zm0 0l20.778-20.778L207 80.667m-20.778-12.278a2.833 2.833 0 11-5.666 0 2.833 2.833 0 015.666 0z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$e = `
<section class="text-gray-600 body-font">
  <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
      <img class="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
    </div>
    <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
      <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Knausgaard typewriter readymade marfa</h1>
      <p class="mb-8 leading-relaxed">Chillwave portland ugh, knausgaard fam polaroid iPhone. Man braid swag typewriter affogato, hella selvage wolf narwhal dreamcatcher.</p>
      <form style="margin: 0;">
        <div class="flex w-full md:justify-start justify-center items-end">
          <div class="relative mr-4 lg:w-full xl:w-1/2 w-2/4">
            <label for="hero-field" class="leading-7 text-sm text-gray-600">Placeholder</label>
            <input type="text" id="hero-field" name="hero-field" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:bg-transparent focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
          </div>
          <button type="submit" class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
        </div>
      </form>
      <p class="text-sm mt-2 text-gray-500 mb-8 w-full">Neutra shabby chic ramps, viral fixie.</p>
      <div class="flex lg:flex-row md:flex-col">
        <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 512 512">
            <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
          </svg>
          <span class="ml-4 flex items-start flex-col leading-none">
            <span class="text-xs text-gray-600 mb-1">GET IT ON</span>
            <span class="title-font font-medium">Google Play</span>
          </span>
        </button>
        <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center lg:ml-4 md:ml-0 ml-4 md:mt-4 mt-0 lg:mt-0 hover:bg-gray-200 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 305 305">
            <path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
            <path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
          </svg>
          <span class="ml-4 flex items-start flex-col leading-none">
            <span class="text-xs text-gray-600 mb-1">Download on the</span>
            <span class="title-font font-medium">App Store</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</section>
`;

function r5s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M192 88a2 2 0 012-2h25a2 2 0 012 2v6a2 2 0 01-2 2h-25a2 2 0 01-2-2v-6z\" fill=\"#6366F1\"></path><rect x=\"133\" y=\"86\" width=\"55\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"133\" y=\"64\" width=\"104\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"133\" y=\"53\" width=\"72\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"133\" y=\"72\" width=\"97\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path d=\"M62.778 92h26.444A3.778 3.778 0 0093 88.222V61.778A3.778 3.778 0 0089.222 58H62.778A3.778 3.778 0 0059 61.778v26.444A3.778 3.778 0 0062.778 92zm0 0l20.778-20.778L93 80.667M72.222 68.389a2.833 2.833 0 11-5.666 0 2.833 2.833 0 015.666 0z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$d = `
<section class="text-gray-600 body-font">
  <div class="container mx-auto flex flex-col px-5 py-24 justify-center items-center">
    <img class="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
    <div class="w-full md:w-2/3 flex flex-col mb-16 items-center text-center">
      <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Knausgaard typewriter readymade marfa</h1>
      <p class="mb-8 leading-relaxed">Kickstarter biodiesel roof party wayfarers cold-pressed. Palo santo live-edge tumeric scenester copper mug flexitarian. Prism vice offal plaid everyday carry. Gluten-free chia VHS squid listicle artisan.</p>
      <form style="margin: 0;">
        <div class="flex w-full justify-center items-end">
          <div class="relative mr-4 lg:w-full xl:w-1/2 w-2/4 md:w-full text-left">
            <label for="hero-field" class="leading-7 text-sm text-gray-600">Placeholder</label>
            <input type="text" id="hero-field" name="hero-field" class="w-full bg-gray-100 bg-opacity-50 rounded focus:ring-2 focus:ring-indigo-200 focus:bg-transparent border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" required>
          </div>
          <button type="submit" class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
        </div>
      </form>
      <p class="text-sm mt-2 text-gray-500 mb-8 w-full">Neutra shabby chic ramps, viral fixie.</p>
      <div class="flex">
        <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 512 512">
            <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
          </svg>
          <span class="ml-4 flex items-start flex-col leading-none">
            <span class="text-xs text-gray-600 mb-1">GET IT ON</span>
            <span class="title-font font-medium">Google Play</span>
          </span>
        </button>
        <button class="bg-gray-100 inline-flex py-3 px-5 rounded-lg items-center ml-4 hover:bg-gray-200 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 h-6" viewBox="0 0 305 305">
            <path d="M40.74 112.12c-25.79 44.74-9.4 112.65 19.12 153.82C74.09 286.52 88.5 305 108.24 305c.37 0 .74 0 1.13-.02 9.27-.37 15.97-3.23 22.45-5.99 7.27-3.1 14.8-6.3 26.6-6.3 11.22 0 18.39 3.1 25.31 6.1 6.83 2.95 13.87 6 24.26 5.81 22.23-.41 35.88-20.35 47.92-37.94a168.18 168.18 0 0021-43l.09-.28a2.5 2.5 0 00-1.33-3.06l-.18-.08c-3.92-1.6-38.26-16.84-38.62-58.36-.34-33.74 25.76-51.6 31-54.84l.24-.15a2.5 2.5 0 00.7-3.51c-18-26.37-45.62-30.34-56.73-30.82a50.04 50.04 0 00-4.95-.24c-13.06 0-25.56 4.93-35.61 8.9-6.94 2.73-12.93 5.09-17.06 5.09-4.64 0-10.67-2.4-17.65-5.16-9.33-3.7-19.9-7.9-31.1-7.9l-.79.01c-26.03.38-50.62 15.27-64.18 38.86z"></path>
            <path d="M212.1 0c-15.76.64-34.67 10.35-45.97 23.58-9.6 11.13-19 29.68-16.52 48.38a2.5 2.5 0 002.29 2.17c1.06.08 2.15.12 3.23.12 15.41 0 32.04-8.52 43.4-22.25 11.94-14.5 17.99-33.1 16.16-49.77A2.52 2.52 0 00212.1 0z"></path>
          </svg>
          <span class="ml-4 flex items-start flex-col leading-none">
            <span class="text-xs text-gray-600 mb-1">Download on the</span>
            <span class="title-font font-medium">App Store</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</section>
`;

function r6s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"81\" y=\"92\" width=\"104\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"97\" y=\"81\" width=\"72\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><path d=\"M148 116a2 2 0 012-2h25a2 2 0 012 2v6a2 2 0 01-2 2h-25a2 2 0 01-2-2v-6z\" fill=\"#6366F1\"></path><rect x=\"89\" y=\"114\" width=\"55\" height=\"10\" rx=\"2\" fill=\"#CBD5E0\"></rect><rect x=\"85\" y=\"100\" width=\"97\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path d=\"M119.778 61h26.444A3.778 3.778 0 00150 57.222V30.778A3.778 3.778 0 00146.222 27h-26.444A3.778 3.778 0 00116 30.778v26.444A3.778 3.778 0 00119.778 61zm0 0l20.778-20.778L150 49.667m-20.778-12.278a2.833 2.833 0 11-5.666 0 2.833 2.833 0 015.666 0z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$c = `
<section class="text-gray-600 body-font overflow-hidden">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h1 class="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">Pricing</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical.</p>
    </div>
    <div class="flex flex-wrap -m-4">
      <div class="p-4 xl:w-1/4 md:w-1/2 w-full">
        <div class="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
          <h2 class="text-sm tracking-widest title-font mb-1 font-medium">START</h2>
          <h1 class="text-5xl text-gray-900 pb-4 mb-4 border-b border-gray-200 leading-none">Free</h1>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Vexillologist pitchfork</span>
          </p>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Tumeric plaid portland</span>
          </p>
          <p class="flex items-center text-gray-600 mb-6">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Mixtape chillwave tumeric</span>
          </p>
          <button class="flex items-center mt-auto text-white bg-gray-400 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-500 rounded">Button
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-auto" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
          <p class="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
        </div>
      </div>
      <div class="p-4 xl:w-1/4 md:w-1/2 w-full">
        <div class="h-full p-6 rounded-lg border-2 border-indigo-500 flex flex-col relative overflow-hidden">
          <span class="bg-indigo-500 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">POPULAR</span>
          <h2 class="text-sm tracking-widest title-font mb-1 font-medium">PRO</h2>
          <h1 class="text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
            <span>$38</span>
            <span class="text-lg ml-1 font-normal text-gray-500">/mo</span>
          </h1>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Vexillologist pitchfork</span>
          </p>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Tumeric plaid portland</span>
          </p>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Hexagon neutra unicorn</span>
          </p>
          <p class="flex items-center text-gray-600 mb-6">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Mixtape chillwave tumeric</span>
          </p>
          <button class="flex items-center mt-auto text-white bg-indigo-500 border-0 py-2 px-4 w-full focus:outline-none hover:bg-indigo-600 rounded">Button
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-auto" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
          <p class="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
        </div>
      </div>
      <div class="p-4 xl:w-1/4 md:w-1/2 w-full">
        <div class="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
          <h2 class="text-sm tracking-widest title-font mb-1 font-medium">BUSINESS</h2>
          <h1 class="text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
            <span>$56</span>
            <span class="text-lg ml-1 font-normal text-gray-500">/mo</span>
          </h1>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Vexillologist pitchfork</span>
          </p>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Tumeric plaid portland</span>
          </p>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Hexagon neutra unicorn</span>
          </p>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Vexillologist pitchfork</span>
          </p>
          <p class="flex items-center text-gray-600 mb-6">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Mixtape chillwave tumeric</span>
          </p>
          <button class="flex items-center mt-auto text-white bg-gray-400 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-500 rounded">Button
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-auto" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
          <p class="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
        </div>
      </div>
      <div class="p-4 xl:w-1/4 md:w-1/2 w-full">
        <div class="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
          <h2 class="text-sm tracking-widest title-font mb-1 font-medium">SPECIAL</h2>
          <h1 class="text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
            <span>$72</span>
            <span class="text-lg ml-1 font-normal text-gray-500">/mo</span>
          </h1>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Vexillologist pitchfork</span>
          </p>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Tumeric plaid portland</span>
          </p>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Hexagon neutra unicorn</span>
          </p>
          <p class="flex items-center text-gray-600 mb-2">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Vexillologist pitchfork</span>
          </p>
          <p class="flex items-center text-gray-600 mb-6">
            <span class="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" class="w-3 h-3" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span><span>Mixtape chillwave tumeric</span>
          </p>
          <button class="flex items-center mt-auto text-white bg-gray-400 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-500 rounded">Button
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-auto" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
          <p class="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function p1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"96\" y=\"22\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"87\" y=\"31\" width=\"92\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path d=\"M65.5 83a.5.5 0 010 1h-41a.5.5 0 010-1h41z\" fill=\"#E2E8F0\"></path><rect x=\"20.5\" y=\"69.5\" width=\"49\" height=\"58\" rx=\"1.5\" stroke=\"#CBD5E0\" fill=\"none\"></rect><circle cx=\"26\" cy=\"89\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"24\" y=\"77\" width=\"18\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"30\" y=\"88\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"26\" cy=\"95\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"30\" y=\"94\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"26\" cy=\"101\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"30\" y=\"100\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"26\" cy=\"107\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"30\" y=\"106\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"24\" y=\"73\" width=\"10\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><path d=\"M24 116.5a2 2 0 012-2h38a2 2 0 012 2v4a2 2 0 01-2 2H26a2 2 0 01-2-2v-4z\" fill=\"#A0AEC0\"></path><path d=\"M124.5 83a.5.5 0 010 1h-41a.5.5 0 010-1h41z\" fill=\"#E2E8F0\"></path><rect x=\"79.5\" y=\"69.5\" width=\"49\" height=\"58\" rx=\"1.5\" stroke=\"#6366F1\" fill=\"none\"></rect><circle cx=\"85\" cy=\"89\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"83\" y=\"77\" width=\"18\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"89\" y=\"88\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"85\" cy=\"95\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"89\" y=\"94\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"85\" cy=\"101\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"89\" y=\"100\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"85\" cy=\"107\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"89\" y=\"106\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"83\" y=\"73\" width=\"10\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><path d=\"M183.5 83a.5.5 0 010 1h-41a.5.5 0 010-1h41z\" fill=\"#E2E8F0\"></path><rect x=\"138.5\" y=\"69.5\" width=\"49\" height=\"58\" rx=\"1.5\" stroke=\"#CBD5E0\" fill=\"none\"></rect><circle cx=\"144\" cy=\"89\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"142\" y=\"77\" width=\"18\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"148\" y=\"88\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"144\" cy=\"95\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"148\" y=\"94\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"144\" cy=\"101\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"148\" y=\"100\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"144\" cy=\"107\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"148\" y=\"106\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"142\" y=\"73\" width=\"10\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><path d=\"M142 116.5a2 2 0 012-2h38a2 2 0 012 2v4a2 2 0 01-2 2h-38a2 2 0 01-2-2v-4z\" fill=\"#A0AEC0\"></path><path d=\"M83 116.5a2 2 0 012-2h38a2 2 0 012 2v4a2 2 0 01-2 2H85a2 2 0 01-2-2v-4z\" fill=\"#6366F1\"></path><path d=\"M242.5 83a.5.5 0 010 1h-41a.5.5 0 010-1h41z\" fill=\"#E2E8F0\"></path><rect x=\"197.5\" y=\"69.5\" width=\"49\" height=\"58\" rx=\"1.5\" stroke=\"#CBD5E0\" fill=\"none\"></rect><circle cx=\"203\" cy=\"89\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"201\" y=\"77\" width=\"18\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><rect x=\"207\" y=\"88\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"203\" cy=\"95\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"207\" y=\"94\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"203\" cy=\"101\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"207\" y=\"100\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><circle cx=\"203\" cy=\"107\" r=\"2\" fill=\"#A0AEC0\"></circle><rect x=\"207\" y=\"106\" width=\"34\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"201\" y=\"73\" width=\"10\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><path d=\"M201 116.5a2 2 0 012-2h38a2 2 0 012 2v4a2 2 0 01-2 2h-38a2 2 0 01-2-2v-4z\" fill=\"#A0AEC0\"></path><path d=\"M118 43.5h30a1.5 1.5 0 011.5 1.5v4a1.5 1.5 0 01-1.5 1.5h-30a1.5 1.5 0 01-1.5-1.5v-4a1.5 1.5 0 011.5-1.5z\" stroke=\"#6366F1\" fill=\"none\"></path><path fill=\"#6366F1\" d=\"M117 43h16v7h-16z\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$b = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h1 class="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">Pricing</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Banh mi cornhole echo park skateboard authentic crucifix neutra tilde lyft biodiesel artisan direct trade mumblecore 3 wolf moon twee</p>
    </div>
    <div class="lg:w-2/3 w-full mx-auto overflow-auto">
      <table class="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          <tr>
            <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl"><span>Plan</span></th>
            <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"><span>Speed</span></th>
            <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"><span>Storage</span></th>
            <th class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"><span>Price</span></th>
            <th class="w-10 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="px-4 py-3"><span>Start</span></td>
            <td class="px-4 py-3"><span>5 Mb/s</span></td>
            <td class="px-4 py-3"><span>15 GB</span></td>
            <td class="px-4 py-3 text-lg text-gray-900"><span>Free</span></td>
            <td class="w-10 text-center">
              <input name="plan" type="radio">
            </td>
          </tr>
          <tr>
            <td class="border-t-2 border-gray-200 px-4 py-3"><span>Pro</span></td>
            <td class="border-t-2 border-gray-200 px-4 py-3"><span>25 Mb/s</span></td>
            <td class="border-t-2 border-gray-200 px-4 py-3"><span>25 GB</span></td>
            <td class="border-t-2 border-gray-200 px-4 py-3 text-lg text-gray-900"><span>$24</span></td>
            <td class="border-t-2 border-gray-200 w-10 text-center">
              <input name="plan" type="radio">
            </td>
          </tr>
          <tr>
            <td class="border-t-2 border-gray-200 px-4 py-3"><span>Business</span></td>
            <td class="border-t-2 border-gray-200 px-4 py-3"><span>36 Mb/s</span></td>
            <td class="border-t-2 border-gray-200 px-4 py-3"><span>40 GB</span></td>
            <td class="border-t-2 border-gray-200 px-4 py-3 text-lg text-gray-900"><span>$50</span></td>
            <td class="border-t-2 border-gray-200 w-10 text-center">
              <input name="plan" type="radio">
            </td>
          </tr>
          <tr>
            <td class="border-t-2 border-b-2 border-gray-200 px-4 py-3"><span>Exclusive</span></td>
            <td class="border-t-2 border-b-2 border-gray-200 px-4 py-3"><span>48 Mb/s</span></td>
            <td class="border-t-2 border-b-2 border-gray-200 px-4 py-3"><span>120 GB</span></td>
            <td class="border-t-2 border-b-2 border-gray-200 px-4 py-3 text-lg text-gray-900"><span>$72</span></td>
            <td class="border-t-2 border-b-2 border-gray-200 w-10 text-center">
              <input name="plan" type="radio">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex pl-4 mt-4 lg:w-2/3 w-full mx-auto">
      <a class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">Learn More
        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </a>
      <button class="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Button</button>
    </div>
  </div>
</section>
`;

function p2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"110\" y=\"20\" width=\"46\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"87\" y=\"29\" width=\"92\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"106\" y=\"37\" width=\"55\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"50\" y=\"57\" width=\"167\" height=\"11\" rx=\"1\" fill=\"#E2E8F0\"></rect><rect x=\"55\" y=\"61\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"55\" y=\"121\" width=\"19\" height=\"3\" rx=\"1.5\" fill=\"#6366F1\"></rect><rect x=\"108\" y=\"61\" width=\"24\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"145\" y=\"61\" width=\"30\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"188\" y=\"61\" width=\"20\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"55\" y=\"74\" width=\"26\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"108\" y=\"74\" width=\"12\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M216.5 82a.5.5 0 010 1h-166a.5.5 0 010-1h166z\" fill=\"#E2E8F0\"></path><rect x=\"145\" y=\"74\" width=\"13\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"188\" y=\"74\" width=\"20\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"55\" y=\"89\" width=\"39\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"108\" y=\"89\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M216.5 97a.5.5 0 010 1h-166a.5.5 0 010-1h166z\" fill=\"#E2E8F0\"></path><rect x=\"145\" y=\"89\" width=\"18\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"188\" y=\"89\" width=\"13\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"55\" y=\"104\" width=\"33\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"108\" y=\"104\" width=\"14\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><path d=\"M216.5 112a.5.5 0 010 1h-166a.5.5 0 010-1h166z\" fill=\"#E2E8F0\"></path><rect x=\"182\" y=\"119\" width=\"31\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect><rect x=\"145\" y=\"104\" width=\"18\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"188\" y=\"104\" width=\"20\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$a = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap -m-4 text-center">
      <div class="p-4 sm:w-1/4 w-1/2">
        <h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">2.7K</h2>
        <p class="leading-relaxed">Users</p>
      </div>
      <div class="p-4 sm:w-1/4 w-1/2">
        <h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">1.8K</h2>
        <p class="leading-relaxed">Subscribes</p>
      </div>
      <div class="p-4 sm:w-1/4 w-1/2">
        <h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">35</h2>
        <p class="leading-relaxed">Downloads</p>
      </div>
      <div class="p-4 sm:w-1/4 w-1/2">
        <h2 class="title-font font-medium sm:text-4xl text-3xl text-gray-900">4</h2>
        <p class="leading-relaxed">Products</p>
      </div>
    </div>
  </div>
</section>
`;

function s1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"45\" y=\"66\" width=\"26\" height=\"10\" rx=\"5\" fill=\"#4A5568\"></rect><rect x=\"43\" y=\"80\" width=\"30\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"95\" y=\"66\" width=\"26\" height=\"10\" rx=\"5\" fill=\"#4A5568\"></rect><rect x=\"93\" y=\"80\" width=\"30\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"145\" y=\"66\" width=\"26\" height=\"10\" rx=\"5\" fill=\"#4A5568\"></rect><rect x=\"143\" y=\"80\" width=\"30\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"195\" y=\"66\" width=\"26\" height=\"10\" rx=\"5\" fill=\"#4A5568\"></rect><rect x=\"193\" y=\"80\" width=\"30\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$9 = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex flex-wrap">
    <div class="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
      <div class="w-full sm:p-4 px-4 mb-6">
        <h1 class="title-font font-medium text-xl mb-2 text-gray-900">Moon hashtag pop-up try-hard offal truffaut</h1>
        <div class="leading-relaxed">Pour-over craft beer pug drinking vinegar live-edge gastropub, keytar neutra sustainable fingerstache kickstarter.</div>
      </div>
      <div class="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
        <h2 class="title-font font-medium text-3xl text-gray-900">2.7K</h2>
        <p class="leading-relaxed">Users</p>
      </div>
      <div class="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
        <h2 class="title-font font-medium text-3xl text-gray-900">1.8K</h2>
        <p class="leading-relaxed">Subscribes</p>
      </div>
      <div class="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
        <h2 class="title-font font-medium text-3xl text-gray-900">35</h2>
        <p class="leading-relaxed">Downloads</p>
      </div>
      <div class="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
        <h2 class="title-font font-medium text-3xl text-gray-900">4</h2>
        <p class="leading-relaxed">Products</p>
      </div>
    </div>
    <div class="lg:w-1/2 sm:w-1/3 w-full rounded-lg overflow-hidden mt-6 sm:mt-0">
      <img class="object-cover object-center w-full h-full" src="https://dummyimage.com/600x300" alt="stats">
    </div>
  </div>
</section>
`;

function s2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M175.792 92h26.544a3.785 3.785 0 003.792-3.778V61.778A3.785 3.785 0 00202.336 58h-26.544A3.785 3.785 0 00172 61.778v26.444A3.785 3.785 0 00175.792 92zm0 0l20.856-20.778 9.48 9.445m-20.856-12.278a2.838 2.838 0 01-2.844 2.833 2.838 2.838 0 01-2.844-2.833 2.838 2.838 0 012.844-2.833 2.838 2.838 0 012.844 2.833z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"20\" y=\"46\" width=\"70\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"57\" width=\"98\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"65\" width=\"87\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"20\" y=\"88\" width=\"17\" height=\"7\" rx=\"3.5\" fill=\"#4A5568\"></rect><rect x=\"20\" y=\"99\" width=\"20\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"46\" y=\"88\" width=\"17\" height=\"7\" rx=\"3.5\" fill=\"#4A5568\"></rect><rect x=\"46\" y=\"99\" width=\"20\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"72\" y=\"88\" width=\"17\" height=\"7\" rx=\"3.5\" fill=\"#4A5568\"></rect><rect x=\"72\" y=\"99\" width=\"20\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"98\" y=\"88\" width=\"17\" height=\"7\" rx=\"3.5\" fill=\"#4A5568\"></rect><rect x=\"98\" y=\"99\" width=\"20\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$8 = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Master Cleanse Reliac Heirloom</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them man bun deep jianbing selfies heirloom prism food truck ugh squid celiac humblebrag.</p>
    </div>
    <div class="flex flex-wrap -m-4 text-center">
      <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
        <div class="border-2 border-gray-200 px-4 py-6 rounded-lg">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
            <path d="M8 17l4 4 4-4m-4-5v9"></path>
            <path d="M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29"></path>
          </svg>
          <h2 class="title-font font-medium text-3xl text-gray-900">2.7K</h2>
          <p class="leading-relaxed">Downloads</p>
        </div>
      </div>
      <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
        <div class="border-2 border-gray-200 px-4 py-6 rounded-lg">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"></path>
          </svg>
          <h2 class="title-font font-medium text-3xl text-gray-900">1.3K</h2>
          <p class="leading-relaxed">Users</p>
        </div>
      </div>
      <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
        <div class="border-2 border-gray-200 px-4 py-6 rounded-lg">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
            <path d="M3 18v-6a9 9 0 0118 0v6"></path>
            <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"></path>
          </svg>
          <h2 class="title-font font-medium text-3xl text-gray-900">74</h2>
          <p class="leading-relaxed">Files</p>
        </div>
      </div>
      <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
        <div class="border-2 border-gray-200 px-4 py-6 rounded-lg">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <h2 class="title-font font-medium text-3xl text-gray-900">46</h2>
          <p class="leading-relaxed">Places</p>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function s3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M21 64.5h48a.5.5 0 01.5.5v33a.5.5 0 01-.5.5H21a.5.5 0 01-.5-.5V65a.5.5 0 01.5-.5z\" stroke=\"#CBD5E0\" fill=\"none\"></path><path d=\"M50 75a5 5 0 11-10 0 5 5 0 0110 0z\" fill=\"#6366F1\"></path><path d=\"M39 92a1 1 0 011-1h10a1 1 0 110 2H40a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"35\" y=\"84\" width=\"20\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><path d=\"M80 64.5h48a.5.5 0 01.5.5v33a.5.5 0 01-.5.5H80a.5.5 0 01-.5-.5V65a.5.5 0 01.5-.5z\" stroke=\"#CBD5E0\" fill=\"none\"></path><path d=\"M109 75a5 5 0 11-10 0 5 5 0 0110 0z\" fill=\"#6366F1\"></path><path d=\"M98 92a1 1 0 011-1h10a1 1 0 010 2H99a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"94\" y=\"84\" width=\"20\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><path d=\"M139 64.5h48a.5.5 0 01.5.5v33a.5.5 0 01-.5.5h-48a.5.5 0 01-.5-.5V65a.5.5 0 01.5-.5z\" stroke=\"#CBD5E0\" fill=\"none\"></path><path d=\"M168 75a5 5 0 11-10 0 5 5 0 0110 0z\" fill=\"#6366F1\"></path><path d=\"M157 92a1 1 0 011-1h10a1 1 0 010 2h-10a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"153\" y=\"84\" width=\"20\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><path d=\"M198 64.5h48a.5.5 0 01.5.5v33a.5.5 0 01-.5.5h-48a.5.5 0 01-.5-.5V65a.5.5 0 01.5-.5z\" stroke=\"#CBD5E0\" fill=\"none\"></path><path d=\"M227 75a5 5 0 11-10 0 5 5 0 0110 0z\" fill=\"#6366F1\"></path><path d=\"M216 92a1 1 0 011-1h10a1 1 0 010 2h-10a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"212\" y=\"84\" width=\"20\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"81\" y=\"36\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"81\" y=\"36\" width=\"104.391\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"96\" y=\"25\" width=\"74\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"97\" y=\"44\" width=\"73\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"113\" y=\"115\" width=\"40\" height=\"10\" rx=\"2\" fill=\"#6366F1\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$7 = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex flex-wrap">
    <div class="flex flex-wrap w-full">
      <div class="lg:w-2/5 md:w-1/2 md:pr-10 md:py-6">
        <div class="flex relative pb-12">
          <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
            <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
          </div>
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div class="flex-grow pl-4">
            <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 1</h2>
            <p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
          </div>
        </div>
        <div class="flex relative pb-12">
          <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
            <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
          </div>
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <div class="flex-grow pl-4">
            <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 2</h2>
            <p class="leading-relaxed">Vice migas literally kitsch +1 pok pok. Truffaut hot chicken slow-carb health goth, vape typewriter.</p>
          </div>
        </div>
        <div class="flex relative pb-12">
          <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
            <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
          </div>
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="3"></circle>
              <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
            </svg>
          </div>
          <div class="flex-grow pl-4">
            <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 3</h2>
            <p class="leading-relaxed">Coloring book nar whal glossier master cleanse umami. Salvia +1 master cleanse blog taiyaki.</p>
          </div>
        </div>
        <div class="flex relative pb-12">
          <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
            <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
          </div>
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="flex-grow pl-4">
            <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 4</h2>
            <p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
          </div>
        </div>
        <div class="flex relative">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01l-3-3"></path>
            </svg>
          </div>
          <div class="flex-grow pl-4">
            <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">FINISH</h2>
            <p class="leading-relaxed">Pitchfork ugh tattooed scenester echo park gastropub whatever cold-pressed retro.</p>
          </div>
        </div>
      </div>
      <img class="lg:w-3/5 md:w-1/2 object-cover object-center rounded-lg md:mt-0 mt-12" src="https://dummyimage.com/1200x500" alt="step">
    </div>
  </div>
</section>
`;

function q1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M24 28.5a.5.5 0 011 0v94a.5.5 0 01-1 0v-94z\" fill=\"#CBD5E0\"></path><path d=\"M29 30.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z\" fill=\"#6366F1\"></path><path d=\"M34 35a1 1 0 011-1h54a1 1 0 110 2H35a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"34\" y=\"28\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><path d=\"M29 52.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z\" fill=\"#6366F1\"></path><path d=\"M34 57a1 1 0 011-1h54a1 1 0 110 2H35a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"34\" y=\"50\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><path d=\"M29 74.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z\" fill=\"#6366F1\"></path><path d=\"M34 79a1 1 0 011-1h54a1 1 0 110 2H35a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"34\" y=\"72\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><path d=\"M29 96.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z\" fill=\"#6366F1\"></path><path d=\"M34 101a1 1 0 011-1h54a1 1 0 010 2H35a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"34\" y=\"94\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><path d=\"M29 118.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z\" fill=\"#6366F1\"></path><path d=\"M34 123a1 1 0 011-1h54a1 1 0 010 2H35a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"34\" y=\"116\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><path d=\"M175.792 89h26.544a3.785 3.785 0 003.792-3.778V58.778A3.785 3.785 0 00202.336 55h-26.544A3.785 3.785 0 00172 58.778v26.444A3.785 3.785 0 00175.792 89zm0 0l20.856-20.778 9.48 9.445m-20.856-12.278a2.838 2.838 0 01-2.844 2.833 2.838 2.838 0 01-2.844-2.833 2.838 2.838 0 012.844-2.833 2.838 2.838 0 012.844 2.833z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$6 = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto flex flex-wrap">
    <div class="flex relative pt-10 pb-20 sm:items-center md:w-2/3 mx-auto">
      <div class="h-full w-6 absolute inset-0 flex items-center justify-center">
        <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
      </div>
      <div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">1</div>
      <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
        <div class="flex-shrink-0 w-24 h-24 bg-indigo-100 text-indigo-500 rounded-full inline-flex items-center justify-center">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-12 h-12" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
          <h2 class="font-medium title-font text-gray-900 mb-1 text-xl">Shooting Stars</h2>
          <p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
        </div>
      </div>
    </div>
    <div class="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
      <div class="h-full w-6 absolute inset-0 flex items-center justify-center">
        <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
      </div>
      <div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">2</div>
      <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
        <div class="flex-shrink-0 w-24 h-24 bg-indigo-100 text-indigo-500 rounded-full inline-flex items-center justify-center">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-12 h-12" viewBox="0 0 24 24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
          <h2 class="font-medium title-font text-gray-900 mb-1 text-xl">The Catalyzer</h2>
          <p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
        </div>
      </div>
    </div>
    <div class="flex relative pb-20 sm:items-center md:w-2/3 mx-auto">
      <div class="h-full w-6 absolute inset-0 flex items-center justify-center">
        <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
      </div>
      <div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">3</div>
      <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
        <div class="flex-shrink-0 w-24 h-24 bg-indigo-100 text-indigo-500 rounded-full inline-flex items-center justify-center">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-12 h-12" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="3"></circle>
            <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
          </svg>
        </div>
        <div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
          <h2 class="font-medium title-font text-gray-900 mb-1 text-xl">The 400 Blows</h2>
          <p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
        </div>
      </div>
    </div>
    <div class="flex relative pb-10 sm:items-center md:w-2/3 mx-auto">
      <div class="h-full w-6 absolute inset-0 flex items-center justify-center">
        <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
      </div>
      <div class="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">4</div>
      <div class="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
        <div class="flex-shrink-0 w-24 h-24 bg-indigo-100 text-indigo-500 rounded-full inline-flex items-center justify-center">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-12 h-12" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="flex-grow sm:pl-6 mt-6 sm:mt-0">
          <h2 class="font-medium title-font text-gray-900 mb-1 text-xl">Neptune</h2>
          <p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function q3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M24 28.5a.5.5 0 011 0v93a.5.5 0 01-1 0v-93z\" fill=\"#CBD5E0\"></path><path d=\"M26 40.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z\" fill=\"#6366F1\"></path><path d=\"M47 43a1 1 0 011-1h54a1 1 0 010 2H48a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"47\" y=\"36\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><circle cx=\"36.5\" cy=\"40.5\" r=\"6.5\" fill=\"#C3DAFE\"></circle><path d=\"M26 63.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z\" fill=\"#6366F1\"></path><path d=\"M47 66a1 1 0 011-1h54a1 1 0 010 2H48a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"47\" y=\"59\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><circle cx=\"36.5\" cy=\"63.5\" r=\"6.5\" fill=\"#C3DAFE\"></circle><path d=\"M26 86.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z\" fill=\"#6366F1\"></path><path d=\"M47 89a1 1 0 011-1h54a1 1 0 010 2H48a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"47\" y=\"82\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><circle cx=\"36.5\" cy=\"86.5\" r=\"6.5\" fill=\"#C3DAFE\"></circle><path d=\"M26 109.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z\" fill=\"#6366F1\"></path><path d=\"M47 112a1 1 0 011-1h54a1 1 0 010 2H48a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"47\" y=\"105\" width=\"35\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><circle cx=\"36.5\" cy=\"109.5\" r=\"6.5\" fill=\"#C3DAFE\"></circle><path d=\"M175.792 89h26.544a3.785 3.785 0 003.792-3.778V58.778A3.785 3.785 0 00202.336 55h-26.544A3.785 3.785 0 00172 58.778v26.444A3.785 3.785 0 00175.792 89zm0 0l20.856-20.778 9.48 9.445m-20.856-12.278a2.838 2.838 0 01-2.844 2.833 2.838 2.838 0 01-2.844-2.833 2.838 2.838 0 012.844-2.833 2.838 2.838 0 012.844 2.833z\" stroke=\"#A0AEC0\" stroke-width=\"3px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$5 = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Our Team</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them.</p>
    </div>
    <div class="flex flex-wrap -m-2">
      <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
        <div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
          <img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/80x80">
          <div class="flex-grow">
            <h2 class="text-gray-900 title-font font-medium">Holden Caulfield</h2>
            <p class="text-gray-500">UI Designer</p>
          </div>
        </div>
      </div>
      <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
        <div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
          <img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/84x84">
          <div class="flex-grow">
            <h2 class="text-gray-900 title-font font-medium">Henry Letham</h2>
            <p class="text-gray-500">CTO</p>
          </div>
        </div>
      </div>
      <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
        <div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
          <img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/88x88">
          <div class="flex-grow">
            <h2 class="text-gray-900 title-font font-medium">Oskar Blinde</h2>
            <p class="text-gray-500">Founder</p>
          </div>
        </div>
      </div>
      <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
        <div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
          <img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/90x90">
          <div class="flex-grow">
            <h2 class="text-gray-900 title-font font-medium">John Doe</h2>
            <p class="text-gray-500">DevOps</p>
          </div>
        </div>
      </div>
      <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
        <div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
          <img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/94x94">
          <div class="flex-grow">
            <h2 class="text-gray-900 title-font font-medium">Martin Eden</h2>
            <p class="text-gray-500">Software Engineer</p>
          </div>
        </div>
      </div>
      <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
        <div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
          <img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/98x98">
          <div class="flex-grow">
            <h2 class="text-gray-900 title-font font-medium">Boris Kitua</h2>
            <p class="text-gray-500">UX Researcher</p>
          </div>
        </div>
      </div>
      <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
        <div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
          <img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/100x90">
          <div class="flex-grow">
            <h2 class="text-gray-900 title-font font-medium">Atticus Finch</h2>
            <p class="text-gray-500">QA Engineer</p>
          </div>
        </div>
      </div>
      <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
        <div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
          <img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/104x94">
          <div class="flex-grow">
            <h2 class="text-gray-900 title-font font-medium">Alper Kamu</h2>
            <p class="text-gray-500">System</p>
          </div>
        </div>
      </div>
      <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
        <div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
          <img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/108x98">
          <div class="flex-grow">
            <h2 class="text-gray-900 title-font font-medium">Rodrigo Monchi</h2>
            <p class="text-gray-500">Product Manager</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function t1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"110\" y=\"20\" width=\"46\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"87\" y=\"29\" width=\"92\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"44\" y=\"52\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"44\" y=\"58\" width=\"20\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><circle cx=\"31.5\" cy=\"56.5\" r=\"7.5\" fill=\"#E2E8F0\"></circle><rect x=\"20.5\" y=\"45.5\" width=\"69\" height=\"22\" rx=\"1.5\" stroke=\"#CBD5E0\" fill=\"none\"></rect><rect x=\"122\" y=\"52\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"122\" y=\"58\" width=\"20\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><circle cx=\"109.5\" cy=\"56.5\" r=\"7.5\" fill=\"#E2E8F0\"></circle><rect x=\"98.5\" y=\"45.5\" width=\"69\" height=\"22\" rx=\"1.5\" stroke=\"#CBD5E0\" fill=\"none\"></rect><rect x=\"200\" y=\"52\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"200\" y=\"58\" width=\"20\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><circle cx=\"187.5\" cy=\"56.5\" r=\"7.5\" fill=\"#E2E8F0\"></circle><rect x=\"176.5\" y=\"45.5\" width=\"69\" height=\"22\" rx=\"1.5\" stroke=\"#CBD5E0\" fill=\"none\"></rect><rect x=\"44\" y=\"83\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"44\" y=\"89\" width=\"20\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><circle cx=\"31.5\" cy=\"87.5\" r=\"7.5\" fill=\"#E2E8F0\"></circle><rect x=\"20.5\" y=\"76.5\" width=\"69\" height=\"22\" rx=\"1.5\" stroke=\"#CBD5E0\" fill=\"none\"></rect><rect x=\"122\" y=\"83\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"122\" y=\"89\" width=\"20\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><circle cx=\"109.5\" cy=\"87.5\" r=\"7.5\" fill=\"#E2E8F0\"></circle><rect x=\"98.5\" y=\"76.5\" width=\"69\" height=\"22\" rx=\"1.5\" stroke=\"#CBD5E0\" fill=\"none\"></rect><rect x=\"200\" y=\"83\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"200\" y=\"89\" width=\"20\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><circle cx=\"187.5\" cy=\"87.5\" r=\"7.5\" fill=\"#E2E8F0\"></circle><rect x=\"176.5\" y=\"76.5\" width=\"69\" height=\"22\" rx=\"1.5\" stroke=\"#CBD5E0\" fill=\"none\"></rect><rect x=\"44\" y=\"114\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"44\" y=\"120\" width=\"20\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><circle cx=\"31.5\" cy=\"118.5\" r=\"7.5\" fill=\"#E2E8F0\"></circle><rect x=\"20.5\" y=\"107.5\" width=\"69\" height=\"22\" rx=\"1.5\" stroke=\"#CBD5E0\" fill=\"none\"></rect><rect x=\"122\" y=\"114\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"122\" y=\"120\" width=\"20\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><circle cx=\"109.5\" cy=\"118.5\" r=\"7.5\" fill=\"#E2E8F0\"></circle><rect x=\"98.5\" y=\"107.5\" width=\"69\" height=\"22\" rx=\"1.5\" stroke=\"#CBD5E0\" fill=\"none\"></rect><rect x=\"200\" y=\"114\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"200\" y=\"120\" width=\"20\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><circle cx=\"187.5\" cy=\"118.5\" r=\"7.5\" fill=\"#E2E8F0\"></circle><rect x=\"176.5\" y=\"107.5\" width=\"69\" height=\"22\" rx=\"1.5\" stroke=\"#CBD5E0\" fill=\"none\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$4 = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h1 class="text-2xl font-medium title-font mb-4 text-gray-900 tracking-widest">OUR TEAM</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them.</p>
    </div>
    <div class="flex flex-wrap -m-4">
      <div class="p-4 lg:w-1/2">
        <div class="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
          <img alt="team" class="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://dummyimage.com/200x200">
          <div class="flex-grow sm:pl-8">
            <h2 class="title-font font-medium text-lg text-gray-900">Holden Caulfield</h2>
            <h3 class="text-gray-500 mb-3">UI Developer</h3>
            <p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
            <span class="inline-flex">
              <a class="text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </div>
      <div class="p-4 lg:w-1/2">
        <div class="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
          <img alt="team" class="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://dummyimage.com/201x201">
          <div class="flex-grow sm:pl-8">
            <h2 class="title-font font-medium text-lg text-gray-900">Alper Kamu</h2>
            <h3 class="text-gray-500 mb-3">Designer</h3>
            <p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
            <span class="inline-flex">
              <a class="text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </div>
      <div class="p-4 lg:w-1/2">
        <div class="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
          <img alt="team" class="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://dummyimage.com/204x204">
          <div class="flex-grow sm:pl-8">
            <h2 class="title-font font-medium text-lg text-gray-900">Atticus Finch</h2>
            <h3 class="text-gray-500 mb-3">UI Developer</h3>
            <p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
            <span class="inline-flex">
              <a class="text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </div>
      <div class="p-4 lg:w-1/2">
        <div class="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
          <img alt="team" class="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://dummyimage.com/206x206">
          <div class="flex-grow sm:pl-8">
            <h2 class="title-font font-medium text-lg text-gray-900">Henry Letham</h2>
            <h3 class="text-gray-500 mb-3">Designer</h3>
            <p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
            <span class="inline-flex">
              <a class="text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function t2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"110\" y=\"28\" width=\"46\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"87\" y=\"37\" width=\"92\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path d=\"M36.111 83H50.89A2.111 2.111 0 0053 80.889V66.11A2.111 2.111 0 0050.889 64H36.11A2.111 2.111 0 0034 66.111V80.89a2.11 2.11 0 002.111 2.111zm0 0l11.611-11.611L53 76.667m-11.611-6.861a1.583 1.583 0 11-3.167 0 1.583 1.583 0 013.167 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.7px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"66\" y=\"65\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><path d=\"M66 73.5a1.5 1.5 0 011.5-1.5h48a1.5 1.5 0 010 3h-48a1.5 1.5 0 01-1.5-1.5zm0 7a1.5 1.5 0 011.5-1.5h53a1.5 1.5 0 010 3h-53a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M147.111 83h14.778A2.111 2.111 0 00164 80.889V66.11a2.111 2.111 0 00-2.111-2.11h-14.778A2.111 2.111 0 00145 66.111V80.89a2.11 2.11 0 002.111 2.111zm0 0l11.611-11.611L164 76.667m-11.611-6.861a1.583 1.583 0 11-3.167 0 1.583 1.583 0 013.167 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.7px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"177\" y=\"65\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><path d=\"M177 73.5a1.5 1.5 0 011.5-1.5h48a1.5 1.5 0 010 3h-48a1.5 1.5 0 01-1.5-1.5zm0 7a1.5 1.5 0 011.5-1.5h53a1.5 1.5 0 010 3h-53a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M36.111 121H50.89a2.111 2.111 0 002.11-2.111v-14.778A2.111 2.111 0 0050.889 102H36.11a2.111 2.111 0 00-2.11 2.111v14.778A2.11 2.11 0 0036.111 121zm0 0l11.611-11.611L53 114.667m-11.611-6.861a1.583 1.583 0 11-3.167 0 1.583 1.583 0 013.167 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.7px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"66\" y=\"103\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><path d=\"M66 111.5a1.5 1.5 0 011.5-1.5h48a1.5 1.5 0 010 3h-48a1.5 1.5 0 01-1.5-1.5zm0 7a1.5 1.5 0 011.5-1.5h53a1.5 1.5 0 010 3h-53a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path><path d=\"M147.111 121h14.778a2.11 2.11 0 002.111-2.111v-14.778a2.11 2.11 0 00-2.111-2.111h-14.778a2.11 2.11 0 00-2.111 2.111v14.778a2.11 2.11 0 002.111 2.111zm0 0l11.611-11.611 5.278 5.278m-11.611-6.861a1.583 1.583 0 11-3.167 0 1.583 1.583 0 013.167 0z\" stroke=\"#A0AEC0\" stroke-width=\"1.7px\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"177\" y=\"103\" width=\"39\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><path d=\"M177 111.5a1.5 1.5 0 011.5-1.5h48a1.5 1.5 0 010 3h-48a1.5 1.5 0 01-1.5-1.5zm0 7a1.5 1.5 0 011.5-1.5h53a1.5 1.5 0 010 3h-53a1.5 1.5 0 01-1.5-1.5z\" fill=\"#A0AEC0\"></path></svg>", 'image/svg+xml')).firstChild;
}

const source$3 = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h1 class="text-2xl font-medium title-font mb-4 text-gray-900">OUR TEAM</h1>
      <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them.</p>
    </div>
    <div class="flex flex-wrap -m-4">
      <div class="p-4 lg:w-1/4 md:w-1/2">
        <div class="h-full flex flex-col items-center text-center">
          <img alt="team" class="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4" src="https://dummyimage.com/200x200">
          <div class="w-full">
            <h2 class="title-font font-medium text-lg text-gray-900">Alper Kamu</h2>
            <h3 class="text-gray-500 mb-3">UI Developer</h3>
            <p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
            <span class="inline-flex">
              <a class="text-gray-500">
                <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </div>
      <div class="p-4 lg:w-1/4 md:w-1/2">
        <div class="h-full flex flex-col items-center text-center">
          <img alt="team" class="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4" src="https://dummyimage.com/201x201">
          <div class="w-full">
            <h2 class="title-font font-medium text-lg text-gray-900">Holden Caulfield</h2>
            <h3 class="text-gray-500 mb-3">UI Developer</h3>
            <p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
            <span class="inline-flex">
              <a class="text-gray-500">
                <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </div>
      <div class="p-4 lg:w-1/4 md:w-1/2">
        <div class="h-full flex flex-col items-center text-center">
          <img alt="team" class="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4" src="https://dummyimage.com/202x202">
          <div class="w-full">
            <h2 class="title-font font-medium text-lg text-gray-900">Atticus Finch</h2>
            <h3 class="text-gray-500 mb-3">UI Developer</h3>
            <p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
            <span class="inline-flex">
              <a class="text-gray-500">
                <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </div>
      <div class="p-4 lg:w-1/4 md:w-1/2">
        <div class="h-full flex flex-col items-center text-center">
          <img alt="team" class="flex-shrink-0 rounded-lg w-full h-56 object-cover object-center mb-4" src="https://dummyimage.com/203x203">
          <div class="w-full">
            <h2 class="title-font font-medium text-lg text-gray-900">Henry Letham</h2>
            <h3 class="text-gray-500 mb-3">UI Developer</h3>
            <p class="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
            <span class="inline-flex">
              <a class="text-gray-500">
                <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a class="ml-2 text-gray-500">
                <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function t3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 266 150\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"110\" y=\"20\" width=\"46\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect><rect x=\"87\" y=\"29\" width=\"92\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><path d=\"M39.444 66h10.112c.797 0 1.444-.647 1.444-1.444V54.444c0-.797-.647-1.444-1.444-1.444H39.444c-.797 0-1.444.647-1.444 1.444v10.112c0 .797.647 1.444 1.444 1.444zm0 0l7.945-7.944L51 61.666m-7.944-4.694a1.083 1.083 0 11-2.167 0 1.083 1.083 0 012.167 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"24\" y=\"78\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"29\" y=\"82\" width=\"32\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"36\" y=\"74\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><path d=\"M98.444 66h10.112c.797 0 1.444-.647 1.444-1.444V54.444c0-.797-.647-1.444-1.444-1.444H98.444c-.797 0-1.444.647-1.444 1.444v10.112c0 .797.647 1.444 1.444 1.444zm0 0l7.945-7.944 3.611 3.61m-7.944-4.694a1.084 1.084 0 11-2.167 0 1.084 1.084 0 012.167 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"83\" y=\"78\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"88\" y=\"82\" width=\"32\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"95\" y=\"74\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><path d=\"M157.444 66h10.112c.797 0 1.444-.647 1.444-1.444V54.444c0-.797-.647-1.444-1.444-1.444h-10.112c-.797 0-1.444.647-1.444 1.444v10.112c0 .797.647 1.444 1.444 1.444zm0 0l7.945-7.944 3.611 3.61m-7.944-4.694a1.084 1.084 0 11-2.167 0 1.084 1.084 0 012.167 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"142\" y=\"78\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"147\" y=\"82\" width=\"32\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"154\" y=\"74\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><path d=\"M216.444 66h10.112c.797 0 1.444-.647 1.444-1.444V54.444c0-.797-.647-1.444-1.444-1.444h-10.112c-.797 0-1.444.647-1.444 1.444v10.112c0 .797.647 1.444 1.444 1.444zm0 0l7.945-7.944 3.611 3.61m-7.944-4.694a1.084 1.084 0 11-2.167 0 1.084 1.084 0 012.167 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"201\" y=\"78\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"206\" y=\"82\" width=\"32\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"213\" y=\"74\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><path d=\"M39.444 112h10.112c.797 0 1.444-.647 1.444-1.444v-10.112c0-.797-.647-1.444-1.444-1.444H39.444c-.797 0-1.444.647-1.444 1.444v10.112c0 .797.647 1.444 1.444 1.444zm0 0l7.945-7.944L51 107.667m-7.944-4.695a1.084 1.084 0 11-2.167.001 1.084 1.084 0 012.167-.001z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"24\" y=\"124\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"29\" y=\"128\" width=\"32\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"36\" y=\"120\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><path d=\"M98.444 112h10.112c.797 0 1.444-.647 1.444-1.444v-10.112c0-.797-.647-1.444-1.444-1.444H98.444c-.797 0-1.444.647-1.444 1.444v10.112c0 .797.647 1.444 1.444 1.444zm0 0l7.945-7.944 3.611 3.611m-7.944-4.695a1.084 1.084 0 11-2.167 0 1.084 1.084 0 012.167 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"83\" y=\"124\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"88\" y=\"128\" width=\"32\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"95\" y=\"120\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><path d=\"M157.444 112h10.112c.797 0 1.444-.647 1.444-1.444v-10.112c0-.797-.647-1.444-1.444-1.444h-10.112c-.797 0-1.444.647-1.444 1.444v10.112c0 .797.647 1.444 1.444 1.444zm0 0l7.945-7.944 3.611 3.611m-7.944-4.695a1.084 1.084 0 11-2.167 0 1.084 1.084 0 012.167 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"142\" y=\"124\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"147\" y=\"128\" width=\"32\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"154\" y=\"120\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect><path d=\"M216.444 112h10.112c.797 0 1.444-.647 1.444-1.444v-10.112c0-.797-.647-1.444-1.444-1.444h-10.112c-.797 0-1.444.647-1.444 1.444v10.112c0 .797.647 1.444 1.444 1.444zm0 0l7.945-7.944 3.611 3.611m-7.944-4.695a1.084 1.084 0 11-2.167 0 1.084 1.084 0 012.167 0z\" stroke=\"#A0AEC0\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><rect x=\"201\" y=\"124\" width=\"41\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"206\" y=\"128\" width=\"32\" height=\"2\" rx=\"1\" fill=\"#A0AEC0\"></rect><rect x=\"213\" y=\"120\" width=\"17\" height=\"2\" rx=\"1\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$2 = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <h1 class="text-3xl font-medium title-font text-gray-900 mb-12 text-center">Testimonials</h1>
    <div class="flex flex-wrap -m-4">
      <div class="p-4 md:w-1/2 w-full">
        <div class="h-full bg-gray-100 p-8 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="block w-5 h-5 text-gray-400 mb-4" viewBox="0 0 975.036 975.036">
            <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
          </svg>
          <p class="leading-relaxed mb-6">Synth chartreuse iPhone lomo cray raw denim brunch everyday carry neutra before they sold out fixie 90's microdosing. Tacos pinterest fanny pack venmo, post-ironic heirloom try-hard pabst authentic iceland.</p>
          <a class="inline-flex items-center">
            <img alt="testimonial" src="https://dummyimage.com/106x106" class="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center">
            <span class="flex-grow flex flex-col pl-4">
              <span class="title-font font-medium text-gray-900">Holden Caulfield</span>
              <span class="text-gray-500 text-sm">UI DEVELOPER</span>
            </span>
          </a>
        </div>
      </div>
      <div class="p-4 md:w-1/2 w-full">
        <div class="h-full bg-gray-100 p-8 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="block w-5 h-5 text-gray-400 mb-4" viewBox="0 0 975.036 975.036">
            <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
          </svg>
          <p class="leading-relaxed mb-6">Synth chartreuse iPhone lomo cray raw denim brunch everyday carry neutra before they sold out fixie 90's microdosing. Tacos pinterest fanny pack venmo, post-ironic heirloom try-hard pabst authentic iceland.</p>
          <a class="inline-flex items-center">
            <img alt="testimonial" src="https://dummyimage.com/107x107" class="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center">
            <span class="flex-grow flex flex-col pl-4">
              <span class="title-font font-medium text-gray-900">Alper Kamu</span>
              <span class="text-gray-500 text-sm">DESIGNER</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function m1s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><rect x=\"25\" y=\"57\" width=\"104\" height=\"62\" rx=\"1\" fill=\"#E2E8F0\"></rect><circle cx=\"39.5\" cy=\"105.5\" r=\"7.5\" fill=\"#CBD5E0\"></circle><path d=\"M52 108a1 1 0 011-1h24a1 1 0 010 2H53a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"52\" y=\"101\" width=\"43\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"32\" y=\"75\" width=\"76\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"32\" y=\"81\" width=\"88\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"32\" y=\"87\" width=\"83\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><path d=\"M38.641 63h-2.182a.354.354 0 00-.36.349v2.119c0 .192.161.349.36.349h1.044c-.014.554-.146.999-.398 1.333-.198.263-.498.481-.9.653a.344.344 0 00-.177.468l.258.53c.084.17.29.245.468.17.475-.2.876-.452 1.204-.758.399-.375.672-.797.82-1.268.148-.472.222-1.115.222-1.93v-1.666a.354.354 0 00-.359-.349zM32.761 68.97c.47-.199.869-.451 1.198-.757.403-.375.678-.796.826-1.264.148-.467.222-1.112.222-1.934v-1.666a.354.354 0 00-.359-.349h-2.183a.354.354 0 00-.359.349v2.119c0 .192.161.349.36.349h1.044c-.014.554-.146.999-.398 1.333-.198.263-.498.481-.9.653a.344.344 0 00-.177.468l.258.529c.083.17.29.245.468.17z\" fill=\"#A0AEC0\"></path><rect x=\"137\" y=\"57\" width=\"104\" height=\"62\" rx=\"1\" fill=\"#E2E8F0\"></rect><circle cx=\"151.5\" cy=\"105.5\" r=\"7.5\" fill=\"#CBD5E0\"></circle><path d=\"M164 108a1 1 0 011-1h24a1 1 0 010 2h-24a1 1 0 01-1-1z\" fill=\"#A0AEC0\"></path><rect x=\"164\" y=\"101\" width=\"43\" height=\"3\" rx=\"1.5\" fill=\"#4A5568\"></rect><rect x=\"144\" y=\"75\" width=\"76\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"144\" y=\"81\" width=\"88\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><rect x=\"144\" y=\"87\" width=\"83\" height=\"3\" rx=\"1.5\" fill=\"#A0AEC0\"></rect><path d=\"M150.641 63h-2.182a.354.354 0 00-.359.349v2.119c0 .192.16.349.359.349h1.044c-.014.554-.146.999-.398 1.333-.198.263-.498.481-.899.653a.344.344 0 00-.178.468l.258.53c.084.17.29.245.468.17.475-.2.876-.452 1.204-.758.399-.375.672-.797.82-1.268.148-.472.222-1.115.222-1.93v-1.666a.354.354 0 00-.359-.349zM144.761 68.97c.47-.199.869-.451 1.198-.757.403-.375.678-.796.826-1.264.148-.467.222-1.112.222-1.934v-1.666a.354.354 0 00-.359-.349h-2.183a.353.353 0 00-.358.349v2.119c0 .192.16.349.358.349h1.045c-.014.554-.146.999-.398 1.333-.198.263-.498.481-.899.653a.344.344 0 00-.178.468l.257.529c.084.17.291.245.469.17z\" fill=\"#A0AEC0\"></path><rect x=\"107\" y=\"31\" width=\"52\" height=\"5\" rx=\"2.5\" fill=\"#4A5568\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source$1 = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="xl:w-1/2 lg:w-3/4 w-full mx-auto text-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="inline-block w-8 h-8 text-gray-400 mb-8" viewBox="0 0 975.036 975.036">
        <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
      </svg>
      <p class="leading-relaxed text-lg">Edison bulb retro cloud bread echo park, helvetica stumptown taiyaki taxidermy 90's cronut +1 kinfolk. Single-origin coffee ennui shaman taiyaki vape DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware. Man bun next level coloring book skateboard four loko knausgaard. Kitsch keffiyeh master cleanse direct trade indigo juice before they sold out gentrify plaid gastropub normcore XOXO 90's pickled cindigo jean shorts. Slow-carb next level shoindigoitch ethical authentic, yr scenester sriracha forage franzen organic drinking vinegar.</p>
      <span class="inline-block h-1 w-10 rounded bg-indigo-500 mt-8 mb-6"></span>
      <h2 class="text-gray-900 font-medium title-font tracking-wider text-sm">HOLDEN CAULFIELD</h2>
      <p class="text-gray-500">Senior Product Designer</p>
    </div>
  </div>
</section>
`;

function m2s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M139.282 32h-4.365a.708.708 0 00-.718.697v4.239c0 .385.322.697.718.697h2.089c-.027 1.11-.293 1.998-.795 2.666-.396.527-.997.963-1.799 1.308a.687.687 0 00-.356.935l.517 1.06c.166.34.578.49.934.34.951-.398 1.753-.903 2.408-1.517.798-.748 1.346-1.593 1.641-2.536.296-.943.444-2.228.444-3.86v-3.332a.708.708 0 00-.718-.697zM127.523 43.94c.939-.398 1.737-.903 2.396-1.515.805-.748 1.355-1.59 1.651-2.526.296-.936.444-2.226.444-3.87v-3.332a.708.708 0 00-.718-.697h-4.365a.708.708 0 00-.718.697v4.239c0 .385.322.697.718.697h2.089c-.027 1.11-.293 1.998-.795 2.666-.397.527-.997.963-1.799 1.308a.689.689 0 00-.357.935l.516 1.057c.166.34.581.491.938.34z\" fill=\"#A0AEC0\"></path><rect x=\"95\" y=\"58\" width=\"76\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"123\" y=\"94\" width=\"20\" height=\"2\" rx=\"1\" fill=\"#6366F1\"></rect><rect x=\"89\" y=\"66\" width=\"88\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"92\" y=\"74\" width=\"83\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"103\" y=\"82\" width=\"60\" height=\"4\" rx=\"2\" fill=\"#A0AEC0\"></rect><rect x=\"113\" y=\"104\" width=\"40\" height=\"4\" rx=\"2\" fill=\"#4A5568\"></rect><rect x=\"106\" y=\"112\" width=\"54\" height=\"4\" rx=\"2\" fill=\"#CBD5E0\"></rect></svg>", 'image/svg+xml')).firstChild;
}

const source = `
<section class="text-gray-600 body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-wrap -m-4">
      <div class="lg:w-1/3 lg:mb-0 mb-6 p-4">
        <div class="h-full text-center">
          <img alt="testimonial" class="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://dummyimage.com/302x302">
          <p class="leading-relaxed">Edison bulb retro cloud bread echo park, helvetica stumptown taiyaki taxidermy 90's cronut +1 kinfolk. Single-origin coffee ennui shaman taiyaki vape DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
          <span class="inline-block h-1 w-10 rounded bg-indigo-500 mt-6 mb-4"></span>
          <h2 class="text-gray-900 font-medium title-font tracking-wider text-sm">HOLDEN CAULFIELD</h2>
          <p class="text-gray-500">Senior Product Designer</p>
        </div>
      </div>
      <div class="lg:w-1/3 lg:mb-0 mb-6 p-4">
        <div class="h-full text-center">
          <img alt="testimonial" class="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://dummyimage.com/300x300">
          <p class="leading-relaxed">Edison bulb retro cloud bread echo park, helvetica stumptown taiyaki taxidermy 90's cronut +1 kinfolk. Single-origin coffee ennui shaman taiyaki vape DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
          <span class="inline-block h-1 w-10 rounded bg-indigo-500 mt-6 mb-4"></span>
          <h2 class="text-gray-900 font-medium title-font tracking-wider text-sm">ALPER KAMU</h2>
          <p class="text-gray-500">UI Develeoper</p>
        </div>
      </div>
      <div class="lg:w-1/3 lg:mb-0 p-4">
        <div class="h-full text-center">
          <img alt="testimonial" class="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://dummyimage.com/305x305">
          <p class="leading-relaxed">Edison bulb retro cloud bread echo park, helvetica stumptown taiyaki taxidermy 90's cronut +1 kinfolk. Single-origin coffee ennui shaman taiyaki vape DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
          <span class="inline-block h-1 w-10 rounded bg-indigo-500 mt-6 mb-4"></span>
          <h2 class="text-gray-900 font-medium title-font tracking-wider text-sm">HENRY LETHAM</h2>
          <p class="text-gray-500">CTO</p>
        </div>
      </div>
    </div>
  </div>
</section>
`;

function m3s() {
  return (new DOMParser().parseFromString("<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 266 150\" fill=\"none\" width=\"266\"  height=\"150\" ><path fill=\"#FFFFFF\" d=\"M0 0h266v150H0z\"></path><path d=\"M21 77a2 2 0 012-2h59a2 2 0 110 4H23a2 2 0 01-2-2zM26 85a2 2 0 012-2h48.92a2 2 0 110 4H28a2 2 0 01-2-2z\" fill=\"#A0AEC0\"></path><path d=\"M38 104a2 2 0 012-2h25a2 2 0 110 4H40a2 2 0 01-2-2z\" fill=\"#4A5568\"></path><path d=\"M26 69a2 2 0 012-2h48.92a2 2 0 110 4H28a2 2 0 01-2-2z\" fill=\"#A0AEC0\"></path><path d=\"M44 94.5a1.5 1.5 0 011.5-1.5h13.38a1.5 1.5 0 010 3H45.5a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><circle cx=\"53\" cy=\"53\" r=\"8\" fill=\"#E2E8F0\"></circle><path d=\"M102 77a2 2 0 012-2h59a2 2 0 110 4h-59a2 2 0 01-2-2zM107 85a2 2 0 012-2h48.92a2 2 0 110 4H109a2 2 0 01-2-2z\" fill=\"#A0AEC0\"></path><path d=\"M119 104a2 2 0 012-2h25a2 2 0 110 4h-25a2 2 0 01-2-2z\" fill=\"#4A5568\"></path><path d=\"M107 69a2 2 0 012-2h48.92a2 2 0 110 4H109a2 2 0 01-2-2z\" fill=\"#A0AEC0\"></path><path d=\"M125 94.5a1.5 1.5 0 011.5-1.5h13.38a1.5 1.5 0 010 3H126.5a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><circle cx=\"134\" cy=\"53\" r=\"8\" fill=\"#E2E8F0\"></circle><path d=\"M183 77a2 2 0 012-2h59a2 2 0 110 4h-59a2 2 0 01-2-2zM188 85a2 2 0 012-2h48.92a2 2 0 110 4H190a2 2 0 01-2-2z\" fill=\"#A0AEC0\"></path><path d=\"M200 104a2 2 0 012-2h25a2 2 0 110 4h-25a2 2 0 01-2-2z\" fill=\"#4A5568\"></path><path d=\"M188 69a2 2 0 012-2h48.92a2 2 0 110 4H190a2 2 0 01-2-2z\" fill=\"#A0AEC0\"></path><path d=\"M206 94.5a1.5 1.5 0 011.5-1.5h13.38a1.5 1.5 0 010 3H207.5a1.5 1.5 0 01-1.5-1.5z\" fill=\"#6366F1\"></path><circle cx=\"215\" cy=\"53\" r=\"8\" fill=\"#E2E8F0\"></circle></svg>", 'image/svg+xml')).firstChild;
}

const sources = [
  {
    id: "blog-block-1",
    class: "",
    label: index.getSvgHtml(b1s),
    content: source$Z,
    category: "Blog"
  },
  {
    id: "blog-block-2",
    class: "",
    label: index.getSvgHtml(b2s),
    content: source$Y,
    category: "Blog"
  },
  {
    id: "blog-block-3",
    class: "",
    label: index.getSvgHtml(b3s),
    content: source$X,
    category: "Blog"
  },
  {
    id: "blog-block-4",
    class: "",
    label: index.getSvgHtml(b4s),
    content: source$W,
    category: "Blog"
  },
  {
    id: "blog-block-5",
    class: "",
    label: index.getSvgHtml(b5s),
    content: source$V,
    category: "Blog"
  },
  {
    id: "contact-block-1",
    class: "",
    label: index.getSvgHtml(c1s),
    content: source$U,
    category: "Contact"
  },
  {
    id: "contact-block-2",
    class: "",
    label: index.getSvgHtml(c2s),
    content: source$T,
    category: "Contact"
  },
  {
    id: "contact-block-3",
    class: "",
    label: index.getSvgHtml(c3s),
    content: source$S,
    category: "Contact"
  },
  {
    id: "content-block-1",
    class: "",
    label: index.getSvgHtml(d1s),
    content: source$R,
    category: "Content"
  },
  {
    id: "content-block-2",
    class: "",
    label: index.getSvgHtml(d2s),
    content: source$Q,
    category: "Content"
  },
  {
    id: "content-block-3",
    class: "",
    label: index.getSvgHtml(d3s),
    content: source$P,
    category: "Content"
  },
  {
    id: "content-block-4",
    class: "",
    label: index.getSvgHtml(d4s),
    content: source$O,
    category: "Content"
  },
  {
    id: "content-block-5",
    class: "",
    label: index.getSvgHtml(d5s),
    content: source$N,
    category: "Content"
  },
  {
    id: "content-block-6",
    class: "",
    label: index.getSvgHtml(d6s),
    content: source$M,
    category: "Content"
  },
  {
    id: "content-block-7",
    class: "",
    label: index.getSvgHtml(d7s),
    content: source$L,
    category: "Content"
  },
  {
    id: "content-block-8",
    class: "",
    label: index.getSvgHtml(d8s),
    content: source$K,
    category: "Content"
  },
  {
    id: "cta-block-1",
    class: "",
    label: index.getSvgHtml(a1s),
    content: source$J,
    category: "CTA"
  },
  {
    id: "cta-block-2",
    class: "",
    label: index.getSvgHtml(a2s),
    content: source$I,
    category: "CTA"
  },
  {
    id: "cta-block-3",
    class: "",
    label: index.getSvgHtml(a3s),
    content: source$H,
    category: "CTA"
  },
  {
    id: "cta-block-4",
    class: "",
    label: index.getSvgHtml(a4s),
    content: source$G,
    category: "CTA"
  },
  {
    id: "commerce-block-1",
    class: "",
    label: index.getSvgHtml(e1s),
    content: source$F,
    category: "Commerce"
  },
  {
    id: "commerce-block-2",
    class: "",
    label: index.getSvgHtml(e2s),
    content: source$E,
    category: "Commerce"
  },
  {
    id: "commerce-block-3",
    class: "",
    label: index.getSvgHtml(e3s),
    content: source$D,
    category: "Commerce"
  },
  {
    id: "feature-block-1",
    class: "",
    label: index.getSvgHtml(f1s),
    content: source$C,
    category: "Features"
  },
  {
    id: "feature-block-2",
    class: "",
    label: index.getSvgHtml(f2s),
    content: source$B,
    category: "Features"
  },
  {
    id: "feature-block-3",
    class: "",
    label: index.getSvgHtml(f3s),
    content: source$A,
    category: "Features"
  },
  {
    id: "feature-block-4",
    class: "",
    label: index.getSvgHtml(f4s),
    content: source$z,
    category: "Features"
  },
  {
    id: "feature-block-5",
    class: "",
    label: index.getSvgHtml(f5s),
    content: source$y,
    category: "Features"
  },
  {
    id: "feature-block-6",
    class: "",
    label: index.getSvgHtml(f6s),
    content: source$x,
    category: "Features"
  },
  {
    id: "feature-block-7",
    class: "",
    label: index.getSvgHtml(f7s),
    content: source$w,
    category: "Features"
  },
  {
    id: "feature-block-8",
    class: "",
    label: index.getSvgHtml(f8s),
    content: source$v,
    category: "Features"
  },
  {
    id: "footer-block-1",
    class: "",
    label: index.getSvgHtml(z1s),
    content: source$u,
    category: "Footer"
  },
  {
    id: "footer-block-2",
    class: "",
    label: index.getSvgHtml(z2s),
    content: source$t,
    category: "Footer"
  },
  {
    id: "footer-block-3",
    class: "",
    label: index.getSvgHtml(z3s),
    content: source$s,
    category: "Footer"
  },
  {
    id: "footer-block-4",
    class: "",
    label: index.getSvgHtml(z4s),
    content: source$r,
    category: "Footer"
  },
  {
    id: "footer-block-5",
    class: "",
    label: index.getSvgHtml(z5s),
    content: source$q,
    category: "Footer"
  },
  {
    id: "gallery-block-1",
    class: "",
    label: index.getSvgHtml(g1s),
    content: source$p,
    category: "Gallery"
  },
  {
    id: "gallery-block-2",
    class: "",
    label: index.getSvgHtml(g2s),
    content: source$o,
    category: "Gallery"
  },
  {
    id: "gallery-block-3",
    class: "",
    label: index.getSvgHtml(g3s),
    content: source$n,
    category: "Gallery"
  },
  {
    id: "header-block-1",
    class: "",
    label: index.getSvgHtml(h1s),
    content: source$m,
    category: "Header"
  },
  {
    id: "header-block-2",
    class: "",
    label: index.getSvgHtml(h2s),
    content: source$l,
    category: "Header"
  },
  {
    id: "header-block-3",
    class: "",
    label: index.getSvgHtml(h3s),
    content: source$k,
    category: "Header"
  },
  {
    id: "header-block-4",
    class: "",
    label: index.getSvgHtml(h4s),
    content: source$j,
    category: "Header"
  },
  {
    id: "hero-block-1",
    class: "",
    label: index.getSvgHtml(r1s),
    content: source$i,
    category: "Hero"
  },
  {
    id: "hero-block-2",
    class: "",
    label: index.getSvgHtml(r2s),
    content: source$h,
    category: "Hero"
  },
  {
    id: "hero-block-3",
    class: "",
    label: index.getSvgHtml(r3s),
    content: source$g,
    category: "Hero"
  },
  {
    id: "hero-block-4",
    class: "",
    label: index.getSvgHtml(r4s),
    content: source$f,
    category: "Hero"
  },
  {
    id: "hero-block-5",
    class: "",
    label: index.getSvgHtml(r5s),
    content: source$e,
    category: "Hero"
  },
  {
    id: "hero-block-6",
    class: "",
    label: index.getSvgHtml(r6s),
    content: source$d,
    category: "Hero"
  },
  {
    id: "pricing-block-1",
    class: "",
    label: index.getSvgHtml(p1s),
    content: source$c,
    category: "Pricing"
  },
  {
    id: "pricing-block-2",
    class: "",
    label: index.getSvgHtml(p2s),
    content: source$b,
    category: "Pricing"
  },
  {
    id: "statistic-block-1",
    class: "",
    label: index.getSvgHtml(s1s),
    content: source$a,
    category: "Statistics"
  },
  {
    id: "statistic-block-2",
    class: "",
    label: index.getSvgHtml(s2s),
    content: source$9,
    category: "Statistics"
  },
  {
    id: "statistic-block-3",
    class: "",
    label: index.getSvgHtml(s3s),
    content: source$8,
    category: "Statistics"
  },
  {
    id: "step-block-1",
    class: "",
    label: index.getSvgHtml(q1s),
    content: source$7,
    category: "Steps"
  },
  {
    id: "step-block-3",
    class: "",
    label: index.getSvgHtml(q3s),
    content: source$6,
    category: "Steps"
  },
  {
    id: "team-block-1",
    class: "",
    label: index.getSvgHtml(t1s),
    content: source$5,
    category: "Team"
  },
  {
    id: "team-block-2",
    class: "",
    label: index.getSvgHtml(t2s),
    content: source$4,
    category: "Team"
  },
  {
    id: "team-block-3",
    class: "",
    label: index.getSvgHtml(t3s),
    content: source$3,
    category: "Team"
  },
  {
    id: "testimonial-block-1",
    class: "",
    label: index.getSvgHtml(m1s),
    content: source$2,
    category: "Testimonials"
  },
  {
    id: "testimonial-block-2",
    class: "",
    label: index.getSvgHtml(m2s),
    content: source$1,
    category: "Testimonials"
  },
  {
    id: "testimonial-block-3",
    class: "",
    label: index.getSvgHtml(m3s),
    content: source,
    category: "Testimonials"
  }
];
const loadTailwindBlocks = (newEditor) => {
  const blockManager = newEditor.BlockManager;
  sources.forEach((s) => {
    blockManager.add(s.id, {
      label: s.label,
      attributes: { class: s.class },
      content: s.content,
      category: { label: s.category, open: s.category === "Blog" }
    });
  });
};

function loadBlocks(editor) {
  loadBasicBlocks(editor);
  loadTailwindBlocks(editor);
}

const appendTailwindCss = (newEditor) => {
  const iframe = newEditor.Canvas.getFrameEl();
  if (!iframe)
    return;
  const cssLink = document.createElement("link");
  cssLink.href = index.tailwindCssUrl;
  cssLink.rel = "stylesheet";
  const cssStyle = document.createElement("style");
  cssStyle.innerHTML = `img.object-cover { filter: sepia(1) hue-rotate(190deg) opacity(.46) grayscale(.7) !important; }`;
  const f = setInterval(() => {
    const doc = iframe.contentDocument;
    if (doc.readyState === "complete") {
      doc.head.appendChild(cssLink);
      doc.head.appendChild(cssStyle);
      clearInterval(f);
    }
  }, 100);
};
const appendCustomCss = () => {
  document.querySelector("html").style.height = "100%";
  document.querySelector("body").style.height = "100%";
  const nextRoot = document.querySelector("#__next");
  const element = document.querySelector(index.elementExists(nextRoot) ? "#__next" : "#root");
  element.style.height = "100%";
};
const appendCss = (newEditor) => {
  appendCustomCss();
  appendTailwindCss(newEditor);
};

const handleEvents = (newEditor, standaloneServer) => {
  const baseUrl = standaloneServer ? `http://localhost:${index.standaloneServerPort}` : "";
  const path = window.location.pathname === "/" || window.location.pathname === "" ? "default.json" : `${window.location.pathname}.json`;
  const saveLocally = (data) => index.fetchJSON({
    method: "post",
    url: `${baseUrl}/api/builder/handle`,
    data: { path, data }
  });
  newEditor.on("storage:store", (e) => saveLocally(e));
};

const uploadFile = (e, editor, standaloneServer) => {
  const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
  const formData = new FormData();
  for (const i in files) {
    formData.append("file-" + i, files[i]);
  }
  const baseUrl = standaloneServer ? `http://localhost:${index.standaloneServerPort}` : "";
  fetch(`${baseUrl}/api/builder/handle`, { method: "POST", body: formData }).then((res) => res.json()).then((images) => {
    editor.AssetManager.add(images);
  });
};
export const initEditor = async (startServer = true, standaloneServer) => {
  const grapesjs = await Promise.resolve().then(function () { return require('./grapes.min-02b325bd.js'); });
  globalThis.grapesjs = grapesjs;
  if (startServer) {
    assetManagerOptions.uploadFile = (e) => uploadFile(e, editor, standaloneServer);
    editorOptions.assetManager = assetManagerOptions;
  }
  var editor = grapesjs.init(editorOptions);
  loadTraits(editor);
  loadPanels(editor, startServer);
  loadComponents(editor);
  loadBlocks(editor);

  appendCss(editor);
  if (startServer)
    handleEvents(editor, standaloneServer);
  if (startServer)
    loadTemplate(editor, standaloneServer);
};
const loadTemplate = async (editor, standaloneServer) => {
  const baseUrl = standaloneServer ? `http://localhost:${index.standaloneServerPort}` : "";
  const data = await index.fetchJSON({ method: "get", url: `${baseUrl}/api/builder/handle?id=${location.pathname.split('events/').pop()}` });
  if (!data)
    return;
  const content = JSON.parse(data.content);
  editor.setComponents(JSON.parse(content.components));
  editor.setStyle(JSON.parse(content.styles));
};
const assetManagerOptions = {
  storageType: "",
  storeOnChange: true,
  storeAfterUpload: true,
  assets: [],
  uploadFile
};

const editorOptions = {
  selectorManager: { escapeName: index.escapeName },
  container: "#gjs",
  height: "100%",
  storageManager: { autoload: false },
  showDevices: false,
  traitsEditor: true,
  assetManager: assetManagerOptions,
  canvas: {
    scripts: [
      'https://kit.fontawesome.com/777c2040eb.js',
      'https://unpkg.com/swiper@7/swiper-bundle.min.js',
    ],
    // The same would be for external styles
    styles: [
      "https://unpkg.com/swiper@7/swiper-bundle.min.css",
    ],
  },
  plugins: [basicPlugin, swiperPlugin],
  pluginsOpts: {
    [basicPlugin]: {
      blocks: ['column1', 'column2', 'column3', 'column3-7'],
      stylePrefix: 'block-basic'
    },
    [swiperPlugin]: {}
  },
};
