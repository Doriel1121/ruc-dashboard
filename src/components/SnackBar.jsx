import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SimpleSnackbar(props) {
  const { text, isOpen, handleIsOpen } = props;
  //   const [open, setOpen] = React.useState(false);

  //   const handleClick = () => {
  //     setOpen(true);
  //   };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    handleIsOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        בטל
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <div>
        <Snackbar
          open={isOpen}
          autoHideDuration={6000}
          onClose={handleClose}
          message={text}
          action={action}
        >
          <Alert onClose={handleClose} sx={{ width: "100%" }} severity="error">
            חרגת ממספר המוזמנים בתוכנית שרכשת
          </Alert>
        </Snackbar>
      </div>
    </Stack>
  );
}
