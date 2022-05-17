import React, { useState } from "react";
import config from "../../config";
import FormError from "../layout/FormError";

const SignInForm = (props) => {
  const { state } = props.location
  const [userPayload, setUserPayload] = useState({ email: "", password: "" });
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [errors, setErrors] = useState({});

  const validateInput = (payload) => {
    setErrors({});
    const { email, password } = payload;
    const emailRegexp = config.validation.email.regexp;
    let newErrors = {};
    if (!email.match(emailRegexp)) {
      newErrors = {
        ...newErrors,
        email: "is invalid",
      };
    }

    if (password.trim() === "") {
      newErrors = {
        ...newErrors,
        password: "is required",
      };
    }

    setErrors(newErrors);
  };

  const onSubmit = async (event) => {
    event.preventDefault()
    validateInput(userPayload)
    try {
      if (Object.keys(errors).length === 0) {
        const response = await fetch("/api/v1/user-sessions", {
          method: "post",
          body: JSON.stringify(userPayload),
          headers: new Headers({
            "Content-Type": "application/json",
          })
        })
        if(!response.ok) {
          const errorMessage = `${response.status} (${response.statusText})`
          const error = new Error(errorMessage)
          throw(error)
        }
        const userData = await response.json()
        setShouldRedirect(true)
      }
    } catch(err) {
      console.error(`Error in fetch: ${err.message}`)
    }
  }

  const onInputChange = (event) => {
    setUserPayload({
      ...userPayload,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };
  if (shouldRedirect) {
    if (state.params.roomId) {
      location.href = state.url
    } else {
      location.href = "/";
    }
  }

  return (
    <div className="flex flex-col items-center" onSubmit={onSubmit}>
      <h1 className="text-4xl my-2">Sign In</h1>
      <form>
        <div className="flex flex-col">
          <label className="flex flex-col">
            Email
            <input 
              className="border rounded-lg border-gray-200"
              type="text" 
              name="email" 
              value={userPayload.email} 
              onChange={onInputChange} />
            <FormError error={errors.email} />
          </label>
        </div>
        <div>
          <label className="flex flex-col">
            Password
            <input
              className="border rounded-lg border-gray-200"
              type="password"
              name="password"
              value={userPayload.password}
              onChange={onInputChange}
            />
            <FormError error={errors.password} />
          </label>
        </div>
        <div>
          <input 
            className="mt-1 py-1 px-4 rounded-lg text-white bg-black" 
            type="submit" 
            value="Sign In" 
            role="button"
          />
        </div>
      </form>
    </div>
  );
};

export default SignInForm;