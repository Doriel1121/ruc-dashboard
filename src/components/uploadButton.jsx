import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PropTypes from "prop-types";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload(props) {
  const { updateGuestsList } = props;

  InputFileUpload.propTypes = {
    updateGuestsList: PropTypes.func.isRequired,
  };
  return (
    <Button
      className="importBtn"
      size="large"
      component="label"
      sx={{ stroke: "black", fontSize: "25px" }}
      startIcon={<CloudUploadIcon />}
    >
      העלה רשימת מוזמנים
      <VisuallyHiddenInput
        required
        type="file"
        className="customFieldStyle"
        inputProps={{
          accept:
            ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        }}
        onChange={(e) => updateGuestsList(e)}
      />
    </Button>
  );
}
