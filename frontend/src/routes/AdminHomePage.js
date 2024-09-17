import AdminHome from '../adminUser/AdminHome';
import Navbar from '../containers/navbar/Navbar'
import Footer from '../containers/footer/Footer'


function AdminHomePage() {
  return (
    <>
      <Navbar /> 
      <AdminHome />
      <Footer />
    </>
  );
}

export default AdminHomePage;
