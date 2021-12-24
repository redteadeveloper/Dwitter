import accountDB from '../db/accountdb'
import discordDB from '../db/discorddb'

export async function loginCheck(discordID: String) {
    const res = await discordDB.findOne({ userID: discordID });
    if (res.currentAccount === null) {
        return false;
    } else {
        return true;
    }
}

export async function currentUser(discordID: String) {
    const res = await discordDB.findOne({ userID: discordID });
    return res.currentAccount
}