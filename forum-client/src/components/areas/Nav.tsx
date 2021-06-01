import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import ReactModal from "react-modal";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import "./Nav.css";
import SideBarMenus from "./sidebar/SideBarMenus";

const Nav = () => {
  const { width } = useWindowDimensions();
  const [showMenu, setShowMenu] = useState(false);

  const getMobileMenu = () => {
    if (width <= 768) {
      return (
        <FontAwesomeIcon
          onClick={onClickToggle}
          icon={faBars}
          size="lg"
          className="nav-mobile-menu"
        />
      );
    }

    return null;
  };

  const onClickToggle = (e: React.MouseEvent<Element, MouseEvent>) => {
    setShowMenu(!showMenu);
  };

  const onRequestClose = (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => {
    setShowMenu(false);
  };

  return (
    <>
      <ReactModal
        className="modal-menu"
        isOpen={showMenu}
        onRequestClose={onRequestClose}
        shouldCloseOnOverlayClick={true}
        appElement={document.getElementById("root") as HTMLElement}
      >
        <SideBarMenus />
      </ReactModal>
      <nav>
        {getMobileMenu()}
        <strong>SuperForum</strong>
        <hr />
      </nav>
    </>
  );
};

export default Nav;
