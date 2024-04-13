import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";
import "../styles/customTable.css";

const columns = [
  {
    width: 200,
    label: "שם",
    dataKey: "name",
  },
  {
    width: 120,
    label: "טלפון",
    dataKey: "phone",
  },
  {
    width: 120,
    label: "סטטוס",
    dataKey: "isComing",
  },
  {
    width: 120,
    label: "מספר מגיעים",
    dataKey: "amount",
    numeric: true,
  },
];

// const rows = Array.from({ length: 200 }, (_, index) => {
//   const randomSelection = sample[Math.floor(Math.random() * sample.length)];
//   return createData(index, ...randomSelection);
// });

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer
      sx={{ borderRadius: "20px" }}
      component={Paper}
      {...props}
      ref={ref}
    />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{
        borderCollapse: "separate",
        tableLayout: "fixed",
        textAlign: "right",
      }}
    />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

const customTableBodyCell = (row, column) => {
  if (column.dataKey === "isComing") {
    switch (row[column.dataKey]) {
      case true:
        return <span className="coming">מגיע</span>;
      case false:
        return <span className="notComing">לא מגיע</span>;

      default:
        return <span className="pending">ממתין </span>;
    }
  } else {
    return row[column.dataKey];
  }
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align="left"
          style={{ width: column.width }}
          sx={{
            backgroundColor: "#F8F9FA",
            fontWeight: "600",
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell key={column.dataKey} align="left">
          {customTableBodyCell(row, column)}
          {/* {row[column.dataKey]} */}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function ReactVirtualizedTable(props) {
  const { data } = props;
  console.log(data);
  return (
    <Paper
      style={{
        height: 400,
        width: "100%",
        borderRadius: "20px",
      }}
    >
      <TableVirtuoso
        dir="rtl"
        data={data}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
