/* eslint-disable no-loop-func */
import { useState, useEffect } from "react";
import Pagination from "rc-pagination";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, MenuItem, Select } from "@mui/material";

function CharacterList() {
  const [characterList, setCharacterList] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [size, setSize] = useState(perPage);
  const [current, setCurrent] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [masterData, setMasterData] = useState([]);
  const [filmFilterValue, setFilmFilterValue] = useState([]);
  const [speciesFilterValue, setSpeciesFilterValue] = useState([]);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [results, setResults] = useState([]);


  const navigate = useNavigate();


  const setFilters = () => {

  }

  useEffect(() => {

    // getting all character data

    let tempMasterData = [];
    fetch("https://swapi.py4e.com/api/people")
      .then((res) => res.json())
      .then((data) => {
        setTotalCount(data.count);
        setCharacterList(data.results);
        tempMasterData = tempMasterData.concat(data.results);
      });

    for (let i = 2; i < 10; i++) {
      fetch(`https://swapi.py4e.com/api/people?page=${i}`)
        .then((res) => res.json())
        .then((data) => {
          tempMasterData = tempMasterData.concat(data.results);
          if (tempMasterData.length === 87) {
            setMasterData(tempMasterData);
              setResults(tempMasterData);
          }
        });
    }


    // films list for filter

    if (!localStorage.getItem("filmList")) {
      fetch(`https://swapi.py4e.com/api/films`)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("filmList", JSON.stringify(data.results));
        });
    }

    // species list for filter
    let tempSpeciesList = [];

    for (let i = 1; i < 5; i++) {
      fetch(`https://swapi.py4e.com/api/species?page=${i}`)
        .then((res) => res.json())
        .then((data) => {
          tempSpeciesList = tempSpeciesList.concat(data.results);
          if (tempSpeciesList.length === 37) {
            localStorage.setItem(
              "speciesList",
              JSON.stringify(tempSpeciesList)
            );
          }
        });
    }
  }, []);

  const PaginationChange = (page, pageSize) => {
    setCurrent(page);
    setSize(pageSize);
  };

  const PrevNextArrow = (current, type, originalElement) => {
    if (type === "prev") {
      return (
        <button>
          <i className="fa fa-angle-double-left"></i>
        </button>
      );
    }
    if (type === "next") {
      return (
        <button>
          <i className="fa fa-angle-double-right"></i>
        </button>
      );
    }
    return originalElement;
  };

  const PerPageChange = (value) => {
    setSize(value);
    const newPerPage = Math.ceil(totalCount / value);
    if (current > newPerPage) {
      setCurrent(newPerPage);
    }
    console.log(newPerPage, "new page");
  };

  const filmList = JSON.parse(localStorage.getItem("filmList")) || [];
  const speciesList = JSON.parse(localStorage.getItem("speciesList")) || [];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130, renderCell: (rowData) => {<p onClick={() => navigate(`/characters/${rowData.id}`)}>{rowData.name}</p>;} },
    { field: "species", headerName: "Species", width: 130 },
  ];

  const rows = results.map((item, i) => ({ name:  item.name, id: i+1 }))

  return (
    <>
      List
      <p
        onClick={() => {
          setOpenFilterModal(true);
        }}
        className="filter-btn"
      >
        Advanced Search
      </p>
      {/* {results.map((item, i) => {
        return (
          <div onClick={() => navigate(`/characters/${i}`)} key={item.name}>
            {item.name}
          </div>
        );
      })} */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          onRowClick={(rowData) => navigate(`/characters/${rowData.id}`)}
        />
      </div>
      {/* <Pagination
        className="pagination-data"
        showTotal={(total, range) =>
          `Showing ${range[0]}-${range[1]} of ${total}`
        }
        onChange={PaginationChange}
        total={totalCount}
        current={current}
        pageSize={size}
        showSizeChanger={false}
        itemRender={PrevNextArrow}
        onShowSizeChange={PerPageChange}
      /> */}
      <Dialog fullWidth={true} open={openFilterModal}>
        <DialogTitle
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            margin: "5px",
            marginLeft: "40px",
            marginRight: "40px",
          }}
        >
          <p>Filter</p>
          <CloseIcon
            onClick={() => setOpenFilterModal(false)}
            style={{ marginLeft: "auto", cursor: "pointer" }}
          ></CloseIcon>
        </DialogTitle>
        <div className="model-item-seperator"></div>

        <DialogContent>
          <div className="filter-items-cont">
            <div className="filter-input-cont">
              <p className="filter-label">Appeared In</p>
              <Select
                multiple
                value={filmFilterValue}
                onChange={(e) => setFilmFilterValue(e.target.value)}
                sx={{ width: 200 }}
              >
                {filmList.map((item) => (
                  <MenuItem key={item.title} value={item.title}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="filter-input-cont">
              <p className="filter-label"> Species</p>
              <Select
                multiple
                value={speciesFilterValue}
                onChange={(e) => setSpeciesFilterValue(e.target.value)}
                sx={{ width: 200 }}
              >
                {speciesList.map((item) => (
                  <MenuItem key={item.name} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className="filter-input-cont">
              <p className="filter-label">Birth Year Range</p>
              <Input />{" "}
              <Select>
                <MenuItem> BBY</MenuItem>
                <MenuItem> ABY</MenuItem>
              </Select>
              <Input /> <Select />
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ margin: "20px" }}>
          <Button
            onClick={() => {
              setFilters();
              setOpenFilterModal(false);
            }}
            style={{ marginLeft: "auto" }}
            text={"Search"}
          >
            Apply Filters
          </Button>
          <p
            onClick={() => setOpenFilterModal(false)}
            style={{
              marginRight: "auto",
              marginLeft: "20px",
              cursor: "pointer",
            }}
          >
            Cancel
          </p>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CharacterList;
