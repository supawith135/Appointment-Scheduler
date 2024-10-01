import { useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { UsersInterface } from '../../interfaces/IUsers';
import { CreateTeacher } from '../../services/https/admin/listUsers';
import FrontLayout from '../../components/layouts/FrontLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  typography: {
    fontFamily: '"Noto Sans", "Noto Sans Thai", sans-serif',
  },
});

function AddTeacherListPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [usersData, setUsersData] = useState<UsersInterface[]>([]);
  const [loading, setLoading] = useState(false); // Loading state for submissions

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name); // Set the file name
    }
  };

  // Import and parse file
  const handleImport = () => {
    if (!file) return;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'csv') {
      parseCSV(file);
    } else if (fileExtension === 'xlsx') {
      parseXLSX(file);
    }
  };

  // Helper function to map positions to position_id
  const mapPositionToId = (position: string): number => {
    switch (position) {
      case 'ศาสตราจารย์':
        return 1;
      case 'รองศาสตราจารย์':
        return 2;
      case 'ผู้ช่วยศาสตราจารย์':
        return 3;
      case 'อาจารย์':
        return 4;
      case 'ผู้ช่วยสอนและวิจัย':
        return 5;
      default:
        return 6; // default or unknown position_id
    }
  };

  // Helper function to map positions to position_id
  const mapPositionToName = (position_id: number): string => {
    switch (position_id) {
      case 1:
        return 'ศาสตราจารย์';
      case 2:
        return 'รองศาสตราจารย์';
      case 3:
        return 'ผู้ช่วยศาสตราจารย์';
      case 4:
        return 'อาจารย์';
      case 5:
        return 'ผู้ช่วยสอนและวิจัย';
      default:
        return 'ไม่มีตำแหน่ง'; // default or unknown position_id
    }
  };


  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: false, // เปลี่ยนเป็น false เพื่อให้ได้ข้อมูลเป็น array แทน object
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (result) => {
        const data: UsersInterface[] = result.data
          .slice(1) // ตัดแถวแรกที่เป็น header ออก
          .map((row: any) => ({
            user_name: row[0],
            position_id: mapPositionToId(row[1]), // Map position title to position_id
            full_name: row[2],
            email: `${row[0]}@sut.ac.th`,
            role_id: 2,
            password: row[0],
          }));
        setUsersData(data);
        console.log("CSV data: ", data);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  };


  // Parse XLSX file
  const parseXLSX = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: UsersInterface[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        .slice(1)
        .map((row: any) => ({
          user_name: row[0],
          position_id: mapPositionToId(row[1]), // Map position title to position_id
          full_name: row[2],
          email: `${row[0]}@sut.ac.th`,
          role_id: 2,
          password: row[0],
        }));
      setUsersData(jsonData);
      console.log("XLSX data: ", jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    if (usersData.length === 0) {
      toast.error("ไม่มีข้อมูลอาจารย์ในการบันทึก");
      return;
    }

    setLoading(true); // Set loading state to true
    try {
      for (const user of usersData) {
        const userJson: UsersInterface = {
          user_name: user.user_name || '',
          full_name: user.full_name || '',
          position_id: user.position_id ,
          email: user.email || '',
          password: user.password || '',
          role_id: user.role_id ?? 2,
        };
        console.log('Submitting user:', userJson); // Log the user data before submission

        const res = await CreateTeacher(userJson); // Call your API to save the user

        if (res.status === 200) {
          console.log('Student data:', res.data);
          toast.success(res.data.message || "บันทึกข้อมูลสำเร็จ!"); // Set success message
        } else {
          console.error('Error adding user:', res.statusText);
          toast.error(res.data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล!"); // Set error message from API
        }
      }
    } catch (error) {
      console.error('Error adding users:', error instanceof Error ? error.message : 'An unknown error occurred');
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล!"); // Default error message
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  return (
    <FrontLayout>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
            minHeight: '100vh',
          }}
        >
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-red-700 mb-6 lg:mb-10 text-center">
            เพิ่มรายชื่ออาจารย์
          </p>

          <input type="file" accept=".xlsx,.csv" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
          <label htmlFor="file-upload">
            <Button variant="contained" color="primary" startIcon={<AddIcon />} component="span" sx={{ mb: 2 }}>
              เลือกไฟล์
            </Button>
          </label>
          {fileName && (
            <Typography variant="subtitle1" sx={{ mt: 2, color: '#555' }}>
              ไฟล์ที่เลือก: {fileName}
            </Typography>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleImport}
            sx={{ mt: 2, '&:hover': { transform: 'scale(1.05)' } }}
          >
            นำเข้าไฟล์
          </Button>
          <Box sx={{ mt: 4, width: '100%', maxWidth: '600px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>ข้อมูลที่นำเข้า:</Typography>
            {usersData.length > 0 && (
              <TableContainer component={Paper} sx={{ color: "black", fontSize: '2rem', fontWeight: 'bold' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>รหัสประจำตัว</TableCell>
                      <TableCell>ตำแหน่ง</TableCell>
                      <TableCell>ชื่อ</TableCell>
                      <TableCell>อีเมล</TableCell>
                      {/* <TableCell>ID บทบาท</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usersData.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.user_name}</TableCell>
                        <TableCell>{mapPositionToName(Number(user.position_id))}</TableCell>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        {/* <TableCell>{user.role_id}</TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ mt: 4, '&:hover': { transform: 'scale(1.05)' } }}
          >
            {loading ? 'บันทึกข้อมูล...' : 'บันทึกข้อมูล'}
          </Button>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            closeOnClick
            pauseOnHover
            draggable
            theme="colored" // You can change the theme here
          />
        </Box>
      </ThemeProvider>
    </FrontLayout>
  );
}

export default AddTeacherListPage;
