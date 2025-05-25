import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    rol: string,
    comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        maxlength: [30, 'Username is limited to 30 characters'],
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: 'Please provide a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    firstName: {
        type: String,
        required: [true, 'Please provide your first name'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your last name'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    rol: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error)
    }
});

userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual('profileUrl').get(function () {
    return `/username/${this.username}`;
});

const User = model<IUser>('User', userSchema);

export default User;