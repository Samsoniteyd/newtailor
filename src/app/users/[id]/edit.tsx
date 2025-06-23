// "use client";
// import React from 'react';
// // import { UserForm } from '@/components/UserForm';
// // Update the import path if the alias '@' is not configured or incorrect
// import UserForm from '../../../components/UserForm';
// import { User } from '../../../types';

// const dummyUser: User = {
//   _id: '1',
//   name: 'John Doe',
//   email: 'john@example.com',
//   phone: '1234567890',
//   role: 'user',
//   isActive: true,
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// };

// const EditUser = () => {
//   const handleSubmit = (formData: any) => {
//     // For now, just log the data
//     console.log('Edit user data:', formData);
//   };

//   return (
//     <div>
//       <h1>Edit User</h1>
//       <UserForm isLogin={false} initialData={dummyUser} onSubmit={handleSubmit} />
//     </div>
//   );
// };

// export default EditUser;