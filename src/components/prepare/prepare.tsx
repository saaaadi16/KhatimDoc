import React, { useState, useEffect, useContext, useRef } from "react";
import Snackbar from "../snackbar/Snackbar";
import { Link } from "react-router-dom";
import { User } from "../../App";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useCookies } from "react-cookie";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
import { ChevronRight, UploadFile } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import CardMedia from "@mui/material/CardMedia";
import DeleteModal from "../modal/DeleteModal";
import {
  Box,
  Modal,
  Button,
  CardActionArea,
  CardActions,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import "./prepare.css";
import { PackageContext } from "../../services/packageContext";
import Axios from "../../services/axios";
import {
  base64ToB,
  clearPack,
  Download,
  TempPackSet,
} from "../../utils/GetRouterState";

interface params {
  user: User;
  setUser: (user: User) => void;
  packageId: string;
  setPackage: Function;
}

interface cardProps {
  file: any;
  fileDelete: Function;
  fileDownload: Function;
  setOpenChange: Function;
  setSelectedDoc: Function;
}

const RenderCard = ({
  file,
  fileDelete,
  fileDownload,
  setOpenChange,
  setSelectedDoc,
}: cardProps) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const [open, setOpen] = useState<boolean>(Boolean(anchorEl));

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <Card
      sx={{
        padding: 0,
        margin: 0,
        marginTop: 0.5,
        minHeight: 220,
        maxHeight: 220,
        minWidth: 220,
        maxWidth: 220,
        border: "1px solid #bdbdbd",
      }}
    >
      <CardMedia
        component="img"
        height="150"
        src={`data:image/png;base64,${file.doc_thumbnail}`}
        sx={{ marginBottom: 0, paddingBottom: 0 }}
      />
      <CardContent
        sx={{
          padding: 0,
          margin: 0,
          pt: 0.1,
          backgroundColor: "rgb(245, 245, 245)",
        }}
      >
        <CardActions
          sx={{
            padding: 0,
            margin: "0.5rem",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              fontSize: 16,
              fontWeight: 550,
              padding: 0,
              paddingLeft: 1,
              margin: 0,
              textAlign: "left",
              width: "90%",
            }}
            component="p"
          >
            {file?.doc_name?.length > 18
              ? file?.doc_name?.substring(0, 15) + "..."
              : file?.doc_name}
            <Typography
              color="textSecondary"
              sx={{
                fontSize: 12,
                paddingBottom: 0,
                paddingTop: 1,
                margin: 0,
                textAlign: "left",
                width: "90%",
              }}
              component="p"
            >
              Pages: {file.page_count}
            </Typography>
          </Typography>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ padding: 0, marginLeft: 1 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <MoreVertIcon />
          </IconButton>
        </CardActions>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={() => {
            console.log("Closing Menu");
            handleClose();
          }}
          // onClick={(e) => {
          //   handleClick(e);
          // }}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.2))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 100,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              console.log("calling for file", file.doc_name);
              setOpenChange(true);
              setSelectedDoc(file);
            }}
          >
            Rename
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.preventDefault();
              fileDownload(file.doc_id, file.doc_name);
              handleClose();
            }}
          >
            Download
          </MenuItem>
          <MenuItem
            onClick={() => {
              console.log("calling for file", file.doc_name);
              fileDelete(file.doc_id);
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

interface Irecipient {
  recipient_id?: number;
  contact_name: string;
  assigned_color: string;
  contact_email: string;
  order?: number;
  permission?: string;
  right?: string;
}

interface Imessage {
  subject: string;
  body: string;
}

const PreparePackage: React.FC = () => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
    },
  };
  const [cookies, setCookies] = useCookies<string>(["package"]);
  // const top100Films = [
  //   { label: "The Shawshank Redemption", year: 1994 },
  //   { label: "The Godfather", year: 1972 },
  //   { label: "The Godfather: Part II", year: 1974 },
  //   { label: "The Dark Knight", year: 2008 },
  // ];

  const [change, setChange] = useState(0);

  // const [contacts, setContacts] = useState<any[]>([
  //   { name: "Faizan", email: "fuxxy797@gmail.com" },
  //   { name: "Faiq", email: "faiqijaz19@gmail.com" },
  // ]);

  const { currPackage, setCurrPackage } = useContext(PackageContext);

  const [docLoading, setDocLoading] = useState(false);

  const [files, setFiles] = useState<any[]>([]);

  const loaded = useRef(false);

  const [dataLoading, setDataLoading] = useState(false);

  const [recipients, setRecipients] = useState<Irecipient[]>([]);

  const [selectedDoc, setSelectedDoc] = useState<any>(files[0]);

  const [openChange, setOpenChange] = useState(false);

  const [dmOpen, setDMOpen] = useState(false);

  let navigate = useNavigate();

  const loadData = () => {
    console.log("Config : ", config);
    Axios.get("/package/" + currPackage + "/preview", config)
      .then((res) => {
        if (res.data.response_code === 0) {
          setFiles(res.data.thumbnails);
          console.log("Files Data : ", res.data.thumbnails);
          var names = res.data.thumbnails.map((file: any, index: number) => {
            if (index === 0) return file.doc_name;
            else return " " + file.doc_name;
          });
          setMessage({ ...message, subject: `${names}` });
          console.log("Files Data : ", res.data);
        } else {
          console.log("Preview Error Response : ", res.data);
        }
        Axios.get("/package/" + currPackage, config)
          .then((res) => {
            if (res.data.response_code === 0) {
              setRecipients(res.data.recipients);
              console.log("Recipients : ", res.data.recipients);
            } else {
              console.log("Adding Recipient");
              AddRecipients();
            }
            setDataLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setDataLoading(false);
          });
        // Axios.get("/contacts", config)
        //   .then((res) => {
        //     if (res.data.response_code === 0) {
        //       if (res.data.contacts) {
        //         console.log("Setting contacts");
        //         setContacts(res.data.contacts);
        //       }
        //     } else {
        //       console.log("Contacts Response : ", res.data.message);
        //     }
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
      })
      .catch((err) => {
        console.log("Preview Error : ", err);
        setSnackbar(true);
        setAlertColor("error");
        setAlertMessage(err.message);
        setDataLoading(false);
      });
    console.log("Loaded...");
  };

  useEffect(() => {
    if (loaded.current === false) {
      console.log("Loading preparation data");
      setDataLoading(true);
      loadData();
      loaded.current = true;
    }
  }, [change]);

  const [expanded1, setExpanded1] = React.useState<boolean>(true);

  const [expanded2, setExpanded2] = React.useState<boolean>(true);

  const [expanded3, setExpanded3] = React.useState<boolean>(true);

  const [message, setMessage] = useState<Imessage>({
    subject: "",
    body: "",
  });

  const deletePackage = () => {
    console.log("Deleting Package");
    Axios.delete("/package/" + currPackage, config)
      .then((res) => {
        if (res.data.response_code === 0) {
          setCurrPackage("");
          setCookies("packageId", "", { path: "/" });
          TempPackSet(0);
          navigate("//inbox");
        } else {
          setSnackbar(true);
          setAlertColor("error");
          setAlertMessage(res.data.error_message);
        }
      })
      .catch((err) => {
        setSnackbar(true);
        setAlertColor("error");
        setAlertMessage(err.error_message);
      });
  };

  const AddRecipients = () => {
    var number = Math.floor(Math.random() * 16777215);
    var randomColor: string = number.toString(16);
    while (randomColor.length < 6 || number > 9999999) {
      number = Math.floor(Math.random() * 16777215);
      randomColor = number.toString(16);
    }
    recipients?.map((recipient, index) => {
      Axios.post(
        "/package/recipient/replace",
        {
          package_guid: currPackage,
          recipient_id: recipient.recipient_id,
          contact_name: recipient.contact_name,
          contact_email: recipient.contact_email,
          order: index + 1,
          rights: recipient.right,
          permission: recipient.permission,
        },
        config
      )
        .then((res) => {
          if (res.data.response_code === 0)
            console.log("Recipient added : " + recipient.contact_name);
          else {
            setSnackbar(true);
            setAlertMessage("Couldn't add recipient" + recipient.contact_name);
            setAlertColor("Warning");
          }
        })
        .catch((err) => {
          setSnackbar(true);
          setAlertColor("error");
          setAlertMessage(err.error_message);
        });
    });
    Axios.post(
      "/package/recipient",
      {
        package_id: currPackage,
        serial: true,
        recipients: [
          {
            contact_name: "",
            contact_email: "",
            permission: "sign",
            rights: "all",
            order: recipients === undefined ? 1 : recipients.length + 1,
            assigned_color: `#${randomColor}`,
          },
        ],
      },
      config
    )
      .then((res) => {
        if (res.data.response_code === 0) {
          console.log("Recipient Added");
          Axios.get("/package/" + currPackage, config)
            .then((res) => {
              if (res.data.response_code === 0) {
                console.log(res.data.recipients);
                setRecipients(res.data.recipients);
                setDataLoading(false);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("Recipient Adding Error : ", res.data);
          setSnackbar(true);
          setAlertMessage("Couldn't add recipient");
          setAlertColor("Warning");
        }
      })
      .catch((err) => {
        console.log("Recipient Adding Error : ", err);
        setSnackbar(true);
        setAlertColor("error");
        setAlertMessage(err.error_message);
      });
  };

  const handleDelete = (index: number | undefined) => {
    if (index !== undefined) {
      const token = localStorage.getItem("AuthToken");
      console.log("Deleting recipient : " + index);
      Axios.delete("/package/" + currPackage + "/recipient/" + index, config)
        .then((res) => {
          if (res.data.response_code === 0) {
            console.log("Deleted");
            Axios.get("/package/" + currPackage, config)
              .then((res) => {
                if (res.data.response_code === 0)
                  setRecipients(res.data.recipients);
                else console.log(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            setSnackbar(true);
            setAlertColor("error");
            setAlertMessage(res.data.error_message);
          }
        })
        .catch((err) => {
          setSnackbar(true);
          setAlertColor("error");
          setAlertMessage(err.error_message);
        });
    } else {
      console.log("Invalid Id");
    }
  };

  const fileDelete = (id: number) => {
    console.log("Deleting file : " + id);
    Axios.delete("/package/" + currPackage + "/doc/" + id, config)
      .then((res) => {
        if (res.data.response_code === 0) {
          const newFiles = files.filter((file: any) => {
            return file.doc_id !== id;
          });
          setFiles(newFiles);
          var names = newFiles.map((file: any, index: number) => {
            if (index === 0) return file.doc_name;
            else return " " + file.doc_name;
          });
          setMessage({ ...message, subject: `${names}` });
        } else {
          setSnackbar(true);
          setAlertColor("error");
          setAlertMessage(res.data.error_message);
        }
      })
      .catch((err) => {
        setSnackbar(true);
        setAlertColor("error");
        setAlertMessage(err.error_message);
      });
  };

  const fileRename = (id: number, name: string) => {
    console.log("Deleting file : " + id + " " + name);
    Axios.post(
      "/package/doc/rename",
      {
        package_guid: currPackage,
        doc_id: id,
        doc_name: name,
      },
      config
    )
      .then((res) => {
        if (res.data.response_code === 0) {
          console.log("File renamed");
          var names = files.map((file: any, index: number) => {
            if (index === 0) {
              if (file.doc_id === id) return name;
              else return file.doc_name;
            } else {
              if (file.doc_id === id) return " " + name;
              else return " " + file.doc_name;
            }
          });
          setMessage({ ...message, subject: `${names}` });
          setFiles(
            files.map((file: any) => {
              if (file.doc_id === id) {
                return { ...file, doc_name: name };
              } else {
                return file;
              }
            })
          );
        } else {
          setSnackbar(true);
          setAlertColor("error");
          setAlertMessage(res.data.error_message);
        }
      })
      .catch((err) => {
        setSnackbar(true);
        setAlertColor("error");
        setAlertMessage(err.error_message);
      });
    setOpenChange(false);
  };

  const fileDownload = (id: string, name: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };

    Axios.get("/package/" + currPackage + "/doc/" + id, config)
      .then((res) => {
        console.log(res.data, "Download");

        if (res.data.response_code === 0) {
          Download(name + ".pdf", base64ToB(res.data.doc_bytes));
        }
      })
      .catch((err) => {});
  };

  const dragItem = React.useRef<any>(null);

  const dragOverItem = React.useRef<any>(null);

  const handleSort = () => {
    let _recipients = [...recipients];
    const draggedItemContent = _recipients.splice(dragItem.current, 1)[0];
    _recipients.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setRecipients(_recipients);
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newState = recipients.map((recipient: Irecipient, index2: number) => {
      if (index2 === index) {
        return { ...recipient, [e.target.name]: e.target.value };
      }
      return recipient;
    });
    setRecipients(newState);
  };

  const fileInput = (e: any) => {
    console.log("Request to add file : " + e.target.files[0]?.name);
    setDocLoading(true);
    var filename = e.target.files[0]?.name;
    const index = filename?.lastIndexOf(".");
    if (index > -1) {
      filename = filename?.slice(0, index);
    }
    const Data = new FormData();
    Data.append("document", e.target.files[0]);
    Data.append("package_guid", currPackage);
    Data.append("doc_name", filename);
    console.log(Data);
    Axios.post("/package/doc", Data, config)
      .then((res) => {
        console.log("Document uploaded : ", res.data);
        if (res.data.response_code === 0) {
          Axios.get("/package/" + currPackage + "/preview", config)
            .then((res) => {
              console.log("Getting documents");
              if (res.data.response_code === 0) {
                setDocLoading(false);
                setFiles(res.data.thumbnails);
                var names = res.data.thumbnails.map(
                  (file: any, index: number) => {
                    if (index === 0) return file.doc_name;
                    else return " " + file.doc_name;
                  }
                );
                setMessage({ ...message, subject: `${names}` });
              } else {
                setDocLoading(false);
                console.log(res.data);
              }
            })
            .catch((err) => {
              console.log(err);
              setDocLoading(false);
            });
        } else {
          setDocLoading(false);
          setSnackbar(true);
          setAlertColor("error");
          setAlertMessage(res.data.error_message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setDataLoading(false);
    e.target.files = undefined;
  };

  const [snackbar, setSnackbar] = useState<boolean>(false);

  const [alertMessage, setAlertMessage] = useState<string>("");

  const [alertColor, setAlertColor] = useState<string>("");

  const handleContinue = () => {
    setDataLoading(true);
    var error = false;
    console.log("Handling continue");
    if (
      message.subject === "" ||
      files.length === 0 ||
      recipients.length === 0
    ) {
      if (message.subject === "") {
        setSnackbar(true);
        setAlertMessage("Package Name is required");
        setAlertColor("warning");
        setDataLoading(false);
      } else if (files.length === 0) {
        setSnackbar(true);
        setAlertMessage("Files are required");
        setAlertColor("warning");
        setDataLoading(false);
      } else {
        setSnackbar(true);
        setAlertMessage("Recipients are required");
        setAlertColor("warning");
        setDataLoading(false);
      }
    } else {
      Axios.post(
        "/package/subject",
        {
          package_guid: currPackage,
          package_name: message.subject,
          email_msg: message.body,
        },
        config
      )
        .then((res) => {
          if (res.data.response_code === 0) {
            console.log("Subject added");
            recipients.map((recipient, index) => {
              if (!error) {
                if (recipient.contact_name === "") {
                  error = true;
                  setSnackbar(true);
                  setAlertMessage("Contact Name is required");
                  setAlertColor("error");
                } else if (recipient.contact_email === "") {
                  error = true;
                  setSnackbar(true);
                  setAlertMessage("Contact Email is required");
                  setAlertColor("error");
                } else {
                  Axios.post(
                    "/package/recipient/replace",
                    {
                      package_guid: currPackage,
                      recipient_id: recipient.recipient_id,
                      contact_name: recipient.contact_name,
                      contact_email: recipient.contact_email,
                      order: index + 1,
                      rights: recipient.right,
                      permission: recipient.permission,
                    },
                    config
                  )
                    .then((res) => {
                      if (res.data.response_code === 0)
                        console.log(
                          "Recipient added : " + recipient.contact_name
                        );
                      if (index === recipients.length - 1) {
                        navigate("/prepare/editor");
                      } else {
                        setSnackbar(true);
                        setAlertMessage(
                          "Couldn't add recipient" + recipient.contact_name
                        );
                        setAlertColor("error");
                        error = true;
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              }
            });
          } else {
            error = true;
            setSnackbar(true);
            setAlertMessage("Couldn't add Subject");
            setAlertColor("error");
            setDataLoading(false);
          }
          setDataLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setSnackbar(true);
          setAlertMessage(err.error_message);
          setAlertColor("error");
          setDataLoading(false);
        });
    }
  };

  const handlePackageClose = () => {
    setDataLoading(true);
    Axios.post(
      "/package/subject",
      {
        package_guid: currPackage,
        package_name: message.subject,
        email_msg: message.body,
      },
      config
    )
      .then((res) => {
        if (res.data.response_code === 0) {
          console.log("Subject added");
          recipients.map((recipient, index) => {
            Axios.post(
              "/package/recipient/replace",
              {
                package_guid: currPackage,
                recipient_id: recipient.recipient_id,
                contact_name: recipient.contact_name,
                contact_email: recipient.contact_email,
                order: index + 1,
                rights: recipient.right,
                permission: recipient.permission,
              },
              config
            )
              .then((res) => {
                if (res.data.response_code === 0) {
                  console.log("Recipient added : " + recipient.contact_name);
                } else {
                  console.log("Recipient Add Error : ", res.data);
                }
              })
              .catch((err) => {
                console.log(err);
              });
            if (index === recipients.length - 1) {
              TempPackSet(2);
              navigate("//drafts");
            }
          });
        } else {
          setSnackbar(true);
          setAlertMessage("Couldn't add Subject");
          setAlertColor("error");
        }
        setDataLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setSnackbar(true);
        setAlertMessage(err.error_message);
        setAlertColor("error");
        setDataLoading(false);
      });
  };

  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 20,
    p: "1rem",
    textAlign: "center",
  };
  return (
    <>
      <div className="prepare-container">
        {dataLoading && (
          <div
            style={{
              backgroundColor: "rgb(80, 80, 80, 0.25)",
              paddingTop: "17%",
              position: "fixed",
              zIndex: 9999,
              width: "100%",
              height: "100%",
              color: "white",
            }}
          >
            <CircularProgress color="success" size={80} />
            <Typography
              fontWeight="bold"
              sx={{ fontSize: 35, color: "#1b5e20", mt: 4 }}
            >
              KhatimDoc
            </Typography>
          </div>
        )}
        <Modal
          open={openChange}
          onClose={() => {
            setOpenChange(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style2}>
            <Typography id="modal-modal-title" variant="h6">
              Rename Document
            </Typography>
            <TextField
              sx={{ mt: 2, mb: 2 }}
              variant="outlined"
              fullWidth
              color="success"
              label="New Name"
              name="doc_name"
              value={selectedDoc?.doc_name}
              onChange={(e) => {
                setSelectedDoc({
                  ...selectedDoc,
                  [e.target.name]: e.target.value,
                });
              }}
            />
            <Button
              variant="contained"
              sx={{
                mr: 1,
                bgcolor: "rgb(240, 240, 240)",
                [`&:hover`]: { bgcolor: "#cfcfcf" },
                color: "black",
              }}
              onClick={() => {
                setOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="success"
              variant="contained"
              onClick={() => {
                fileRename(selectedDoc.doc_id, selectedDoc.doc_name);
              }}
              sx={{
                ml: 1,
                bgcolor: "#c6ff00",
                [`&:hover`]: { bgcolor: "#d1ff33" },
                color: "black",
              }}
            >
              Change
            </Button>
          </Box>
        </Modal>
        <Accordion
          disableGutters={true}
          sx={{
            bgcolor: "rgb(245, 245, 245)",
            paddingLeft: "12%",
            paddingRight: "12%",
            paddingTop: 1,
            paddingBottom: 1,
          }}
          expanded={expanded1}
          onChange={() => {
            setExpanded1(!expanded1);
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography
              sx={{ flexShrink: 0, fontWeight: "bold", fontSize: 28 }}
              variant="h5"
            >
              Add Documents
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} sx={{ height: "100%" }}>
              {files?.map((file: any, index: number) => {
                return (
                  <Grid item md={3} sm={6} xs={12} key={file.doc_id}>
                    {
                      <RenderCard
                        file={file}
                        fileDelete={fileDelete}
                        fileDownload={fileDownload}
                        setOpenChange={setOpenChange}
                        setSelectedDoc={setSelectedDoc}
                      />
                    }
                  </Grid>
                );
              })}
              {docLoading && (
                <Grid item md={3} sm={6} xs={12}>
                  <Card
                    sx={{
                      marginTop: 0.5,
                      minWidth: 220,
                      maxWidth: 220,
                      minHeight: 220,
                      maxHeight: 220,
                    }}
                  >
                    <CardContent
                      sx={{
                        alignItems: "center",
                        width: 220,
                        height: 220,
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                      }}
                    >
                      <CircularProgress color="success" />
                    </CardContent>
                  </Card>
                </Grid>
              )}
              <Grid item md={3} sm={6} xs={12}>
                <Card
                  sx={{
                    marginTop: 0.5,
                    minWidth: 220,
                    maxWidth: 220,
                    minHeight: 220,
                    maxHeight: 220,
                  }}
                >
                  <CardContent
                    sx={{
                      alignItems: "center",
                      marginTop: 2,
                      width: 220,
                      height: 220,
                    }}
                  >
                    <IconButton sx={{ marginBottom: 1 }} component="label">
                      <UploadFile
                        color="success"
                        sx={{ width: 60, height: 60 }}
                      />
                      <input
                        multiple
                        hidden
                        accept="application/pdf"
                        type="file"
                        onSubmit={fileInput}
                      />
                    </IconButton>
                    <Typography variant="subtitle2" sx={{}}>
                      Upload files to continue
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      component="label"
                      sx={{ width: "70%", marginTop: 2 }}
                    >
                      Upload
                      <input
                        multiple
                        hidden
                        accept="application/pdf"
                        type="file"
                        value={""}
                        onChange={fileInput}
                      />
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          disableGutters={true}
          sx={{
            bgcolor: "rgb(245, 245, 245)",
            paddingLeft: "12%",
            paddingRight: "12%",
            paddingTop: 1,
            paddingBottom: 1,
          }}
          expanded={expanded2}
          onChange={() => {
            setExpanded2(!expanded2);
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography
              sx={{ flexShrink: 0, fontWeight: "bold", fontSize: 28 }}
              variant="h5"
            >
              Add Recipients
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{ alignItems: "left", margin: 0, pt: 0, pb: 0, pr: 0 }}
          >
            {recipients?.map((recipient: Irecipient, index: number) => {
              return (
                <div
                  className="form"
                  key={index}
                  draggable
                  onDragStart={(e) => (dragItem.current = index)}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="form-dragzone">
                    <Button aria-label="settings">
                      <MenuIcon color="success" />
                    </Button>
                  </div>
                  <div className="form-bar">
                    <CircleTwoToneIcon
                      sx={{
                        width: 24,
                        height: "auto",
                        color: recipient?.assigned_color,
                      }}
                    />
                  </div>
                  <div className="form-index-container">
                    <div className="form-index">{index + 1}</div>
                  </div>
                  <div className="form-inputs">
                    <TextField
                      sx={{ marginRight: 1, width: "50%" }}
                      value={recipient.contact_name}
                      onChange={(e: any) => {
                        onChange(e, index);
                      }}
                      size="small"
                      color={"success"}
                      label="Name"
                      name="contact_name"
                      required
                      variant="outlined"
                      error={
                        recipient.contact_name.length < 3 &&
                        recipient.contact_name !== ""
                      }
                    />
                    <TextField
                      id="outlined-basic"
                      sx={{ marginLeft: 1, width: "50%" }}
                      value={recipient.contact_email}
                      onChange={(e: any) => {
                        onChange(e, index);
                      }}
                      size="small"
                      color={"success"}
                      label="Email"
                      name="contact_email"
                      required
                      variant="outlined"
                    />
                  </div>
                  <div className="form-button">
                    <Button
                      aria-label="settings"
                      onClick={() => {
                        handleDelete(recipient?.recipient_id);
                      }}
                    >
                      <DeleteIcon color="success" />
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button
              sx={{ marginTop: 2 }}
              color="success"
              variant="contained"
              onClick={AddRecipients}
            >
              Add Recipient
            </Button>
          </AccordionDetails>
        </Accordion>
        <Accordion
          disableGutters={true}
          sx={{
            bgcolor: "rgb(245, 245, 245)",
            paddingLeft: "12%",
            paddingRight: "12%",
            paddingTop: 1,
            paddingBottom: 1,
          }}
          expanded={expanded3}
          onChange={() => {
            setExpanded3(!expanded3);
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography
              sx={{ flexShrink: 0, fontWeight: "bold", fontSize: 28 }}
              variant="h5"
            >
              Package Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form className="message-form">
              <TextField
                id="outlined-basic"
                sx={{ marginBottom: 2, marginRight: 2 }}
                name="subject"
                onChange={(e: any) => {
                  setMessage({ ...message, [e.target.name]: e.target.value });
                }}
                value={message.subject}
                fullWidth
                size="small"
                color={"success"}
                label="Name"
                required
                variant="outlined"
              />
              <TextField
                id="outlined-basic"
                sx={{ marginTop: 2, marginRight: 2 }}
                name="body"
                onChange={(e: any) => {
                  setMessage({ ...message, [e.target.name]: e.target.value });
                }}
                value={message.body}
                multiline
                rows={5}
                fullWidth
                size="small"
                color={"success"}
                label="Message to recipients"
                variant="outlined"
              />
            </form>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="form-actions">
        <DeleteModal
          dmOpen={dmOpen}
          setDMOpen={setDMOpen}
          handleContinue={deletePackage}
          message={"This will delete the package."}
        />
        <Button
          variant="contained"
          sx={{
            marginRight: 1,
            width: "8%",
            bgcolor: "rgb(240, 240, 240)",
            [`&:hover`]: { bgcolor: "#cfcfcf" },
            color: "black",
          }}
          onClick={() => {
            handlePackageClose();
            clearPack();
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          sx={{
            marginRight: 1,
            ml: 1,
            width: "8%",
            bgcolor: "rgb(240, 240, 240)",
            [`&:hover`]: { bgcolor: "#cfcfcf" },
            color: "black",
          }}
          onClick={() => {
            setDMOpen(!dmOpen);
          }}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{
            marginLeft: 1,
            width: "9%",
            bgcolor: "#c6ff00",
            [`&:hover`]: { bgcolor: "#d1ff33" },
            color: "black",
            fontFamily: "Roboto, sans-serif",
            fontWeight: "600",
          }}
          onClick={() => {
            handleContinue();
          }}
          endIcon={<ChevronRightIcon />}
        >
          Continue
        </Button>
      </div>
      <Snackbar
        open={snackbar}
        setOpen={setSnackbar}
        message={alertMessage}
        alert={alertColor}
      />
    </>
  );
};

export default PreparePackage;
