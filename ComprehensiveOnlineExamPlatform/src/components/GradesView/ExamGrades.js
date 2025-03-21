import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { DownloadForOffline as DownloadForOfflineIcon, Receipt as ReceiptIcon, Delete as DeleteIcon, DeleteForever as DeleteForeverIcon} from '@mui/icons-material';
import axios from 'axios';
import ExamResult from "../GradesView/ExamResult"
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Pagination, Tooltip, 
  Alert, TextField, Button, Dialog, DialogActions, DialogContent ,TableSortLabel
} from '@mui/material';
import * as XLSX from 'xlsx';
import { AppContext } from '../AppContext';
function Title({ children }) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};

function ExamGrades() {
  // get user list
  const [userAccount, setUserAccount] = useState([]);
  const { demoMode, userAccountDemo, setUserAccountDemo, examModesDemo, examBankDemo } = useContext(AppContext);
  //load the user account from back end service
  useEffect(() => {
    if(demoMode){
      setUserAccount(userAccountDemo);
    }else{
      axios.get('https://comprehensiveonlineexamplatformbackend.onrender.com/userAccount')
        .then(response => {
          setUserAccount(response.data);
          })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });
    }
  }, [demoMode, userAccountDemo]);

  // search items
  const [searchTerm, setSearchTerm] = useState("Student");
  const filteredUsers = userAccount.filter(
    (user) =>
    ( user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Loginrole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()))
  );

    // Function to sum user grades
    const Sum = (grades) => {
      return grades.reduce((acc, grade) => acc + grade, 0);
    };

  //state for sortting the item
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showConfirmation, setShowConfirmation] = useState("");

    // Success or error message
  const [outSuccess, setOutSuccess] = useState(null);
  const [openUserResult,setOpenUserResult] = useState(false);

    // set for displaying the users' answer if the user has taken the exam
  const [examPaperQuestions, setExamPaperQuestions] = useState(null);
  const [attempts,setAttempts] = useState(null);
  const [examScore, setExamScore] = useState(null);
  const [totalScore,setTotalScore] = useState(null);



  
  // sort the items
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valueA, valueB;
    if (sortBy === "average") {
      valueA = a.examGradesList.length ? Sum(a.examGradesList) / a.examGradesList.length : 0;
      valueB = b.examGradesList.length ? Sum(b.examGradesList) / b.examGradesList.length : 0;
    } else {
      valueA = a[sortBy];
      valueB = b[sortBy];
    }

    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
  const handleSort = (column) => {
    const isAsc = sortBy === column && sortDirection === "asc";
    setSortBy(column);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = sortedUsers.slice(startIndex, endIndex);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // the function to delete users' grade
  const handleDeleteGrades = (userName)=>{
    if (!showConfirmation) {
      setShowConfirmation("Click it again to delete");
      setTimeout(() => {
        setShowConfirmation("");
      }, 2000);
    } else {
      if(demoMode){
        const selectedUser = userAccountDemo.find(user => user.name === userName);
        selectedUser.examGradesList = [];
        selectedUser.examAttemptList = [];
        setUserAccountDemo(userAccountDemo.map(user => user.name === userName ? selectedUser : user));
        setOutSuccess("Delete user grades successfully!");
        setTimeout(() => {
          setOutSuccess("");
        }, 3000);
      }else{
        axios
        .post('https://comprehensiveonlineexamplatformbackend.onrender.com/deleteUserGrades', { userName })
        .then((response) => {
          setUserAccount(response.data.updatedUserAccount);
          setOutSuccess(response.data.message);
          setTimeout(() => {
            setOutSuccess("");
          }, 3000);
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
        });
      }
    }
  };

  // the function to view the detailed users' answers
  const handleViewUserResult = (userName)=>{
      if(demoMode){
        const selectedUser = userAccountDemo.find(user => user.name === userName);
        const totalScore =  (
          examModesDemo.examSingleChoiceCount * examModesDemo.examSingleChoiceScore +
          examModesDemo.examMultipleChoiceCount * examModesDemo.examMultipleChoiceScore +
          examModesDemo.examFillingBlankCount * examModesDemo.examFillingBlankScore +
          examModesDemo.examJudgementsCount * examModesDemo.examJudgementsScore
        );
        let attempts = selectedUser.examAttemptList[0];
        const qIDList = attempts.map(attempt => attempt.qID);
        let examPaperQuestions = examBankDemo.filter(question => qIDList.includes(question.id));
        
        setExamPaperQuestions(examPaperQuestions);
        setAttempts(attempts);
        setExamScore(attempts.examScore);
        setTotalScore(selectedUser.examGradesList.length > 0 ? Sum(selectedUser.examGradesList) / totalScore : 0);
        setOpenUserResult(true);
      }else{
        axios
          .post('https://comprehensiveonlineexamplatformbackend.onrender.com/viewUserDetailResult', { userName })
          .then((response) => {
          setExamPaperQuestions(response.data.examPaperQuestions)
          setAttempts(response.data.attempts)
          setExamScore(response.data.examScore)
          setTotalScore(response.data.totalScore)
          setOpenUserResult(true)
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
        });
      }
  };
  
    // Function to export the table data to Excel
    const downloadExcel = () => {
      const ws = XLSX.utils.json_to_sheet(
        paginatedRows.map((row) => ({
          "User ID": row.id,
          "User Name": row.name,
          "First Name": row.firstname,
          "Last Name": row.lastname,
          "Exam Score": row.examGradesList.length > 0 ? (Sum(row.examGradesList) / row.examGradesList.length).toFixed(2) : "No Record"
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "User Exam Grades");
  
      // download the file as an Excel (.xlsx) file
      XLSX.writeFile(wb, "User_Exam_Grades.xlsx");
    };

    // clear all users' grades
    const clearAllGrades = () => {
      const confirmExit = window.confirm("All the users' grades will be cleered and can't roll back. Are you sure?");
      if (!confirmExit) {
        return
      } else {
        if(demoMode){
          setUserAccountDemo(userAccountDemo.map(user => {
            user.examGradesList = [];
            user.examAttemptList = [];
            return user;
          }));
          setOutSuccess("All the users' grades have been cleared!");
          setTimeout(() => {
            setOutSuccess("");
          }, 3000);
        }else{
          axios
          .get('https://comprehensiveonlineexamplatformbackend.onrender.com/deleteAllUserGrades')
          .then((response) => {
            setUserAccount(response.data.updatedUserAccount);
            setOutSuccess(response.data.message);
            setTimeout(() => {
              setOutSuccess("");
            }, 3000);
          })
          .catch((error) => {
            console.error('Error deleting user:', error);
          });
        }
      }
    };

  return (
    <div>
      {/* Success message */}
      {outSuccess && (
        <Alert variant="outlined" severity="success">
          {outSuccess}
        </Alert>
      )}

      {/* Title */}
      <div style={{ display: 'flex', maxHeight: '100%', minWidth: '40%' }}>
        <div style={{ flex: 2, color: '#1976D2', marginLeft: '30px' }}>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
            }}
          >
          <h1 style={{ flexGrow: 1, textAlign: "center", margin: 0 }}>
            User Exam Grades
          </h1>
          <TextField
              label="Filter Users"
              variant="standard"
              margin="normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginLeft: "auto" }}
          />
        </div>
    
      {/* download Button */}
      <div style={{display: "flex",justifyContent: "space-between",alignItems: "center",padding: "10px"}}>
        <Button variant="contained" color="primary" onClick={downloadExcel} startIcon={<DownloadForOfflineIcon/>} sx={{ mr: 2 }}>
          Download Excel
        </Button>
        <Button variant="contained" color="primary" onClick={clearAllGrades} startIcon={<DeleteForeverIcon/>} sx={{ mr: 2 }}>
          Clear All Grades
        </Button>
      </div>
          
      {/* Table for displaying user exam grades */}
      {paginatedRows.length > 0 ? (
            <Table size="large">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "id"}
                      direction={sortBy === "id" ? sortDirection : "asc"}
                      onClick={() => handleSort("id")}>
                      User ID
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "name"}
                      direction={sortBy === "name" ? sortDirection : "asc"}
                      onClick={() => handleSort("name")}>
                      User Name
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "firstname"}
                      direction={sortBy === "firstname" ? sortDirection : "asc"}
                      onClick={() => handleSort("firstname")}>
                      First Name
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "lastname"}
                      direction={sortBy === "lastname" ? sortDirection : "asc"}
                      onClick={() => handleSort("lastname")}>
                      Last Name
                    </TableSortLabel>
                  </TableCell>
                  
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "average"}
                      direction={sortBy === "average" ? sortDirection : "asc"}
                      onClick={() => handleSort("average")}>
                      Exam Score
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} style={{ cursor: 'pointer' }}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.firstname}</TableCell>
                    <TableCell>{row.lastname}</TableCell>
                    <TableCell>
                      {row.examGradesList.length > 0 ? (Sum(row.examGradesList) / row.examGradesList.length).toFixed(2) : "No Record"}
                    </TableCell>
                    <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Tooltip
                        title={
                          showConfirmation ? "Click it again to delete the grades" : "Double click to delete its grade"}>
                        <DeleteIcon
                          onClick={() => handleDeleteGrades(row.name)}
                          size="small"/>
                      </Tooltip>

                      {/* only display if the user has taken the exam and the answer has been submitted*/}
                      {(row.examAttemptList.length > 0 )&&
                      (
                      <Tooltip title="View exam answers">
                        <ReceiptIcon
                          onClick={() => handleViewUserResult(row.name)}
                          style={{ marginLeft: '10px' }}
                        />
                      </Tooltip>)}
                    </div>
                </TableCell>                    
              </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
              // situation of no user in dataset
            <div>
              <br /> <br /> <br />
              <div style={{ fontSize: '1.2em' }}>No Users available.</div>
            </div>
          )}
          <Pagination count={pageCount} page={page} onChange={handleChangePage} />
        </div>
      </div>

      {/*View detailed exam Dialog*/}
      <Dialog open={openUserResult} onClose={() => setOpenUserResult(false)} maxWidth="lg" fullWidth>
          <DialogContent sx={{ minWidth: "1000px", p:4}}>
          <ExamResult examStudentGradesVisible={true} examStudentAnswerVisible={true} 
              examPaperQuestions={examPaperQuestions} attempts={attempts} examScore={examScore} totalScore={totalScore}/>
          </DialogContent>
        <DialogActions>
           <Button onClick={() => { setOpenUserResult(false)}}>Cancel</Button>
       </DialogActions>
     </Dialog>
    </div>
  );
}

export default ExamGrades;

