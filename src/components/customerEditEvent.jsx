import { Box, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
// import { useFetch } from "../hooks/useFetch";
// import { postReducer, INITIAL_STATE } from "../hooks/postReducer";
// import Loader from "./loader";

export default function CustomerEditEvent(props) {
  const { eventInfo, updateEvent, fallback } = props;
  const [localEventInfo, setLocalEventInfo] = useState({});
  // const Fetch = useFetch();
  // const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const [isEditable, setIsEditable] = useState(false);

  const {
    _id,
    broom,
    bride,
    location,
    date,
    hoopa_hour,
    max_guests_amount,
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
    max_guests_amount: {
      value: max_guests_amount,
      he: "מספר מוזמנים בתוכנית",
      label: "max_guests_amount",
    },
    serviceType: {
      value: serviceType.name,
      he: "סוג שירות",
      label: "serviceType",
    },
    templateLink: {
      value: "template_link",
      he: "קישור להזמנה",
      label: "templateLink",
      type: "link",
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
    max_guests_amount: {
      value: max_guests_amount,
      he: "מספר מוזמנים בתוכנית",
      label: "max_guests_amount",
    },
    templateLink: {
      value: "template_link",
      he: "קישור להזמנה",
      label: "templateLink",
      type: "link",
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
        setLocalEventInfo(weddingEditableFields);
        break;

      default:
        setLocalEventInfo(weddingEditableFields);
        break;
    }
  }, [_id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEditable) {
      const data = new FormData(event.target);
      const infoData = { ...Object.fromEntries(data.entries()) };
      const filteredObject = {
        ...filterEmptyProperties(infoData),
        eventId: eventInfo._id,
      };
      updateEvent(filteredObject);
    } else {
      setIsEditable(true);
    }
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
                {isEditable ? (
                  <TextField
                    variant="standard"
                    label={localEventInfo[property]?.he}
                    placeholder={localEventInfo[property]?.value}
                    key={index}
                    name={localEventInfo[property]?.label}
                    sx={{ width: "90%" }}
                  />
                ) : (
                  <span>
                    <strong>{localEventInfo[property]?.he}: </strong>
                    {localEventInfo[property]?.type === "link" ? (
                      <a href={localEventInfo[property]?.value}>לחץ כאן</a>
                    ) : (
                      <span>{localEventInfo[property]?.value}</span>
                    )}
                  </span>
                )}
              </Box>
            );
          })}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button className="submitBtn" variant="contained" type="submit">
            {isEditable ? "עדכן פרטי אירוע" : "הפוך עריכה לזמינה"}
          </Button>
          <a onClick={() => setIsEditable(false)} className="clickable">
            {isEditable ? "חזור" : null}
          </a>
        </Box>
      </form>
    </div>
  );
}
