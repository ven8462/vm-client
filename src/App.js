import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginForm from './LoginForm';
import Signup from './Signup';
import UserDashboard from './UserDashboard';
import CreateBackup from './CreateBackup';
import Billing from './Billing';
import SubscriptionManagement from './SubscriptionManagement';
import AdminDashboard from './AdminDashBoard';
import CreateVirtualMachine from './CreateVirtualMachines';
import ManageVirtualMachine from './ManageVirtualMachines';
import VirtualMachineList from './RemoveVirtualMachine';
import AssignVirtualMachine from './AssignVirtualMachine';
import GuestDashboard from './GuestDashboard';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/guest" element={<GuestDashboard />} />

          <Route path='admin' element={<AdminDashboard />}>
            <Route path="create-vm" element={<CreateVirtualMachine />} />
            <Route path="manage-vm" element={<ManageVirtualMachine />} />
            <Route path="delete-vm" element={<VirtualMachineList  />} />
            <Route path="assign-vm" element={<AssignVirtualMachine  />} />
          </Route>

          {/* Nested routes inside UserDashboard */}
          <Route path="/account" element={<UserDashboard />}>
            <Route path="vm-management" element={<GuestDashboard />} />
            <Route path="create-backup" element={<CreateBackup />} />
            <Route path="billing" element={<Billing />} />
            <Route path="subscription-management" element={<SubscriptionManagement />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
