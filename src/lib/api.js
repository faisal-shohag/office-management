const api_key = import.meta.env.VITE_apiKey;

const adminLogin = (email, password) => {
  return fetch(api_key + "admin_login", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
};

//Add Class
const classAdd = (data) => {
  return fetch(api_key + "class_add", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });
};

//Add teachers
const teacherAdd = (data) => {
  return fetch(api_key + "teacher_add", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });
};

/* Add Staff */
const staffAdd = (data) => {
  return fetch(api_key + "staff_add", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });
};

/* Add Student */

const studentAdd = (data) => {
  return fetch(api_key + "student_add", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const AdmissionFeeAdd = (data) => {
  return fetch(api_key + "admission_fee", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

//Regular fee add
const RegularFeeAdd = (data) => {
  return fetch(api_key + "regular_fee", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};



const SalaryAdd = (data, employee) => {
  return fetch(api_key + 'salary_add/'+employee, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

//teacher salary add
// const teacherSalaryAdd = (data) => {
//   return fetch(api_key + 'teacher_salary_add', {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "content-type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
// };

// const staffSalaryAdd = (data) => {
//   return fetch(api_key + 'staff_salary_add', {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "content-type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
// };

const sectionAdd = (data) => {
  return fetch(api_key + "section_add", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

//Add Settings
const settingsAdd = (data) => {
  return fetch(api_key + "settings_add", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });
};

//set all absent for students
const setClassAbsent = (data) => {
  return fetch(api_key + "class/attendances", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

// ADD Accounts
const accountsAdd = (data) => {
  return fetch(api_key + "account_add", {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

////___________________________________________________________________________________________________________________////////

//GET
const adminLogout = () => {
  return fetch(api_key + "admin_logout", {
    method: "GET",
    credentials: "include",
  });
};

const checkAdminLogin = () => {
  return fetch(api_key + "check_admin_login", {
    method: "GET",
    credentials: "include",
  });
};

// Classes
const getClasses = () => {
  return fetch(api_key + "classes", {
    method: "GET",
    credentials: "include",
  });
};

const getClassById = (id) => {
  return fetch(api_key + "class/" + id, {
    method: "GET",
    credentials: "include",
  });
};

//teachers
const getTeachers = () => {
  return fetch(api_key + "teachers", {
    method: "GET",
    credentials: "include",
  });
};

const getLastTeacher = () => {
  return fetch(api_key + "last_teacher", {
    method: "GET",
    credentials: "include",
  });
};
//getTeacherById
const getTeacherById = (id) => {
  return fetch(api_key + "teacher/" + id, {
    method: "GET",
    credentials: "include",
  });
};

/* Get Last Staff */
const getLastStaff = () => {
  return fetch(api_key + "last_staff", {
    method: "GET",
    credentials: "include",
  });
};
/* Get All Staff */
const getStaffs = () => {
  return fetch(api_key + "staffs", {
    method: "GET",
    credentials: "include",
  });
};
//getStaffById
const getStaffById = (id) => {
  return fetch(api_key + "staff/" + id, {
    method: "GET",
    credentials: "include",
  });
};

// getStudentsCount
const getTeacherCount = () => {
  return fetch(api_key + "teacher_count", {
    method: "GET",
    credentials: "include",
  });
};

// View Students
const viewStudentsData = () => {
  return fetch(api_key + "students", {
    method: "GET",
    credentials: "include",
  });
};

//getStudents
const getStudents = () => {
  return fetch(api_key + "students", {
    method: "GET",
    credentials: "include",
  });
};


const getLastStudent = () => {
  return fetch(api_key + "last_student", {
    method: "GET",
    credentials: "include",
  });
};

// getStudentsCount
const getStudentCount = () => {
  return fetch(api_key + "student_count", {
    method: "GET",
    credentials: "include",
  });
};

//getStudentById_no
const getStudentById = (id) => {
  return fetch(api_key + "student/" + id, {
    method: "GET",
    credentials: "include",
  });
};

const getSettings = () => {
  return fetch(api_key + "settings", {
    method: "GET",
    credentials: "include",
  });
};

// get image
const getImage = (folder, filename) => {
  return fetch(api_key + `image/${folder}/${filename}`, {
    method: "GET",
    credentials: "include",
  });
};

// get student by attendance
const getStudentsByClassAndSection = (classId) => {
  return fetch(api_key + `students/${classId}`, {
    method: "GET",
    credentials: "include",
  });
};

const getClassAttendance = (classId, date) => {
  return fetch(api_key + `class/attendance/${classId}/${date}`, {
    method: "GET",
    credentials: "include",
  });
};
/* Get Accounts Details */
const getAccounts = () => {
  return fetch(api_key + "accounts", {
    method: "GET",
    credentials: "include",
  });
};

//getTeacherOrStaffById_no
const getTeacherOrStaffById = (id, type) => {
  return fetch(api_key + `${type}/` + id, {
    method: "GET",
    credentials: "include",
  });
};

/* Account Report BY Date */

const accountReportByDate = (startDate, endDate) => {
  return fetch(api_key + `accountsByDate?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
};

/* Salary Report By Date */

const salaryReportByDate = (startDate, endDate) => {
  return fetch(api_key + `salaries?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
};


/* Fee Report By Date */
const feeReportByDate = (startDate, endDate) => {
  return fetch(api_key + `fees?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
};

//count
const getCount = () => {
  return fetch(api_key + "count", {
    method: "GET",
    credentials: "include",
  });
};

//----------------------------------------------
//UPDATE

const adminUpdate = (data, id) => {
  return fetch(api_key + "admin_update/" + id, {
    method: "PUT",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const studentReadmission = (data, id) => {
  return fetch(api_key + "readmission/" + id, {
    method: "PUT",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const studentUpdate = (data, id) => {
  return fetch(api_key + "readmission/" + id, {
    method: "PUT",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const teacherUpdate = (data, id) => {
  return fetch(api_key + "teacher_update/" + id, {
    method: "PUT",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const staffUpdate = (data, id) => {
  return fetch(api_key + "staff_update/" + id, {
    method: "PUT",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const classUpdate = (data, id) => {
  return fetch(api_key + "class_update/" + id, {
    method: "PUT",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};


/* Settings Update */

const settingsUpdate = (data, id) => {
  return fetch(api_key + "settings_update/" + id, {
    method: "PUT",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

// Attendance Update
const attendanceUpdate = (data, studentId, date, attendanceId) => {
  return fetch(
    api_key + `class/attendance/${attendanceId}/${studentId}/${date}/`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
};

//______________________________________________________________________________//////

//DELETE
const deleteClass = (id) => {
  return fetch(api_key + "class/" + id, {
    method: "DELETE",
    credentials: "include",
  });
};

const deleteStudent = (id) => {
  return fetch(api_key + "student/" + id, {
    method: "DELETE",
    credentials: "include",
  });
};

/* Teacher Delete */
const deleteTeacher = (id) => {
  return fetch(api_key + "teacher/" + id, {
    method: "DELETE",
    credentials: "include",
  });
};
/* Staff Delete */
const deleteStaff = (id) => {
  return fetch(api_key + "staff/" + id, {
    method: "DELETE",
    credentials: "include",
  });
};

// get Formatted DateTime
const dateTime = (date) => {
  let d = date.toString();
  d = d.split(" ");
  return d[1] + " " + d[2] + ", " + d[3];
};

//
const fetchImageAndConvertToDataURI = async (folder, filename) => {
  const response = await fetch(api_key + "image/" + `${folder}/${filename}`, {
    credentials: "include",
  });
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

const formDate = (date) => {
  date = new Date(date);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};
/* Accounts Delete */
const deleteAccounts = (id) => {
  return fetch(api_key + "accounts/" + id, {
    method: "DELETE",
    credentials: "include",
  });
};
/* Accounts Report */
/* Salary Delete */
/* Teacher Delete */
const deleteSalary = (id) => {
  return fetch(api_key + "salary/" + id, {
    method: "DELETE",
    credentials: "include",
  });
};

export {
  deleteSalary,
  getTeacherOrStaffById,
  adminLogin,
  adminLogout,
  checkAdminLogin,
  classAdd,
  teacherAdd,
  studentAdd,
  studentUpdate,
  sectionAdd,
  viewStudentsData,
  getClasses,
  deleteClass,
  getTeachers,
  getLastTeacher,
  getTeacherCount,
  deleteTeacher,
  getStudentById,
  getStudents,
  getStudentCount,
  deleteStudent,
  dateTime,
  AdmissionFeeAdd,
  settingsAdd,
  getSettings,
  settingsUpdate,
  getImage,
  fetchImageAndConvertToDataURI,
  getLastStudent,
  adminUpdate,
  formDate,
  getClassById,
  studentReadmission,
  staffAdd,
  getLastStaff,
  RegularFeeAdd,
  getStudentsByClassAndSection,
  getClassAttendance,
  setClassAbsent,
  attendanceUpdate,
  getStaffs,
  deleteStaff,
  getTeacherById,
  getStaffById,
  accountsAdd,
  getAccounts,
  SalaryAdd,
  getCount,
  accountReportByDate,
  deleteAccounts,
  salaryReportByDate,
  feeReportByDate,
  classUpdate,
  teacherUpdate,
  staffUpdate,
};
