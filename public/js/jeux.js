
var defaultActionsRed = ["rougeRD", "rouge1", "rouge2", "rouge3", "rouge4", "rouge5"];
var defaultActionsBlue = ["bleuFD", "bleu1", "bleu2", "bleu3", "bleu4", "bleu5"];

var redActionsSelected=["","","","",""];
var blueActionsSelected=["","","","",""];
var indice = 0;
var tmp;

var tableBasicFlagRed = [new Position(3, 0), new Position(5, 0), new Position(4, 7), new Position(4, 8)];

var tableBasicFlagBlue = [new Position(3, 8), new Position(5, 8), new Position(4, 0), new Position(4, 1)];

var basicPositionTableRed = [new Position(0, 3), new Position(0, 4), new Position(0, 5), new Position(1, 4)];

var basicPositionTableBlue = [new Position(8, 3), new Position(8, 4), new Position(8, 5), new Position(7, 4)];

document.addEventListener("DOMContentLoaded", function () {
    displayGrid();
    document.getElementById("redActions").addEventListener("click", function () {
        var blocActions = document.getElementById("blocActions");
        var imgRouge = ["nord-rouge","est-rouge","ouest-rouge","sud-rouge", "prendre-rouge", "deposer-rouge", "repousser-rouge", "annuler-rouge", "x2-rouge", "pause-rouge", "est-x2-rouge"];
        displayRobotActions(blocActions, imgRouge, "actionsPlayerRed");
    });

    document.getElementById("blueActions").addEventListener("click", function () {
        var blocActions = document.getElementById("blocActions");
        var imgBlue = ["nord-bleu","est-bleu","ouest-bleu","sud-bleu", "prendre-bleu", "deposer-bleu", "repousser-bleu", "annuler-bleu", "x2-bleu", "pause-bleu", "ouest-x2-bleu"];
        displayRobotActions(blocActions, imgBlue, "actionsPlayerBlue");
    });

    displayDefaultAction("actionsPlayerRed", defaultActionsRed);
    displayDefaultAction("actionsPlayerBlue", defaultActionsBlue);


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
        blocActions.innerHTML += '<input type="checkbox" id="' + tabImg[i] + '" name="' + tabImg[i] + '"><label for="' + tabImg[i] + '" onclick="selectAction(this,\'' + element + '\')"><img src="../images/' + tabImg[i] + '.png" alt="' + tabImg[i] + '"></label>';
    }
    blocActions.innerHTML += '<div id="valider" onclick="unblockButtons(\'' + element + '\');fermer(\'' + element + '\')">Valider</div>';
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

function unblockButtons(el) {
    if (el == "actionsPlayerRed") {
        var actionsBlue = document.getElementById("blueActions");
        actionsBlue.style.cursor = "pointer";
        actionsBlue.disabled = false;
    } else if (el == "actionsPlayerBlue") {
        var boutonJeu = document.getElementById("play");
        boutonJeu.style.cursor = "pointer";
        boutonJeu.disabled = false;
    }
    
}


function selectAction(action, actionsRobot) {
    if (indice < 5) {
        var actionSelected = action.getAttribute("for");
        
        var player1 = document.querySelector('.'+actionsRobot);
        
        var action = player1.getElementsByTagName("label");
        
        action[indice].children[0].src = "../images/" + actionSelected + ".png";
        
        if(actionsRobot == "actionsPlayerRed"){
            
            redActionsSelected[indice]=actionSelected;
        }
        else{
            blueActionsSelected[indice]=actionSelected;
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
    var numAction = action.getAttribute("for");
    tmp = indice;
    if (indice => numAction && indice > 0) {

        var defaultAction;
        if (element == "actionsPlayerRed") {
            defaultAction = defaultActionsRed;
        } else {
            defaultAction = defaultActionsBlue;
        }
        action.querySelector("img").src = "../images/block-vide-" + defaultAction[numAction] + ".png";
        indice = numAction - 1;
    }

}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};



function Position(x, y) {
    this.x = x;
    this.y = y;
}

function Plateau() {
    this.grid = new Array();

    for (var i = 0; i < 9; i++) {
        this.grid[i] = new Array();
    }
}



function Case(position, isOccupedByRobot = false, colorFlag = "", isOccupedByFlag = false) {
    //?Peut-etre rajouté un attribut drapeau?// 
    this.position = position // Position de la case
    this.isOccupedByRobot = isOccupedByRobot; //Si la case est occupé ou non
    this.isOccupedByFlag = isOccupedByFlag; // -1 sinon, 0 si rouge et 1 si bleu
    this.colorFlag = colorFlag;
}


var Robot = {
    constructor: function (color) {
        this.color = color;
        this.flag = "";

        if (color === "red") {
            this.currentDirection = 'EAST';
            var tmp = basicPositionTableRed[getRandomIntInclusive(0, 3)];
            this.currentCase = new Position(tmp.x,tmp.y);
            this.currentCase.isOccupedByRobot = true;
        } else if (color === "blue") {
            this.currentDirection = 'WEST';
            var tmp = basicPositionTableBlue[getRandomIntInclusive(0, 3)]
            this.currentCase = tmp;
            this.currentCase.isOccupedByRobot = true;

        }

    },


    //Avancer deux fois;
    twiceAdvance: function () {
        console.log(this.color);
        if (this.color === "red") {
            if (this.currentCase.x + 2 > 8) {
                alert('Votre robot ne peut pas sortir du plateau de jeu');
            } else {
                this.currentCase.x += 2;
                //this.currentCase.isOccuped = false;
            }
        } else if (this.color === "blue") {
            if (this.currentCase.x - 2 < 0) {
                alert('Votre robot ne peut pas sortir du plateau de jeu');
            } else {
                this.position.x -= 2;
            }
        }
    },

    //Prendre un drapeau
    takeFlag: function () {
        console.log("Aurevoir");
        console.log(this.currentCase.isOccupedByFlag);
        if (this.currentCase.isOccupedByFlag) {
            this.flag = this.currentCase.hasFlag;
            this.currentCase.hasFlag = "";
            this.flag.currentCase = this.currentCase;
            console.log("bonjour");
        }
    },

    //Déposer un drapeau
    dropFlag: function (flag, currentCase) {
        if (!currentCase.isOccuped) {
            this.flag = "";
            flag.currentCase = currentCase;
        }
    },

    //Repousser le robot adverse
    repulse: function (opposingRobot) {
        if (opposingRobot.color = "red") {
            opposingRobot.currentCase.position.x -= 1;
        } else {
            opposingRobot.currentCase.position.x += 1;
        }
    },

    //Tourner et avancer d'une case
    advance: function (direction) {
        this.currentDirection = direction;

        switch (this.currentDirection) {
            case 'EAST':
                this.currentCase.x += 1;
                break;
            case 'WEST':
                this.currentCase.x -= 1;
                break;
            case 'NORTH':
                this.currentCase.y += 1;
                console.log("Franck");
                break;
            case 'SOUTH':
                this.currentCase.y -= 1;
                break;
        }
    }


}


var Flag = {
    constructor: function (color, currentCase) {
        this.color = color;
        this.currentCase = currentCase;
        this.isTaken = false;

    }
}



//Création des robots
var redRobot = Object.create(Robot);
redRobot.constructor("red");

var blueRobot = Object.create(Robot);
blueRobot.constructor("blue");


var plateau = new Plateau();

function displayGrid() {
    var grid = '<caption>Début de la partie</caption>';
    var nine = false;


    for (var i = 0; i < 9; i++) {
        grid += '<tr>';

        for (var j = 0; j < 9; j++) {



            for (var k = 0; k < 4; k++) {
                if (basicPositionTableRed[k].x === j && basicPositionTableRed[k].y === i) {
                    grid += '<td class="redCas">';
                    nine = true;
                } else if (basicPositionTableBlue[k].x === j && basicPositionTableBlue[k].y === i) {
                    grid += '<td class="blueCas">';
                    nine = true;
                } else if ((tableBasicFlagRed[k].x === j && tableBasicFlagRed[k].y === i) || (tableBasicFlagBlue[k].x === j && tableBasicFlagBlue[k].y === i)) {
                    grid += '<td class="greenCas">';
                    nine = true;
                }
                plateau.grid[i][j] = new Case(new Position(i, j));
            }

            if (!nine) {
                grid += '<td>';
            }
            nine = false;


            if (redRobot.currentCase.x === j && redRobot.currentCase.y === i) {
                grid += '<div class="robot"> <div class = "wheel" ></div><div class = "redRobot" ></div></div>';
                plateau.grid[i][j] = new Case(new Position(i, j), true);
            } else if (blueRobot.currentCase.x === j && blueRobot.currentCase.y === i) {
                grid += '<div class="robot"><div class="wheel"></div><div class="blueRobot"></div></div>';
                plateau.grid[i][j] = new Case(new Position(i, j), true);
            } else {
                for (var p = 0; p < 4; p++) {
                    if (tableBasicFlagRed[p].x === j && tableBasicFlagRed[p].y === i) {
                        grid += '<img src="../images/flag-red.png" alt="flag-red">';
                        plateau.grid[i][j] = new Case(new Position(i, j), false, "red", true);


                    } else if (tableBasicFlagBlue[p].x === j && tableBasicFlagBlue[p].y === i) {
                        grid += '<img src="../images/flag-blue.png" alt="flag-blue">';
                        plateau.grid[i][j] = new Case(new Position(i, j), false, "blue", true);
                    }
                }
            }

            grid += '</td>';

            if (j === 8) {
                grid += '</tr>';
            }
        }

    }
    document.querySelector("table").innerHTML = grid;

    console.log(plateau.grid);

}

redRobot.twiceAdvance();
redRobot.advance('EAST');
redRobot.takeFlag();
redRobot.advance('NORTH');