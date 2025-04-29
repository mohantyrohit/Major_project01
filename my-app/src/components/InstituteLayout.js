import React from 'react';
import NavbarInstitute from './NavbarInstitute';

const InstituteLayout = ({ children }) => {
  return (
    <>
      <NavbarInstitute />
      <div className="institute-content">
        {children}
      </div>
    </>
  );
};

export default InstituteLayout;
