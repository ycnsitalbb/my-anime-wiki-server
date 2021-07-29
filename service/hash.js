const bcrypt = require ('bcrypt');
const saltAndHash = (data)=>{
    const salt = bcrypt.genSaltSync();
    console.log(salt)
    console.log(data)
    const hash =  bcrypt.hashSync(data,salt);
    return hash;
}
const match = (original,hashed)=>{
    return bcrypt.compareSync(original,hashed)
}
module.exports = {saltAndHash,match}