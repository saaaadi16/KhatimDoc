import {
  Backdrop,
  Box,
  Button,
  Fade,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import * as React from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#e5e5e5",
  // border: '3px solid #357a38',
  borderRadius: "10px",
  boxShadow: 24,
  p: 3,
};

const DeleteModal = (props: any) => {
  const handleOpen = () => props.setDMOpen(true);
  const handleClose = () => props.setDMOpen(false);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.dmOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.dmOpen}>
        <Grid container>
          <Grid item xs={4} md={12}>
            <Box sx={style}>
              <Typography
                variant="subtitle1"
                component="h6"
                sx={{ mb: 2.5, fontWeight: "bold" }}
                align={"center"}
              >
                {props.message}
              </Typography>
              <Box sx={{ textAlign: "center" }}>
                <Button
                  size={"small"}
                  variant={"contained"}
                  sx={{
                    mr: 1.5,
                    fontWeight: "bold",
                    bgcolor: "#90a4ae",
                    [`&:hover`]: { bgcolor: "#607d8b" },
                  }}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  size={"small"}
                  color={"success"}
                  variant={"contained"}
                  sx={{ fontWeight: "bold" }}
                  onClick={() => {
                    props.handleContinue();
                    props.setDMOpen(false);
                  }}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Fade>
    </Modal>
  );
};

export default DeleteModal;
