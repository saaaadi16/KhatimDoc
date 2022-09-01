import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import DeleteModal from "../modal/DeleteModal";
import { PackageContext } from "../../services/packageContext";
import Axios from "../../services/axios";
import Snackbar from "../snackbar/Snackbar";
import { saveAs } from "file-saver";
import { base64ToB, clearApp, Download } from "../../utils/GetRouterState";

const SplitButton = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { setCurrPackage, setRecipient } = useContext(PackageContext);
  const navigate = useNavigate();

  const HandleButton = (selectedIndex: number) => {
    const Config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };

    if (
      props?.row?.permitted_actions[selectedIndex]?.toUpperCase() ===
      "Delete".toUpperCase()
    ) {
      if (
        props?.row?.status?.toUpperCase() === "Pending".toUpperCase() ||
        props?.row?.status?.toUpperCase() === "Waiting".toUpperCase()
      ) {
        setMessage(
          "Do you wish to delete this package. You won’t be able to see this package any more?"
        );
      } else {
        setMessage(
          "Do you want to delete this package: " +
            // "`" +
            props?.row?.package_name
          //+  "`"
        );
      }
      setDMOpen(true);
    } else if (
      props?.row.permitted_actions[selectedIndex]?.toUpperCase() ===
      "Cancel".toUpperCase()
    ) {
      setMessage(
        "Do you wish to cancel this package? No recipient can do any further processing."
      );
      setDMOpen(true);
    } else if (
      props.row.permitted_actions[selectedIndex]?.toUpperCase() ===
      "Decline".toUpperCase()
    ) {
      setMessage("Do you wish to decline this package?");
      setDMOpen(true);
    } else if (
      props.row.permitted_actions[selectedIndex]?.toUpperCase() ===
      "Share".toUpperCase()
    ) {
      Axios.get("/package/" + props?.row?.package_guid + "/share", Config)
        .then((res) => {
          if (res.data.response_code === 0) {
            setSKOpen(true);
            setMsgSK("Success");
            setAlert("success");
            props.setLRUp(props.LocalRowsUp + 1);
          } else {
            setSKOpen(true);
            setMsgSK(res.data.error_message);
            setAlert("error");
          }
        })
        .catch((err) => {
          setSKOpen(true);
          setMsgSK("Internal Server Error!");
          setAlert("error");

          if (err.response.status === 403) {
            localStorage.removeItem("AuthToken");
            clearApp();
            navigate("/redirect");
          }
        });
    } else if (
      props.row.permitted_actions[selectedIndex]?.toUpperCase() ===
      "Sign".toUpperCase()
    ) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      };
      Axios.get("/package/" + props.package_guid, config)
        .then((res) => {
          if (res.data.response_code === 0) {
            res.data.recipients.filter((recipient: any) => {
              if (
                recipient.contact_email.toLowerCase() === props.user.email &&
                !recipient.processed
              ) {
                console.log("Recipient here : ", recipient);
                setCurrPackage(res.data.package_name);
                setRecipient(recipient);
                navigate(`/sign/${props.package_guid}/0`);
              } else console.log(recipient, props.user);
            });
          } else {
            console.log("Response : ", res.data);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 403) {
            localStorage.removeItem("AuthToken");
            clearApp();
            navigate("/redirect");
          }
        });
    } else if (
      props.row.permitted_actions[selectedIndex]?.toUpperCase() ===
      "Download".toUpperCase()
    ) {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      };

      Axios.get("/package/" + props.row.package_guid + "/download", config)
        .then((res) => {
          console.log(res.data, "Download");

          if (res.data.response_code === 0) {
            let Title = props?.row?.package_name + ".zip";

            if (res.data.status === false) {
              Title = props?.row?.package_name + ".pdf";
            }

            Download(Title, base64ToB(res.data.bytes));
          }
        })
        .catch((err) => {
          if (err.response.status === 403) {
            localStorage.removeItem("AuthToken");
            clearApp();
            navigate("/redirect");
          }
        });
    } else if (
      props.row.permitted_actions[selectedIndex]?.toUpperCase() ===
      "Continue".toUpperCase()
    ) {
      setCurrPackage(props.package_guid);
      navigate("/prepare");
    }
  };

  const handleClick = () => {
    HandleButton(selectedIndex);
  };

  const handleClick2 = (index: number) => {
    HandleButton(index);
  };

  const APICall = (Data: any, API: string) => {
    const Config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };
    Axios.put("/package/" + API + "/" + Data.package_guid, Data, Config)
      .then((res) => {
        if (res.data.response_code === 0) {
          setSKOpen(true);
          setMsgSK("Success");
          setAlert("success");
          props.setLRUp(props.LocalRowsUp + 1);
        } else {
          setSKOpen(true);
          setMsgSK(res.data.error_message);
          setAlert("error");
        }
      })
      .catch((err) => {
        setSKOpen(true);
        setMsgSK("Internal Server Error!");
        setAlert("error");

        if (err.response.status === 403) {
          localStorage.removeItem("AuthToken");
          clearApp();
          navigate("/redirect");
        }
      });
  };

  const handleContinue = () => {
    if (
      props.row.permitted_actions[selectedIndex]?.toUpperCase() ===
      "Delete".toUpperCase()
    ) {
      const Config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      };
      Axios.delete("/package/" + props.row.package_guid, Config)
        .then((res) => {
          if (res.data.response_code === 0) {
            setSKOpen(true);
            setMsgSK("Success");
            setAlert("success");
            props.setLRUp(props.LocalRowsUp + 1);
          } else {
            setSKOpen(true);
            setMsgSK(res.data.error_message);
            setAlert("error");
          }
        })
        .catch((err) => {
          setSKOpen(true);
          setMsgSK("Internal Server Error!");
          setAlert("error");

          if (err.response.status === 403) {
            localStorage.removeItem("AuthToken");
            clearApp();
            navigate("/redirect");
          }
        });
    } else if (
      props.row.permitted_actions[selectedIndex]?.toUpperCase() ===
      "Cancel".toUpperCase()
    ) {
      const Data = {
        package_guid: props.row.package_guid,
      };

      APICall(Data, "cancel");
    } else if (
      props.row.permitted_actions[selectedIndex]?.toUpperCase() ===
      "Decline".toUpperCase()
    ) {
      const Data = {
        package_guid: props.row.package_guid,
      };

      APICall(Data, "decline");
    }
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    event.preventDefault();
    setSelectedIndex(index);
    handleClick2(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  const [dmOpen, setDMOpen] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");

  const [skopen, setSKOpen] = React.useState<boolean>(false);
  const [messageSK, setMsgSK] = React.useState<string>("");
  const [alert, setAlert] = React.useState<string>("");

  return (
    <React.Fragment>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
        color={"success"}
      >
        <Button
          onClick={handleClick}
          sx={{ fontWeight: "bold", width: 115, display: { md: "flex" } }}
          size="small"
        >
          {props.row.permitted_actions[selectedIndex]}
        </Button>
        <Button
          // disabled={props?.row?.permitted_actions?.length < 2}
          size="small"
          aria-controls={open ? "saad" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        sx={{
          zIndex: 1,
          width: 159,
        }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: "center bottom",
              // placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="saad" autoFocusItem>
                  {props?.row?.permitted_actions?.map(
                    (option: string, index: number) => (
                      <MenuItem
                        key={index}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    )
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <DeleteModal
        dmOpen={dmOpen}
        setDMOpen={setDMOpen}
        message={message}
        handleContinue={handleContinue}
      />
      <Snackbar
        open={skopen}
        setOpen={setSKOpen}
        message={messageSK}
        alert={alert}
      />
    </React.Fragment>
  );
};

export default SplitButton;
