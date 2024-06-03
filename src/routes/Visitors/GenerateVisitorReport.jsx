/* eslint-disable react/prop-types */

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
import * as XLSX from 'xlsx';

const GenerateVisitorReport = ({ data, deleteHandler }) => {
    // convert excel

    const _data = data.map(item => {
        return {
            date: item.date,
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            address: item.address,
            classes: item.classes.join(', '),
        }
    })

    const convertExcel = () => {
        // Create a new worksheet and add data to it 

        const worksheet = XLSX.utils.json_to_sheet(_data);

        // Create a new workbook and append the worksheet to it 
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "visitors");

        // Adjust column width 
        const wscols = [
            { wch: 10 }, // id 
            { wch: 15 }, // date 
            { wch: 15 }, // month 
            { wch: 10 }, // amount 
            { wch: 10 }, // status 
        ];
        worksheet["!cols"] = wscols;

        // Save the workbook to a file 
        XLSX.writeFile(workbook, "visitors.xlsx");
    }


    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {/* Convert Excel Sheet */}
            <Button
                size="sm"
                className="h-8 gap-1 mt-5 col-span-2 mb-5 ml-5 bg-[green]"
                onClick={convertExcel}
            >
                Convert To Excel
            </Button>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Visitor name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Phone No
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Course
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map(item => {
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
                                    <AlertDialog>
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
                                    </AlertDialog>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            {/* <button onClick={convertExcel}>Convert To Excel</button> */}
        </div>

    );
};

export default GenerateVisitorReport;