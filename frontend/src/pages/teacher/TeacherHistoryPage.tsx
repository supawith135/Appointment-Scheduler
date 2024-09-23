import TeacherHistoryTable from '../../components/teacher/TeacherHistoryTable';
import TeacherDashboard from '../../components/teacher/TeacherDashboard';
import FrontLayout from '../../components/layouts/FrontLayout'
function TeacherHistoryPage() {
    return (
        <FrontLayout>

            <div className="flex flex-grow flex-col  my-4 gap-3">
                <div className='m-auto w-full sm:w-full lg:w-4/5'>
                    <TeacherDashboard />   
                </div>
                <div className='m-auto w-full sm:w-full lg:w-4/5'>
                    <TeacherHistoryTable />           
                </div>
            </div>  
        </FrontLayout>
    );
}

export default TeacherHistoryPage;
 