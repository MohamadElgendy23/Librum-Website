import React, { useContext, useRef } from "react";
import { SiteContext } from "../../Context/Context";
import useFormSubmit from "../../hooks/useFormSubmit";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import pic4 from "../../Pages/Support/pic4.svg";
import pic from "./message.svg";
import "./Form.css";
import { useState } from "react";
import { useCallback } from "react";

export const Form = () => {
  const { bg } = useContext(SiteContext);
  const { submitForm, isLoading } = useFormSubmit();
  const name = useRef();
  const email = useRef();
  const message = useRef();
  const [captchaError, setCaptchaError] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();
  const recaptchaRef = useRef(null);

  const verifyToken = async (token) => {
    try {
      await fetch(
        `https://librum-dev.azurewebsites.net/api/recaptchaVerify?userToken=${token}`,
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          return (recaptchaRef.current = data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e, token) => {
    e?.preventDefault();
    await verifyToken(token);

    try {
      if (recaptchaRef.current.success === true) {
        console.log("verified");
        const values = {
          name: name.current.value,
          email: email.current.value,
          message: message.current.value,
        };
        await submitForm(values);

        name.current.value = "";
        email.current.value = "";
        message.current.value = "";
      }
    } catch (error) {
      console.log("not verified");
      console.log(error);
    }
  };

  const handleReCaptchaVerify = useCallback(
    async (e) => {
      e?.preventDefault();
      try {
        if (!executeRecaptcha) {
          console.log("Execute recaptcha not yet available");
          throw new Error("Execute recaptcha not yet available");
        }

        const token = await executeRecaptcha("SupportPage");
        await handleSubmit(e, token);
      } catch (error) {
        console.log(error);
        setCaptchaError(error);
      }
    },
    [executeRecaptcha]
  );

  return (
    <div
      // style={{ margin: "100px auto 0", paddingBottom: "100px" }}
      className="support-page-contact"
    >
      <div className="support-page-contact-form">
        <h2>Contact Us</h2>

        <form onSubmit={handleReCaptchaVerify}>
          <p
            style={
              bg === "light"
                ? { color: "var(--color-primary0)" }
                : {
                    color: "white",
                  }
            }
          >
            Send us a message today
          </p>
          <div className="form-div">
            <p
              style={
                bg === "light"
                  ? { color: "var(--color-primary0)" }
                  : {
                      color: "white",
                    }
              }
              className="p-form"
            >
              Name
            </p>
            <input
              style={bg === "light" ? { color: "black" } : { color: "white" }}
              type="text"
              placeholder="Enter your Name"
              ref={name}
            />
          </div>
          <div className="form-div">
            {" "}
            <p
              style={
                bg === "light"
                  ? { color: "var(--color-primary0)" }
                  : {
                      color: "white",
                    }
              }
              className="p-form"
            >
              Email
            </p>
            <input
              style={bg === "light" ? { color: "black" } : { color: "white" }}
              type="text"
              placeholder="Enter your email address"
              ref={email}
              required
            />
          </div>
          <div className="form-div">
            {" "}
            <p
              style={
                bg === "light"
                  ? { color: "var(--color-primary0)" }
                  : {
                      color: "white",
                    }
              }
              className="p-form"
            >
              Message
            </p>
            <textarea
              style={bg === "light" ? { color: "black" } : { color: "white" }}
              type="text"
              placeholder="Enter Message"
              ref={message}
              required
            />
          </div>
          <div>
            <button
              className="btn btn-secondary"
              type="submit"
              disabled={isLoading ? true : false}
            >
              Submit{" "}
            </button>
          </div>
        </form>
      </div>
      {/* <div className="support-page-contact-image">
        <img src={pic} alt="" />
      </div> */}
    </div>
  );
};
