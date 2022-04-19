//const { listenerCount } = require("process");

class Song {
    constructor(songID, artist, name) {
        this.name = name;
        this.artist = artist;
        this.songID = songID;
    }
}
let song1 = new Song("sarki1", "ben", "ten");
let song2 = new Song("sarki2", "ben2", "ten2");
let song3 = new Song("sarki3", "ben3", "ten3");

let songs = [song1, song2, song3];
let userPlaylist = [];
let logged= false;


window.onload = function () {
    //renderLogin();
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
        userPlaylist=[];
        renderPlaylistAll([], "all-songs");
        renderPlaylistUser(userPlaylist, "user-playlist");
    }
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
            userPlaylist=data.user.plist;
            console.log(sessionStorage);
            renderPlaylistAll(songs, "all-songs");
            renderPlaylistUser(userPlaylist, "user-playlist");//user olcak
            //do rest call playlist
            //list all songs
        });
}

function renderPlaylistAll(plist, id) {
    const div = document.createElement('div');
    const ul = document.createElement('ul');
    const h1 = document.createElement('h1');
    h1.textContent = "Songs";
    if(!(plist.length===0)){
    div.appendChild(h1);
    }
    div.id = id;
  
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
        //add playlist btn
        const addToPlaylistBtn = document.createElement("button");
        const songID = plist[i].songID;
        addToPlaylistBtn.setAttribute('id', songID);
        addToPlaylistBtn.textContent = "Add to my playlist";
        addToPlaylistBtn.addEventListener('click', function () {
            const id = addToPlaylistBtn.id;
            addToPlaylist(id);
        });
        
        const song = document.createElement('li');
        song.appendChild(info);
        song.appendChild(addToPlaylistBtn);

        ul.appendChild(song);
    }
    div.appendChild(ul);
    document.getElementById("playlists").replaceChild(div, document.getElementById(id));
}

async function addToPlaylist(songID) {
    let result = await fetch('http://localhost:3000/' + sessionStorage.getItem("username") + "/" + songID, {
        method: 'PUT'
    }).then(res => res.json())
        .then(plist => {
            userPlaylist = plist;
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
            renderPlaylistUser(userPlaylist, "user-playlist");//user olcak
            //do rest call playlist
            //list all songs
        });      
}

function renderPlaylistUser(ulist, id) {
    const div = document.createElement('div');
    const ul = document.createElement('ul');
    const h1 = document.createElement('h1');
    if(!(ulist.length===0)){
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
        addToPlaylistBtn.textContent = "Remove from my playlist";

        addToPlaylistBtn.addEventListener('click', function () {
            const id = addToPlaylistBtn.id;
            removeFromPlaylist(id);
        });

        //play btn
        const playBtn = document.createElement("button");
        const songPath = plist[i].path;
        //addToPlaylistBtn.setAttribute('id', songID);
        playBtn.textContent = "PLAY";
        playBtn.addEventListener('click', function (songPath) {
            const id = songPath;
            //addToPlaylist(id);
        });

        const song = document.createElement('li');

        song.appendChild(info);
        song.appendChild(addToPlaylistBtn);
        song.appendChild(playBtn);//play btn
        ul.appendChild(song);
    }
    div.appendChild(ul);

    document.getElementById("playlists").replaceChild(div, document.getElementById(id));
}
/*
function renderLogin(logged){
    if(!logged){
        const div = document.createElement('div');
        div.setAttribute("id", "login");
        const ulabel=document.createElement('label');
        ulabel.setAttribute('for', "uname");        
        const uinput=document.createElement('input');
        uinput.setAttribute('type', "text");
        uinput.setAttribute('id', "uname");
        uinput.setAttribute('value', "uname");
        uinput.setAttribute('name', "uname");
        uinput.setAttribute('required', '');

        
        const psw=document.createElement('label');
        psw.setAttribute('for', "uname");        
        const pswd=document.createElement('input');
        pswd.setAttribute('type', "password");
        pswd.setAttribute('id', "pswd");
        pswd.setAttribute('value', "pswd");
        pswd.setAttribute('name', "pswd");
        pswd.setAttribute('required', '');

        const submit=document.createElement("button");
        submit.setAttribute("type", "submit");
        submit.setAttribute('id', "login-btn");
        submit.textContent="Login";

        div.appendChild(ulabel);
        div.appendChild(uinput);
        div.appendChild(psw);
        div.appendChild(pswd);
        div.appendChild(submit);

        document.getElementById("playlists").replaceWith(div);
    }
    
    
                <label for="uname"><b>Username</b></label>
                <input type="text" id="uname" value="uname" name="uname" required>

                <label for="psw"><b>Password</b></label>
                <input type="password" id="pswd" value="pswd" name="psw" required>

                <button type="submit" id="login-btn">Login</button>
    
            }
*/
