import ManageAccounts from '../adminUser/ManageAccounts';
import Navbar from '../containers/navbar/Navbar'
import Footer from '../containers/footer/Footer'


const ManageAccountsPage = () => {
  return (
    <>
      <Navbar />
      <ManageAccounts />
      <Footer />
    </>
  );
};

export default ManageAccountsPage;
