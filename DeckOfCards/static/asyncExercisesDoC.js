/*
    DECK OF CARDS API RELATED FUNCTIONS
*/

let deckId = "new";

function callDeckOfCardsAPI(inApiAction, fx) {
  const ROOT_DECK_API = "https://deckofcardsapi.com/api/deck/";

  let cardPromise = axios.get(`${ROOT_DECK_API}${inApiAction}`);

  cardPromise.then((data) => fx(data["data"])).catch((err) => fx(err));
}

function handleCard(data) {
  // data:
  // {
  //     "success": true,
  //     "cards": [
  //         {
  //             "image": "https://deckofcardsapi.com/static/img/KH.png",
  //             "value": "KING",
  //             "suit": "HEARTS",
  //             "code": "KH"
  //         }, . . .
  //       . . . for x cards
  //     ],
  //     "deck_id":"vkl5zeyo13vw",
  //     "remaining": 50
  // }

  if (data["success"]) {
    $("#card").attr("src", data["cards"][0]["image"]);

    deckId = data["deck_id"];

    if (data["remaining"] < 1) {
      $("#deal-card").prop("disabled", true);
      $("#msg").text(`0 cards remaining in deck# ${deckId}. `);
    }
  } else {
    // when status code 500 occurs, data is typically
    //   Error: Request failed with status code 500 at createError ...
    // But for 40x errors, data is
    //   {success: false, ... error:<<text of error>>}
    // It looks odd, but test for data["success"] === false so we handle
    //   the api messages correctly.
    // stub to handle any messaging
    if (data["success"] === false) {
      $("#msg").text(data["error"]);
    } else {
      $("#msg").text(data);
    }
  }
}

function dealCard(evt) {
  evt.preventDefault();

  // clear messages
  $("#msg").text("");
  callDeckOfCardsAPI(`${deckId}/draw/?count=1`, handleCard);
}

$("#deal-card").on("click", dealCard);
