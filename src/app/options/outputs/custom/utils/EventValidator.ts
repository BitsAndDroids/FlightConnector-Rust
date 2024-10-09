import { EventErrors } from "../CustomEvents";

export const validateEventID = (value: string): Partial<EventErrors> => {
  const errorState = {
    id: { state: false, message: "" },
  };
  if (value === "") {
    errorState.id.state = true;
    errorState.id.message = "Event ID cannot be empty ";
  }
  if (parseInt(value) < 3000) {
    errorState.id.state = true;
    errorState.id.message += "Event ID must be greater than 3000";
  }
  if (parseInt(value) > 9999) {
    errorState.id.state = true;
    errorState.id.message += "Event ID must be smaller than 10000";
  }

  return errorState;
};

export const validateEventDescription = (
  value: string,
): Partial<EventErrors> => {
  const errorState = {
    action_text: { state: false, message: "" },
  };
  if (value === "") {
    errorState.action_text.state = true;
    errorState.action_text.message = "Event Description cannot be empty";
  }
  return errorState;
};
