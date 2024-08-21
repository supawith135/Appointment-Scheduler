import React from 'react';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import NavbarV2 from '../../layout/AdminNavbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

function AddStudentPage() {
  const [name, setName] = useState('');
  const [advisor, setAdvisor] = useState('');

  const handleName = (event: SelectChangeEvent) => {
    setName(event.target.value);
  };

  const handleAdvisor = (event: SelectChangeEvent) => {
    setAdvisor(event.target.value);
  };

  return (
    <div className="min-w-screen min-h-screen flex flex-col bg-white">
      <Header />
      <NavbarV2 />
      <div className='flex flex-grow flex-col p-4 md:p-8 lg:p-10'>
        <div className='mx-auto p-2 md:p-10 lg:p-12 shadow-xl rounded-md font-NotoSans w-full max-w-4xl'>
          <div className='text-red-700 text-3xl md:text-4xl my-2 text-center'>เพิ่มรายชื่อนักศึกษา</div>
          <div className='mb-4'>
            <label className='block text-lg font-medium text-black'>รหัสนักศึกษา</label>
            <label className='ml-4 block text-sm font-medium text-gray-500 mb-2'>รหัสนักศึกษา เช่น B64xxxxx</label>
            <input
              type='text'
              placeholder='กรุณากรอกชื่อผู้ใช้......'
              id='username'
              name='username'
              className='w-full p-2 bg-white border border-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-700'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-lg font-medium text-black'>คำนำหน้าชื่อ</label>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small-label">คำนำหน้าชื่อ</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={name}
                label="คำนำหน้าชื่อ"
                onChange={handleName}
                sx={{
                  fontFamily: 'Noto Sans, Noto Sans Thai', // Added fontFamily here
                  '.MuiOutlinedInput-notchedOutline': {
                      borderColor: '#b91c1c',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#b91c1c',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#b91c1c',
                  },
                  '.MuiSelect-select': {
                      fontFamily: 'Noto Sans, Noto Sans Thai', // Ensure the font is applied to the select options as well
                  },
                  
                }}
              >
                <MenuItem value={10}>นาย</MenuItem>
                <MenuItem value={20}>นางสาว</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='mb-4 flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <label className='block text-lg font-medium text-black mb-2'>ชื่อ</label>
              <input
                type='text'
                placeholder='กรุณากรอกชื่อ......'
                id='firstname'
                name='firstname'
                className='w-full p-2 bg-white border border-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-700'
              />
            </div>
            <div className='flex-1'>
              <label className='block text-lg font-medium text-black mb-2'>นามสกุล</label>
              <input
                type='text'
                placeholder='กรุณากรอกนามสกุล......'
                id='lastname'
                name='lastname'
                className='w-full p-2 bg-white border border-red-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-700'
              />
            </div>
          </div>
          <div className='mb-4'>
            <label className='block text-lg font-medium text-black'>อาจารย์ที่ปรึกษา</label>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small-label">อาจารย์ที่ปรึกษา</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={advisor}
                label="อาจารย์ที่ปรึกษา" 
                onChange={handleAdvisor}
                sx={{
                  fontFamily: 'Noto Sans, Noto Sans Thai', // Added fontFamily here
                  '.MuiOutlinedInput-notchedOutline': {
                      borderColor: '#b91c1c',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#b91c1c',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#b91c1c',
                  },
                  '.MuiSelect-select': {
                      fontFamily: 'Noto Sans, Noto Sans Thai', // Ensure the font is applied to the select options as well
                  },
                }}
              >
                <MenuItem value={10}>Hollie Tyler</MenuItem>
                <MenuItem value={20}>Oskar O'Moore</MenuItem>
                <MenuItem value={30}>Martina Solomon</MenuItem>
                <MenuItem value={40}>Oskar O'Moore</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='mt-4 flex justify-end'>
            <button className="text-xl border border-red-700 rounded-md px-5 py-3 font-NotoSans text-red-700 hover:bg-red-700 hover:text-white">
              บันทึก
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddStudentPage;
