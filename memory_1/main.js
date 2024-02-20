
var cardImages = [];
function loadCards() {

    // load blank into position 0
    cardImages[0] = new Image();
    cardImages[0].src = "../images/blank.png"
    // load back into position 1
    cardImages[1] = new Image();
    cardImages[1].src = "../images/back.png"
    // load the rest of the cards, 24 card images
    for (var i = 2; i <= 25 ; i++) {
        cardImages[i] = new Image();
        cardImages[i].src = "images/card_"+ (i-1) +".png"
    }
}

// Fisher-Yates (Knuth) Shuffle
function shuffle(array) {
    let currentIndex = array.length - 1;
    let randomIndex;

    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        currentIndex--;
    }

}

$(document).ready(() => {
    $("#tabs").tabs();
   loadCards();
    let num_cards = sessionStorage.getItem("num_cards");
    if (num_cards === null || isNaN(num_cards)) {
        num_cards = 48;
    } else {
            num_cards = parseInt(num_cards);
    }

    function displayPlayerName() {
        const player_name = sessionStorage.getItem("player_name");
        if (player_name != null) {
        $("#player").text(player_name);
        }
    }

    displayPlayerName();

    function updatePlayerScore(newScore = null) {
        let player_name = sessionStorage.getItem("player_name");
        if (player_name != null) {
            $("#player").text(player_name);
            let player_score = sessionStorage.getItem(player_name + "_score");
            if (player_score != null && newScore == null) {
                $("#high_score").text(Math.floor(player_score * 100) + "%"); }
            else if (player_score == null && newScore != null) { 
                sessionStorage.setItem(player_name + "_score", newScore);
                $("#high_score").text(Math.floor(newScore * 100) + "%");
            }
            else if (player_score != null && newScore != null) {
                if (player_score > newScore) {
                    $("#high_score").text(Math.floor(player_score * 100) + "%");
                } else {
                    sessionStorage.setItem(player_name + "_score", newScore);
                    $("#high_score").text(Math.floor(newScore * 100) + "%");
                }
            } else {
                $("#high_score").text("");
            }
        }
    }

    updatePlayerScore();


   var deck = [];
   var wait = 0;
   var $firstPick;
   var $firstClick;
   var pick = 1;
   var score = 0;
   var attempts = 0;
   var winning_score = 0;

   for (let a = 0; a < num_cards; a++) {
            if (a == 0) {
                deck[a] = 2;
            } else if (a % 2 == 0) {
                deck[a] = deck[a-1] + 1;
            } else {
                deck[a] = deck[a-1];
            }
   }


   function dealCards() {
        const cards = $('#cards');
        shuffle(deck);
        deck.forEach((card, index) => { 
            const newCard = $("<a id='" + card + "' href='#'></a>");
            cards.append(newCard);
            newCard.append("<img src='" + cardImages[1].src + "' alt=''></img>");
        })
        wait = 0;
        score = 0;
        attempts = 0;
        pick = 1;
        winning_score = Math.floor(num_cards / 2);
        cards.attr("style", "height: " + (((deck.length) / 8) * 102) + "px;");
        cards.attr
   }

   dealCards();



   $("#cards a").on("click", function() {
         if (wait == 0) {
                // check to make sure someone didn't pick the same card on thier 2nd pick or pick a card that's already been matched
                if (($(this).is($firstClick) && pick == 2) || $(this, 'img').attr("src") == cardImages[0].src) {
                }
                else {
                // capture the first 'a' object
                $firstClick = $(this);
                // wait is to prevent picking another card prior to the card animations completing
                wait = 1;
                const imageNum = parseInt($(this).attr("id"));
                // fade out the card back, call an inline function to continue the logic
                $('img', this).fadeOut(500, function() {
                    // swap images
                    $(this).attr("src", cardImages[imageNum].src);
                    // fade the card back in, call another inline function to continue
                    $(this).fadeIn(500, function() {
                        // if this is the first pick, just turn off the wait and adjust the pick counter
                        if (pick == 1) {
                            wait = 0;
                            pick++;
                            $firstPick = $(this);
                        // if this is the 2nd pick, there are some checks that need to happen
                        } else if (pick == 2) {
                            // if they src images match, we have a match and just to make sure we check to make sure the img objects aren't the same
                            if ($(this).attr("src") == $firstPick.attr("src") && !$(this).is($firstPick)) {
                                score++;
                                attempts++;
                                $(this).slideUp(500, function() {
                                    $(this).attr("src", cardImages[0].src);
                                    $(this).slideDown(500);
                                });
                                $firstPick.slideUp(500, function() {
                                    $firstPick.attr("src", cardImages[0].src);
                                    $firstPick.slideDown(500);
                                });
                                if (score == winning_score) {
                                    updatePlayerScore(winning_score / attempts);
                                }
                            } else {
                                attempts++;
                                $(this).fadeOut(500, function() {
                                    $(this).attr("src", cardImages[1].src);
                                    $(this).fadeIn(500);
                                });
                                $($firstPick).fadeOut(500, function() {
                                    $firstPick.attr("src", cardImages[1].src);
                                    $firstPick.fadeIn(500);
                                });
                            }
                            wait = 0;
                            pick = 1;
                        }


                    });
                });
        }
    }
   });
   
   
   $("#save_settings").on("click", function() {
    if ($("#player_name").val() != "") {
        sessionStorage.setItem("player_name", $("#player_name").val());
        sessionStorage.setItem("num_cards", $("#num_cards").val());
        $("#player").text($("#player_name").val());
        location.reload();
        dealCards();
    }


   })


});