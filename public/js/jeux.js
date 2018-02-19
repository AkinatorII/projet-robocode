var defaultActionsRed = ["rougeRD", "rouge1", "rouge2", "rouge3", "rouge4", "rouge5"];
var defaultActionsBlue = ["bleuFD", "bleu1", "bleu2", "bleu3", "bleu4", "bleu5"];

var redActionsSelected = ["", "", "", "", ""];
var blueActionsSelected = ["", "", "", "", ""];
var indice = 0;
var tmp;
var round = 0;
var tableBasicFlagCaseRed = [new Position(3, 0), new Position(5, 0), new Position(4, 7), new Position(4, 8)];

var tableBasicFlagCaseBlue = [new Position(3, 8), new Position(5, 8), new Position(4, 0), new Position(4, 1)];

var basicPositionTableRed = [new Position(0, 3), new Position(0, 4), new Position(0, 5), new Position(1, 4)];

var basicPositionTableBlue = [new Position(8, 3), new Position(8, 4), new Position(8, 5), new Position(7, 4)];

var plateau = new Plateau();

document.addEventListener("DOMContentLoaded", function () {
    generatePlateau();
    displayGrid();
    document.getElementById("redActions").addEventListener("click", function () {
        var blocActions = document.getElementById("blocActions");
        var imgRouge = ["nord-rouge", "est-rouge", "ouest-rouge", "sud-rouge", "prendre-rouge", "deposer-rouge", "repousser-rouge", "annuler-rouge", "x2-rouge", "pause-rouge", "est-x2-rouge"];
        displayRobotActions(blocActions, imgRouge, "actionsPlayerRed");
    });

    document.getElementById("blueActions").addEventListener("click", function () {
        var blocActions = document.getElementById("blocActions");
        var imgBlue = ["nord-bleu", "est-bleu", "ouest-bleu", "sud-bleu", "prendre-bleu", "deposer-bleu", "repousser-bleu", "annuler-bleu", "x2-bleu", "pause-bleu", "ouest-x2-bleu"];
        displayRobotActions(blocActions, imgBlue, "actionsPlayerBlue");
    });

    displayDefaultAction("actionsPlayerRed", defaultActionsRed);
    displayDefaultAction("actionsPlayerBlue", defaultActionsBlue);
    document.getElementById("play").addEventListener("click", function () {

        blockButton("blueActions", "redActions", "play");
        playGame(plateau);

    });


});

function displayDefaultAction(element, tabActions) {

    var actionsPlayer = document.querySelector("." + element);
    actionsPlayer.innerHTML = '';
    for (var i = 0; i < 6; i++) {
        if (i == 0) {
            actionsPlayer.innerHTML += '<img src="../images/block-vide-' + tabActions[i] + '.png">';
        } else {
            actionsPlayer.innerHTML += '<input type="checkbox" id="' + i + '" name="action' + i + '"><label for="' + i + '" onclick="annulerAction(this,\'' + element + '\')"><img src="../images/block-vide-' + tabActions[i] + '.png"></label>';
        }
    }
}

function displayRobotActions(blocActions, tabImg, element) {
    blocActions.innerHTML = '<h3> Les actions :</h3><div id="fermer" onclick="fermer(\'' + element + '\')">X</div>';
    for (var i = 0; i < tabImg.length; i++) {
        blocActions.innerHTML += '<input type="checkbox" id="' + tabImg[i] + '" name="' + tabImg[i] + '"><label id="label' + tabImg[i] + '" for="' + tabImg[i] + '" onclick="selectAction(this,\'' + element + '\')"><img src="../images/' + tabImg[i] + '.png" alt="' + tabImg[i] + '"></label>';
    }
    blocActions.innerHTML += '<div id="valider" onclick="valide(\'' + element + '\');">Valider</div>';
    blocActions.style.display = "block";
}

function fermer(element) {

    document.getElementById("blocActions").style.display = "none";
    if (indice > 0) {
        if (element == "actionsPlayerRed") {
            displayDefaultAction(element, defaultActionsRed);
        } else {
            displayDefaultAction(element, defaultActionsBlue);
        }

    }

    indice = 0;
}

function blockButton() {

    var btn;
    for (var i in arguments) {
        btn = document.getElementById(arguments[i])
        btn.disabled = true;
        btn.style.cursor = "not-allowed";
    }

}

function unblockButton() {
    var btn;
    for (var i in arguments) {
        btn = document.getElementById(arguments[i])
        btn.disabled = false;
        btn.style.cursor = "pointer";
    }


}


function valide(element) {
    if (indice > 4) {
        if (element == "actionsPlayerRed") {
            unblockButton("blueActions");
            if (round % 2 != 0) {
                unblockButton("play");
            }
        } else if (element == "actionsPlayerBlue") {
            unblockButton("redActions");
            if (round % 2 == 0) {
                unblockButton("play");
            }
        }
        fermer(element);
    } else {
        alert("il faut choisir 5 actions !!");
    }


}

function selectAction(action, actionsRobot) {
    if (indice < 5) {
        var actionSelected = action.getAttribute("for");
        action.style.display = "none";
        var player1 = document.querySelector('.' + actionsRobot);

        var action = player1.getElementsByTagName("label");

        //document.querySelector("#");
        action[indice].children[0].src = "../images/" + actionSelected + ".png";
        //action[indice].style.display="none";

        if (actionsRobot == "actionsPlayerRed") {

            redActionsSelected[indice] = actionSelected;
        } else {
            blueActionsSelected[indice] = actionSelected;
        }

        if (tmp > indice) {
            indice = tmp;
            tmp = undefined;
        } else {
            indice++;
        }

    }


}

function annulerAction(action, element) {
    //regarder a la fin le truc d'input dans les deux bloc (player1_2 , blocAction)
    var numAction = action.getAttribute("for");
    tmp = indice;

    if (indice >= numAction && indice > 0) {

        var defaultAction;
        var tabActionsSelected;
        if (element == "actionsPlayerRed") {
            defaultAction = defaultActionsRed;
            tabActionsSelected = redActionsSelected;
        } else {
            defaultAction = defaultActionsBlue;
            tabActionsSelected = blueActionsSelected;
        }

        //action.style.display="none";
        action.querySelector("img").src = "../images/block-vide-" + defaultAction[numAction] + ".png";
        indice = numAction - 1;
        document.querySelector("#label" + redActionsSelected[indice]).style.display = "inline";
        tabActionsSelected[indice] = "";

    }

}

/*Fonction qui génère un entier entre deux bornes min et max*/
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


/*Objet Position*/
function Position(x, y) {
    this.x = x;
    this.y = y;
}

/*Objet Plateau*/
function Plateau() {
    this.grid = new Array();

    for (var i = 0; i < 9; i++) {
        this.grid[i] = new Array();
    }
}


/*Objet Case */
function Case(position) {
    //?Peut-etre rajouté un attribut drapeau?// 
    this.position = position // Position de la case
    this.isOccupedByRobot = ""; //Si la case est occupé ou non
    this.isOccupedByFlag = ""; // -1 sinon, 0 si rouge et 1 si bleu
    this.colorFlag = "";
    this.colorCase = "";

}


/*Objet Robot*/
var Robot = {
    constructor: function (color) {
        this.color = color;
        this.hasFlag = "";

        if (color === "red") {
            this.currentDirection = 'EAST';
            var tmp = basicPositionTableRed[getRandomIntInclusive(0, 3)];
            this.currentCase = new Position(tmp.x,tmp.y);
            this.currentCase.isOccupedByRobot = true;
        } else if (color === "blue") {
            this.currentDirection = 'WEST';
            var tmp = basicPositionTableBlue[getRandomIntInclusive(0, 3)]
            this.currentCase = new Position(tmp.x,tmp.y);
            this.currentCase.isOccupedByRobot = true;

        }

    },


    //Avancer deux fois;
    twiceAdvance: function (plateau) {
        if (this.color === "red") {

            this.advance("EAST", plateau);
            this.advance("EAST", plateau);
        } else if (this.color === "blue") {

            this.advance("WEST", plateau);
            this.advance("WEST", plateau);
        }
    },

    //Prendre un drapeau
    takeFlag: function (plateau) {
        if (plateau.grid[this.currentCase.y][this.currentCase.x].isOccupedByFlag !== "") {
            this.hasFlag = plateau.grid[this.currentCase.y][this.currentCase.x].isOccupedByFlag;
            plateau.grid[this.currentCase.y][this.currentCase.x].isOccupedByFlag = false;
        }
    },

    //Déposer un drapeau
    dropFlag: function (plateau) {

        if (!plateau.grid[this.currentCase.y][this.currentCase.x].isOccupedByFlag) {
            plateau.grid[this.currentCase.y][this.currentCase.x].isOccupedByFlag = this.hasFlag;
        }
    },

    //Repousser le robot adverse
    repulse: function (opposingRobot, plateau) {
        plateau.grid[opposingRobot.currentCase.y][opposingRobot.currentCase.x].isOccupedByRobot = "";
        if (opposingRobot.color === "red") {
            plateau.grid[opposingRobot.currentCase.y][opposingRobot.currentCase.x - 1].isOccupedByRobot = opposingRobot.color;
            opposingRobot.currentCase.x -= 1;
        } else {
            plateau.grid[opposingRobot.currentCase.y][opposingRobot.currentCase.x + 1].isOccupedByRobot = opposingRobot.color;
            opposingRobot.currentCase.x += 1;
        }
    },

    //Tourner et avancer d'une case
    advance: function (direction, plateau) {
        this.currentDirection = direction;
        switch (this.currentDirection) {
            case 'EAST':


                if (!this.testError(plateau, this.currentCase.x + 1, this.currentCase.y)) {
                    plateau.grid[this.currentCase.y][this.currentCase.x].isOccupedByRobot = "";
                    plateau.grid[this.currentCase.y][this.currentCase.x + 1].isOccupedByRobot = this.color;
                    this.currentCase.x += 1;
                }

                break;
            case 'WEST':

                if (!this.testError(plateau, this.currentCase.x - 1, this.currentCase.y)) {
                    plateau.grid[this.currentCase.y][this.currentCase.x].isOccupedByRobot = "";
                    plateau.grid[this.currentCase.y][this.currentCase.x - 1].isOccupedByRobot = this.color;
                    this.currentCase.x -= 1;
                }

                break;
            case 'NORTH':

                if (!this.testError(plateau, this.currentCase.x, this.currentCase.y - 1)) {
                    plateau.grid[this.currentCase.y][this.currentCase.x].isOccupedByRobot = "";
                    plateau.grid[this.currentCase.y - 1][this.currentCase.x].isOccupedByRobot = this.color;
                    this.currentCase.y -= 1;
                }

                break;
            case 'SOUTH':

                if (!this.testError(plateau, this.currentCase.x, this.currentCase.y + 1)) {
                    plateau.grid[this.currentCase.y][this.currentCase.x].isOccupedByRobot = "";
                    plateau.grid[this.currentCase.y + 1][this.currentCase.x].isOccupedByRobot = this.color;
                    this.currentCase.y += 1;
                }

                break;
        }
    },


    testError: function (plateau, x, y) {

        if (x > 8 || y > 8 || x < 0 || y < 0) {
            alert('Votre robot ne peut pas sortir du plateau de jeu');
            return true;

        } else if (plateau.grid[y][x].isOccupedByRobot != "") {
            alert('Votre adverssaire est deja dans la case ');
            return true;
        }
        return false;
    }

}




//Création des robots
var redRobot = Object.create(Robot);
redRobot.constructor("red");

var blueRobot = Object.create(Robot);
blueRobot.constructor("blue");



/* Fonction qui sert à afficher la grille avec les robots et les drapeaux*/
function displayGrid() {
    var grid = '<caption>Début de la partie</caption>';
    var nine = false;

    for (var i = 0; i < 9; i++) {
        grid += '<tr>';

        for (var j = 0; j < 9; j++) {
            if (plateau.grid[i][j].colorCase === "red") {
                grid += '<td class="redCas">';
                nine = true;
            } else if (plateau.grid[i][j].colorCase === "blue") {
                grid += '<td class="blueCas">';
                nine = true;
            } else if (plateau.grid[i][j].colorCase === "green") {
                grid += '<td class="greenCas">';
                nine = true;
            }


            if (!nine) {
                grid += '<td>';
            }
            nine = false;


            if (plateau.grid[i][j].isOccupedByRobot === "red") {
                grid += '<div class="robot"> <div class = "wheel" ></div><div class = "redRobot" ></div></div>';
            } else if (plateau.grid[i][j].isOccupedByRobot === "blue") {
                grid += '<div class="robot"><div class="wheel"></div><div class="blueRobot"></div></div>';
            }




            if (plateau.grid[i][j].isOccupedByFlag === "red") {
                grid += '<img src="../images/flag-red.png" alt="flag-red">';

            } else if (plateau.grid[i][j].isOccupedByFlag === "blue") {
                grid += '<img src="../images/flag-blue.png" alt="flag-blue">';

            }
        }

        grid += '</td>';

        if (j === 8) {
            grid += '</tr>';
        }
    }


    document.querySelector("table").innerHTML = grid;
}

/* Fonction qui genere le plateau de jeu */
function generatePlateau() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            plateau.grid[i][j] = new Case(new Position(i, j));
            for (var k = 0; k < 4; k++) {
                if (basicPositionTableRed[k].x === j && basicPositionTableRed[k].y === i) {
                    plateau.grid[i][j].colorCase = "red";
                } else if (basicPositionTableBlue[k].x === j && basicPositionTableBlue[k].y === i) {
                    plateau.grid[i][j].colorCase = "blue";
                } else if ((tableBasicFlagCaseRed[k].x === j && tableBasicFlagCaseRed[k].y === i) || (tableBasicFlagCaseBlue[k].x === j && tableBasicFlagCaseBlue[k].y === i)) {
                    plateau.grid[i][j].colorCase = "green";
                }

                if (tableBasicFlagCaseRed[k].x === j && tableBasicFlagCaseRed[k].y === i && redRobot.currentCase.x === j && redRobot.currentCase.y === i) {
                    plateau.grid[i][j].isOccupedByRobot = "red";
                    plateau.grid[i][j].isOccupedByFlag = "red";
                } else if (tableBasicFlagCaseRed[k].x === j && tableBasicFlagCaseRed[k].y === i) {
                    plateau.grid[i][j].isOccupedByFlag = "red";


                } else if (tableBasicFlagCaseBlue[k].x === j && tableBasicFlagCaseBlue[k].y === i && redRobot.currentCase.x === j && redRobot.currentCase.y === i) {
                    plateau.grid[i][j].isOccupedByRobot = "blue";
                    plateau.grid[i][j].isOccupedByFlag = "blue";

                } else if (tableBasicFlagCaseBlue[k].x === j && tableBasicFlagCaseBlue[k].y === i) {
                    plateau.grid[i][j].isOccupedByFlag = "blue";
                }
            }

            if (redRobot.currentCase.x === j && redRobot.currentCase.y === i) {
                plateau.grid[i][j].isOccupedByRobot = "red";
            } else if (blueRobot.currentCase.x === j && blueRobot.currentCase.y === i) {
                plateau.grid[i][j].isOccupedByRobot = "blue";
            }
        }
    }
}

/*Fonction principale qui fait dérouler le jeu */
function playGame() {
    var win=false;
if(win ===false){
    if (indice < 5) {
        if (redActionsSelected[indice] !== "annuler-rouge" && blueActionsSelected[indice] !== 'annuler-bleu') {
            actionRed(redActionsSelected[indice]);
            actionBlue(blueActionsSelected[indice]);
        }

        displayGrid();
        indice++;

        console.log(verifWin());
        if (verifWin() === "red") {
            alert("Le joueur rouge a gagné");
            win=true;
        } else if (verifWin() === "blue") {
            alert("Le joueur bleu a gagné");
            win=true;
        } else {
            setTimeout(playGame, 1000);
            round++;
        }
    } else if (indice == 5) {

        if (round % 2 == 0) {
            blockButton("blueActions", "play");
            unblockButton("redActions");
        } else {
            blockButton("redActions", "play");
            unblockButton("blueActions");
        }
        indice = 0;
    }

}

}

/*Fonction qui prend en parametre une action du robot rouge et l'execute */
function actionRed(action) {
    switch (action) {
        case 'sud-rouge':
            redRobot.advance('SOUTH', plateau);
            break;
        case 'est-rouge':
            redRobot.advance('EAST', plateau);
            break;
        case 'ouest-rouge':
            redRobot.advance('WEST', plateau);
            break;
        case 'nord-rouge':
            redRobot.advance('NORTH', plateau);
            break;
        case 'est-x2-rouge':
            redRobot.twiceAdvance(plateau);
            break;
        case 'prendre-rouge':
            redRobot.takeFlag(plateau);
            break;
        case 'deposer-rouge':
            redRobot.dropFlag(plateau);
            break;
        case 'repousser-rouge':
            redRobot.repulse(blueRobot, plateau);
            break;
    }
}

/*Fonction qui prend en parametre une action du robot bleu et l'execute */
function actionBlue(action) {
    switch (action) {
        case 'sud-bleu':
            blueRobot.advance('SOUTH', plateau);
            break;
        case 'est-bleu':
            blueRobot.advance('EAST', plateau);
            break;
        case 'ouest-bleu':
            blueRobot.advance('WEST', plateau);
            break;
        case 'nord-bleu':
            blueRobot.advance('NORTH', plateau);
            break;
        case 'ouest-x2-bleu':
            blueRobot.twiceAdvance(plateau);
            break;
        case 'prendre-bleu':
            blueRobot.takeFlag(plateau);
            break;
        case 'deposer-bleu':
            blueRobot.dropFlag(plateau);
            break;
        case 'repousser-bleu':
            blueRobot.repulse(redRobot, plateau);
            break;
    }
}

/*Fonction qui vérifie si il y a un gagnant entre les deux joueurs */
function verifWin() {
    var tmpRed = 0;
    var tmpBlue = 0;
    
    for(var k=0;k<4;k++){
        if(plateau.grid[basicPositionTableRed[k].y][basicPositionTableRed[k].x].isOccupedByFlag !== ""){
            tmpRed++;
        }else if(plateau.grid[basicPositionTableBlue[k].y][basicPositionTableBlue[k].x].isOccupedByFlag !== ""){
            tmpBlue++;
        }
    }

    

    if (tmpBlue === 3) {
        return "blue";
    } else if (tmpRed === 3) {
        return "red";
    } else {
        return false;
    }

}
