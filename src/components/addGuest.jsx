/* eslint-disable react/prop-types */
import { Box, Button, TextField } from "@mui/material";

export default function AddGuest(props) {
  const openAddBox = props.openAddBox;

  return (
    <Box className={`addBox ${openAddBox ? "openedBox" : "closedBox"}`}>
      <form className="flexBox">
        <TextField variant="standard" label={"שם"} placeholder="שם" />
        <TextField variant="standard" label={"טלפון"} placeholder="טלפון" />
        <Button type="submit"> הוסף</Button>
      </form>
    </Box>
  );
}
