import { Outlet } from 'react-router-dom';
import MasterLayout from '../layout';

export const ProtectedLayout = () => {
    return (
        <MasterLayout >
            <Outlet />
        </MasterLayout>
    );
};
