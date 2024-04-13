import { Box } from "@mui/material";
import React from "react";

export default function MyLogo(props: any) {
  const { variant } = props;
  console.log(variant);
  const MyLogoIcon = () => {
    switch (variant) {
      case 1:
        return (
          <img
            src="./full-logo-white.png"
            style={{ width: "200px" }}
            alt="logo"
          />
        );
      case 2:
        return (
          <img src="./logo-symbol.png" style={{ width: "50px" }} alt="logo" />
        );
      case 3:
        return (
          <img
            src="./full-logo-black.png"
            style={{ width: "150px", height: "auto" }}
            alt="logo"
          />
        );

      default:
        return (
          <img
            src="./full-logo-white.png"
            style={{ width: "150px", height: "auto" }}
            alt="logo"
          />
        );
    }
  };

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {MyLogoIcon()}
      {/* <img src="./full-logo-white.png" style={{ width: "200px" }} alt="logo" /> */}
    </Box>
  );
}
