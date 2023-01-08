class Validator {

    constructor() {
        this.CONSTRAINTS = [
            "length",
            "minLength",
            "maxLength",
            "text",
            "uppercase",
            "lowercase",
            "number",
        ];
    }

    validate(...inputs) {
        for (let i = 0; i < inputs.length; i++) {
            let constraints = this.getInputConstraints(inputs[i]);
            console.log("valid state : ", this.validateConstraits(inputs[i], constraints), inputs[i]);
        }
    }

    /**
     * Gets all valid & registered constraints
     * @param {HtmlInputElement} input 
     * @returns {String[]} constraints
     */
    getInputConstraints(input) {
        let constraint = input.getAttribute('data-form-constraints');
        return constraint.match(/\w+/g);
    }

    /**
     * checks if input values matches constraint
     * @param {String[]} constraints 
     * @returns {Boolean}
     */
    validateConstraits(input, constraints) {
        let valid = true;
        for(let i = 0; i < constraints.length; i++) {
            if(this.CONSTRAINTS.indexOf(constraints[i]) > 0) {
                let res = this[constraints[i]](input);
                if(!res) valid = false;
            } else {
                if(location.href.includes("127.0.0.1")) {
                    console.warn("Unkown constraint : " + constraints[i]);
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
     * @returns 
     */
    length(input, min, max) {
        if (input.value.length >= min && input.value.length <= max) return true;
        return false;
    }

    /**
     * Checks if input lengths is above min
     * @param {HtmlInputElement} input 
     * @param {Number} min 
     * @param {Number} max 
     * @returns 
     */
    minLength(input, min) {
        if (input.value.length >= min) return true;
        return false;
    }

    /**
     * Checks if input lengths is under max
     * @param {HtmlInputElement} input 
     * @param {Number} min 
     * @param {Number} max 
     * @returns 
     */
    minLength(input, max) {
        if (input.value.length <= max) return true;
        return false;
    }

    /**
     * Will test if a string contains letters
     * @param {HtmlInputElement} input 
     * @returns bool
     */
    text(input) {
        return /[a-zA-Z]/.test(input.value);
    }

    /**
     * Will test if a string is uppercase
     * @param {HtmlInputElement} input 
     * @returns bool
     */
    uppercase(input) {
        return input.value === input.value.toUpperCase();
    }

    /**
     * Will test if a string is lowercase
     * @param {HtmlInputElement} input 
     * @returns bool
     */
    lowercase(input) {
        return input.value === input.value.toLowerCase();
    }

    /**
     * Will test if a string is only numbers, dots or commas
     * @param {HtmlInputElement} input 
     * @returns bool
     */
    number(input) {
        return /^(\d+,)*(\d+)$/.test(input.value);
    }

}

export default Validator;