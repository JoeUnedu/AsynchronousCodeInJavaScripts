/*
    NUMBERS API RELATED FUNCTIONS
*/

function callNumbersAPI(favNbr, fx) {

    /*
        Call the numbers api at http://numbersapi.com/favNbr
        for trivia about the number
    */

    const ROOT_API = 'http://numbersapi.com/';
    const config = {
        headers: { "Content-Type": "application/json" }
    }

    let numberPromise = axios.get(`${ROOT_API}${favNbr}`, config);

    numberPromise
        .then(data => fx(data, "success"))
        .catch(err => fx(err, "failure"));

}

function callNumbersAPIMulti(favNbr, nbrOfFacts, fx) {

    /*
        Call the numbers api at http://numbersapi.com/favNbr
        for trivia about the number.

        nbrOfFacts is the number of facts to return.

        Yes, this function (callNumbersAPIMulti) and callNumbersAPI 
        could get refactored into one function. 
    */

    const ROOT_API = 'http://numbersapi.com/';
    const config = {
        headers: { "Content-Type": "application/json" }
    }

    const nbrFacts = []

    for (let i = 0; i < nbrOfFacts; i++) {
        nbrFacts.push(axios.get(`${ROOT_API}${favNbr}`, config));
    }

    Promise.all(nbrFacts)
        .then(data => fx(data, "success-m"))
        .catch(err => fx(err, "error"))

}

/** processForm: get data from form and make AJAX call to our API. */

function setFavNbrFormFields(data, type) {

    if (data) {

        if (type === "success") {
            // data['data'] can have 1:M values. When there is 1 value, 'data' is the key.
            // When there are multiple values, the entered number is the key.

            let msg;

            if (typeof (data["data"]) === "string") {
                msg = `${data["data"]}`;

            } else {
                msg = '';
                let delim = '';
                for (let key in data["data"]) {
                    msg = `${msg}${delim}${data["data"][key]}`;
                    delim = "<br>";
                    //$(`#${key}-err`).text(indata[key][0]);
                }
            }

            $("#favnbr-trivia").html(`<br>${msg}<br><br>`);

        } else {

            if (type === "success-m") {
                // data is an array of {data: fact} objects. Handle each one.
                let msg = '';
                data.forEach((fact, idx) => {
                    msg = `${msg}Fact #${idx + 1}: ${fact["data"]}<br>`;
                })

                $("#favnbr-trivia").html(`<br>${msg}<br>`);

            } else {

                // we have an error. Put data in the field's error.
                $("#fav-nbr-err").text(data);

            }

        }

    } else {

        $("#favnbr-trivia").html("<br><br><br>");
        $("#fav-nbr-err").text("");
        $("#nbr-of-facts-err").text("");

    }


}


function processFavNbrForm(evt) {

    evt.preventDefault();

    setFavNbrFormFields('', '');

    let favNbr = ($("#fav-nbr").val().trim()).replaceAll(' ', '');
    if (favNbr.length > 0) {
        nbrOfFacts = $("#nbr-of-facts").val();
        if (nbrOfFacts > 1) {
            // make sure there is only one number in favNbr.
            if (favNbr.indexOf(",") > -1) {
                $("#nbr-of-facts-err").text(`Ignored ${nbrOfFacts} - Multiple facts are not available for mulitiple numbers.`);
                callNumbersAPI(favNbr, setFavNbrFormFields);
            } else {
                callNumbersAPIMulti(favNbr, nbrOfFacts, setFavNbrFormFields);
            }
        } else {
            callNumbersAPI(favNbr, setFavNbrFormFields);
        }

    } else {
        // Value is needed for fav nbr.
        $("#fav-nbr-err").text("'Favorite Number' cannot be all spaces.");
    }

}


$("#favnbr-form").on("submit", processFavNbrForm);

