/* eslint-disable react/prop-types */
import { deleteVisitor, getVisitors } from '@/lib/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import Alert from '@/components/app_components/Alert';


const LatesVisitor = ({ load }) => {
    const [visitors, setVisitors] = useState([])
    /* Get Latest Vistor */
    useEffect(() => {
        getVisitors()
            .then(res => res.json())
            .then(data => {
                setVisitors((data))
            })
    }, [load])
    
    return (
        <>
            {
                visitors.length == 0 ? <Alert title="No data found!" /> : <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-10">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Visitor name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Phone No
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Course
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                visitors.map(item => {
                                    return (
                                        <tr key={item.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.name}
                                            </th>
                                            <td className="px-6 py-4">
                                                {item.phone}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.classes.join(' | ')}
                                            </td>
                                            {/* <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button className="" variant="destructive">Delete</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete your
                                                            account and remove your data from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteHandler(item.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog> */}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            }
        </>

    );
};

export default LatesVisitor;