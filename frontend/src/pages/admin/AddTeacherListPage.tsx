import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { UsersInterface } from '../../interfaces/IUsers';
import { CreateTeacher, GetTeachersList } from '../../services/https/admin/listUsers';
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
  LinearProgress,
  Card,
  CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  typography: {
    fontFamily: '"Noto Sans", "Noto Sans Thai", sans-serif',
  },
});

function AddTeacherListPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [usersData, setUsersData] = useState<UsersInterface[]>([]);
  const [existingUsers, setExistingUsers] = useState<UsersInterface[]>([]); // เก็บข้อมูลผู้ใช้ที่มีอยู่แล้วในฐานข้อมูล
  const [loading, setLoading] = useState(false); // Loading state for submissions
  const [uploadProgress, setUploadProgress] = useState<number>(0); // Track upload progress

  const navigate = useNavigate();
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
            user_name: row[3],
            position_id: mapPositionToId(row[1]), // Map position title to position_id
            full_name: row[2],
            email: row[3],
            role_id: 2,
            password: row[3],
            contact_number: row[4],
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
          user_name: row[3],
          position_id: mapPositionToId(row[1]), // Map position title to position_id
          full_name: row[2],
          email: row[3],
          role_id: 2,
          password: row[3],
          contact_number: row[4],
        }));
      setUsersData(jsonData);
      console.log("XLSX data: ", jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    const fetchExistingUsers = async () => {
      try {
        const res = await GetTeachersList(); // เรียก API เพื่อดึงผู้ใช้ที่มีอยู่แล้วในระบบ
        if (res.status === 200) {
          setExistingUsers(res.data.data); // เก็บข้อมูลผู้ใช้ใน state
        } else {
          console.error('Error fetching users:', res.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error instanceof Error ? error.message : 'An unknown error occurred');
      }
    };

    fetchExistingUsers(); // เรียกใช้เมื่อโหลด component
  }, []);

  // เช็คข้อมูลที่ซ้ำในระบบ
  const isDuplicate = (newUser: UsersInterface) => {
    return existingUsers.find((existingUser) =>
      existingUser.user_name === newUser.user_name || existingUser.email === newUser.email
    );
  };

  const handleSubmit = async () => {
    if (usersData.length === 0) {
      toast.error("ไม่มีข้อมูลอาจารย์ในการบันทึก");
      return;
    }

    setLoading(true);
    let processed = 0;
    const toastId = toast.info("กำลังตรวจสอบและบันทึกข้อมูล...", { autoClose: false });

    try {
      const duplicates: UsersInterface[] = [];

      for (const user of usersData) {
        const duplicate = isDuplicate(user);
        if (duplicate) {
          duplicates.push(user);
        } else {
          const userJson: UsersInterface = {
            user_name: user.email || '',
            full_name: user.full_name || '',
            position_id: user.position_id,
            email: user.email || '',
            password: user.password || '',
            role_id: user.role_id ?? 2,
            contact_number: user.contact_number,
          };

          const res = await CreateTeacher(userJson);

          if (res.status === 200) {
            processed++;
            const progress = Math.round((processed / usersData.length) * 100);
            setUploadProgress(progress);
            toast.update(toastId, {
              render: `กำลังบันทึกข้อมูล... (${progress}%)`,
            });
          } else {
            toast.error(res.data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล!");
          }
        }
      }

      if (duplicates.length > 0) {
        const duplicateNames = duplicates.map(user => user.full_name || user.email).join(", ");
        toast.warning(`พบข้อมูลซ้ำ: ${duplicateNames}`, { autoClose: 5000 });
      }

      toast.update(toastId, {
        render: `บันทึกข้อมูลสำเร็จ! (${processed}/${usersData.length})`,
        type: "success",
        autoClose: 3000,
      });

      // เพิ่มการนำทางหลังจากแจ้งเตือนสำเร็จ
      setTimeout(() => {
        navigate('/Admin/TeacherList');
      }, 3000); // รอ 3 วินาทีก่อนนำทาง (ให้ผู้ใช้มีเวลาอ่านข้อความแจ้งเตือน)

    } catch (error) {
      console.error('Error adding users:', error instanceof Error ? error.message : 'An unknown error occurred');
      toast.update(toastId, {
        render: "เกิดข้อผิดพลาดในการบันทึกข้อมูล!",
        type: "error",
        autoClose: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FrontLayout>
      <ThemeProvider theme={theme}>
        <Card sx={{ minWidth: 275, boxShadow: 3 }}>
          <CardContent>
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
              <div> ในการอัปโหลดไฟล์ .CSV หรือ .XLSX คอลัมน์ ต้องเรียง ลำดับ, ตำแหน่ง, ชื่อ, อีเมล และ เบอร์โทร เท่านั้น !!</div>
              {fileName && (
                <Typography variant="subtitle1" sx={{ mt: 2, color: '#555' }}>
                  ไฟล์ที่เลือก: {fileName}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleImport}
                disabled={!fileName || loading}
              >
                อัปโหลด {fileName ? `: ${fileName}` : ''}
              </Button>
              {loading && <LinearProgress variant="determinate" value={uploadProgress} />}

              <Box sx={{ my: 4, width: '100%', maxWidth: '700px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>ข้อมูลที่นำเข้า:</Typography>
                {usersData.length > 0 && (
                  <TableContainer component={Paper} sx={{ color: "black", fontSize: '2rem', fontWeight: 'bold' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                        <TableCell>ลำดับ</TableCell>
                          <TableCell>ตำแหน่ง</TableCell>
                          <TableCell>ชื่อ</TableCell>
                          <TableCell>อีเมล</TableCell>
                          <TableCell>เบอร์โทร</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {usersData.map((user, index) => (
                          <TableRow key={index}>
                            <TableCell>{index +1}</TableCell>
                            <TableCell>{mapPositionToName(Number(user.position_id))}</TableCell>
                            <TableCell>{user.full_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.contact_number}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>

              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmit}
                disabled={loading || usersData.length === 0}
              >
                บันทึกข้อมูล
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
          </CardContent>
        </Card>
      </ThemeProvider>
    </FrontLayout>
  );
}

export default AddTeacherListPage;
