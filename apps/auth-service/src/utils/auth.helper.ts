import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import redis from "../../../../packages/libs/redis";
import { sendEmail } from "./sendMail";


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

export const checkOtpRestrictions = async (email:string,next:NewableFunction) => {
    //Check OTP Lock (When someone use more than 3 otp attemps)
    if(await redis.get(`otp_lock:${email}`))
    {
        return next(new ValidationError("Too many incorrect OTP attempts. Please try again after 30 minutes.")); 
    }

    //Check OTP Spam Lock (When someone )
    if(await redis.get(`otp_spam_lock:${email}`))
    {
        return next(new ValidationError("Too many OTP requests. Please try again after 1 hour.")); 
    }

    //Check if user is in cooldown period for requesting new OTP
    if(await redis.get(`otp_cooldown:${email}`))
    {
        return next(new ValidationError("Please wait 1 minutes before requesting a new OTP."));
    }

}

export const sendOtp = async(name:string, email:string, template:string) => {
    
    //Create otp number
    const otp = crypto.randomInt(1000,9999).toString();
    //Send mail
    await sendEmail(email,"Verify your Email",template,{name,otp});
    //Set into cache (redis)
    await redis.set(`otp:${email}`, otp, 'EX', 5 * 60); //5 minutes expiry
    await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60); //60 seconds cooldown [Client can't request new otp in this duration]
}