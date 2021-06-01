import React, { FC } from "react";
import "./ThreadCard.css";
import Thread from "../../../models/Thread";
import { Link, useHistory } from "react-router-dom";
import { faEye, faHeart, faReplyAll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard: FC<ThreadCardProps> = ({ thread }) => {
  const history = useHistory();
  const { width } = useWindowDimensions();

  const onClickShowThread = (e: React.MouseEvent<HTMLDivElement>) => {
    history.push("/thread/" + thread.id);
  };

  const getPoints = () => {
    if (width > 768) {
      return (
        <div className="threadcard-points">
          <div className="threadcard-points-item">
            {thread.points || 0}
            <br />
            <FontAwesomeIcon icon={faHeart} className="points-icon" />
          </div>

          <div
            className="threadcard-points-item"
            style={{ marginBottom: ".75em" }}
          >
            {thread?.threadItems?.length}
            <br />
            <FontAwesomeIcon icon={faReplyAll} className="points-icon" />
          </div>
        </div>
      );
    }
  };

  const getPointsMobile = (thread: Thread) => {
    if (width <= 768) {
      return (
        <label style={{ marginTop: ".25em", marginRight: ".75em" }}>
          {thread.points || 0}
          <FontAwesomeIcon
            icon={faHeart}
            className="points-icon"
            style={{ marginLeft: ".2em" }}
          />
        </label>
      );
    }

    return null;
  };

  const getResponses = (thread: Thread) => {
    if (width <= 768) {
      return (
        <label style={{ marginRight: ".5em" }}>
          {thread?.threadItems?.length}
          <FontAwesomeIcon
            icon={faReplyAll}
            className="points-icon"
            style={{ marginLeft: ".25em", marginTop: "-.25em" }}
          />
        </label>
      );
    }

    return null;
  };

  return (
    <section className="panel threadcard-container">
      <div className="threadcard-txt-container">
        <div className="content-header">
          <Link
            to={`/categorythreads/${thread?.category?.id}`}
            className="link-txt"
          >
            <strong>{thread?.category?.name}</strong>
          </Link>
          <span className="username-header" style={{ marginLeft: ".5em" }}>
            {thread?.user?.Username}
          </span>
        </div>

        <div className="question">
          <div
            onClick={onClickShowThread}
            data-thread-id={thread.id}
            style={{ marginBottom: ".4em" }}
          >
            <strong>{thread?.title}</strong>
          </div>

          <div
            onClick={onClickShowThread}
            data-thread-id={thread?.id}
            className="threadcard-body"
          >
            <div>{thread?.body}</div>
          </div>

          <div className="threadcard-footer">
            <span style={{ marginRight: ".5em" }}>
              <label>
                {thread?.views}
                <FontAwesomeIcon icon={faEye} className="icon-lg" />
              </label>
            </span>
            <span>
              {getPointsMobile(thread)}
              {getResponses(thread)}
            </span>
          </div>
        </div>
      </div>
      {getPoints()}
    </section>
  );
};

export default ThreadCard;
