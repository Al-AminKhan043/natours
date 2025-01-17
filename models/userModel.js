const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const crypto=require('crypto')
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please tell us your name!']
    },
    email:{
        type:String,
        required:[true, 'Please provide email'],
        unique:true,
        lowercase:true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo:{
        type:String,
        default:'default.jpg'
    },
    password:{
        type:String,
        required:[true,'Provide a password'],
        minlength:8,
        select:false
    },
    role:{
       type: String,
       enum:['user','guide','lead-guide','admin'],
       default:'user'
    },
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
    type: Boolean,
    default: true,
    select:false
    },
    passwordConfirm:{
        type:String,
        require:[true,'Please confirm your password'],
        validate:{
            validator:function(e){
                //this only work on create/save
                return e===this.password
            },
            message:'Passwords are not the same'
        },
        
    },
    passwordChangedAt: {
        type:Date
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password= await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    next();
})

userSchema.pre('save',function(next){
    if(!this.isModified('password')|| this.isNew ) return next();
    this.passwordChangedAt=Date.now()-1000;
    next();
})

userSchema.pre(/^find/,function(next){
    //this points to current querry
    this.find({active: {$ne:false}})
    next();
})

userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changedPasswordAfter=function(JWTTimesStamp){
    if(this.passwordChangedAt){
        const changedTimeStap=parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimesStamp< changedTimeStap;
    }
    return false;   
}

userSchema.methods.createPasswordResetToken= function(){
const resetToken= crypto.randomBytes(32).toString('hex');
this.passwordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex');
this.passwordResetExpires=Date.now()+10*60*1000;
console.log({resetToken},this.passwordResetToken)
return resetToken;
}

const User=  mongoose.model('User',userSchema);
module.exports=User;