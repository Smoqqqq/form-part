class AnimatedForm {
    constructor(config) {
        this.config = config;
        this.holder = config.holder;
        this.holder.classList.add("form-part-holder");

        this.parts = this.holder.querySelectorAll(".form-part");
        this.scrollArea = this.holder.querySelector(".form-parts");
        this.currentIndex = 0;

        this.getInputs();

        this.defaultConfig();
        this.handleConfig();

        this.resizeParts();
        this.goTo(0);

        this.checkForErrors();
    }

    defaultConfig() {
        let defaults = {
            submitButton: true,
            submitButtonText: "Submit",
            previousPageText: "Previous",
            nextPageText: "Next",
        }

        for(const option in defaults) {
            if(this.config[option] === undefined) {
                this.config[option] = defaults[option];
            }
        }
    }

    handleConfig() {
        // Add or not the nav elements
        if (this.config.nav === undefined || this.config.nav === true) {
            this.config.nav = true;
            this.createNav();
            this.handleNavEvents();
        }

        // Add or not previous / next controls + submit btn
        if (this.config.controls === undefined || this.config.controls === true) {
            this.config.controls = true;
            this.addControls();
            this.handleControls();
        }

        if (typeof this.config.themeColor === "string") {
            document.querySelector(':root').style.setProperty('--theme', this.config.themeColor);
        } else {
            console.log(typeof this.config.themeColor)
        }
    }

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

    checkForErrors() {
        let scrolled = false;
        for (let i = 0; i < this.parts.length; i++) {
            if (this.parts[i].querySelectorAll(".invalid-feedback").length > 0) {
                this.holder.querySelectorAll(".form-part-nav-item")[i].classList.add("invalid");
                if (!scrolled) {
                    scrolled = true;
                    this.goTo(i);
                }
            }
        }
    }

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

    handleNavEvents() {
        for (let i = 0; i < this.navs.length; i++) {
            this.navs[i].addEventListener("click", () => {
                let check = (i > this.currentIndex) ? true : false;
                this.goTo(i, check);
            })
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
            if (!this.checkInputs(index - 1)) {
                if (document.getElementsByClassName("form-alert").length < 1) {
                    this.addAlert("Please fill in required inputs (with red borders) to go to the next page", index - 1);
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

        let leftCoordinates = index * this.scrollArea.getBoundingClientRect().width + (50 * index)

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
        for (let i = 0; i < this.parts.length; i++) {
            this.parts[i].inputs = [];
            let inputElems = this.parts[i].querySelectorAll("input, select, textarea")

            for (let j = 0; j < inputElems.length; j++) {
                this.parts[i].inputs.push(inputElems[j]);
            }
        }
    }

    checkInputs(index) {
        let inputs = this.parts[index].inputs;
        let valid = true;

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].getAttribute("required") && inputs[i].getAttribute("required") !== "false") {
                if (inputs[i].value.length < 1) {
                    inputs[i].classList.add("invalid");
                    valid = false;
                } else {
                    inputs[i].classList.remove("invalid");
                }
            }
        }

        return valid;
    }
}