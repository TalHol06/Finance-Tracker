import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
    {
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true,
            validate: {
                validator: (email) => {/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);}
            },
            message: "Please enter a valid email."
        },
        password: {
            type: String,
            trim: true,
            required: true,
            minlength: [8, "Your password must be at least 8 characters long."]
        },
        finances: {
            type: Schema.Types.ObjectId,
            ref: 'Finances',
            default: null
        }
    },
    {
        id: false,
    }
);

const User = mongoose.model('User', UserSchema);
export default User;