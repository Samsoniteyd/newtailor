"use client";
import React from 'react';
import { User } from '../types';

interface UserListProps {
    users: User[];
    onDelete?: (id: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users = [], onDelete }) => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">User List</h2>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border-b p-2">Name</th>
                        <th className="border-b p-2">Email</th>
                        <th className="border-b p-2">Phone</th>
                        <th className="border-b p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="border-b p-2">{user.name}</td>
                            <td className="border-b p-2">{user.email}</td>
                            <td className="border-b p-2">{user.phone}</td>
                            <td className="border-b p-2">
                                <button 
                                    className="text-blue-500 hover:underline"
                                    onClick={() => onDelete && onDelete(user.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;