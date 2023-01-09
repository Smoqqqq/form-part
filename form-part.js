import Validator from "./validator.js";

class AnimatedForm {
    constructor(config) {
        this.config = config;
        this.holder = config.holder;
        this.holder.classList.add("form-part-holder");
        this.validator = new Validator();

        this.parts = this.holder.querySelectorAll(".form-part");
        this.currentIndex = 0;

        this.initHtmlStructure();
        this.defaultConfig();
        this.getInputs();
        this.handleConfig();
        this.resizeParts();
        this.goTo(0);
    }

    /**
     * Inits the HTML structure :
     * wraps .form-part in .form-parts
     */
    initHtmlStructure() {
        this.scrollArea = document.createElement("div");
        this.scrollArea.classList.add("form-parts");

        while (this.holder.childNodes.length > 0) {
            this.scrollArea.appendChild(this.holder.childNodes[0]);
        }

        this.holder.append(this.scrollArea);
    }

    /**
     * Set defaults for undefined config options
     */
    defaultConfig() {
        let defaults = {
            controls: true,
            nav: true,
            previousPageText: "Previous",
            nextPageText: "Next",
            submitButton: true,
            submitButtonText: "Submit",
            partMargin: 25,
            defaultFieldAlertText: false,
            emptyFieldsAlertText: "Please fill in required inputs to go to the next page",
            validator: true,
            debug: false,
        }

        for (const option in defaults) {
            if (this.config[option] === undefined) {
                this.config[option] = defaults[option];
            }
        }
    }

    /**
     * handle config choices
     */
    handleConfig() {
        // Add the nav elements
        if (this.config.nav) {
            this.createNav();
            this.handleNav();
        }

        // Add previous / next controls + submit btn
        if (this.config.controls) {
            this.addControls();
            this.handleControls();
        }

        if(this.config.validator) {
            const validator = new Validator(this.config.debug);

            validator.watch(this.inputs);
        }
    }

    /**
     * Adds control btns on each page
     */
    addControls() {
        for (let i = 0; i < this.parts.length; i++) {
            let controls = document.createElement("div");
            controls.className = "form-part-controls";

            if (i > 0) {
                controls.innerHTML += `<div class='form-part-control form-part-previous-page'>${this.config.previousPageText}</div>`
            }

            if (i < this.parts.length - 1) {
                controls.innerHTML += `<div class='form-part-control form-part-next-page'>${this.config.nextPageText}</div>`
            } else if (this.config.submitButton) {
                controls.innerHTML += `<div class='form-part-control form-part-submit'>${this.config.submitButtonText}</div>`
            }

            this.parts[i].append(controls);
        }
    }

    handleControls() {
        for (let i = 0; i < this.parts.length; i++) {
            let next = this.parts[i].querySelectorAll(".form-part-next-page");
            let prev = this.parts[i].querySelectorAll(".form-part-previous-page");

            for (let n = 0; n < next.length; n++) {
                next[n].addEventListener("click", () => {
                    this.goTo(i + 1, true);
                })
            }

            for (let n = 0; n < prev.length; n++) {
                prev[n].addEventListener("click", () => {
                    this.goTo(i - 1);
                })
            }
        }
    }

    /**
     * Creates navigation elements
     */
    createNav() {
        let html = "";
        let elem = document.createElement("div");
        elem.className = "form-part-nav";

        for (let i = 0; i < this.parts.length; i++) {
            let name = (this.parts[i].getAttribute("data-part-name")) ? this.parts[i].getAttribute("data-part-name") : i + 1;

            html += `<div class="form-part-nav-item">${name}</div>`;
        }

        elem.innerHTML = html;
        this.holder.insertBefore(elem, this.scrollArea);

        this.navs = this.holder.querySelectorAll(".form-part-nav-item");
    }

    handleNav() {
        for (let i = 0; i < this.navs.length; i++) {
            this.navs[i].addEventListener("click", () => {
                let check = (i > this.currentIndex) ? true : false;
                this.goTo(i, check);
            })
        }
    }

    /**
     * Resizes parts on page resize
     */
    resizeParts() {
        let width = this.scrollArea.getBoundingClientRect().width;

        for (let i = 0; i < this.parts.length; i++) {
            this.parts[i].style.width = width + "px";
            this.parts[i].style.minWidth = width + "px";
        }

        addEventListener("resize", () => {
            this.resizeParts();
            this.goTo(this.currentIndex);
        })
    }

    addAlert(message, index = null) {
        let alert = document.createElement("div");
        alert.classList.add("form-alert");
        alert.innerHTML = message;

        let alertContainer = this.parts[this.currentIndex].querySelector(".form-alert-container");
        if (alertContainer) {
            alertContainer.append(alert);
        } else if (index) {
            this.parts[index].insertBefore(alert, this.parts[index].inputs[0]);
        } else {
            this.holder.insertBefore(alert, this.scrollArea);
        }
    }

    goTo(index, checkInputs = false) {

        // check for empty inputs
        if (checkInputs) {
            if (!this.checkInputs(this.currentIndex)) {
                if (document.getElementsByClassName("form-alert").length < 1) {
                    this.addAlert(this.config.emptyFieldsAlertText, this.currentIndex);
                }
                return;
            } else {
                let alerts = document.getElementsByClassName("form-alert");
                for (let i = alerts.length - 1; i > -1; i--) {
                    alerts[i].remove();
                }
            }
        }

        this.currentIndex = index;

        let leftCoordinates = index * this.scrollArea.getBoundingClientRect().width + (this.config.partMargin * 2 * index)

        this.scrollArea.scrollTo({
            top: 0,
            left: leftCoordinates,
            behavior: 'smooth'
        })

        if (this.config.nav) {
            for (let i = 0; i < this.navs.length; i++) {
                this.navs[i].classList.remove("active");
            }

            for (let i = 0; i < index + 1; i++) {
                this.navs[i].classList.add("active");
            }
        }
    }

    getInputs() {
        this.inputs = [];
        for (let i = 0; i < this.parts.length; i++) {
            this.parts[i].inputs = [];
            let inputElems = this.parts[i].querySelectorAll("input, select, textarea")

            for (let j = 0; j < inputElems.length; j++) {
                this.parts[i].inputs.push(inputElems[j]);
                this.inputs.push(inputElems[j]);
            }
        }
    }

    /**
     * Verify that every required input as some text in it
     * then passes it to the validator
     */
    checkInputs(index) {
        let inputs = this.parts[index].inputs;
        let valid = true;

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].getAttribute("required") && inputs[i].getAttribute("required") !== "false") {
                if (!this.validator.validate(inputs[i]) || inputs[i].value.length < 1) {
                    this.setInvalidInput(inputs, index, i);

                    valid = false;
                } else {
                    this.setValidInput(inputs, i);
                }
            }
        }

        return valid;
    }

    setInvalidInput(inputs, index, i) {
        inputs[i].classList.add("invalid");

        if ((inputs[i].getAttribute("data-alert") || this.config.defaultFieldAlertText) && !document.querySelector(`[data-form-part-input-id="${i}"]`)) {
            let alert = document.createElement("span");
            alert.className = "form-part-input-alert";
            alert.setAttribute("data-form-part-input-id", i);
            alert.innerText = (inputs[i].getAttribute("data-alert")) ? inputs[i].getAttribute("data-alert") : this.config.defaultFieldAlertText;
            this.parts[index].insertBefore(alert, inputs[i]);
        }
    }

    setValidInput(inputs, i) {
        inputs[i].classList.remove("invalid");
        document.querySelector(`[data-form-part-input-id="${i}"]`)?.remove();
    }
}

export default AnimatedForm;