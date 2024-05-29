import {
    File,
    ListFilter,
    // MoreHorizontal,
    PlusCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    // DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {

    TooltipProvider,

} from "@/components/ui/tooltip"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Loading from "@/components/app_components/Loading"
import TeacherTabContent from "@/components/app_components/TeacherTabContent"
import Alert from "@/components/app_components/Alert"
import { getTeachers } from "@/lib/api"

export default function Teachers() {

    const [teachers, setTeachers] = useState([])
    const [isData, setIsData] = useState(false)

    useEffect(() => {
        getTeachers()
          .then(res=>res.json())
          .then(data=> {
            // console.log(data)
            setTeachers(data)
            setIsData(true)
          })
          .catch(err=> {
            console.log(err)
          })
    }, [])

    

    return (
        <>
        { !isData ? <Loading/> :
        <TooltipProvider>
            <main className="">
                <Tabs defaultValue="all">
                    <div className="flex items-center">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="present">Present</TabsTrigger>
                            <TabsTrigger value="leave">Leave</TabsTrigger>
                        </TabsList>
                        <div className="ml-auto flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 gap-1">
                                        <ListFilter className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                            Filter
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem checked>
                                        Present
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>Leave</DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button size="sm" variant="outline" className="h-8 gap-1">
                                <File className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Export
                                </span>
                            </Button>
                            <Button size="sm" className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <Link to='/dashboard/add-teachers' className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Teachers
                                </Link>
                            </Button>
                        </div>
                    </div>
                    {
                        teachers.length == 0 ? <Alert title="You have not added any Teacher yet!" subtitle="Here you can manage teachers!" link="/dashboard/add-teachers" linktitle="Add"/> : <div>
                        <TabsContent value="all">
                            <TeacherTabContent title="All Teachers" description="Manage all teachers here." teachers={teachers}/>
                        </TabsContent>
                        {/* <TabsContent value="present">
                        <TeacherTabContent title="Present Teachers" description="Manage all present teachers here." teachers={teachers}/>
                        </TabsContent>
                        <TabsContent value="leave">
                        <TeacherTabContent title="Teachers who have left" description="Manage all left teachers here." teachers={teachers}/>
                        </TabsContent> */}
                        </div>
                    }
                </Tabs>
            </main>
        </TooltipProvider>}
        </>

    )
}
