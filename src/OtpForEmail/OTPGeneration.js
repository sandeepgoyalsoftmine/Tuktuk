import otpGenrator from 'otp-generator';

export function otpGenerator(){
    return otpGenrator.generate(6, {alphabets :false, upperCase: false, specialChars: false });
}
