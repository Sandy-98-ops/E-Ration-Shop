import './App.css';
import { Route, Routes } from 'react-router-dom';
import GuestLayout from './components/guestLayout/GuestLayout';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS
import Home from './components/guestLayout/Home';
import About from './components/guestLayout/About';
import UserLogin from './components/guestLayout/UserLogin';
import RetailerLogin from './components/guestLayout/RetailerLogin';
import DistributorLogin from './components/guestLayout/DistributorLogin';
import CitizenLayout from './components/citizenLayout/CitizenLayout';
import CitizenApplication from './components/citizenLayout/CitizenApplication';
import AddRetailer from './components/distributorLayout/AddRetailer';
import RetailerLayout from './components/retailerLayout/RetailerLayout';
import RetailerSale from './components/retailerLayout/RetailerSale';
import EditRetailerDetails from './components/retailerLayout/EditRetailerDetails';
import ChangeRetailerPassword from './components/retailerLayout/ChangeRetailerPassword';
import Register from './components/guestLayout/Register';
import DistributorLayout from './components/distributorLayout/DistributorLayout';
import AddItems from './components/distributorLayout/AddItems';
import ViewRetailers from './components/distributorLayout/ViewRetailers';
import ItemsList from './components/distributorLayout/ItemsList';
import IssueStock from './components/distributorLayout/IssueStock';
import ViewIssuedStocks from './components/distributorLayout/ViewIssuedStocks';
import ViewSale from './components/retailerLayout/ViewSale';
import ViewCitizens from './components/retailerLayout/ViewCitizens';
import IssuedRation from './components/citizenLayout/IssuedRation';
import ViewRetailerStock from './components/retailerLayout/ViewRetailerStock';
import Notifications from './components/distributorLayout/Notifications';
import UserNotifications from './components/citizenLayout/UserNotifications';


function App() {
  return (
    <div className="App">
      <Routes>

        <Route path='/' element={<GuestLayout />}>
          <Route index element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/register' element={<Register />} />
          <Route path='/guestLayout/userLogin' element={<UserLogin />} />
          <Route path='/guestLayout/retailerLogin' element={<RetailerLogin />} />
          <Route path='/guestLayout/distributorLogin' element={<DistributorLogin />} />
        </Route>

        <Route path='/citizen' element={< CitizenLayout />}>
          <Route index element={<IssuedRation />} />
          <Route path='/citizen/issuedRationList' element={<IssuedRation />} />
          <Route path='/citizen/viewNotifications' element={<UserNotifications />} />
        </Route>

        <Route path='/retailer' element={<RetailerLayout />}>
          <Route index element={<RetailerSale />} />
          <Route path='/retailer/sale' element={<RetailerSale />} />
          <Route path='/retailer/edit-profile' element={<EditRetailerDetails />} />
          <Route path='/retailer/change-password' element={<ChangeRetailerPassword />} />

          <Route path='/retailer/saleList' element={<ViewSale />} />
          <Route path='/retailer/citizenList' element={<ViewCitizens />} />

          <Route path='/retailer/stockList' element={<ViewRetailerStock />} />
        </Route>

        <Route path='/distributor' element={<DistributorLayout />}>
          <Route index element={<AddRetailer />} />
          <Route path='/distributor/addRetailer' element={<AddRetailer />} />
          <Route path='/distributor/retailersList' element={<ViewRetailers />} />

          <Route path='/distributor/addItem' element={<AddItems />} />
          <Route path='/distributor/itemsList' element={<ItemsList />} />

          <Route path='/distributor/issueStock' element={<IssueStock />} />
          <Route path='/distributor/viewIssuedStocks' element={<ViewIssuedStocks />} />
          <Route path='/distributor/setNotification' element={<Notifications />} />
        </Route>




      </Routes>
    </div>
  );
}

export default App;
