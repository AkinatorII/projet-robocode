document.addEventListener("DOMContentLoaded", function(e) {
    
    var dessin = document.getElementById("dessin");
    var overlay = document.getElementById("overlay");
    
    var act = function(f, e) {
        var rect = dessin.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        f.call(currentCommand, x, y);
    }
    
    overlay.addEventListener("mousemove", function(e) {
        act(currentCommand.move, e); 
    });
    overlay.addEventListener("mousedown", function(e) {
        act(currentCommand.down, e); 
    });    
    overlay.addEventListener("mouseup", function(e) {
        act(currentCommand.up, e); 
    });                      
    overlay.addEventListener("mouseout", function(e) {
        act(currentCommand.out, e); 
    });                 
    
    
    var ctxBG = dessin.getContext("2d");
    var ctxFG = overlay.getContext("2d");
    
    document.getElementById("new").addEventListener("click", function(e) {
        ctxBG.clearRect(0, 0, ctxBG.width, ctxBG.height); 
    });
    
    document.getElementById("open").addEventListener("click", function(e) {
        filemanager.afficher();
    });
    
    document.getElementById("save").addEventListener("click", function(e) {
        filemanager.enregistrer();
    });

    // Tailles des zones 
    overlay.width = dessin.width = ctxBG.width = ctxFG.width = 500;
    overlay.height = dessin.height = ctxBG.height = ctxFG.height = 500;
    // Taille du crayon
    ctxBG.lineCap = ctxFG.lineCap = "round";
    
    
    /**
     *  Prototype de commande (classe abstraite)
     */
    function Commande() { 
        // bouton cliqué
        this.isDown = false;
        // fillStyle pour le dessin 
        this.fsBG = "white", 
        // fillStyle pour le calque
        this.fsFG = "white";
        // strokeStyle pour le dessin
        this.ssBG = "white";
        // strokeStyle pour le calque
        this.ssFG = "white";
    }
    // selection (paramétrage des styles)
    Commande.prototype.select = function() {
        ctxBG.fillStyle = this.fsBG; 
        ctxFG.fillStyle = this.fsFG; 
        ctxBG.strokeStyle = this.ssBG;
        ctxFG.strokeStyle = this.ssFG;
        currentCommand = this;
    };
    // action liée au déplacement de la souris
    Commande.prototype.move = function(x, y) { 
        ctxFG.clearRect(0, 0, ctxFG.width, ctxFG.height);
    };
    // action liée au relâchement du bouton de la souris
    Commande.prototype.up = function(x, y) { 
        this.isDown = false;
    };
    // action liée à l'appui sur le bouton de la souris
    Commande.prototype.down = function(x, y) { 
        this.isDown = true;
    }; 
    // action liée à la sortie de la souris de la zone
    Commande.prototype.out = function() {
        this.isDown = false;
        ctxFG.clearRect(0, 0, ctxFG.width, ctxFG.height);
    };
    
    
    /** 
     *  Commande pour tracer (dessine un point)
     *      au survol : affichage d'un point 
     *      au clic : dessin du point 
     */
    var tracer = new Commande();     
    tracer.dessiner = function(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x, y, size.value/2, 0, 2*Math.PI);
        ctx.fill();
    }
    tracer.move = function(x, y) {
        // appel classe mère
        Commande.prototype.move.call(this, x, y);
        // affichage sur le calque 
        this.dessiner(ctxFG, x, y);
        // si bouton cliqué : impression sur la zone de dessin
        if (this.isDown) {
            this.dessiner(ctxBG, x, y);
        }
    }
    tracer.down = function(x, y) {
        // appel classe mère
        Commande.prototype.down.call(this, x, y);
        // impression sur la zone de dessin
        this.dessiner(ctxBG, x, y);
    }
    
    
    /** 
     *  Commande pour gommer (effacer une zone)
     *      au survol : affichage d'un rectangle représentant la zone à effacer 
     *      au clic : effacement de la zone
     */
    var gommer = new Commande();
    gommer.ssFG = "black";
    gommer.effacer = function(x, y) {
        ctxBG.clearRect(x - size.value/2, y - size.value/2, size.value, size.value);
    }
    gommer.move = function(x, y) {
        Commande.prototype.move.call(this, x, y);
        ctxFG.lineWidth = 1;
        if (this.isDown) {
            this.effacer(x, y);
        }
        ctxFG.strokeRect(x - size.value/2, y - size.value/2, size.value, size.value);
    }
    gommer.down = function(x, y) {
        Commande.prototype.down.call(this, x, y);    
        gommer.effacer(x,y);
    }

    
    /** 
     *  Commande pour tracer une ligne
     *      au survol si clic appuyé : ombrage de la ligne entre le point de départ et le point courant. 
     *      au relâchement du clic : tracé de la ligne sur la zone de dessin
     */
    var ligne = new Commande();
    ligne.ssFG = "white";
    ligne.dessiner = function(ctx, x, y) {
        ctx.lineWidth = size.value;
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    ligne.move = function(x, y) {
        Commande.prototype.move.call(this, x, y);
        ctxFG.lineWidth = size.value;
        if (this.isDown) {
            this.dessiner(ctxFG, x, y);
        }
        else tracer.dessiner(ctxFG, x, y);
    }
    ligne.down = function(x, y) {
        Commande.prototype.down.call(this, x, y);
        this.startX = x;
        this.startY = y;
    }
    ligne.up = function(x, y) {
        Commande.prototype.up.call(this, x, y);
        this.dessiner(ctxBG, x, y);
    }

    
    /** 
     *  Commande pour dessiner un rectangle
     *      au survol si clic appuyé : ombrage du rectangle entre le point de départ et le point courant. 
     *      au relâchement du clic : tracé du rectangle sur la zone de dessin
     */
    var rectangle = new Commande();
    rectangle.dessiner = function(ctx, x, y) {
        ctx.lineWidth = size.value;
        ctx.fillRect(this.startX, this.startY, x - this.startX, y - this.startY);
        ctx.strokeRect(this.startX, this.startY, x - this.startX, y - this.startY);
    }
    rectangle.move = function(x, y) {
        Commande.prototype.move.call(this, x, y);
        if (this.isDown) {
            this.dessiner(ctxFG, x, y);
        }
        else {
            ctxFG.fillRect(x - size.value/2, y - size.value/2, size.value, size.value);
        }
    }
    rectangle.down = function(x, y) {
        Commande.prototype.down.call(this, x, y);
        this.startX = x;
        this.startY = y;
    }
    rectangle.up = function(x, y) {
        Commande.prototype.up.call(this, x, y);
        this.dessiner(ctxBG, x, y);
    }
    
    
    /** 
     *  Affectation des événements sur les boutons radios
     *  et detection du bouton radio en cours de sélection.
     */
    var radios = document.getElementsByName("radCommande");
    for (var i=0; i < radios.length; i++) {
        var selection = function() {
            if (this.checked) {
                currentCommand = eval(this.id);  
                currentCommand.select();
            }            
        }
        selection.apply(radios.item(i));
        radios.item(i).addEventListener("change", selection);
    }
    
});    
    

/** 
 *  Objet permettant de gérer les dessins enregistrés dans le localStorage
 */
var filemanager = {

    /**
     *  Afficher le gestionnaire de dessin : liste les dessins existants et 
     *      donne la possibilité de les ouvrir ou de les supprimer.
     */
    afficher: function() {
        var modal = document.getElementById("modal");
        
        var html = "Pas d'image enregistrée.";
           
        if (localStorage.length > 0) {
            html = "<table>";
            for (var i=0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                html += "<tr><td>" + key + "</td>" + 
                    "<td><img src='data:image/png;base64," + localStorage.getItem(key) + 
                        "' onclick='filemanager.ouvrir(\"" + key + "\")'></td>" +
                    "<td><img src='../images/icone-supprimer.png' onclick='filemanager.supprimer(\"" + key + "\")'></td></tr>";
            }
            html += "</table>";
        }
        modal.innerHTML = "<h3>Images enregistrées</h3>" + html + "<div id='fermer' onclick='filemanager.fermer()'></div>";
        modal.style.display = "block";   
    },
    
    /** 
     *  Ouverture du dessin dans la zone de dessin
     */
    ouvrir: function(id) {
        var dataImg = localStorage.getItem(id);
        if (dataImg) {
            var img = new Image();
            img.onload = function() {
                var ctxBG = document.getElementById("dessin").getContext("2d");
                ctxBG.clearRect(0, 0, ctxBG.width, ctxBG.height);
                ctxBG.drawImage(img, 0, 0, ctxBG.width, ctxBG.height);
                filemanager.fermer();
            }
            img.src = "data:image/png;base64," + dataImg;   
        }
    },
        
    /**
     *  Enregistrer l'image dans le localStorage
     */
    enregistrer: function() {
        var conf = false;
        do {
            var nom = prompt("Donnez un nom à l'image");
            if (nom) {
                conf = (localStorage.getItem(nom)) ? confirm("Ce nom d'image existe déjà. L'écraser ?") : true;
            }
            else 
                return;
        }
        while (!conf);
        if (nom) {
            var emile = dessin.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
            localStorage.setItem(nom, emile);
        }
    },

    /**
     *  Suppression du dessin du localStorage
     */
    supprimer: function(id) {
        if (confirm("Voulez-vous vraiment supprimer ce dessin ?")) {
            localStorage.removeItem(id);    
            this.afficher();
        }
    },

    /** Fermeture de la fenêtre modale */
    fermer: function() {
        document.getElementById("modal").style.display = "none";   
    }
}
