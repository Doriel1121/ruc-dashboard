/* eslint-disable react/prop-types */
import { useReducer } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TextField } from "@mui/material";
import { useFetch } from "../hooks/useFetch";
import { postReducer, INITIAL_STATE } from "../hooks/postReducer";

export default function AdditionalActions(props) {
  const { eventData } = props;
  const FetchData = useFetch();
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);

  const handleOpeningForm = (event) => {
    console.log(event);
    event.preventDefault();
    const data = new FormData(event.target);
    console.log(data);
    const infoData = {
      ...Object.fromEntries(data.entries()),
      eventId: eventData._id,
    };
    console.log(infoData);
    handleUpdate(infoData);
  };

  const handleUpdate = (payload) => {
    dispatch({ type: "START" });
    FetchData("/updateEventInfo", "post", payload)
      .then((res) => {
        dispatch({ type: "SUCCESS", payload: res.data });

        console.log(res);
      })
      .catch((err) => {
        dispatch({ type: "ERROR" });
        console.log(err);
      });
  };

  return (
    <div>
      <h3>פעולות נוספות</h3>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>הוסף/ערוך פתיח להודעה</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ textAlign: "left", background: "#f9f9f1" }}>
          <Typography>
            כאן ניתן להוסיף פתיח להודעה שתישלח לכלל המוזמנים שלך, במקרה ושדה זה
            לא ימולא תתווסף הודעה גנרית.
          </Typography>
          <form className="openingForm" onSubmit={handleOpeningForm}>
            <TextField
              sx={{ width: "100%", marginTop: "20px" }}
              id="standard-multiline-static"
              label="הכנס פתיח"
              name="opening"
              multiline
              maxRows={4}
              placeholder="הנכם מוזמנים ל..."
              variant="standard"
            />
            <button type="submit">שמור</button>
          </form>
          <b>פתיח נוכחי:</b>
          <div>
            <span>{eventData?.opening},</span>
            <br />
            {eventData?.serviceType?.value !== 0 ? (
              <>
                <span>נשמח שתעדכנו אותנו אודות הגעתכם כאן</span>
                <br />
              </>
            ) : null}
            <a className="link">
              https://rucoming-dashboard/eventId/customerId
            </a>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>יצירת הודעה לעדכון מוזמנים לגבי שינוי</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ textAlign: "left", background: "#f9f9f1" }}>
          <Typography>
            נסח כאן את ההודעה,
            <br /> ההודעה תישלח באופן מיידי לכלל המוזמנים
          </Typography>
          <form className="openingForm" onSubmit={handleOpeningForm}>
            <TextField
              sx={{ width: "100%", marginTop: "20px" }}
              id="standard-multiline-static"
              label="הכנס הודעה"
              name="opening"
              multiline
              maxRows={4}
              variant="standard"
            />
            <button type="submit">שמור</button>
          </form>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
