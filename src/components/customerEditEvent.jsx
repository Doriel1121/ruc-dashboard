import { Box, TextField, Button } from "@mui/material";
import { useState, useEffect, useReducer } from "react";
import { useFetch } from "../hooks/useFetch";
import { postReducer, INITIAL_STATE } from "../hooks/postReducer";
import Loader from "./loader";

export default function CustomerEditEvent(props) {
  const { eventInfo, updateEvent, fallback } = props;
  const [localEventInfo, setLocalEventInfo] = useState({});
  const Fetch = useFetch();
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);

  const {
    _id,
    broom,
    bride,
    location,
    date,
    hoopa_hour,
    invited_amount,
    party_hour,
    broom_parents,
    bride_parents,
    name,
    hour,
    father_name,
    mother_name,
    eventType,
    serviceType,
    type,
    templateId,
    templateAttendanceId,
    sendingPlatform,
    thirdMessageDte,
    secondMessageDate,
    firstMessageDate,
  } = eventInfo;
  const weddingEditableFields = {
    name: { value: broom, he: "שם חתן", label: "broom" },
    brideName: { value: bride, he: "שם כלה", label: "bride" },
    date: { value: date, he: "תאריך", label: "date" },
    sendingPlatform: {
      value: sendingPlatform,
      he: "אמצעי שליחה",
      label: "sendingPlatform",
    },
    broom_parents: {
      value: broom_parents,
      he: "שמות הורי החתן",
      label: "broom_parents",
    },
    bride_parents: {
      value: bride_parents,
      he: "שמות הורי הכלה",
      label: "bride_parents",
    },
  };
  const barMitzvaEditableFields = {
    name: { value: name, he: "שם", label: "name" },
    date: { value: date, he: "תאריך", label: "date" },
    sendingPlatform: {
      value: sendingPlatform,
      he: "אמצעי שליחה",
      label: "sendingPlatform",
    },
    broom_parents: {
      value: broom_parents,
      he: "שמות הורי החתן",
      label: "broom_parents",
    },
    bride_parents: {
      value: bride_parents,
      he: "שמות הורי הכלה",
      label: "bride_parents",
    },
  };

  useEffect(() => {
    switch (type) {
      case "חתונה":
        setLocalEventInfo(weddingEditableFields);
        break;
      case "בר מצווה":
        setLocalEventInfo(barMitzvaEditableFields);
        break;
      case "חינה":
        setLocalEventInfo(barMitzvaEditableFields);
        break;

      default:
        setLocalEventInfo(weddingEditableFields);
        break;
    }
  }, [_id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const infoData = { ...Object.fromEntries(data.entries()) };
    const filteredObject = {
      ...filterEmptyProperties(infoData),
      eventId: eventInfo._id,
    };
    updateEvent(filteredObject);
  };

  function filterEmptyProperties(obj) {
    const filteredObj = Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value !== "")
    );

    return filteredObj;
  }

  return (
    <div className="eventsInputs">
      <h3>פרטי אירוע</h3>
      <form className="form" onSubmit={handleSubmit}>
        <Box className="inputsLayout">
          {Object.keys(localEventInfo).map((property, index) => {
            console.log("property", property, index);
            //   {
            // !!information[property].value === true ? (
            return (
              <Box className="inputWrapper" key={index}>
                {/* <span>{localEventInfo[property]?.he}</span> */}
                <TextField
                  variant="standard"
                  label={localEventInfo[property]?.he}
                  placeholder={localEventInfo[property]?.value}
                  key={index}
                  name={localEventInfo[property]?.label}
                  //   value={localEventInfo[property]?.value}
                />
              </Box>
            );
          })}
        </Box>
        <Button className="submitBtn" variant="contained" type="submit">
          עדכן פרטי אירוע
        </Button>
      </form>
    </div>
  );
}
