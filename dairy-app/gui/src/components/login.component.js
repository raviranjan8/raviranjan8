import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AuthService from "../services/auth.service";

export default function Login(props) {

  const { register, formState: { errors }, handleSubmit } = useForm();
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const getOtp = data => {
    console.log(data);
    var loginParam = {
      username : data.mobile,
      role: ["staff"]
    };
    AuthService.register(loginParam).then((response) => {
      setOtpSent(true);
      setMessage("Otp sent to your mobile. Kindly check and enter the OTP here.");
    }).catch((error) => {
      const resMessage =  (error.response &&  error.response.data &&  error.response.data.message) 
                                      || error.message ||  error.toString();
        setMessage(resMessage);
    });
  }
  const onSubmit = data => {
    console.log(data);
    var loginParam = {
      username : data.mobile,
      password : data.otp
    };
    AuthService.login(loginParam).then(
      () => {
          props.history.push("/");
          window.location.reload();
      },
      (error) => {
        const resMessage =  (error.response &&  error.response.data &&  error.response.data.message) 
                                      || error.message ||  error.toString();
        setMessage(resMessage);
      }
    );
  }

  useEffect(() => {
    //AuthService.setCurrentUser("Alok");
    //console.log(AuthService.getCurrentUser());
  }, [props]);

  return (
    <div className="submit-form">
      
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="mobile">Mobile</label>
            <input {...register("mobile", { required: true,minLength: 10, maxLength: 10 })} type="number"
              className="form-control"/>
            {errors.mobile && (
                <p>Please enter 10 digit Mobile no.</p>
              )}
          </div>
          {!otpSent ? 
          <input type="button" value={'Get OTP'} className="btn btn-success" onClick={handleSubmit(getOtp)}/>
          : ''}
          {otpSent ? 
            <div className="form-group">
              <div className="form-group">
                <label htmlFor="otp">OTP</label>
                <input {...register("otp", { required: true,minLength: 4, maxLength: 4  })}  className="form-control" type="number"/>
                {errors.otp && (
                    <p>Please enter 4 digit OTP sent to your mobile.</p>
                  )}
              </div>
              <input type="submit" className="btn btn-success"/>
            </div>
          : ''}
          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
        </form>
    </div>
  );
}
