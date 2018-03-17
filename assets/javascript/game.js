
var startingGroup = [
    {
        name: "Luke Skywalker",
        id: "luke",
        picture: "assets/images/luke_skywalker.jpg",
        sound: "assets/sounds/luke.wav",
        hp: 100,
        attack: 5,
        increment: 10,
        defense: 5
    },
    {
        name: "Han Solo",
        id: "han",
        picture: "assets/images/han_solo.jpg",
        sound: "assets/sounds/han.wav",
        hp: 140,
        attack: 10,
        increment: 5,
        defense: 8
    },
    {
        name: "Obi-Wan Kenobi",
        id: "obiwan",
        picture: "assets/images/obiwan_kenobi.jpg",
        sound: "assets/sounds/obiwan.wav",
        hp: 90,
        attack: 30,
        increment: 5,
        defense: 10
    },
    {
        name: "Darth Vader",
        id: "vader",
        picture: "assets/images/darth_vader.jpg",
        sound: "assets/sounds/vader.wav",
        hp: 150,
        attack: 15,
        increment: 5,
        defense: 15
    },
    {
        name: "Darth Sidious",
        id: "sidious",
        picture: "assets/images/darth_sidious.jpg",
        sound: "assets/sounds/sidious.wav",
        hp: 150,
        attack: 20,
        increment: 1,
        defense: 25
    },
], characters = [], user = [], enemies = [], defender = [], lostGame = false, wonGame = false, audio = document.createElement("audio");;

var showChars = function (arr, cardClass, slot, clickable) {
    $(slot).html("");
    for (let i = 0; i < arr.length; i++) {
        var fighter = $("<div>");
        fighter.addClass(cardClass);
        if (clickable) {
            fighter.addClass("clickable-card");
        } else {
            fighter.removeClass("clickable-card");
        }
        fighter.attr("id", arr[i].id);
        fighter.html("<p>" + arr[i].name + "</p><img class='icon' src=" + arr[i].picture + ">" + "<p>HP: " + arr[i].hp + "</p>");
        $(slot).append(fighter);

    }
};

var initiateBattle = function () {
    $("#character-select").on("click", ".character-card", function () {
        var myGuy = $(this).attr("id"), targetIndex;
        for (let i = 0; i < characters.length; i++) {
            if (myGuy == characters[i].id) {
                targetIndex = i;
            }
        }
        user = characters.splice(targetIndex, 1);
        enemies = characters;
        characters = [];
        $("#character-select-header").hide();
        $("#defender-header").fadeOut();
        $("#your-character-header").fadeIn("slow");
        $("#enemies-header").fadeIn("slow");
        showChars(characters, "character-card", "#character-select", true);
        showChars(user, "character-card", "#your-character", false);
        audio.pause();
        audio.setAttribute("src", user[0].sound);
        audio.play();
        showChars(enemies, "enemy-card", "#enemies", true);
    });
};

var selectDefender = function () {
    $("#enemies").on("click", ".enemy-card", function () {
        if (defender.length == 0 && !lostGame && !wonGame) {
            var badGuy = $(this).attr("id"), targetIndex;
            for (let i = 0; i < enemies.length; i++) {
                if (badGuy == enemies[i].id) {
                    targetIndex = i;
                }
            }
            defender = enemies.splice(targetIndex, 1);
            showChars(enemies, "enemy-card", "#enemies", false);
            showChars(defender, "defender-card", "#defender", false);
            audio.pause();
            audio.setAttribute("src", defender[0].sound);
            audio.play();
        }
        $("#defender-header").fadeIn();
        $("#attack-btn").show();
        $("#enemies-header").text("Enemies Remaining:");
    });
};

var displayResults = function (enemy, hero) {
    $("#attack-display").text("You attacked " + enemy + " for " + user[0].attack + " damage.");
    if (defender.length == 1) {
        $("#defend-display").text(defender[0].name + " attacked you back for " + defender[0].defense + " damage.");
    } else {
        $("#defend-display").text(enemy + " was defeated!");
    }
    if (wonGame) {
        $("#game-end").text("YOU WON!!");
        $("#restart-btn").show();
        $("#enemies-header").hide();
        $("#attack-btn").hide();
    }
    else if (lostGame) {
        $("#defend-display").text(defender[0].name + " attacked you back for " + defender[0].defense + " damage and destroyed you.");
        $("#game-end").text("You Lost!");
        $("#restart-btn").show();
        $("#attack-btn").hide();
    }
}

var attack = function () {
    $("#attack-btn").on("click", function () {
        if (defender.length == 1 && !lostGame && !wonGame) {
            const damage = defender[0].defense, enemy = defender[0].name, hero = user[0].name;
            defender[0].hp -= user[0].attack;
            if (defender[0].hp <= 0) {
                $("#attack-btn").hide();
                $("#defender-header").hide();
                $("#enemies-header").text("Select Your Enemy:");
                showChars(enemies, "enemy-card", "#enemies", true);
                defender = [];
            }
            if (defender.length == 1) {
                user[0].hp -= damage;
                if (user[0].hp <= 0) {
                    user[0].hp = 0;
                    lostGame = true;
                }
            }
            if (defender.length == 0 && enemies.length == 0) {
                wonGame = true;
            }
            showChars(defender, "defender-card", "#defender", false);
            showChars(user, "character-card", "#your-character", false);
            console.log("me:", user, "enemy", defender, "attacking...", "lost?", lostGame, "won?", wonGame);
            displayResults(enemy, hero);
            user[0].attack += user[0].increment;
        }
    })
}

var reset = function () {
    $("#restart-btn").on("click", function () {
        console.log("restarting");
        audio.pause();
        audio.setAttribute("src","assets/sounds/theme.mp3")
        audio.play();
        characters = JSON.parse(JSON.stringify(startingGroup));
        user = [];
        enemies = [];
        defender = [];
        lostGame = false;
        wonGame = false;
        $("#attack-btn").hide();
        $("#character-select-header").show();
        $("#your-character-header").hide();
        $("#enemies-header").hide();
        $("#defender-header").hide();
        $("#game-end").text("");
        $("#attack-display").text("");
        $("#defend-display").text("");
        console.log(startingGroup, characters, user);
        showChars(enemies, "enemy-card", "#enemies", true);
        showChars(defender, "defender-card", "#defender", false);
        showChars(characters, "character-card", "#character-select", true);
        showChars(user, "character-card", "#your-character", false);
        $(this).hide();
    });
}

$(document).ready(function () {
    audio.setAttribute("src","assets/sounds/theme.mp3")
    audio.play();
    characters = JSON.parse(JSON.stringify(startingGroup));
    $("#restart-btn").hide();
    $("#attack-btn").hide();
    $("#your-character-header").hide();
    $("#enemies-header").hide();
    $("#defender-header").hide();
    showChars(characters, "character-card", "#character-select", true);
    initiateBattle();
    selectDefender();
    attack();
    reset();

});