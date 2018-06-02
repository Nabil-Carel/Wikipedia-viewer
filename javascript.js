/**
 * dataArray: contains data from api call
 * userLanguage: browser language
 */



var dataArray, isFirstClick, userLanguage;
isFirstClick = false;

var regex = /\S+/; // regular expression used to validate user input
flexbox.backgroundColor = "white";

userLanguage = navigator.language;

if (userLanguage == null || userLanguage == undefined) {
    userLanguage = "en";
} else {
    userLanguage = userLanguage.split("-")[0];
    if (userLanguage.length != 2) {
        userLanguage = "en";
    }
}

document.getElementById("first").href = "";

// launch a random wikipedia article in a new window
function randomArticle() {
    window.open("https://" + userLanguage + ".wikipedia.org/wiki/Special:Random");
}


//get user input and launch search if valid
function getInput() {
    var data = document.getElementById("input").value;
    document.getElementById("input").value = " ";
    var validInput = regex.test(data);

    if (validInput) {
        searchResults(data);
    } else {
        alert("Invalid input.");
    }

}

/** 
 * get data using user input
 * @param: {String} user input
 */




function searchResults(value) {
    if (!isFirstClick) {
        isFirstClick = true;
    } else {
        while (flexbox.childElementCount > 2) {
            flexbox.removeChild(flexbox.lastChild);
        }
    }

    var input = value;
    document.getElementById("input").innerHTML = " ";
    var url = "https://" + userLanguage + ".wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&rvsection=0&list=search&srsearch=";
    url += input + "&format=json&callback=?";

    $.getJSON(url)

    .done(function(data) {
        var dataLength = data.query.search.length;
        dataArray = [];

        if (dataLength > 0) {
            document.body.style.backgroundColor = "dodgerblue";
        } else {
            alert("No results for this search.");
        }

        for (var i = 0; i < dataLength; i++) {
            dataArray.push({
                title: data.query.search[i].title,
                id: data.query.search[i].pageid,
            });
        }

        loadData(dataArray);
    })

    .fail(function() {
        alert("something went wrong");
    });

}

/** 
 * load search results
 * @param: {array} containing search results
 */

function loadData(info) {

    for (var i = 0; i < info.length; i++) {
        var currentDiv = document.createElement('div');
        var currentParagraph = document.createElement('p');
        currentParagraph.innerHTML = info[i].title;
        var dataPosition = i;
        currentDiv.id = dataPosition.toString();
        currentString = currentDiv.id;
        currentDiv.addEventListener('click', function() {
            openSelectedLink(this.id);
        });
        currentDiv.appendChild(currentParagraph);
        flexbox.appendChild(currentDiv);
    }
}

/**
 * make search results clickable 
 * @param: {String} div's id
 */


function openSelectedLink(aNumber) {
    aNumberInt = parseInt(aNumber, 10);
    var currentUrl = "http://" + userLanguage + ".wikipedia.org/?curid=";
    currentUrl += dataArray[aNumberInt].id;
    window.open(currentUrl);
}

document.getElementById("first").onclick = randomArticle;
document.getElementById("buttonSearch").onclick = getInput;

/**
 * launch search when enter is hit
 */
var inputField = document.getElementById("input");
inputField.addEventListener("keydown", function(e) {
    if (e.keyCode === 13) { //checks whether the pressed key is "Enter"
        getInput();
    }
});