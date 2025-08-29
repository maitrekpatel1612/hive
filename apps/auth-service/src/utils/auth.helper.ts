import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data:any, userType:"user" | "seller") => {
    const {name , email, password, phone_number, country} = data;

    //Field validation
    if(!name || !email || !password || (userType === "seller" && (!phone_number || !country))) {
        throw new ValidationError("Missing Required Fields");
    }

    //Email format validation
    if(!emailRegex.test(email)) {
        throw new ValidationError("Invalid Email Format");
    }

}