import { Add, Close } from "@mui/icons-material";
import { useState } from "react";
import {
  IconButton,
  TextField,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Modal,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { addNewCustomer } from "../state/slice/customers";
import { Formik } from "formik";
import * as Yup from "yup";

const tableHeads = ["No", "First Name", "Last Name", "Age", "Gender", "Email"];
const rowsPerPage = 10;

export default function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers.value);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="w-full space-y-8">
      <div className="w-full flex justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <IconButton
          className="bg-blue-500"
          variant="contained"
          onClick={() => setIsModalOpen(true)}
        >
          <Add className="text-white" />
        </IconButton>
      </div>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow
              style={{
                fontWeight: "bold",
              }}
            >
              {tableHeads.map((head, index) => (
                <TableCell
                  align={
                    index === 0
                      ? "left"
                      : index === tableHeads.length - 1
                      ? "right"
                      : "center"
                  }
                  key={index}
                >
                  <p className="font-semibold">{head}</p>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {customers
              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
              ?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1 + (currentPage - 1) * rowsPerPage}
                  </TableCell>
                  <TableCell align="center">{row.firstName}</TableCell>
                  <TableCell align="center">{row.lastName}</TableCell>
                  <TableCell align="center">{row.age}</TableCell>
                  <TableCell align="center">{row.gender}</TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex justify-center items-center" color="primary">
        <Pagination
          count={
            parseInt(customers.length / rowsPerPage) +
            parseInt(customers.length % rowsPerPage > 0 ? 1 : 0)
          }
          onChange={(e, page) => {
            setCurrentPage(page);
          }}
        />
      </div>

      <Modal
        className="flex justify-center items-center"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Paper className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-[60%] md:w-[40%] shadow-lg p-6">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-xl">Add new customer</h2>
            <IconButton
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              <Close />
            </IconButton>
          </div>

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              age: 0,
              gender: "male",
              email: "",
              birthDate: "",
            }}
            validationSchema={Yup.object().shape({
              firstName: Yup.string().required("First name is required"),
              age: Yup.number().positive().required("Age is required"),
              gender: Yup.string().required("Gender is required"),
              email: Yup.string().email("Invalid email format"),
              birthDate: Yup.date().required("Date of birth is required"),
            })}
            onSubmit={(values) => {
              dispatch(addNewCustomer(values));
              setIsModalOpen(false);
            }}
          >
            {({
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
            }) => {
              return (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <TextField
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="standard"
                    label="First Name"
                    size="small"
                    id="firstName"
                    required
                    error={errors.firstName && touched.firstName}
                    helperText={
                      errors.firstName && touched.firstName && errors.firstName
                    }
                  />
                  <TextField
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="standard"
                    label="Last Name"
                    size="small"
                    id="lastName"
                  />
                  <TextField
                    value={values.age}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="standard"
                    label="Age"
                    size="small"
                    type="number"
                    id="age"
                    required
                    error={errors.age && touched.age}
                    helperText={errors.age && touched.age && errors.age}
                  />
                  <TextField
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="standard"
                    size="small"
                    id="gender"
                    label="Gender"
                    select
                    required
                    error={errors.gender && touched.gender}
                    helperText={
                      errors.gender && touched.gender && errors.gender
                    }
                  >
                    <MenuItem value="male">male</MenuItem>
                    <MenuItem value="female">female</MenuItem>
                  </TextField>
                  <TextField
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="standard"
                    label="Email"
                    size="small"
                    id="email"
                    error={errors.email && touched.email}
                    helperText={errors.email && touched.email && errors.email}
                  />
                  <TextField
                    value={values.birthDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    variant="standard"
                    label="DOB"
                    size="small"
                    type="date"
                    id="birthDate"
                    required
                    error={errors.birthDate && touched.birthDate}
                    helperText={
                      errors.birthDate && touched.birthDate && errors.birthDate
                    }
                  />
                  <div className="flex justify-end gap-4 mt-2">
                    <Button
                      onClick={() => {
                        handleReset();
                        setIsModalOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-500"
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Add
                    </Button>
                  </div>
                </form>
              );
            }}
          </Formik>
        </Paper>
      </Modal>
    </div>
  );
}
