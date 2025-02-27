import React, { useContext, useEffect, useRef } from "react";

import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { Box } from "@mui/material";
import "../../css/ArtShop.css";
import PaymentArea from "./../StyledMUI/PaymentArea.tsx"
import Customized3DModel from "../StyledMUI/Customized3DModel.tsx";

export default function DepositeCoin() {
  const { theme, dark } = useContext(ThemeContext);


  return (
    <>
    <div
        className="formup"
        style={{
          backgroundImage: "url('/images/animation_simple_box_red.gif')",
          backgroundSize: "cover",
          height:"100vh",
          position: "relative",
        }}
      >
      <PaymentArea />
      <Customized3DModel />
    </div>
    </>
  );
}
