import { Search, Close } from "@mui/icons-material";
import { alpha, Grid, IconButton, InputBase, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  SearchText: string;
  setSearchText: Function;
  SearchUpdate: number;
  setSearchUp: Function;
}

const Search2 = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "16ch",
      "&:focus": {
        width: "18ch",
      },
    },
  },
}));

const SearchBar = ({
  SearchText,
  setSearchText,
  SearchUpdate,
  setSearchUp,
}: Props) => {
  let navigate = useNavigate();
  let location = useLocation();

  const [history, setHistory] = useState<string>("");

  return (
    <Search2>
      <SearchIconWrapper>
        <Search />
      </SearchIconWrapper>
      <Grid container>
        <Grid item lg={10} xs={9.5}>
          <StyledInputBase
            placeholder="Search"
            value={SearchText}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setHistory(location.pathname);
                setSearchUp(SearchUpdate + 1);
                navigate("//search");
              }
            }}
            onClick={() => {
              setHistory(location.pathname);
            }}
            onChange={(event) => {
              setSearchText(event.target.value);
              if (event.target.value.length < 1) {
                navigate(history);
              }
            }}
          />
        </Grid>
        <Grid item lg={2} xs={2.5}>
          {SearchText.length > 0 && (
            <IconButton
              onClick={() => {
                setSearchText("");
                navigate(history);
              }}
            >
              <Close sx={{ color: "white" }} />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </Search2>
  );
};

export default SearchBar;
