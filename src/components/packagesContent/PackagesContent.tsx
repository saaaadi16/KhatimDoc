import "./PackagesContent.css";
import {
  Box,
  Checkbox,
  Divider,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Grid,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import * as React from "react";
import {
  CheckTwoTone,
  DoneTwoTone,
  ReportTwoTone,
  Search,
} from "@mui/icons-material";
import SplitButton from "../splitButton/SplitButtons";
import { IRecep, IRow } from "../../App";

import {
  ReportProblemTwoTone,
  HourglassTopTwoTone,
  CancelTwoTone,
  PermIdentityTwoTone,
} from "@mui/icons-material";
import { User } from "../../App";
import Axios from "../../services/axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "../snackbar/Snackbar";
import { clearApp } from "../../utils/GetRouterState";

interface Column {
  id:
    | "package_guid"
    | "serial"
    | "package_name"
    | "package_status"
    | "last_change"
    | "recipients"
    | "package_location"
    | "permitted_actions";
  label: string;
}

interface params {
  Title: string;
  user: User;
  setUser: any;
  RowsUpdated: number;
  setRowsUp: Function;
  SearchText?: string;
  SearchUpdate?: number;
}

export const PackagesContent = ({
  Title,
  user,
  setUser,
  setRowsUp,
  RowsUpdated,
  SearchText,
  SearchUpdate,
}: params) => {
  const columns: readonly Column[] = [
    { id: "package_guid", label: "" },
    { id: "serial", label: "" },
    { id: "package_name", label: "Packages" },
    { id: "package_status", label: "Status" },
    { id: "last_change", label: "Updated" },
    { id: "permitted_actions", label: "" },
  ];

  let navigate = useNavigate();

  const [Rows, setRows] = React.useState<IRow[]>([]);

  const [open, setOpen] = React.useState<boolean>(false);
  const [msg, setMsg] = React.useState<string>("");
  const [alert, setAlert] = React.useState<string>("");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [check, setCheck] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [LocalRowsUp, setLRUp] = React.useState<number>(0);

  const getDataPackage = (URL: string, Config: any) => {
    setLoading(true);
    setRows([]);

    Axios.get(URL, Config)
      .then((res) => {
        console.log(res, "PackCont");

        if (res.data.response_code === 0) {
          const Data: IRow[] = res?.data?.packages?.content;
          setRows(Data);
          setRowsUp(RowsUpdated + 1);
        } else {
          setOpen(true);
          setMsg(res.data.error_message);
          setAlert("error");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 403) {
          localStorage.removeItem("AuthToken");
          clearApp();
          navigate("/redirect");
        }
      });
  };

  React.useEffect(() => {
    const Config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
      },
    };
    Axios.get("/user/basic", Config)
      .then((res) => {
        if (res.data.response_code === 0) {
          setUser({
            userID: res.data.user_id,
            email: res.data.email,
            password: "",
            firstname: res.data.first_name,
            lastname: res.data.last_name,
            company: res.data.company_name,
            number: res.data.phone,
            country: res.data.country,
            avatar: res.data.image,
          });
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
  }, []);

  React.useEffect(() => {
    if (localStorage.getItem("AuthToken") !== "") {
      const Config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AuthToken")}`,
        },
      };

      if (Title === "Inbox") {
        getDataPackage("/package?package_location=inbox", Config);
      } else if (Title === "Sent") {
        getDataPackage("/package?package_location=sent", Config);
      } else if (Title === "Draft") {
        getDataPackage("/package?package_location=draft", Config);
      } else if (Title === "Pending") {
        getDataPackage("/package?package_status=Pending", Config);
      } else if (Title === "Waiting for Others") {
        getDataPackage("/package?package_status=Waiting", Config);
      } else if (Title === "Declined") {
        getDataPackage("/package?package_status=Declined", Config);
      } else if (Title === "Cancelled") {
        getDataPackage("/package?package_status=Cancelled", Config);
      } else if (Title === "Completed") {
        getDataPackage("/package?package_status=Completed", Config);
      } else if (Title === "Search Results") {
        getDataPackage("/package?search=" + SearchText, Config);
      }
    } else navigate("/redirect");
  }, [Title, LocalRowsUp, SearchUpdate]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box
      sx={{
        display: "flex",
        ml: { md: 33.9, sx: 0 },
        width: { md: "calc(100% - 275px)", xs: "100%" },
      }}
    >
      <Box component="main" sx={{ flexGrow: 1, mt: 8 }}>
        <Box
          sx={{
            p: 2,
          }}
        >
          <Typography
            align={"left"}
            sx={{
              fontWeight: "bold",
              fontSize: 30,
            }}
          >
            {!SearchText ? (
              <>{Title}</>
            ) : (
              <>
                {Title}{" "}
                {
                  <Typography
                    noWrap
                    component={"span"}
                    sx={{
                      fontSize: 30,
                      fontWeight: "light",
                      color: "lightslategray",
                    }}
                  >
                    {"("}
                    {Rows ? Rows?.length : "No record"} {"found)"}
                  </Typography>
                }
              </>
            )}
          </Typography>
        </Box>
        <Divider sx={{ color: "success.main" }} />
        <TablePagination
          className={"tmp"}
          rowsPerPageOptions={[10, 25, 100, 500]}
          count={Rows?.length ? Rows.length : 0}
          component={"div"}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ pb: 0, pt: 0 }}
        />
        <Divider sx={{ color: "success.main" }} />
        <Box>
          <TableContainer sx={{ maxHeight: 558 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow hover role="checkbox">
                  <Grid
                    container
                    alignItems="center"
                    sx={{ fontWeight: "bold", fontSize: 14, mb: 2, mt: 2 }}
                  >
                    {columns?.map((column, Index1) => (
                      <React.Fragment key={Index1}>
                        {column.id === "serial" ? (
                          <Grid
                            display={"flex"}
                            justifyContent={"center"}
                            item
                            md={1}
                            sm={1}
                            xs={1}
                          >
                            {column.label}
                          </Grid>
                        ) : column.id === "package_name" ? (
                          <Grid
                            display={"flex"}
                            justifyContent={"flex-start"}
                            item
                            md={5.5}
                            sm={6}
                            xs={4}
                          >
                            {column.label}
                          </Grid>
                        ) : column.id === "package_status" ? (
                          <Grid
                            justifyContent={"flex-start"}
                            item
                            md={1.5}
                            sm={0.1}
                            xs={0.1}
                            sx={{
                              display: { md: "flex", xs: "none", sm: "none" },
                            }}
                          >
                            {column.label}
                          </Grid>
                        ) : column.id === "last_change" ? (
                          <Grid
                            sx={{
                              display: { md: "flex", xs: "none", sm: "flex" },
                            }}
                            justifyContent={"flex-start"}
                            item
                            md={2}
                            sm={2}
                            xs={0.1}
                          >
                            {column.label}
                          </Grid>
                        ) : column.id === "permitted_actions" ? (
                          <Grid
                            display={"flex"}
                            justifyContent={"flex-start"}
                            item
                            md={2}
                            sm={2}
                            xs={2}
                          >
                            {column.label}
                          </Grid>
                        ) : (
                          <></>
                        )}
                      </React.Fragment>
                    ))}
                  </Grid>
                  <Divider sx={{ color: "success.main" }} />
                </TableRow>
              </TableHead>

              <TableBody className="codegic-table">
                {Rows?.length > 0 && !loading ? (
                  <>
                    {Rows?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )?.map((row, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            onClick={() => {
                              setCheck(!check);
                            }}
                            key={index + 1}
                          >
                            <Grid
                              container
                              alignItems="center"
                              key={index + 2}
                              sx={{
                                mt: 1,
                                mb: 1,
                              }}
                            >
                              {columns?.map((column, index2) => {
                                const value: any = row[column.id];
                                const Date = row["last_change"]?.split("T");
                                const Time = Date[1]?.split(".");

                                return (
                                  <React.Fragment key={index2 + 4}>
                                    {column?.id === "serial" &&
                                    row?.package_status?.toUpperCase() ===
                                      "Completed".toUpperCase() ? (
                                      <Grid
                                        display={"flex"}
                                        justifyContent="center"
                                        alignItems="center"
                                        item
                                        xs={1}
                                        sm={1}
                                        md={1}
                                      >
                                        <CheckTwoTone color={"success"} />
                                      </Grid>
                                    ) : column?.id === "serial" &&
                                      row?.package_status?.toUpperCase() ===
                                        "".toUpperCase() ? (
                                      <Grid
                                        display={"flex"}
                                        justifyContent="center"
                                        alignItems="center"
                                        item
                                        xs={1}
                                        sm={1}
                                        md={1}
                                      >
                                        <></>
                                      </Grid>
                                    ) : column?.id === "serial" &&
                                      row?.package_status?.toUpperCase() ===
                                        "Pending".toUpperCase() ? (
                                      <Grid
                                        display={"flex"}
                                        justifyContent="center"
                                        alignItems="center"
                                        item
                                        xs={1}
                                        sm={1}
                                        md={1}
                                      >
                                        <ReportTwoTone color={"primary"} />
                                      </Grid>
                                    ) : column?.id === "serial" &&
                                      row?.package_status?.toUpperCase() ===
                                        "Waiting".toUpperCase() ? (
                                      <Grid
                                        display={"flex"}
                                        justifyContent="center"
                                        alignItems="center"
                                        item
                                        xs={1}
                                        sm={1}
                                        md={1}
                                      >
                                        <HourglassTopTwoTone
                                          color={"secondary"}
                                        />
                                      </Grid>
                                    ) : column.id === "serial" &&
                                      row?.package_status?.toUpperCase() ===
                                        "Declined".toUpperCase() ? (
                                      <Grid
                                        display={"flex"}
                                        justifyContent="center"
                                        alignItems="center"
                                        item
                                        xs={1}
                                        sm={1}
                                        md={1}
                                      >
                                        <ReportProblemTwoTone
                                          color={"warning"}
                                        />
                                      </Grid>
                                    ) : column.id === "serial" &&
                                      row?.package_status?.toUpperCase() ===
                                        "Cancelled".toUpperCase() ? (
                                      <Grid
                                        display={"flex"}
                                        justifyContent="center"
                                        alignItems="center"
                                        item
                                        xs={1}
                                        sm={1}
                                        md={1}
                                      >
                                        <CancelTwoTone color={"error"} />
                                      </Grid>
                                    ) : column.id === "package_name" ? (
                                      <Grid
                                        display={"flex"}
                                        justifyContent="flex-start"
                                        container
                                        item
                                        md={5.5}
                                        sm={6}
                                        xs={5.5}
                                        sx={{ pr: { xs: 3, sm: "none" } }}
                                      >
                                        <Grid
                                          display={"flex"}
                                          justifyContent="flex-start"
                                          item
                                          xs={12}
                                          md={12}
                                        >
                                          <Typography
                                            sx={{ fontWeight: "bold" }}
                                            align={"left"}
                                          >
                                            {value}
                                          </Typography>
                                        </Grid>
                                        <Grid
                                          display={"flex"}
                                          justifyContent="flex-start"
                                          item
                                          xs={12}
                                          md={12}
                                          // sx={6}
                                        >
                                          <Typography
                                            component={"span"}
                                            variant={"subtitle2"}
                                            color={"text.secondary"}
                                          >
                                            <Tooltip title={"Owner"}>
                                              <PermIdentityTwoTone
                                                color={"success"}
                                                sx={{
                                                  width: "18px",
                                                  height: "18px",
                                                  mt: -0.39,
                                                  ml: -0.25,
                                                }}
                                              />
                                            </Tooltip>{" "}
                                            {row?.owner_name}
                                            {", "}
                                            To:&nbsp;
                                          </Typography>{" "}
                                          {row?.recipients?.map(
                                            (tos: IRecep, index3: number) => (
                                              <Typography
                                                key={index3 + index2 + 6}
                                                component={"span"}
                                                align={"justify"}
                                                variant={"subtitle2"}
                                                color={"text.secondary"}
                                              >
                                                {tos?.action_performed?.toUpperCase() ===
                                                "declined".toUpperCase() ? (
                                                  <>
                                                    <Tooltip title={"Declined"}>
                                                      <ReportProblemTwoTone
                                                        sx={{
                                                          width: "14px",
                                                          height: "14px",
                                                          mt: -0.39,
                                                        }}
                                                        color={"warning"}
                                                      />
                                                    </Tooltip>{" "}
                                                  </>
                                                ) : tos?.action_performed?.toUpperCase() ===
                                                  "sign".toUpperCase() ? (
                                                  <>
                                                    <Tooltip
                                                      title={"Completed"}
                                                    >
                                                      <DoneTwoTone
                                                        sx={{
                                                          width: "14px",
                                                          height: "14px",
                                                        }}
                                                        color={"success"}
                                                      />
                                                    </Tooltip>{" "}
                                                  </>
                                                ) : (
                                                  <></>
                                                )}
                                                {tos?.name}
                                                {index3 <
                                                row?.recipients.length - 1 ? (
                                                  <>{","}&nbsp;</>
                                                ) : (
                                                  ""
                                                )}{" "}
                                              </Typography>
                                            )
                                          )}
                                        </Grid>
                                      </Grid>
                                    ) : column.id === "package_status" ? (
                                      <Grid
                                        sx={{
                                          display: { md: "flex", xs: "none" },
                                        }}
                                        item
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        md={1.5}
                                        xs={0.1}
                                      >
                                        <Typography
                                          sx={{
                                            display: {
                                              md: "flex",
                                              xs: "none",
                                            },
                                          }}
                                        >
                                          {value}
                                        </Typography>
                                      </Grid>
                                    ) : column.id === "last_change" ? (
                                      <Grid
                                        container
                                        item
                                        md={2}
                                        sm={2}
                                        xs={0.1}
                                      >
                                        <Grid
                                          sx={{
                                            display: {
                                              // md: "flex",
                                              xs: "none",
                                              sm: "flex",
                                            },
                                          }}
                                          justifyContent={"flex-start"}
                                          item
                                          xs={12}
                                        >
                                          {Date[0]}
                                        </Grid>
                                        <Grid
                                          sx={{
                                            display: {
                                              md: "flex",
                                              xs: "none",
                                              sm: "flex",
                                            },
                                          }}
                                          justifyContent={"flex-start"}
                                          item
                                          xs={12}
                                        >
                                          <Typography
                                            variant={"subtitle2"}
                                            color={"text.secondary"}
                                            sx={{
                                              display: {
                                                md: "flex",
                                                xs: "none",
                                                sm: "flex",
                                              },
                                            }}
                                          >
                                            {Time[0]}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    ) : column.id === "permitted_actions" ? (
                                      <Grid
                                        display={"flex"}
                                        item
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        md={2}
                                        sm={2}
                                        xs={2}
                                      >
                                        <SplitButton
                                          row={row}
                                          user={user}
                                          package_guid={row?.package_guid}
                                          style={{ zIndex: 2 }}
                                          LocalRowsUp={LocalRowsUp}
                                          setLRUp={setLRUp}
                                        />
                                      </Grid>
                                    ) : (
                                      <> </>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </Grid>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </>
                ) : loading && Rows?.length < 1 ? (
                  <Grid
                    container
                    display="flex"
                    justifyContent={"center"}
                    sx={{ p: 2, mt: 12, opacity: 0.5 }}
                  >
                    <Grid item xs={12}>
                      <CircularProgress color="success" size={100} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        fontWeight="bold"
                        sx={{ fontSize: 35, color: "#1b5e20", mt: 4 }}
                      >
                        KhatimDoc
                      </Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid
                    container
                    item
                    display={"flex"}
                    justifyContent="center"
                    alignItems={"center"}
                  >
                    <Typography
                      fontWeight="bold"
                      sx={{ p: 20, color: "#1b5e20", fontSize: 25 }}
                    >
                      No Messages in {Title}
                    </Typography>
                  </Grid>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Snackbar open={open} setOpen={setOpen} message={msg} alert={alert} />
    </Box>
  );
};
