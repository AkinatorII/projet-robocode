var data;




function addUser() {
    var xhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    var user = document.getElementById("login").value;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
        }

    }
    xhttp.open("post", '/chat/' + user, true);
    xhttp.send();
    document.getElementById("chat").removeChild(document.getElementById("authentification"));
}


function deleteUser() {
    var xhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    var user = prompt("Entrez un nom d'utilisateur");

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log('jean');
            //Faire modif
        }
    }

    console.log(data.user);
    xhttp.open("delete", '/chat/' + user + '/' + data.key, true);
    xhttp.send();

}


function sendMessage() {
    var xhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    var msg = prompt("Saisir votre message");

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log('jean');
            //Faire modif
        }
    }
    
    xhttp.open("PUT",'/chat/'+data.user+'/'+data.key,true);
    xhttp.setRequestHeader("Content-Type","application/x-ww-form-urlencoded");
    xhttp.send("message="+msg);
}
