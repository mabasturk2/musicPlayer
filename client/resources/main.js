//const { listenerCount } = require("process");

class Song {
    constructor(songID, artist, name, filePath) {
        this.name = name;
        this.artist = artist;
        this.songID = songID;
        this.filePath = filePath;
    }
}
let song1 = new Song("1", "Mathame", "For Every Forever", "resources/songs/For Every Forever - Mathame.mp3");
let song2 = new Song("2", "Hippie Sabotage", "Devil Eyes", "resources/songs/Devil Eyes - Hippie Sabotage.mp3");
let song3 = new Song("3", "Kovacs", "The Devil You Know", "resources/songs/The Devil You Know - Kovacs.mp3");
let song4 = new Song("4", "Devil", "Call Me Devil", "resources/songs/Call Me Devil - Devil.mp3");
let song5 = new Song("5", "Kosheen", "Hide U", "resources/songs/Hide U - Kosheen(Chicola Remix).mp3");
let song6 = new Song("6", "Paul Kalkbrenner", "No Goodbye", "resources/songs/No Goodbye - Paul Kalkbrenner.mp3");
let song7 = new Song("7", "Monolink", "Rearrange My Mind", "resources/songs/Rearrange My Mind - Monolink.mp3");


let songs = [song1, song2, song3, song4, song5, song6, song7];
let userPlaylist = [];
let searchList = [];
//let pList=userPlaylist;
let logged = false;
let repeatOneSong = false;
let repeatAllSongs = false;
let songPosition = 0;

window.onload = function () {
    mainRender();
    // login
    document.getElementById('login-btn').onclick = function () {
        const username = document.getElementById("uname").value;
        const password = document.getElementById("pswd").value;
        login(username, password);
    }
    document.getElementById('logout-btn').onclick = function () {
        console.log("--logged out--");
        sessionStorage.setItem("username", "");
        sessionStorage.setItem("currentTime", "");
        userPlaylist = [];
        document.getElementById("search-bar").style.visibility = "hidden";
        document.getElementById("login").style.visibility = "visible";
        document.getElementById("logout").style.visibility = "hidden";

        document.getElementById("bottom-bar").style.visibility = "hidden";
        renderPlaylistAll([], "Songs");
        renderPlaylistUser(userPlaylist, "user-playlist");
        document.getElementById("player").setAttribute("src" , "");
        
        document.getElementById('sTitle').innerHTML="";
       

    }
    document.getElementById('search-btn').onclick = function search() {
        let searchParam = document.getElementById("search").value;
        let resTemp = [];
        for (let i = 0; i < songs.length; i++) {
            if (songs[i].artist.toLowerCase().includes(searchParam.toLowerCase())) {
                resTemp.push(songs[i]);
            }
            if (songs[i].name.toLowerCase().includes(searchParam.toLowerCase())) {
                resTemp.push(songs[i]);
            }
        }
        //console.log(resTemp);
        searchList = resTemp.filter(onlyUnique);

        if (searchParam === "") {
            renderPlaylistAll(songs, "Songs");
        } else {
            renderPlaylistAll(searchList, "Search Results");
        }

    }

    document.getElementById("repeat-all-btn").addEventListener("click", function () {
        if (repeatAllSongs) {
            repeatAllSongs = false;
            document.getElementById("repeat-all-btn").style.backgroundColor="#e3ffee";
        } else {
            repeatAllSongs = true;
            document.getElementById("repeat-all-btn").style.backgroundColor="#4fff94";
        }
        console.log("repeat all songs: " + repeatAllSongs);
    });


    document.getElementById("repeat-one-btn").addEventListener("click", function () {
        if (repeatOneSong) {
            repeatOneSong = false;
            document.getElementById("repeat-one-btn").style.backgroundColor="#e3ffee";
        } else {
            repeatOneSong = true;
            document.getElementById("repeat-one-btn").style.backgroundColor="#4fff94";
        }
        console.log("repeat one song: " + repeatOneSong);
    });

    document.getElementById("shuffle-btn").addEventListener("click", function () {
        let temp = shuffle(userPlaylist);
        userPlaylist = temp;
        console.log("shuffled");
        renderPlaylistUser(userPlaylist, "user-playlist");
    });

}
async function login(uname, pswd) {
    console.log("func log");
    let result = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            username: uname,
            password: pswd
        })
    }).then(res => res.json())
        .then(jsonString => {
            const data = JSON.parse(jsonString);
            sessionStorage.setItem("username", data.user.uname);
            sessionStorage.setItem("currentTime", data.currentTime);
            userPlaylist = data.user.plist;
            //console.log(sessionStorage);
            document.getElementById("search-bar").style.visibility = "visible";
            document.getElementById("login").style.visibility = "hidden";
            document.getElementById("logout").style.visibility = "visible";

            document.getElementById("bottom-bar").style.visibility = "visible";
            renderPlaylistAll(songs, "Songs");
            renderPlaylistUser(userPlaylist, "user-playlist");//user olcak
            //do rest call playlist
            //list all songs
        });
}
async function mainRender() {
    if (!(sessionStorage.username.length === 0)) {
        document.getElementById("search-bar").style.visibility = "visible";
        document.getElementById("login").style.visibility = "hidden";
        document.getElementById("bottom-bar").style.visibility = "visible";
        document.getElementById("logout").style.visibility = "visible";

        renderPlaylistAll(songs, "Songs");
        let result = await fetch('http://localhost:3000/' + sessionStorage.getItem("username"), {
            method: 'GET'
        }).then(res => res.json())
            .then(plist => {
                userPlaylist = plist;
                console.log(userPlaylist);
                renderPlaylistUser(userPlaylist, "user-playlist");//user olcak
                //do rest call playlist
                //list all songs
            });

    } else {
        document.getElementById("search-bar").style.visibility = "hidden";
        document.getElementById("logout").style.visibility = "hidden";
        document.getElementById("bottom-bar").style.visibility = "hidden";
        
        document.getElementById("login").style.visibility = "visible";

    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function renderPlaylistAll(plist, id) {
    const div = document.createElement('div');
    const ul = document.createElement('ul');
    const h1 = document.createElement('h2');
    h1.textContent = id;
    if (!(plist.length === 0)) {
        div.appendChild(h1);
    }
    div.id = "all-songs";

    for (let i = 0; i < plist.length; i++) {
        const name = document.createElement('span');
        name.textContent = plist[i].name;
        const artist = document.createElement('span');
        artist.textContent = plist[i].artist;
        const dash = document.createElement('span');
        dash.textContent = "-";
        const info = document.createElement('p');
        info.appendChild(name);
        info.appendChild(dash);
        info.appendChild(artist);
        const info2=plist[i].name+"-"+plist[i].artist;
        //add playlist btn
        const addToPlaylistBtn = document.createElement("button");
        const songID = plist[i].songID;
        addToPlaylistBtn.setAttribute('id', songID);
        //addToPlaylistBtn.textContent = "+";

        addToPlaylistBtn.addEventListener('click', function () {
            const id = addToPlaylistBtn.id;
            addToPlaylist(id);
        });

        const song = document.createElement('li');
        //display:inline-block;
        song.innerHTML=info2;
        addToPlaylistBtn.style.position="relative";
        addToPlaylistBtn.style.left="5px";
        const plusIcon = document.createElement('i');
        plusIcon.classList = "fa-solid fa-plus";
        
        addToPlaylistBtn.style.border = "solid #17c245";
        addToPlaylistBtn.style.width="30px";
        addToPlaylistBtn.style.height="30px";
        addToPlaylistBtn.style.borderRadius = "15px";
        addToPlaylistBtn.appendChild(plusIcon);
        song.appendChild(addToPlaylistBtn);
        //song.appendChild(info);
        

        ul.appendChild(song);
    }
    div.appendChild(ul);
    document.getElementById("playlists").replaceChild(div, document.getElementById("all-songs"));
}

async function addToPlaylist(songID) {
    let result = await fetch('http://localhost:3000/' + sessionStorage.getItem("username") + "/" + songID, {
        method: 'PUT'
    }).then(res => res.json())
        .then(plist => {
            userPlaylist = plist;
            //pList=userPlaylist;
            renderPlaylistUser(userPlaylist, "user-playlist");//user olcak
            //do rest call playlist
            //list all songs
        });
}
async function removeFromPlaylist(songID) {
    let result = await fetch('http://localhost:3000/' + sessionStorage.getItem("username") + "/" + songID, {
        method: 'DELETE'
    }).then(res => res.json())
        .then(plist => {
            userPlaylist = plist;
            //pList=userPlaylist;
            renderPlaylistUser(userPlaylist, "user-playlist");//user olcak
            //do rest call playlist
            //list all songs
        });
}

function renderPlaylistUser(ulist, id) {
    console.log("--renduplaylist--");
    const div = document.createElement('div');
    const ul = document.createElement('ul');
    const h1 = document.createElement('h2');
    if (!(ulist.length === 0)) {
        h1.textContent = "My Playlist";
    }
    div.appendChild(h1);
    div.id = id;
    console.log(ulist);
    let plist = [];
    for (let j = 0; j < ulist.length; j++) {
        const index = songs.findIndex(s => s.songID === ulist[j]);
        plist.push(songs[index]);
    };

    for (let i = 0; i < plist.length; i++) {
        const name = document.createElement('span');
        name.textContent = plist[i].name;
        const artist = document.createElement('span');
        artist.textContent = plist[i].artist;
        const dash = document.createElement('span');
        dash.textContent = "-";
        const info = document.createElement('p');
        info.appendChild(name);
        info.appendChild(dash);
        info.appendChild(artist);

        const addToPlaylistBtn = document.createElement("button");
        const songID = plist[i].songID;
        addToPlaylistBtn.setAttribute('id', songID);
        //addToPlaylistBtn.textContent = "Remove from my playlist";

        addToPlaylistBtn.addEventListener('click', function () {
            const id = addToPlaylistBtn.id;
            removeFromPlaylist(id);
        });
        //herrrr <i class="fa-solid fa-minus"></i>
        //addToPlaylistBtn.style.position="relative";
        //addToPlaylistBtn.style.left="5px";
        const plusIcon = document.createElement('i');
        plusIcon.classList = "fa-solid fa-minus";
        
        addToPlaylistBtn.style.border = "solid #17c245";
        addToPlaylistBtn.style.width="30px";
        addToPlaylistBtn.style.height="30px";
        addToPlaylistBtn.style.borderRadius = "15px";
        addToPlaylistBtn.appendChild(plusIcon);
        //song.appendChild(addToPlaylistBtn);
        

        //play btn
        const playBtn = document.createElement("button");
        //const songToPlay = plist[i];
        playBtn.setAttribute('name', songID);
        //playBtn.textContent = "PLAY";
        playBtn.addEventListener('click', function () {

            //addToPlaylist(id);
            player(playBtn.name);
        });
        //<i class="fa-solid fa-play"></i>
        const playIcon = document.createElement('i');
        playIcon.classList = "fa-solid fa-play";
        
        playBtn.style.border = "solid #17c245";
        playBtn.style.width="30px";
        playBtn.style.height="30px";
        playBtn.style.borderRadius = "15px";
        playBtn.appendChild(playIcon);
        playBtn.style.position="relative";
        playBtn.style.left="10px";

        const song = document.createElement('li');

        song.appendChild(info);
        song.appendChild(addToPlaylistBtn);
        song.appendChild(playBtn);//play btn
        ul.appendChild(song);
    }
    div.appendChild(ul);


    document.getElementById("playlists").replaceChild(div, document.getElementById(id));
}
function player(id) {
    const audioContainer = document.getElementById("player-container");

    console.log(audioContainer.hasChildNodes());
    if (!audioContainer.hasChildNodes()) {
        let pList = userPlaylist;
        let song = getSongById(id);
        songPosition = pList.findIndex(s => s === song.songID);
        var sound = document.createElement('audio');
        sound.id = "player";
        sound.src = song.filePath;
        sound.type = "audio/mp3";
        sound.controls = 'controls';
        
        sound.style.position="absolute";
        sound.style.right="40%";
        sound.style.bottom="15px";
        console.log(song.filePath);
        //sound.loop = 'true';
        //prev
        var previous = document.createElement('button');
        previous.setAttribute("id", "previous-btn");
        const previousIcon = document.createElement('i');
        previousIcon.classList = 'fa-solid fa-angle-left';
        previous.appendChild(previousIcon);
        previous.classList = 'btn btn-secondary';
        previous.style.border = "thick solid #17c245";
        previous.style.width="50px";
        previous.style.height="50px";
        previous.style.borderRadius = "25px";
        previous.style.position="absolute";
        previous.style.left="35%";
        previous.style.top="25px";
        previous.addEventListener("click", () => {
            const path=document.getElementById("player").src;
            //const afterLastSlash = path.substring(path.IndexOf('client') + 1);
            const pattern="client/"
            const afterPath=path.substr(path.indexOf(pattern)+pattern.length, path.length);
            const final=afterPath.replaceAll("%20", " ");
            //console.log(final);
            let indexPlaying = songs.findIndex(s => s.filePath  === final);
            let indexinPlist=pList.findIndex(s => s === songs[indexPlaying].songID);
            //console.log(indexinPlist);
            if (indexinPlist === 0) {
                playSong(getSongById(pList[(pList.length-1)]));
            }
            else {
                playSong(getSongById(pList[indexinPlist - 1]));
            }
            //let index = pList.findIndex(s => s === song.songID);

        });

        //next
        var next = document.createElement('button');
        next.setAttribute("id", "next-btn");
        const nextIcon = document.createElement('i');
        nextIcon.classList = 'fa-solid fa-angle-right';
        next.appendChild(nextIcon);
        next.classList = 'btn btn-secondary';
        next.style.border = "thick solid #17c245";
        next.style.width="50px";
        next.style.height="50px";
        next.style.borderRadius = "25px";
        
        next.style.borderRadius = "25px";
        next.style.position="absolute";
        next.style.right="35%";
        next.style.top="25px";
        next.addEventListener("click", () => {
            const path=document.getElementById("player").src;
            //const afterLastSlash = path.substring(path.IndexOf('client') + 1);
            const pattern="client/"
            const afterPath=path.substr(path.indexOf(pattern)+pattern.length, path.length);
            const final=afterPath.replaceAll("%20", " ");
            //console.log(final);
            let indexPlaying = songs.findIndex(s => s.filePath  === final);
            let indexinPlist=pList.findIndex(s => s === songs[indexPlaying].songID);
            //console.log(indexinPlist);
            if (indexinPlist === (pList.length - 1)) {
                playSong(getSongById(pList[0]));
            }
            else {
                playSong(getSongById(pList[indexinPlist + 1]));
            }
            //let index = pList.findIndex(s => s === song.songID);

        });

        sound.addEventListener('ended', () => {
            console.log("sarki bitti");
            if (repeatOneSong) {
                playSong(song);
            } else {
                //console.log("1");
                let index = pList.findIndex(s => s === song.songID);
                console.log(index);
                if (repeatAllSongs) {
                    if (index === (pList.length - 1)) {
                        playSong(getSongById(pList[0]));
                    }
                    else {
                        playSong(getSongById(pList[index + 1]));
                    }
                } else {
                    //console.log("2");
                    if (index === (pList.length - 1)) {
                        //playSong(getSongById(pList[0]));
                        console.log("play list ended");
                    }
                    else {
                        console.log(getSongById(pList[(index + 1)]));
                        playSong(getSongById(pList[index + 1]));
                    }
                }
            }

        });



        audioContainer.appendChild(previous);
        audioContainer.appendChild(next);
        const sTitle = document.createElement('label');
        sTitle.id = 'sTitle';
        sTitle.textContent = song.name + "-" + song.artist;

        sTitle.setAttribute("for","player");        
        sTitle.style.position="absolute";
        sTitle.style.left="42%";
        

        audioContainer.appendChild(sTitle);
        audioContainer.appendChild(sound);
        //assignButtons(song);
        document.getElementById("player").play();

    } else {
        //let pList = userPlaylist;
        console.log("---elsee")
        let song = getSongById(id);
        playSong(song);

    }

}
function getSongById(id) {
    let index = songs.findIndex(s => s.songID === id);
    return songs[index];
}
function playSong(song) {
    let pList = userPlaylist;
    console.log(song);
    songPosition = pList.findIndex(s => s === song.songID);
    const audioContainer = document.getElementById("player-container");
    var sound = document.createElement('audio');
    sound.id = "player";
    sound.src = song.filePath;
    sound.type = "audio/mp3";
    sound.controls = 'controls';

    sound.style.position="absolute";
        sound.style.right="40%";
        sound.style.bottom="15px";

    //sound.loop = 'true';
    sound.addEventListener('ended', () => {
        console.log("sarki bitti");
        if (repeatOneSong) {

            playSong(song);
        } else {
            console.log("plist");
            console.log(pList);
            let index = pList.findIndex(s => s === song.songID);
            if (repeatAllSongs) {
                if (index === (pList.length - 1)) {
                    playSong(getSongById(pList[0]));
                }
                else {
                    playSong(getSongById(pList[index + 1]));
                }
            } else {
                //console.log("2");
                if (index === (pList.length - 1)) {
                    //playSong(getSongById(pList[0]));
                    console.log("play list ended");
                }
                else {
                    //console.log("3");
                    playSong(getSongById(pList[index + 1]));
                }
            }
        }

    });

    const sTitle = document.createElement('label');
    sTitle.id = 'sTitle';
    sTitle.textContent = song.name + "-" + song.artist;
    sTitle.setAttribute("for","player");        
        sTitle.style.position="absolute";
        sTitle.style.left="42%";

    audioContainer.replaceChild(sTitle, document.getElementById("sTitle"));
    audioContainer.replaceChild(sound, document.getElementById("player"));
    //assignButtons(song);
    document.getElementById("player").play();

}
function assignButtons(song) {
    console.log(song);
    //prev
    const previous = document.getElementById("previous-btn");
    previous.addEventListener("click", () => {
        //let index = pList.findIndex(s => s === song.songID);
        if (songPosition === 0) {
            playSong(getSongById(pList[pList.length]));
        }
        else {
            playSong(getSongById(pList[songPosition - 1]));
        }

    });

    //next

    const next = document.getElementById("next-btn");
    next.addEventListener("click", () => {
        //console.log(song);
        if (songPosition === (pList.length - 1)) {
            playSong(getSongById(pList[0]));
        }
        else {
            //console.log(index);
            playSong(getSongById(pList[songPosition + 1]));
        }

    });
}
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
