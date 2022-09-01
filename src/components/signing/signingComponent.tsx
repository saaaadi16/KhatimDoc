import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link, Element, animateScroll } from "react-scroll";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { PackageContext } from "../../services/packageContext";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { TurnedIn, ExpandMore } from "@mui/icons-material";
import {
  Button,
  TextField,
  Card,
  CardMedia,
  Typography,
  CircularProgress,
} from "@mui/material";
import "./signing.css";
import Axios from "../../services/axios";
import Snackbar from "../snackbar/Snackbar";
import { clearPack } from "../../utils/GetRouterState";
import logo from "../../assets/icon.png";

interface DocProps {
  doc_id: number;
  page_no: number;
  doc_image: string;
  doc_name: string;
}

const fields = [
  {
    type: "E-Sign",
    width: 200,
    height: 100,
    color: "rgb(250, 255, 103, 0.8)",
  },
  {
    type: "D-Sign",
    width: 200,
    height: 100,
    color: "rgb(250, 255, 103, 0.8)",
  },
  { type: "Date Signed", width: 100, height: 60 },
  { type: "Text", width: 250, height: 150 },
];

const SigningComponent = () => {
  const loaded = useRef(false);

  const [docs, setDocs] = useState<DocProps[]>([]);

  const [expanded, setExpanded] = React.useState<boolean | string>("document1");

  const { packageId, sessionId } = useParams();

  const [icons, setIcons] = useState<any[]>([]);

  const { currPackage, setCurrPackage, recipient, setRecipient } =
    useContext(PackageContext);

  const signed = useRef(true);

  const navigate = useNavigate();

  const [current, setCurrent] = useState<any>();

  const [selectedIcon, setSelectedIcon] = useState<any>();

  const [value, setValue] = useState("START");

  const [snackbar, setSnackbar] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  const [alertColor, setAlertColor] = useState("");

  const [dataLoading, setDataLoading] = useState(false);

  const [doclist, setDoclist] = useState<any[]>([]);

  const [highlight, setHighlight] = useState<any>({});

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
    },
  };

  const fetchDataJWT = () => {
    Axios.get(
      "/package/" +
        packageId +
        "/recipient/" +
        recipient.recipient_id +
        "/field",
      config
    )
      .then((res) => {
        if (res.data.response_code === 0) {
          console.log("Icons : ", res.data);
          setCurrent(res.data.fields[0]);
          Axios.get(
            "/package/" + packageId + "/images/all/resolution/full",
            config
          )
            .then((res) => {
              if (res.data.response_code === 0) {
                console.log("Docs : ", res.data);
                setDocs(res.data.doc_images);
              } else console.log("Response : ", res.data);
              Axios.get(
                `/package/${packageId}/session/${recipient.session_id}/thumbnails/all`,
                { headers: {} }
              )
                .then((res) => {
                  if (res.data.response_code === 0) {
                    console.log("Setting Thumbnails docs : ", res.data);
                    setDoclist(res.data.docs);
                    setDataLoading(false);
                  } else {
                    console.log("Response : ", res.data);
                    setDataLoading(false);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setDataLoading(false);
                });
            })
            .catch((err) => {
              setSnackbar(true);
              setAlertMessage(err.message);
              setAlertColor("error");
              setDataLoading(false);
            });
          res.data.fields?.map((field: any) => {
            if (field.processed === true && signed.current === true)
              signed.current = true;
            else signed.current = false;
          });
          console.log("Signed:" + signed.current);
          setIcons(res.data.fields);
        } else {
          console.log("Response : ", res.data);
          setDataLoading(false);
        }
      })
      .catch((err) => {
        console.log("Error Response : ", err);
        setDataLoading(false);
      });
  };

  const fetchDataSession = () => {
    Axios.get(`/package/${packageId}/session/${sessionId}`, {
      headers: { Authorization: `${sessionId}` },
    })
      .then((res) => {
        if (res.data.response_code === 0) {
          setCurrPackage(res.data.package_name);
          setRecipient(res.data.recipient);
          setDocs(res.data.doc_images);
          setIcons(res.data.fields);
          console.log("Package : ", res.data.package_name);
          console.log("Fields: ", res.data.fields);
          setCurrent(res.data.fields[0]);
          res.data.fields.map((field: any) => {
            if (field.processed === true && signed.current === true)
              signed.current = true;
            else signed.current = false;
          });
          console.log("Signed:" + signed.current);
        } else console.log("Response : ", res.data);
        setDataLoading(false);
      })
      .catch((err) => {
        console.log("Error Response : ", err);
      });
    Axios.get(`/package/${packageId}/session/${sessionId}/thumbnails/all`)
      .then((res) => {
        if (res.data.response_code === 0) {
          console.log("Setting Thumbnails docs ");
          setDoclist(res.data.docs);
        } else console.log("Response : ", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (loaded.current === false) {
      setDataLoading(true);
      console.log("Package : " + packageId);
      console.log("Session : " + sessionId);
      if (sessionId === "0") fetchDataJWT();
      else if (sessionId !== "0") fetchDataSession();
    }
  }, []);

  const handleSign = (icon: any) => {
    setDataLoading(true);
    if (sessionId !== "0") {
      Axios.put(
        "/package/doc/recipient/field/serversign",
        {
          package_guid: packageId,
          doc_id: icon.doc_id,
          field_id: icon.field_id,
          recipient_id: recipient.recipient_id,
        },
        { headers: { Authorization: "", session_id: `${sessionId}` } }
      )
        .then((res) => {
          if (res.data.response_code === 0) {
            setSnackbar(true);
            setAlertMessage("Signature Successfully Signed with SessionId");
            setAlertColor("success");
            signed.current = true;
            Axios.get(
              `/package/${packageId}/doc/${icon.doc_id}/pageno/${icon.page_no}/full/${sessionId}`
            )
              .then((res) => {
                if (res.data.response_code === 0) {
                  var newDocs = docs.map((doc) => {
                    if (
                      doc.doc_id === res.data.doc_image.doc_id &&
                      doc.page_no === res.data.doc_image.page_no
                    ) {
                      doc.doc_image = res.data.doc_image.doc_image;
                      return doc;
                    } else return doc;
                  });
                  var newIcons = icons.map((icon2) => {
                    if (icon2.field_id === icon.field_id)
                      icon2.processed = true;
                    return icon2;
                  });
                  setIcons(newIcons);
                  setDocs(newDocs);
                  setDataLoading(false);
                } else {
                  setSnackbar(true);
                  setAlertColor("warning");
                  setAlertMessage(res.data.error_message);
                  setDataLoading(false);
                }
              })
              .catch((err) => {
                setDataLoading(false);
                setSnackbar(true);
                setAlertColor("warning");
                setAlertMessage(err.error_message);
              });
          } else {
            console.log("Error Response : ", res.data);
            setSnackbar(true);
            setAlertMessage("Signature Failed");
            setAlertColor("error");
            setDataLoading(false);
          }
        })
        .catch((err) => {
          console.log("Error Response : ", err);
          setDataLoading(false);
          setSnackbar(true);
          setAlertMessage("Signature Failed");
          setAlertColor("error");
        });
    } else if (icon.field_type === "D-Sign") {
      console.log(
        "Sending data to server",
        "guid: " + packageId,
        "doc_id: " + icon.doc_id,
        "field_id: " + icon.field_id,
        "recipient_id: " + recipient.recipient_id
      );
      Axios.put(
        "/package/doc/recipient/field/serversign",
        {
          package_guid: packageId,
          doc_id: icon.doc_id,
          field_id: icon.field_id,
          recipient_id: recipient.recipient_id,
        },
        config
      )
        .then((res) => {
          if (res.data.response_code === 0) {
            signed.current = true;
            setSnackbar(true);
            setAlertMessage("Signature Successfully Signed");
            setAlertColor("success");
            Axios.get(
              `/package/${packageId}/doc/${icon.doc_id}/pageno/${icon.page_no}/full`,
              config
            ).then((res) => {
              if (res.data.response_code === 0) {
                console.log("New Image Recieved", res.data);
                var newDocs = docs.map((doc) => {
                  if (
                    doc.doc_id === res.data.doc_image.doc_id &&
                    doc.page_no === res.data.doc_image.page_no
                  ) {
                    doc.doc_image = res.data.doc_image.doc_image;
                    return doc;
                  } else return doc;
                });
                setDocs(newDocs);
              } else console.log("Response : ", res.data);
              setDataLoading(false);
            });
            Axios.get(
              "/package/" +
                packageId +
                "/recipient/" +
                recipient.recipient_id +
                "/field",
              config
            )
              .then((res) => {
                if (res.data.response_code === 0) {
                  console.log("Icons : ", res.data.fields);
                  setIcons(res.data.fields);
                  signed.current = true;
                }
              })
              .catch((err) => {
                console.log("Response : ", err);
              });
          } else {
            setDataLoading(false);
            console.log("Response : ", res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (icon.field_type === "E-Sign") {
      console.log(
        "Sending data to server",
        "guid: " + packageId,
        "doc_id: " + icon.doc_id,
        "field_id: " + icon.field_id,
        "recipient_id: " + recipient.recipient_id
      );
      Axios.put(
        "/package/doc/recipient/field/serversign",
        {
          package_guid: packageId,
          doc_id: icon.doc_id,
          field_id: icon.field_id,
          recipient_id: recipient.recipient_id,
          e_sign_text: recipient.contact_name,
        },
        config
      )
        .then((res) => {
          if (res.data.response_code === 0) {
            signed.current = true;
            setSnackbar(true);
            setAlertMessage("Signature Successfully Signed");
            setAlertColor("success");
            Axios.get(
              `/package/${packageId}/doc/${icon.doc_id}/pageno/${icon.page_no}/full`,
              config
            ).then((res) => {
              if (res.data.response_code === 0) {
                console.log("New Image Recieved", res.data);
                var newDocs = docs.map((doc) => {
                  if (
                    doc.doc_id === res.data.doc_image.doc_id &&
                    doc.page_no === res.data.doc_image.page_no
                  ) {
                    doc.doc_image = res.data.doc_image.doc_image;
                    return doc;
                  } else return doc;
                });
                setDocs(newDocs);
              } else console.log("Response : ", res.data);
              setDataLoading(false);
            });
            Axios.get(
              "/package/" +
                packageId +
                "/recipient/" +
                recipient.recipient_id +
                "/field",
              config
            )
              .then((res) => {
                if (res.data.response_code === 0) {
                  console.log("Icons : ", res.data.fields);
                  setIcons(res.data.fields);
                  signed.current = true;
                }
              })
              .catch((err) => {
                console.log("Response : ", err);
              });
          } else {
            setDataLoading(false);
            console.log("Response : ", res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleFinish = () => {
    if (signed.current === true) {
      if (sessionId === "0") {
        Axios.get("/package/" + packageId + "/finish", config).then((res) => {
          if (res.data.response_code === 0) {
            setCurrPackage("");
            clearPack();
            navigate("//inbox");
          } else {
            setSnackbar(!snackbar);
            setAlertColor("warning");
            setAlertMessage(res.data.error_message);
          }
        });
      } else {
        Axios.get("/package/" + packageId + "/finish", {
          headers: { Authorization: "", session_id: `${sessionId}` },
        })
          .then((res) => {
            if (res.data.response_code === 0) {
              setCurrPackage("");
              setSnackbar(!snackbar);
              setAlertColor("success");
              setAlertMessage("Package Signing Completed");
              setTimeout(() => {
                window.close();
              }, 2000);
            } else {
              setSnackbar(!snackbar);
              setAlertColor("warning");
              setAlertMessage(res.data.error_message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      setSnackbar(!snackbar);
      setAlertColor("warning");
      setAlertMessage("Please first sign to complete the process.");
    }
  };

  const handleChange = (e: any, icon1: any) => {
    setIcons(
      icons.map((icon: any) => {
        if (
          icon.field_coords === icon1.field_coords &&
          icon.page_no === icon1.page_no
        ) {
          icon.field_value = e.target.value;
          return icon;
        } else return icon;
      })
    );
  };

  const handleNav = () => {
    if (value !== "FINISH") {
      var index2: number = -1;
      var icon2;
      icons.filter((icon: any, index: number) => {
        if (icon.field_id === current.field_id) return (index2 = index);
      });
      setSelectedIcon(icons[index2]);
      if (icons.length === index2 + 1) {
        icons.find((icon: any) => {
          if (icon.processed === false) {
            icon2 = icon;
            return true;
          }
        });
        if (icon2) {
          setCurrent(icon2);
        } else {
          setValue("FINISH");
          setCurrent(null);
        }
      } else if (index2 === 0) {
        icons.find((icon: any, index: number) => {
          if (icon.processed === false && index > 0) {
            icon2 = icon;
            return true;
          }
        });
        if (icon2) {
          setCurrent(icon2);
          setValue("NEXT");
        } else {
          setValue("FINISH");
          setCurrent(null);
        }
      } else {
        icons.find((icon: any, index: number) => {
          if (icon.processed === false && index > index2) {
            icon2 = icon;
            return true;
          }
        });
        if (icon2) {
          setCurrent(icon2);
        } else {
          icons.find((icon: any) => {
            if (icon.processed === false) {
              icon2 = icon;
              return true;
            }
          });
          if (icon2) {
            setCurrent(icon2);
          } else {
            setValue("FINISH");
            setCurrent(null);
          }
        }
      }
    }
  };

  const checkPage = (docId: number, pageNo: number): Boolean => {
    var icon2 = icons.filter((icon) => {
      if (icon.doc_id === docId && icon.page_no === pageNo) return icon;
    })[0];
    if (icon2 !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  const checkDoc = (docId: number): Boolean => {
    var icon2 = icons.filter((icon) => {
      if (icon.doc_id === docId) return icon;
    })[0];
    if (icon2 !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  const handleChangeAccordion =
    (panel: any) => (event: any, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div className="signing-page">
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
      <div className="signing-topbar">
        <div className="topbar-heading">Package : {currPackage}</div>
        <div
          style={{
            textAlign: "right",
            alignItems: "center",
            margin: "5px 20px 5px auto",
            width: "50%",
          }}
        >
          {sessionId === "0" && (
            <Button
              variant="contained"
              sx={{
                bgcolor: "rgb(240, 240, 240)",
                [`&:hover`]: { bgcolor: "#cfcfcf" },
                color: "black",
                width: "10%",
                mr: 1,
              }}
              onClick={() => {
                clearPack();
                navigate("//inbox");
              }}
            >
              Back
            </Button>
          )}

          <Button
            variant="contained"
            sx={{
              bgcolor: "#c6ff00",
              color: "black",
              fontWeight: "bold",
              [`&:hover`]: { bgcolor: "#d1ff33" },
              width: "10%",
              ml: 0.5,
            }}
            onClick={() => {
              handleFinish();
            }}
          >
            Finish
          </Button>
        </div>
      </div>
      <div className="signing-container">
        <Link
          to={`doc${current?.doc_id}${current?.page_no}`}
          containerId="pages-container"
          smooth={true}
          offset={parseInt(current?.field_coords.split(",")[1]) - 10}
        >
          <span
            style={{
              position: "fixed",
              left: "3%",
              top: "8%",
              zIndex: 9999,
              backgroundColor: "#ffe642",
              color: "black",
              fontWeight: "bold",
              padding: "5px",
              width: "6rem",
              fontSize: "1.12rem",
              cursor: "pointer",
              borderRadius: "4px",
            }}
            onClick={handleNav}
          >
            {value}
          </span>
        </Link>
        <div className="signing-documents" id="pages-container">
          {docs.map((doc: DocProps, index: number) => {
            return (
              <Element name={`doc${doc.doc_id}${doc.page_no}`}>
                <div
                  id={`doc${doc.doc_id}${doc.page_no}`}
                  style={{
                    backgroundImage: `url('data:image/png;base64,${doc.doc_image}')`,
                    position: "relative",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    marginBottom: 40,
                    height: 1340,
                    width: 946,
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      bottom: "0",
                      fontFamily: "Roboto, Sans-Serif",
                      left: "0",
                      marginBottom: "-23px",
                      marginLeft: "5px",
                      fontSize: "15px",
                    }}
                  >
                    {doc.doc_name}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      bottom: "0",
                      fontFamily: "Roboto, Sans-Serif",
                      right: "0",
                      marginBottom: "-23px",
                      marginLeft: "5px",
                      fontSize: "15px",
                    }}
                  >
                    Page {doc.page_no}
                  </span>
                  {icons
                    ?.filter((icon: any) => {
                      return (
                        icon.doc_id === doc.doc_id &&
                        icon.page_no === doc.page_no
                      );
                    })
                    ?.map((icon: any) => {
                      const field: any = fields.find((field: any) => {
                        return field.type === icon.field_type;
                      });
                      const coordinates = icon.field_coords.split(",");
                      if (icon.processed === false) {
                        var background = "";
                        if (
                          selectedIcon === icon &&
                          selectedIcon !== undefined
                        ) {
                          background = "rgb(165 225 0)";
                        } else background = field.color;
                        return (
                          <Element
                            name={`icon${icon.doc_id}${icon.page_no}${icon.field_coords}`}
                          >
                            <span
                              style={{
                                backgroundColor: background,
                                width: `${coordinates[2]}px`,
                                height: `${coordinates[3]}px`,
                                position: "absolute",
                                display: "flex",
                                justifyContent: "center",
                                marginLeft: `${coordinates[0]}px`,
                                marginTop: `${coordinates[1]}px`,
                                borderRadius: "0.2rem",
                                color: "black",
                                border: "3px solid rgb(0, 142, 2)",
                                overflow: "hidden",
                              }}
                              onClick={() => {
                                handleSign(icon);
                              }}
                            >
                              <img
                                src={logo}
                                alt={"logo"}
                                width={30}
                                height={30}
                                style={{
                                  position: "absolute",
                                  top: "0",
                                  left: "0",
                                }}
                              />
                              {icon.field_type === "D-Sign" ||
                              icon.field_type === "E-Sign" ? (
                                <>
                                  <Typography
                                    sx={{
                                      cursor: "pointer",
                                      width: "100%",
                                      fontSize: "1.2rem",
                                      fontWeight: 100,
                                      opacity: 0.9,
                                      textAlign: "center",
                                      padding: "5px",
                                      mt: "15px",
                                    }}
                                  >
                                    Click to {icon.field_type}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      cursor: "pointer",
                                      width: "100%",
                                      fontSize: "1.4rem",
                                      opacity: 0.9,
                                      textAlign: "center",
                                      position: "absolute",
                                      bottom: 0,
                                      left: 0,
                                    }}
                                  >
                                    X_____________
                                  </Typography>
                                </>
                              ) : icon.field_type === "Date Signed" ? (
                                <TextField
                                  sx={{
                                    width: "100%",
                                    mt: "auto",
                                  }}
                                  placeholder={icon.field_type}
                                  variant="filled"
                                  onChange={(e) => {
                                    handleChange(e, icon);
                                  }}
                                  value={icon.field_value}
                                />
                              ) : (
                                <TextareaAutosize
                                  value={icon.field_value}
                                  onChange={(e) => {
                                    handleChange(e, icon);
                                  }}
                                  minRows={3}
                                  placeholder="Text"
                                  style={{
                                    width: "100%",
                                    backgroundColor: "transparent",
                                    outline: "none",
                                    maxHeight: `${field.height}px`,
                                  }}
                                />
                              )}
                            </span>
                          </Element>
                        );
                      } else return <></>;
                    })}
                </div>
              </Element>
            );
          })}
        </div>
        <div className="right-panel">
          {doclist.map((thisdoc: any, dindex: number) => {
            return (
              <Accordion
                expanded={expanded === `document${dindex + 1}`}
                onChange={handleChangeAccordion(`document${dindex + 1}`)}
                sx={{
                  border: "none",
                  boxShadow: "none",
                  width: "100%",
                }}
                disableGutters
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    bgcolor: "rgb(241, 241, 241)",
                    borderBottom: "1px solid rgb(231,231,231)",
                    width: "100%",
                  }}
                >
                  {checkDoc(thisdoc?.thumbnails[0].doc_id) && (
                    <TurnedIn
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        mt: -0.6,
                        ml: -0.2,
                        color: "#ffe642",
                      }}
                    />
                  )}
                  <Typography sx={{ textAlign: "center" }}>
                    {thisdoc.doc_name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    bgcolor: "rgb(251, 251, 251)",
                    borderBottom: "1px solid rgb(231,231,231)",
                    width: "100%",
                    display: "flex",
                  }}
                >
                  <div className="listing-pages">
                    {thisdoc?.thumbnails?.map((image: any) => {
                      return (
                        <div
                          style={{
                            width: "80%",
                            marginBottom: 15,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          {checkPage(image.doc_id, image.page_no) && (
                            <TurnedIn
                              sx={{
                                position: "absolute",
                                left: "20%",
                                mt: 0.5,
                                color: "#ffe642",
                              }}
                            />
                          )}
                          <Link
                            to={`doc${image.doc_id}${image.page_no}`}
                            containerId="pages-container"
                            smooth={true}
                          >
                            <Card sx={{ maxWidth: 170, mt: 1 }}>
                              <CardMedia
                                component="img"
                                alt="Document Thumbnail"
                                height="auto"
                                width="150"
                                src={`data:image/png;base64,${image.doc_thumbnail}`}
                              />
                            </Card>
                            <div style={{ marginBottom: "0.5rem" }}>
                              {image.page_no}
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
        {/*  */}
      </div>
      <Snackbar
        open={snackbar}
        setOpen={setSnackbar}
        message={alertMessage}
        alert={alertColor}
      />
    </div>
  );
};

export default SigningComponent;
