const GitHub = new function() {
    const URL = "https://api.github.com/repos/";

    this.getRepo = function(repo, callback) {
        $.getJSON((URL + repo), callback);
    }
};

$(document).ready(function() {
    setPageLastUpdated();
    for (let div of document.getElementsByClassName("github-repo")) {
        let repo = div.dataset.repo;
        if (repo == null || repo === "null") {
            continue;
        }
        GitHub.getRepo(repo, function(data) {
            handleRepo(div, data);
        });
    }

});
const TODAY = new Date();
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function handleRepo(div, data) {
    div.removeAttribute("hidden");
    let url = data["html_url"];
    let numStars = data["stargazers_count"];
    let updated = new Date(data["pushed_at"]);
    let hours = Math.abs(TODAY - updated) / 36e5;

    let lastUpdatedString = "Updated ";
    if (hours < 1) {
        //less than an hour ago
        lastUpdatedString += "less than an hour ago";
    } else if (hours < 24) {
        lastUpdatedString += Math.floor(hours) + " hours ago";
    } else if ((hours / 24) < 7) {
        let days = Math.floor(hours / 24);
        lastUpdatedString += days + " " + (days === 1 ? "day" : "days") + " ago";
    } else {
        lastUpdatedString += MONTHS[updated.getMonth()] + " " + updated.getDate();
        if (TODAY.getFullYear() !== updated.getFullYear()) {
            lastUpdatedString += ", " + updated.getFullYear();
        }
    }
    setDiv(div, url, numStars, lastUpdatedString);
}

function setDiv(div, url, numStars, lastUpdatedString) {
    //url
    div.getElementsByClassName("github-link")[0].href = url;
    //numStars only if has stars
    if (numStars > 0) {
        var stars = div.getElementsByClassName("github-stars")[0];
        stars.removeAttribute("hidden");
        stars.innerHTML += numStars;
    }
    //updated
    div.getElementsByClassName("github-updated")[0].innerHTML = lastUpdatedString;
}

function setPageLastUpdated() {
    //updates the footer dynamically
    let div = document.getElementById("timestamp");
    if (div != null) {
        GitHub.getRepo("chenvictor/chenvictor.github.io", function (data) {
            let updated = new Date(data["pushed_at"]);
            div.innerHTML = MONTHS[updated.getMonth()] + " " + updated.getFullYear();
        });
    } else {
        console.log("No timestamp id to update");
    }
}