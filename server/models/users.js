let users = [];
class User {
    constructor(uname, pswd) {
        this.uname = uname;
        this.pswd = pswd;
        //this.auth = "false";
        this.plist = [];
    }

    static addToPlayList(uname, songID) {
        const index = users.findIndex(u => u.uname === uname);
        if (index > -1) {
            if(!users[index].plist.includes(songID)){
            users[index].plist.push(songID);
            };
            //console.log(users[index].plist);
            return users[index].plist;
        } else {
            throw new Error('Something is Wrong!');
        }
    }
    static removeFromPlayList(uname, songID) {
        const index = users.findIndex(u => u.uname === uname);
        if (index > -1) {
            const updatedList=users[index].plist.filter(s => s !== songID);
            users[index].plist=updatedList;
            return users[index].plist;
        } else {
            throw new Error('Something is Wrong!');
        }
    }

    static fetchPlayList(uname) {
        const index = users.findIndex(u => u.uname === uname);
        return users[index].plist;
    }

    static login(uname, pswd) {
        //console.log(uname, pswd);
        const index = users.findIndex(u => u.uname === uname);
        const user=users[index];
        if (index > -1) {
            if (user.pswd === pswd) {
                //console.log("loged in");
                const utcStr = new Date().toUTCString();
                const res=JSON.stringify({
                    user: users[index],
                    currentTime: utcStr,
                    
                });
                return res;
            } else {
                throw new Error('User name or password error');
            }
        } else {
            throw new Error('User name or password error');
        }
        //return "rtrn";
    }

}

const user1=new User("uname", "pswd");
const user2=new User("uname2", "pswd2");
users.push(user1);
users.push(user2);
module.exports = User;
