import "./Stepper.css";
import { Box, Step, StepLabel, Stepper } from "@mui/material";

const steps = [
  "Create an Account",
  "Enter Code (OTP)",
  "Set Security Question",
  "Set Password",
];

const StepperSignup = (props: any) => {
  return (
    <>
      <Box sx={{ width: "100%", mt: 7 }}>
        <Stepper activeStep={props.index} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              {/* <StepLabel id="stepper-color" sx={{ }}> */}
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </>
  );
};

export default StepperSignup;
