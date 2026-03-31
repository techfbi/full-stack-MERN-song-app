import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    securityQue: {
        type: String,
        required: true,
    }, 
    answer: {
        type: String,
        required: true,
    },
    passwordChangedAt: {
        type: Date,
        default: null, // So it won’t exist until the password is actually changed
    }
}, { timestamps: true });

// Static signup method 
userSchema.statics.signup = async function(email, password, securityQue, answer) {

    // Validation
    if (!email || !password) {
        throw new Error("All fields must be filled");
    }
    
    if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }
    if (!validator.isStrongPassword(password)) {
            throw new Error("Password is not strong enough");
    }
    // Checks the main user database if user exists
    const exists = await this.findOne({ email });
    if (exists) {
        throw new Error("Email already in use");
    }
    if (!securityQue) {
        throw new Error ("Security question must be filled")
    }
    
    // to make sure the question cant be overidden
    const validQuestions = [
        "What was the name of your first pet?",
        "What was the name of your childhood best friend?",
        "What is the first school you attended?"
    ];

    if (!validQuestions.includes(securityQue)) {
        throw new Error ("Security question not valid")
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const hashedAnswer = await bcrypt.hash(answer, saltRounds);
    
    const user = await this.create({ 
        email, 
        password: hashedPassword, 
        securityQue,
        answer: hashedAnswer, 
    });

    return user;
}



// Static login method 
userSchema.statics.login = async function(email, password) {

    // Validation
    if (!email || !password) {
        throw new Error("All fields must be filled");
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error("Incorrect email");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("Incorrect password");
    }

    return user;
}

//Static forgot method 
userSchema.statics.forgot = async function(email, newPassword, securityAns) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(securityAns, user.answer);
    if (!match) throw new Error("Incorrect answer");

    if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Password is not strong enough");
    }

    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPass;

    // to track user password change
    user.passwordChangedAt = Date.now();

    await user.save();

    return user;
}



export default mongoose.model('UserModel', userSchema);