# FORM PART
Form part is a tiny library written in pure Javascript, to transform your big forms into smaller, more managable forms, cut in parts.

it aims to be very simple to use. here is an example :

## Example
Lets say we have this form :

```html
<label for="firstname" class="form-label">Firstname</label>
<input class="form-control" type="text" required="true" name="firstname"><br>
<label for="lastname" class="form-label">Lastname</label>
<input class="form-control" type="text" required="true" name="lastname"><br>
<label for="date_of_birth" class="form-label">Date of birth</label>
<input class="form-control" type="date" required="true" name="date_of_birth"><br>
<label for="line1" class="form-label">Line 1</label>
<input class="form-control" type="text" required="true" name="line1"><br>
<label for="city" class="form-label">City</label>
<input class="form-control" type="text" required="true" name="city"><br>
<label for="country" class="form-label">Country</label>
<input class="form-control" type="text" required="true" name="country"><br>
```

nothing bad here, but a bit clunky !

say we now want to split it in two blocks, personnal infos and address. With form part, you would just need to englobe the form like this to do the trick :

```html
<div id="form">
    <div class="form-part">
        <h1>Personnal infos</h1>
        <hr>
        <label for="firstname" class="form-label">Firstname</label>
        <input class="form-control" type="text" required="true" name="firstname"><br>
        <label for="lastname" class="form-label">Lastname</label>
        <input class="form-control" type="text" required="true" name="lastname"><br>
        <label for="date_of_birth" class="form-label">Date of birth</label>
        <input class="form-control" type="date" required="true" name="date_of_birth"><br>
    </div>
    <div class="form-part">
        <h1>Address</h1>
        <hr>
        <label for="line1" class="form-label">Line 1</label>
        <input class="form-control" type="text" required="true" name="line1"><br>
        <label for="city" class="form-label">City</label>
        <input class="form-control" type="text" required="true" name="city"><br>
        <label for="country" class="form-label">Country</label>
        <input class="form-control" type="text" required="true" name="country"><br>
    </div>
</div>

<script type="module">
    import AnimatedForm from "./form-part.js";

    const form = new AnimatedForm({
        holder: document.getElementById("form")
    });
</script>
```
(wrap your form in a div (eg: the holder))

your form is now split in two pages !

## CONFIGURATION

The `AnimatedForm` Javascript class takes only one argument : the config object.
Available options are listed below :

| Name              | Type          | Default           | Required  |
|-------------------|---------------|-------------------|-----------|
| holder            | HtmlElement   |                   | true      |
| controls          | bool          | true              |           |
| nav               | bool          | true              |           |
| previousPageText: | string        | "Previous"        |           |
| nextPageText:     | string        | "Next"            |           |
| submitButton      | bool          | true              |           |
| submitButtonText  | string        | "Submit"          |           |
| partMargin        | number        | 25                |           |

## PAGE TITLE (nav)
to set a page title (instead of using numbers in navs), set the `data-part-name` attribute to the title you want :

```html
<div class="form-part" data-part-name="Address"> ... </div>
```

'Address' will now show as the title in the navigation !