import React from 'react';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import NavbarV2 from '../../layout/AdminNavbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

function AddTeacherPage() {
  const [name, setName] = useState('');
  const [advisor, setAdvisor] = useState('');

  const handleName = (event: SelectChangeEvent) => {
    setName(event.target.value);
  };

  const handleAdvisor = (event: SelectChangeEvent) => {
    setAdvisor(event.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <NavbarV2 />
      <div className='flex flex-grow flex-col p-4 md:p-8 lg:p-10'>
        <div className='mx-auto p-2 md:p-10 lg:p-12 shadow-xl rounded-md font-Kanit w-full max-w-4xl'>
          <div className='text-orange-400 text-3xl md:text-4xl my-2 text-center'>เพิ่มรายชื่ออาจารย์</div>
          
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
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'orange',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'darkorange',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'orange',
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
                className='w-full p-2 bg-white border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>
            <div className='flex-1'>
              <label className='block text-lg font-medium text-black mb-2'>นามสกุล</label>
              <input
                type='text'
                placeholder='กรุณากรอกนามสกุล......'
                id='lastname'
                name='lastname'
                className='w-full p-2 bg-white border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>
          </div>
          <div className='mb-4'>
            <label className='block text-lg font-medium text-black'>ตำแหน่ง</label>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small-label">ตำแหน่ง</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={advisor}
                label="คำนำหน้าชื่อ"
                onChange={handleAdvisor}
                sx={{
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'orange',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'darkorange',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'orange',
                  },
                }}
              >
                <MenuItem value={10}>ศาสตราจารย์</MenuItem>
                <MenuItem value={20}>รองศาสตราจารย์</MenuItem>
                <MenuItem value={30}>ผู้ช่วยศาสตราจารย์</MenuItem>
                <MenuItem value={30}>อาจารย์</MenuItem>
                
              </Select>
            </FormControl>
          </div>
          <div className='mb-4'>
             <label className='block text-lg font-medium text-black'>ที่อยู่ติดต่อ</label>
          </div>
          <div className='mb-4 flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <label className='block text-lg font-medium text-black mb-2'>อาคาร</label>
              <input
                type='text'
                placeholder='กรุณากรอกชื่ออาคาร......'
                id='firstname'
                name='firstname'
                className='w-full p-2 bg-white border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>
            <div className='flex-1'>
              <label className='block text-lg font-medium text-black mb-2'>เลขห้อง</label>
              <input
                type='text'
                placeholder='กรุณากรอกเลขห้อง......'
                id='lastname'
                name='lastname'
                className='w-full p-2 bg-white border border-orange-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400'
              />
            </div>
          </div>
          <div className='mt-4 flex justify-end'>
            <button className="text-xl border border-orange-300 rounded-md px-5 py-3 font-Kanit text-orange-400 hover:bg-orange-400 hover:text-white">
              บันทึก
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddTeacherPage;
