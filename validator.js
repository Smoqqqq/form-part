import FormDebug from "./formDebug.js";

class Validator {

    constructor(debug = false) {
        this.debug = debug;

        this.CONSTRAINTS = [
            "length",
            "minLength",
            "maxLength",
            "text",
            "uppercase",
            "lowercase",
            "number",
            "nodot",
            "nowhitespace",
            "nonumber",
            "email",
            "dateInPast",
            "dateInFuture"
        ];
    }

    /**
     * watches for constraint compliance on input events
     * @param {HtmlInputElement[]} inputs Inputs to watch
     */
    watch(inputs) {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener("input", () => {
                this.validate([inputs[i]]);
            })
        }

        if (this.debug) {
            new FormDebug();
        }
    }

    /**
     * gets input constraints and validates them for each given inputs
     * @param {HtmlInputElement[]} inputs which constraints to validate
     */
    validate(inputs) {
        for (let i = 0; i < inputs.length; i++) {
            let constraints = this.getInputConstraints(inputs[i]);
            if (constraints) {
                console.log(this.validateConstraits(inputs[i], constraints));
            }
        }
    }

    /**
     * Gets all valid & registered constraints
     * @param {HtmlInputElement} input 
     * @returns {String[]} constraints
     */
    getInputConstraints(input) {
        let constraint = input.getAttribute('data-form-constraints');
        return constraint ? constraint.match(/(\w|:)+/g) : false;
    }

    /**
     * checks if input values matches constraint
     * @param {HtmlInputElement} input
     * @param {String[]} constraints 
     * 
     * @returns {Boolean} if the constraint is valid 
     */
    validateConstraits(input, constraints) {
        let valid = true;
        for (let i = 0; i < constraints.length; i++) {
            let args = [];
            if (constraints[i].includes(":")) {
                args = constraints[i].split(":");
                constraints[i] = args[0];
                args.shift();
            }
            if (this.CONSTRAINTS.indexOf(constraints[i]) >= 0) {
                let res = this[constraints[i]](input, ...args);

                if (res) this.clearInputAlerts(input, constraints[i]);

                if (!res) valid = false;
            } else {
                if (location.href.includes("127.0.0.1")) {
                    console.warn("Unkown constraint : '" + constraints[i] + "'", "Available constraints : ", this.CONSTRAINTS);
                }
            }
        }

        return valid;
    }

    /**
     * Checks if input lengths is within bounds
     * @param {HtmlInputElement} input 
     * @param {Number} min 
     * @param {Number} max 
     * @returns {Boolean} if the constraint is valid
     */
    length(input, min, max) {
        if (input.value.length >= min && input.value.length <= max) return true;

        if (min === max) {
            this.inputAlert(input, "La valeur doit faire " + max + " charactères de longueur.", "length");
        } else {
            this.inputAlert(input, "La valeur doit être comprise entre " + min + " et " + max + " caractères de long.", "length");
        }

        return false;
    }

    /**
     * Checks if input lengths is above min
     * @param {HtmlInputElement} input 
     * @param {Number} min 
     * @param {Number} max 
     * @returns {Boolean} if the constraint is valid
     */
    minLength(input, min) {
        if (input.value.length >= min) return true;
        console.log(input, input.value, input.value.length)
        this.inputAlert(input, "La valeur doit contenir au moins " + min + " caractères", "minLength");
        return false;
    }

    /**
     * Checks if input lengths is under max
     * @param {HtmlInputElement} input 
     * @param {Number} min 
     * @param {Number} max 
     * @returns {Boolean} if the constraint is valid
     */
    maxLength(input, max) {
        if (input.value.length <= max) return true;

        this.inputAlert(input, "La valeur ne doit pas dépasser " + max + " caractères", "maxLength");
        return false;
    }

    /**
     * Will test if a string contains letters
     * @param {HtmlInputElement} input 
     * @returns {Boolean} if the constraint is valid
     */
    text(input) {
        if (/[a-zA-Z]/.test(input.value)) return true;

        this.inputAlert(input, "La valeur doit contenir des lettres", "text");
        return false;
    }

    /**
     * Will test if a string is uppercase
     * @param {HtmlInputElement} input 
     * @returns {Boolean} if the constraint is valid
     */
    uppercase(input) {
        if (input.value === input.value.toUpperCase()) return true;

        this.inputAlert(input, "La valeur doit être en majuscule.", "uppercase");
        return false;
    }

    /**
     * Will test if a string is lowercase
     * @param {HtmlInputElement} input 
     * @returns {Boolean} if the constraint is valid
     */
    lowercase(input) {
        if (input.value === input.value.toLowerCase()) return true;

        this.inputAlert(input, "La valeur doit être en minuscule.", "lowercase");
        return false;
    }

    /**
     * Will test if a string is only numbers, dots or commas
     * @param {HtmlInputElement} input 
     * @returns {Boolean} if the constraint is valid
     */
    number(input) {
        if (/^(\d+,)*(\d+)$/.test(input.value)) return true;

        this.inputAlert(input, "La valeur doit être un nombre.", "number")
        return false;
    }

    /**
     * True if no numbers are in the value
     * @param {HtmlInputElement} input 
     * @returns {Boolean} if the constraint is valid
     */
    nonumber(input) {
        if (!input.value.match(/[0-9]/)) return true;

        this.inputAlert(input, "La valeur ne doit pas contenir de chiffres.", "nonumber");
        return false;
    }

    /**
     * True if no dots are in the value
     * @param {HtmlInputElement} input 
     * @returns {Boolean} if the constraint is valid
     */
    nodot(input) {
        if (!input.value.includes(".")) return true;

        this.inputAlert(input, "La valeur ne doit pas contenir de point ('.').", "nodot");
        return false;
    }

    /**
     * True if no whitespaces are in the value
     * @param {HtmlInputElement} input 
     * @returns {Boolean} if the constraint is valid
     */
    nowhitespace(input) {
        if (!input.value.match(/\s/)) return true;

        this.inputAlert(input, "La valeur ne doit pas contenir d'espaces.", "nowhitespace");
        return false;
    }

    email(input) {
        if (input.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/gm)) return true;

        this.inputAlert(input, "La valeur n'est pas un email valide.", "email");
        return false;
    }

    /**
     * Will check if a date is **aproximately** x year / month / days in past
     * @param {HtmlInputElement} input 
     * @param {Number} minAgeYears 
     * @param {Number} minAgeMonths 
     * @param {Number} minAgeDays 
     */
    dateInPast(input, minAgeYears, minAgeMonths = 0, minAgeDays = 0) {
        let date = new Date(input.value);
        let today = new Date();

        let diff = (365 * minAgeYears) * 24 * 3600 * 1000;
        diff += minAgeMonths * 30 * 24 * 3600 * 1000;
        diff += minAgeDays * 24 * 3600 * 1000;

        if ((today - date) / diff > 1) {
            return true;
        }

        this.inputAlert(input, `La date doit être au moins il y à ${minAgeYears} an(s), ${minAgeMonths} mois et ${minAgeDays} jour(s)`, 'dateInPast')
        return false;
    }

    /**
     * Will check if a date is **aproximately** x year / month / days in the future
     * @param {HtmlInputElement} input 
     * @param {Number} minAgeYears 
     * @param {Number} minAgeMonths 
     * @param {Number} minAgeDays 
     */
    dateInFuture(input, minAgeYears, minAgeMonths = 0, minAgeDays = 0) {
        let date = new Date(input.value);
        let today = new Date();

        let diff = (365 * minAgeYears) * 24 * 3600 * 1000;
        diff += minAgeMonths * 30 * 24 * 3600 * 1000;
        diff += minAgeDays * 24 * 3600 * 1000;

        if ((date - today) / diff > 1) {
            return true;
        }

        this.inputAlert(input, `La date doit être au moins il dans ${minAgeYears} an(s), ${minAgeMonths} mois et ${minAgeDays} jour(s)`, 'dateInFuture')
        return false;
    }

    /**
     * prints an alert close to the input
     * @param {HtmlInputElement} input 
     * @param {String} message 
     * @param {String} constraintName
     */
    inputAlert(input, message, constraintName) {
        let alert = document.createElement("div");
        alert.className = "badge bg-danger text-white";
        alert.innerText = message;
        alert.setAttribute("data-input", input.name);
        alert.setAttribute("data-constraint", constraintName);

        let currentAlerts = document.querySelectorAll(".badge.bg-danger[data-input='" + input.name + "']");

        for (let i = 0; i < currentAlerts.length; i++) {
            if (currentAlerts[i].innerText == message) {
                return;
            }
        }

        input.parentNode.insertBefore(alert, input);
    }

    /**
     * Clear alerts for an input
     * @param {HtmlInputElement} input input to clear alerts from
     * @param {String} constraintName optionnal constraint to filter
     */
    clearInputAlerts(input, constraintName = false) {
        let currentAlerts = document.querySelectorAll(".badge.bg-danger[data-input='" + input.name + "']");

        for (let i = 0; i < currentAlerts.length; i++) {
            if (!constraintName || constraintName == currentAlerts[i].getAttribute("data-constraint")) currentAlerts[i].remove();
        }
    }

}

export default Validator;