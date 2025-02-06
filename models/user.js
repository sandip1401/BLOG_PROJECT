const mongoose=require('mongoose');
const bcrypt=require('bcrypt')

const userSchema=new mongoose.Schema({
   name:{
    type: String,
    require:true
   },
   mobile:{
    type: String,
    require:true,
    unique:true
   },
   email:{
    type:String,
    require:true,
   },
   password:{
    type:String,
    required:true,
    unique:true
   }
});

userSchema.pre('save',async function(next){
    const person=this;

    //hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();
    try{
        //hash password genration
        const salt= await bcrypt.genSalt(10);

        //hash password
        const hashedPassword= await bcrypt.hash(person.password,salt);

        //override the plain passsword
        person.password=hashedPassword;
        next();
    }
    catch(err){
        return next(err); 
    }
})

userSchema.methods.comparePassword= async function(candidatePassword){
    try{
        const isMatch=await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }
    catch(err){
        throw err;
    }
}
const User=mongoose.model('User',userSchema);
module.exports=User;