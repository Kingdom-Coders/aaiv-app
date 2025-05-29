import React from "react";
import { Spinner } from "react-bootstrap";

//Set the default message and size
// Added margin bottom as space
function Loading({ size = 100, loadingMessage="Loading ...", marginBot="30px" }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%"
      }}
    >
      <Spinner
        style={{
          width: size,
          height: size,
          marginBottom: marginBot,
        }}
        //Can change the style and color here
        animation="border"
        variant="secondary" 
      />
      {loadingMessage}
    </div>
  );
}

export default Loading;
