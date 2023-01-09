class FormDebug {
    constructor (inputs = document.querySelectorAll("input")) {
        this.inputs = inputs;
        this.debug();
    }

    debug() {
        for(let i = 0; i < this.inputs.length; i++) {
            let hint = document.createElement("code");
            hint.style.fontSize = "130%";
            hint.innerText = this.inputs[i].getAttribute("data-form-constraints");
            this.inputs[i].parentNode.insertBefore(hint, this.inputs[i]);

            let length = document.createElement("span");
            length.className = "badge bg-secondary";
            length.innerText = this.inputs[i].value.length + " char";
            this.inputs[i].parentNode.insertBefore(length, this.inputs[i])

            this.inputs[i].addEventListener("keyup", (e) => {
                length.innerText = e.target.value.length + " char";
            })
        }
    }
}

export default FormDebug;