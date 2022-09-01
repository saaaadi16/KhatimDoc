import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, Element } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import { PackageContext } from "../../services/packageContext";
import { useCookies } from "react-cookie";
import Snackbar from "../snackbar/Snackbar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import { Send } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import CalendarTodayTwoToneIcon from "@mui/icons-material/CalendarTodayTwoTone";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Axios from "../../services/axios";
import DeleteModal from "../modal/DeleteModal";
import {
  Card,
  CardMedia,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  Tooltip,
  Icon,
  getOffsetLeft,
} from "@mui/material";
import {
  TextFieldsTwoTone,
  ExpandMore,
  ShortText,
  InfoOutlined,
  TurnedIn,
  AspectRatioTwoTone,
} from "@mui/icons-material";
import Box from "@mui/material/Box";
import "./editor.css";
import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
import { TempPackSet } from "../../utils/GetRouterState";

interface ItemProps {
  id: number;
  icon: any;
  name: string;
  recipientid?: number;
  ml?: number;
  mt?: number;
  width?: number;
  height?: number;
  doc?: number;
  page?: number;
}

const pallet: ItemProps[] = [
  {
    id: 0,
    name: "D-Sign",
    icon: <EditTwoToneIcon sx={{ width: 28, height: 28 }} />,
  },
  {
    id: 1,
    name: "E-Sign",
    icon: <ShortText sx={{ width: 28, height: 28 }} />,
  },
  // {
  //   id: 2,
  //   name: "Date Signed",
  //   icon: <CalendarTodayTwoToneIcon sx={{ width: 28, height: 28 }} />,
  // },
  // {
  //   id: 3,
  //   name: "Text",
  //   icon: <TextFieldsTwoTone sx={{ width: 28, height: 28 }} />,
  // },
];

const available: ItemProps[] = [
  {
    id: 0,
    name: "D-Sign",
    icon: <EditTwoToneIcon sx={{ width: 60, height: 60 }} />,
  },
  {
    id: 1,
    name: "E-Sign",
    icon: <ShortText sx={{ width: 60, height: 60 }} />,
  },
  // {
  //   id: 2,
  //   name: "Date Signed",
  //   icon: <CalendarTodayTwoToneIcon sx={{ width: 60, height: 60 }} />,
  // },
  // {
  //   id: 3,
  //   name: "Text",
  //   icon: <TextFieldsTwoTone sx={{ width: 60, height: 60 }} />,
  // },
];

interface Irecipient {
  recipient_id?: number;
  contact_name: string;
  assigned_color: string;
  contact_email: string;
  order?: number;
  permission?: string;
  right?: string;
}
var dragY = 0;
var dragX = 0;

const StyledMenu = styled((props: any) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    width: 240,
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
  },
}));

interface AddedIconProps {
  icon: ItemProps;
}

interface docProps {
  id: number;
  name: any;
  images: [];
}

interface docProps1D {
  doc_id: number;
  page_no: number;
  doc_image: string;
  doc_name: string;
}

const Editor: React.FC<any> = (props: any) => {
  const [recipients, setRecipients] = React.useState<Irecipient[]>([]);

  const [doclist, setDoclist] = React.useState<docProps[]>([]);

  const [cookies, setCookies] = useCookies<string>(["package"]);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
    },
  };

  function DraggableIcon(id: number, icon: any, iconColor: string | undefined) {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "icon",
      item: { id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
    return (
      <div
        ref={drag}
        onDrag={(e) => {
          dragX = e.clientX;
          dragY = e.clientY;
        }}
        style={{
          color: iconColor,
        }}
      >
        {icon}
      </div>
    );
  }

  const loaded = useRef(false);

  const DraggableAddedIcon = ({ icon }: AddedIconProps) => {
    const [anchorElI, setAnchorElI] = useState<any>(null);

    const openI = Boolean(anchorElI);

    const handleCloseIcon = () => {
      setAnchorElI(null);
    };

    const handleChange = (id: number, icondragX: number, icondragY: number) => {
      const parent = document.querySelector(".editor-viewer") as HTMLElement;
      let cx = parent.offsetLeft;
      let cy = parent.offsetTop;
      let scroll: number = parent.scrollTop;
      let page: number = 0;
      let height: number = 0;
      let offsetw: number = 0;
      let offseth: number = 0;
      icon.width ? (offsetw = icon.width / 2) : (offsetw = -1);
      icon.height ? (offseth = icon.height / 2) : (offseth = -1);
      if (scroll > 0) {
        page = Math.floor((scroll + icondragY) / 1380);
        height = scroll + (icondragY - cy - 16 - offseth) - page * 1380;
      } else height = icondragY - cy - 32 - offseth;
      if (height > 1275 || height < 0) {
        height = 0;
      }
      let width: number = icondragX - cx - 32 - offsetw;
      if (width < 0 || width > 870) width = 0;

      console.log("Calculated coordinates : " + width + " " + height);
      const newIcons = pageIcons.map((icon: any) => {
        if (icon.id === id) {
          if (width) icon.ml = width;
          if (height) icon.mt = height;
        }
        return icon;
      });

      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      };

      const data = pageIcons.filter((icon: any) => icon.id === id)[0];

      let width2 = 0;
      let height2 = 0;
      if (data.name === "D-Sign" || data.name === "E-Sign") {
        width2 = 266;
        height2 = 80;
      }

      setPageIcons(newIcons);
      console.log("Icon to change :  ", data);

      Axios.put(
        "/package/doc/recipient/field",
        {
          package_guid: currPackage,
          doc_id: data.doc,
          field_id: data.id,
          field_value: "",
          field_coords: `${data.ml},${data.mt},${width2},${height2}`,
          recipient_id: data.recipientid,
          mandatory: true,
        },
        config
      )
        .then((res) => {
          if (res.data.response_code === 0) {
            console.log("Updated place");
          } else {
            setSnackbar(true);
            setAlertColor("warning");
            setAlertMessage(res.data.error_message);
          }
        })
        .catch((err) => {
          setSnackbar(true);
          setAlertColor("warning");
          setAlertMessage(err.error_message);
        });
    };

    const [{ isDragging }, drag] = useDrag(() => ({
      type: "dragicon",
      item: { id: icon.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    function makeColor(hex: string) {
      var c: any;
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length === 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        return (
          "rgba(" +
          [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
          ",0.85)"
        );
      }
      return "rgba(0, 0, 0)";
    }

    const deleteIcon = (iconb: any) => {
      Axios.delete(
        `/package/${currPackage}/doc/${iconb.doc}/recipient/${iconb.recipientid}/field/${iconb.id}`
      )
        .then((res) => {
          if (res.data.response_code === 0) {
            setSnackbar(true);
            setAlertColor("success");
            setAlertMessage("Icon deleted successfully");
            const newIcons = pageIcons.filter(
              (icon: any) => icon.id !== iconb.id
            );
            setPageIcons(newIcons);
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

    let thisrecipient = recipients.find(
      (recipient) => recipient.recipient_id === icon.recipientid
    ) as any;

    return (
      <span
        id={`icon${icon.id}`}
        style={{
          backgroundColor: makeColor(thisrecipient.assigned_color),
          position: "absolute",
          left: `${icon.ml}px`,
          top: `${icon.mt}px`,
          width: `${icon.width}px`,
          height: `${icon.height}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "beige",
        }}
      >
        <span
          key={icon.id}
          id={`${icon.id}`}
          ref={drag}
          onDragEnd={(e) => {
            handleChange(icon.id, e.clientX, e.clientY);
          }}
          style={{
            width: "70px",
            height: "70px",
            cursor: "grab",
          }}
          onMouseUp={(e) => {
            if (clicked.current === false) setAnchorElI(e.currentTarget);
          }}
        >
          {icon.icon}
        </span>
        <span
          style={{ position: "absolute", right: 0, bottom: 0 }}
          onMouseDown={(e) => {
            clicked.current = true;
            const boxes: any = document.querySelectorAll(`#icon${icon.id}`);
            console.log("boxes : ", boxes);
            var x: number = e.clientX;
            var y: number = e.clientY;
            var width = boxes[0].clientWidth;
            var height = boxes[0].clientHeight;
            var tempx: number = -1;
            var tempy: number = -1;
            onmousemove = (e) => {
              if (clicked.current) {
                tempx = e.clientX - x;
                tempy = e.clientY - y;
                if (boxes !== null && boxes !== undefined) {
                  for (var box of boxes) {
                    if (tempx + width > 75 && tempx + width < 350)
                      box.style.width = `${width + tempx}px`;
                    if (tempy + height > 75 && tempy + height < 250)
                      box.style.height = `${height + tempy}px`;
                  }
                }
              }
            };
            onmouseup = (e) => {
              if (clicked.current) {
                clicked.current = false;
                const changed = pageIcons.map((icon2: any) => {
                  if (icon2.id === icon.id) {
                    console.log(
                      "setting height : " +
                        (height + tempy) +
                        " and width : " +
                        (width + tempx)
                    );
                    icon2.width = width + tempx;
                    icon2.height = height + tempy;
                  }
                  return icon2;
                });
                setPageIcons(changed);
              }
            };
          }}
        >
          <AspectRatioTwoTone />
        </span>
        <Menu
          id="basic-menu"
          anchorEl={anchorElI}
          open={openI}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          onClose={handleCloseIcon}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              deleteIcon(icon);
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </span>
    );
  };

  const { currPackage, setCurrPackage } = useContext(PackageContext);

  const [package_name, setPackageName] = React.useState("");

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const docs = useRef<docProps1D[]>([]);

  const [dataLoading, setDataLoading] = useState(false);

  const rname = useRef<Irecipient>();

  const docid = useRef(0);

  const [snackbar, setSnackbar] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  const [alertColor, setAlertColor] = useState("");

  const [dmOpen, setDMOpen] = useState(false);

  const [highlight, setHighlight] = useState({});

  function fetchData() {
    Axios.get("/package/" + currPackage, config)
      .then((res) => {
        if (res.data.response_code === 0) {
          console.log("Recipients : ", res.data.recipients);
          setRecipients(res.data.recipients);
          setPackageName(res.data.package_name);
          rname.current = res.data.recipients[0];
          res.data.recipients.map((recipient: Irecipient) => {
            Axios.get(
              `/package/${currPackage}/recipient/${recipient.recipient_id}/field`,
              config
            )
              .then((res) => {
                if (res.data.response_code === 0) {
                  console.log(
                    `Fields for recipient ${recipient.contact_name} : `,
                    res.data.fields
                  );
                  res.data.fields.map((field: any) => {
                    const icon = available.find(
                      (icon: any) => icon.name === field.field_type
                    );
                    const newIcon: ItemProps = {
                      icon: icon?.icon,
                      id: field.field_id,
                      name: field.field_type,
                      ml: field.field_coords.split(",")[0],
                      mt: field.field_coords.split(",")[1],
                      recipientid: recipient.recipient_id,
                      doc: field.doc_id,
                      page: field.page_no,
                    };
                    setPageIcons((pageIcons: ItemProps[]) => [
                      ...pageIcons,
                      newIcon,
                    ]);
                  });
                } else console.log("Fields error response : ", res.data);
              })
              .catch((err) => {
                console.log("Fields error response:", err);
              });
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

    Axios.get("package/" + currPackage + "/images/all/resolution/full", config)
      .then((res) => {
        if (res.data.response_code === 0) {
          console.log("Good response", res.data);
          docs.current = res.data.doc_images;
          Axios.get("/package/" + currPackage + "/preview", config)
            .then((res) => {
              if (res.data.response_code === 0) {
                console.log("Preview : ", res.data.thumbnails);
                var length = res.data.thumbnails.length;
                res.data.thumbnails.map((doc: any, index: number) => {
                  console.log("Sending request for : ", doc.doc_id);
                  Axios.get(
                    "/package/" +
                      currPackage +
                      "/doc/" +
                      doc.doc_id +
                      "/thumbnail/all",
                    config
                  )
                    .then((res) => {
                      if (res.data.response_code === 0) {
                        console.log("Adding to doclist at index : ", index);
                        setDoclist((doclist) => [
                          ...doclist,
                          {
                            id: doc.doc_id,
                            name: doc.doc_name,
                            images: res.data.thumbnails,
                          },
                        ]);
                        if (index === length - 1) {
                          setDataLoading(false);
                        }
                      } else {
                        setSnackbar(true);
                        setAlertColor("error");
                        setAlertMessage(res.data.error_message);
                        console.log("Error here", res.data);
                        setDataLoading(false);
                      }
                      docid.current = doc.doc_id;
                    })
                    .catch((err) => {
                      console.log("Big error");
                      console.log(err);
                      setSnackbar(true);
                      setAlertColor("error");
                      setAlertMessage(err.message);
                      setDataLoading(false);
                    });
                });
                //setDataLoading(false);
              } else {
                console.log(res.data);
                setSnackbar(true);
                setAlertColor("error");
                setAlertMessage(res.data.error_message);
                setDataLoading(false);
              }
            })
            .catch((err) => {
              console.log(err);
              setSnackbar(true);
              setAlertColor("error");
              setAlertMessage(err.error_message);
              setDataLoading(false);
            });
        } else {
          console.log(res.data);
          setSnackbar(true);
          setAlertColor("error");
          setAlertMessage(res.data.error_message);
          setDataLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setSnackbar(true);
        setAlertColor("error");
        setAlertMessage(err.error_message);
        setDataLoading(false);
      });
    loaded.current = true;
  }

  useEffect(() => {
    if (loaded.current === false) {
      setDataLoading(true);
      console.log("Fetching Data on Editor : ");
      fetchData();
    }
    return () => {
      console.log("Unmounting");
      loaded.current = true;
    };
  }, []);

  const open = Boolean(anchorEl);

  const [pageIcons, setPageIcons] = React.useState<ItemProps[]>([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "icon",
    drop: (item) => addIconToPage(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addIconToPage = (item: any) => {
    const parent = document.querySelector(".editor-viewer") as HTMLElement;
    let cx = parent.offsetLeft;
    let cy = parent.offsetTop;
    let scrolled = parent.scrollTop;
    let iconfound: ItemProps = {
      id: 0,
      name: "",
      icon: "",
      ml: 0,
      mt: 0,
    };
    iconfound.name = available[item.id].name;
    iconfound.icon = available[item.id].icon;
    let height = dragY - cy - 16 + scrolled;
    console.log("Height: " + height);
    console.log("Page: " + Math.floor(height / 1380));
    if (height > 1412) {
      let page = height / 1380;
      page = Math.floor(page);
      height = height - page * 1380;
      iconfound.page = page;
      iconfound.mt = height - 50;
    } else {
      iconfound.mt = height - 50;
      iconfound.page = 0;
    }
    iconfound.ml = dragX - cx - 32 - 100;
    iconfound.recipientid = rname.current?.recipient_id;
    if (iconfound.name === "D-Sign" || iconfound.name === "E-Sign") {
      iconfound.height = 100;
      iconfound.width = 200;
    }
    setPageIcons((pageIcons) => [...pageIcons, iconfound]);
    console.log("Icon found : ", iconfound);
    iconfound.doc = docs.current[iconfound.page as number].doc_id;
    iconfound.page = docs.current[iconfound.page as number].page_no;
    console.log(
      "Icon registering : ",
      "package_guid:" + currPackage,
      "doc_id:" + iconfound.doc,
      "field_type: " + iconfound.name,
      "page_no:" + iconfound.page,
      "field_coords:" + iconfound.ml + "," + iconfound.mt,
      "recipient_id:" + rname.current?.recipient_id
    );
    Axios.post(
      "/package/doc/recipient/field",
      {
        package_guid: currPackage,
        doc_id: iconfound.doc,
        recipient_id: iconfound.recipientid,
        field_coords: `${iconfound.ml},${iconfound.mt},${iconfound.width},${iconfound.height}`,
        field_type: iconfound.name,
        page_no: iconfound.page,
        mandatory: true,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      }
    )
      .then((res) => {
        if (res.data.response_code === 0) {
          console.log("Field Added : ", res.data);
          iconfound.id = res.data.field_id;
          setPageIcons((pageIcons) => [...pageIcons, iconfound]);
        } else {
          console.log("Field Add Error : ", res.data);
          const newIcons = pageIcons.filter((icon) => icon.id !== iconfound.id);
          setPageIcons(newIcons);
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

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [expanded, setExpanded] = React.useState<boolean | string>("document1");

  const handleChange = (panel: any) => (event: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const deletePackage = () => {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };
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
          setAlertMessage(res.data.error_message);
          setAlertColor("error");
        }
      })
      .catch((err) => {
        console.log("Package deleting error : ", err);
      });
  };

  const sharePackage = () => {
    pageIcons.map((icon, index) => {
      console.log(
        "Sending data : " + "guid : " + currPackage,
        "field_id : " + icon.id,
        "doc_id : " + icon.doc,
        "field_coords : " +
          icon.ml +
          "," +
          icon.mt +
          "," +
          icon.width +
          "," +
          icon.height,
        "recipient_id : " + icon.recipientid
      );
      Axios.put(
        "/package/doc/recipient/field",
        {
          package_guid: currPackage,
          doc_id: icon.doc,
          field_id: icon.id,
          field_value: "",
          field_coords: `${icon.ml},${icon.mt},${icon.width},${icon.height}`,
          recipient_id: icon.recipientid,
          mandatory: true,
        },
        config
      )
        .then((res) => {
          if (res.data.response_code === 0) {
            if (index === pageIcons.length - 1) {
              Axios.get("/package/" + currPackage + "/share", config)
                .then((res) => {
                  if (res.data.response_code === 0) {
                    console.log("Package posted");
                    TempPackSet(1);
                    navigate("//sent");
                  } else {
                    console.log(res.data);
                    setSnackbar(true);
                    setAlertColor("error");
                    setAlertMessage(res.data.error_message);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  setSnackbar(true);
                  setAlertColor("error");
                  setAlertMessage(err.message);
                });
            }
          } else {
            console.log(res.data);
            setSnackbar(true);
            setAlertColor("warning");
            setAlertMessage(res.data.error_message);
          }
        })
        .catch((err) => {
          setSnackbar(true);
          setAlertColor("warning");
          setAlertMessage(err.message);
        });
    });
  };

  const checkPage = (docId: number, pageNo: number): Boolean => {
    var icon2 = pageIcons.filter((icon) => {
      if (
        icon.doc === docId &&
        icon.page === pageNo &&
        icon.recipientid === rname.current?.recipient_id
      )
        return icon;
    })[0];
    if (icon2 !== undefined) {
      return true;
    } else return false;
  };

  const checkDoc = (docId: number): Boolean => {
    var icon2 = pageIcons.filter((icon) => {
      if (
        icon.doc === docId &&
        icon.recipientid === rname.current?.recipient_id
      )
        return icon;
    })[0];
    if (icon2 !== undefined) return true;
    else return false;
  };

  const updateIcons = () => {
    pageIcons.map((icon, index) => {});
  };

  const clicked = useRef(false);

  return (
    <>
      <div className="editor-bg">
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
        <div className="package-heading">
          <Typography variant="h6" sx={{ fontSize: 16, pt: 1, mb: 1, ml: 3 }}>
            Package Name: {package_name}
          </Typography>
          <div className="editor-buttons">
            <DeleteModal
              dmOpen={dmOpen}
              setDMOpen={setDMOpen}
              handleContinue={deletePackage}
              message={"This action will delete the package."}
            />
            <Button
              variant="contained"
              sx={{
                margin: 1,
                bgcolor: "rgb(240, 240, 240)",
                [`&:hover`]: { bgcolor: "#cfcfcf" },
                color: "black",
                width: "14%",
              }}
              onClick={() => {
                navigate("/prepare");
              }}
              startIcon={<ChevronLeftIcon />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              sx={{
                margin: 1,
                marginLeft: 0,
                bgcolor: "rgb(240, 240, 240)",
                [`&:hover`]: { bgcolor: "#cfcfcf" },
                color: "black",
                width: "14%",
              }}
              onClick={() => {
                TempPackSet(2);
                navigate("//drafts");
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              sx={{
                margin: 1,
                bgcolor: "rgb(240, 240, 240)",
                [`&:hover`]: { bgcolor: "#cfcfcf" },
                marginLeft: 0,
                color: "black",
                width: "14%",
              }}
              onClick={() => {
                setDMOpen(!dmOpen);
              }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              sx={{
                margin: 1,
                marginLeft: 0,
                bgcolor: "#c6ff00",
                [`&:hover`]: { bgcolor: "#d1ff33" },
                color: "black",
                width: "14%",
                fontWeight: "bold",
              }}
              onClick={() => {
                sharePackage();
              }}
              endIcon={<Send />}
            >
              Send
            </Button>
          </div>
        </div>
        <div className="editor-container">
          <div className="editor-sidebar">
            <Button
              id="demo-customized-button"
              aria-controls={open ? "demo-customized-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              variant="outlined"
              disableElevation
              fullWidth
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon sx={{ mr: 0, ml: "auto" }} />}
              sx={{ border: "1px solid #e0e0e0", pl: 3, pr: 3 }}
            >
              <CircleTwoToneIcon
                sx={{
                  width: 16,
                  height: "auto",
                  mr: 1,
                  color: rname.current?.assigned_color,
                }}
              />
              <span style={{ marginLeft: 0, marginRight: "auto" }}>
                {rname.current?.contact_name}
              </span>
            </Button>
            <Divider />
            <StyledMenu
              id="demo-customized-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {recipients?.map((recipient: Irecipient, index: number) => {
                return (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      rname.current = recipient;
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <CircleTwoToneIcon
                        sx={{
                          width: 16,
                          height: "auto",
                          mr: 1,
                          color: recipient.assigned_color,
                        }}
                      />
                    </ListItemIcon>
                    <Typography variant="inherit">
                      {recipient.contact_name}
                    </Typography>
                  </MenuItem>
                );
              })}
            </StyledMenu>
            <Typography
              variant="h6"
              sx={{
                width: "100%",
                fontSize: 21,
                marginTop: 1.8,
                marginBottom: 1.5,
                fontWeight: 500,
                textAlign: "left",
                pl: 3,
              }}
            >
              <span
                style={{
                  marginLeft: 0,
                  marginRight: "auto",
                }}
              >
                Add Fields
              </span>
              <Tooltip
                title="Drag and add fields to the document"
                sx={{ ml: "auto", mr: 0 }}
              >
                <IconButton>
                  <InfoOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Typography>
            <Divider />
            <Box sx={{ overflow: "auto" }}>
              <List sx={{ padding: 1, pt: 0 }}>
                {pallet?.map((item, index) => {
                  return (
                    <ListItemButton
                      key={index}
                      sx={{ marginTop: 1, marginBottom: 1 }}
                    >
                      <ListItemIcon className="abc">
                        {DraggableIcon(
                          index,
                          item.icon,
                          rname.current?.assigned_color
                        )}
                      </ListItemIcon>
                      <Typography sx={{ fontSize: 16 }}>{item.name}</Typography>
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          </div>
          <div className="editor-viewer" ref={drop} id="pagesContainer">
            {docs.current?.map((doc: docProps1D) => {
              return (
                <Element name={`doc${doc.doc_id}${doc.page_no}`}>
                  <div
                    style={{
                      backgroundImage: `url('data:image/png;base64,${doc.doc_image}')`,
                      position: "relative",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      marginBottom: 40,
                      height: 1340,
                      width: 946,
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
                        fontFamily: "Roboto, Sans-Serif",
                        bottom: "0",
                        right: "0",
                        marginBottom: "-23px",
                        marginRight: "5px",
                        fontSize: "15px",
                      }}
                    >
                      Page {doc.page_no}
                    </span>
                    {pageIcons
                      ?.filter(
                        (icon) =>
                          icon.doc === doc.doc_id && icon.page === doc.page_no
                      )
                      ?.map((icon: ItemProps) => {
                        return <DraggableAddedIcon icon={icon} />;
                      })}
                  </div>
                </Element>
              );
            })}
          </div>
          <div className="editor-listing">
            {doclist?.map((thisdoc: docProps, dindex: number) => {
              return (
                <Accordion
                  expanded={expanded === `document${dindex + 1}`}
                  onChange={handleChange(`document${dindex + 1}`)}
                  sx={{ border: "none", boxShadow: "none" }}
                  disableGutters
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{
                      bgcolor: "rgb(241, 241, 241)",
                      borderBottom: "1px solid rgb(231,231,231)",
                    }}
                  >
                    {checkDoc(thisdoc.id) && (
                      <TurnedIn
                        sx={{
                          position: "absolute",
                          left: -1,
                          mt: -2,
                          color: rname.current?.assigned_color,
                        }}
                      />
                    )}
                    <Typography sx={{ textAlign: "center" }}>
                      {thisdoc.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      bgcolor: "rgb(251, 251, 251)",
                      borderBottom: "1px solid rgb(231,231,231)",
                    }}
                  >
                    <div className="listing-pages">
                      {thisdoc?.images?.map((image: any, pindex: number) => {
                        var thisBorder;
                        if (highlight === image) {
                          thisBorder = "2px solid  rgb(93, 226, 60)";
                        } else thisBorder = "1px solid rgb(220,220,220)";
                        return (
                          <div
                            style={{ width: "80%", marginBottom: 20 }}
                            onClick={(e) => {
                              console.log("Clicked");
                            }}
                          >
                            {checkPage(thisdoc.id, image.page_no) && (
                              <TurnedIn
                                sx={{
                                  position: "absolute",
                                  left: "16%",
                                  mt: -0.5,
                                  color: rname.current?.assigned_color,
                                }}
                              />
                            )}
                            <Link
                              to={`doc${thisdoc.id}${pindex + 1}`}
                              containerId="pagesContainer"
                              smooth={true}
                            >
                              <Card
                                onClick={(e) => {
                                  setHighlight(image);
                                }}
                                sx={{
                                  width: "100%",
                                  border: thisBorder,
                                  boxShadow: "none",
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  alt="Document Thumbnail"
                                  height="auto"
                                  width="100%"
                                  src={`data:image/png;base64,${image.doc_thumbnail}`}
                                />
                              </Card>
                              <Typography
                                variant="body2"
                                sx={{
                                  //textAlign: "left",
                                  ml: 0.5,
                                  fontSize: 13,
                                  mt: 0.2,
                                }}
                              >
                                {pindex + 1}
                              </Typography>
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
        </div>
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
export default Editor;
