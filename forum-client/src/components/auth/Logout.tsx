import { gql, useMutation } from "@apollo/client";
import React, { FC } from "react";
import ReactModal from "react-modal";
import { useSelector } from "react-redux";
import { AppState } from "../../store/AppState";
import ModalProps from "../types/ModalProps";
import useRefreshReduxMe, { Me } from "../../hooks/useRefreshReduxMe";
import "./Logout.css";

const LogoutMutation = gql`
  mutation logout($Username: String!) {
    logout(Username: $Username)
  }
`;

const Logout: FC<ModalProps> = ({ isOpen, onClickToggle }) => {
  const user = useSelector((state: AppState) => state.user);
  const [execLogout] = useMutation(LogoutMutation, {
    refetchQueries: [
      {
        query: Me,
      },
    ],
  });
  const { deleteMe } = useRefreshReduxMe();

  const onClickLogout = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    onClickToggle(e);
    await execLogout({
      variables: {
        Username: user?.Username ?? "",
      },
    });
    deleteMe();
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
        <div className="logout-inputs">Are you sure you want to logout?</div>
        <div className="form-buttons form-buttons-sm">
          <div className="form-btn-left">
            <button
              style={{ marginLeft: ".5em" }}
              className="action-btn"
              onClick={onClickLogout}
            >
              Logout
            </button>
            <button
              style={{ marginLeft: ".5em" }}
              className="cancel-btn"
              onClick={onClickCancel}
            >
              Close
            </button>
          </div>
        </div>
      </form>
    </ReactModal>
  );
};

export default Logout;
