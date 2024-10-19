import ManageUserProfiles from '../adminUser/ManageUserProfiles';
import Navbar from '../containers/navbar/Navbar'
import Footer from '../containers/footer/Footer'


const ManageUserProfilesPage = () => {
  return (
    <>
      <Navbar />
      <ManageUserProfiles />
      <Footer />
    </>
  );
};

export default ManageUserProfilesPage;
