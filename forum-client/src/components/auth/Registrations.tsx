import React, { FC, useReducer } from "react";
import ReactModal from "react-modal";
import ModalProps from "../types/ModalProps";
import userReducer from "./common/UserReducer";
import { allowSubmit } from "./common/Helpers";
import PasswordComparison from "./common/PasswordComparison";
import { gql, useMutation } from "@apollo/client";
import "./Registration.css";

const RegisterMutation = gql`
  mutation register($email: String!, $Username: String!, $password: String!) {
    register(email: $email, Username: $Username, password: $password)
  }
`;

const Registration: FC<ModalProps> = ({ isOpen, onClickToggle }) => {
  const [execRegister] = useMutation(RegisterMutation);
  const [
    { Username, password, passwordConfirm, email, resultMsg, isSubmitDisabled },
    dispatch,
  ] = useReducer(userReducer, {
    Username: "",
    password: "",
    passwordConfirm: "",
    email: "",
    resultMsg: "",
  });

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ payload: e.target.value, type: "userName" });
    if (!e.target.value) {
      allowSubmit(dispatch, "Username cannot be empty", true);
    } else if (e.target.value.length < 4) {
      allowSubmit(
        dispatch,
        "Username must be at least 4 characters long",
        true
      );
    } else {
      allowSubmit(dispatch, "", false);
    }
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ payload: e.target.value, type: "email" });
    if (!e.target.value) {
      allowSubmit(dispatch, "Email cannot be empty", true);
    } else {
      allowSubmit(dispatch, "", false);
    }
  };

  const onClickRegister = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    onClickToggle(e);

    try {
      const result = await execRegister({
        variables: {
          email,
          Username,
          password,
        }
      })

      dispatch({ type: 'resultMsg', payload: result.data.register });
    } catch (err) {
      console.log(err);
    }
  };

  const onClickCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    onClickToggle(e);
  };

  return (
    <ReactModal
      className="modal-menu"
      isOpen={isOpen}
      onRequestClose={onClickToggle}
      shouldCloseOnOverlayClick={true}
      appElement={document.getElementById("root") as HTMLElement}
    >
      <form>
        <div className="reg-inputs">
          <div>
            <label>username</label>
            <input type="text" value={Username} onChange={onChangeUsername} />
          </div>
          <div>
            <label>email</label>
            <input type="text" value={email} onChange={onChangeEmail} />
          </div>
          <div>
            <PasswordComparison
              dispatch={dispatch}
              password={password}
              passwordConfirm={passwordConfirm}
            />
          </div>
        </div>
        <div className="form-buttons">
          <div className="form-btn-left">
            <button
              style={{ marginLeft: ".5em" }}
              className="action-btn"
              disabled={isSubmitDisabled}
              onClick={onClickRegister}
            >
              Register
            </button>
            <button
              style={{ marginLeft: ".5em" }}
              className="cancel-btn"
              onClick={onClickCancel}
            >
              Close
            </button>
          </div>
          <span className="form-btn-right">
            <strong>{resultMsg}</strong>
          </span>
        </div>
      </form>
    </ReactModal>
  );
};

export default Registration;
