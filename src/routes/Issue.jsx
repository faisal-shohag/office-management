import Loading from "@/components/app_components/Loading";
import { dateTime, getIssues, issueAdd } from "@/lib/api";

import { CheckCircle, PlusCircle, Send, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Issue = () => {
  const features = [
    {
      title: "Dashboard",
      selected: false,
    },
    {
      title: "View Courses",
      selected: false,
    },
    {
      title: "Add Courses",
      selected: false,
    },
    {
      title: "Add Batch",
      selected: false,
    },
    {
      title: "View Students",
      selected: false,
    },
    {
      title: "Admission",
      selected: false,
    },
    {
      title: "Generate id card",
      selected: false,
    },
    {
      title: "Add attendance",
      selected: false,
    },
    {
      title: "View Teachers",
      selected: false,
    },
    {
      title: "View Staff",
      selected: false,
    },
    {
      title: "Add Staff",
      selected: false,
    },
    {
      title: "Add Fees",
      selected: false,
    },
    {
      title: "Fee Reports",
      selected: false,
    },
    {
      title: "Pay Salaries",
      selected: false,
    },
    {
      title: "Salary Reports",
      selected: false,
    },
    {
      title: "Add Account",
      selected: false,
    },
    {
      title: "Account Reports",
      selected: false,
    },
    {
      title: "Add Visitors",
      selected: false,
    },
    {
      title: "Visitors Reports",
      selected: false,
    },
    {
      title: "Other",
      selected: false,
    },
  ];
  const [allfeatures, setFeatures] = useState(features)
  const [selectedFeature, setSelectedFeature] = useState([])

  const handleFeatureSelect = (index) => {
    allfeatures[index].selected = !allfeatures[index].selected;
    const f = allfeatures.filter((feature) => feature.selected);
    setSelectedFeature(f);
    setFeatures(allfeatures);
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    const issue = e.target.issue.value;
    const f = selectedFeature.map((feature) => feature.title);
    toast.promise(
        issueAdd({issue, feature: f})
            .then((res) => res.json())
            .then((d) => {
                if (d.err) throw new Error(d.err);
                getUpdatedIssue()
            }),
        {
            loading: "Reporting an issue...",
            success: <b>Issue added successfully!</b>,
            error: (error) => <b>{error.message}</b>,
        }
    );
  };

  const getUpdatedIssue = () => {
    getIssues()
      .then((res) => res.json())
      .then((d) => {
        setIssues(d);
      });
  
  }

  const [issues, setIssues] = useState([])

  const [isData, setIsData] = useState(false)


  useEffect(() => {
    getIssues()
    .then(res=> res.json())
    .then(d => {
      setIssues(d)
      setIsData(true)
    })
  }, [])

//   console.log(issues)

  


  return (
    <>
      <div
        style={{
          backgroundImage: "url('https://i.postimg.cc/wB704JFK/image.png')",
        }}
        className="w-full p-5 rounded-xl text-center font-bold text-2xl text-white bg-cover bg-center"
      >
        Reports/Issues
        <div className="text-sm">
          Feeling lost? Drop your issues here. We will fix them as soon as
          possible.
        </div>
      </div>

      <div className="border p-5 rounded-xl">
        <div className="font-bold">All Issues</div>
        {isData ? <div className="overflow-y-auto max-h-[500px]">
        {
            issues.map((issue) => (
                <div key={issue.id} className="mt-2 text-sm rounded-xl border p-3">
                    <div className="flex justify-between">
                    <div className="flex gap-1">
                        {issue.feature.map((f, index) => <div className="text-xs  rounded-sm px-1 py-1 bg-black text-white" key={index}>{f}</div>)}
                    </div>
                    <div className="text-xs text-white">{issue.isSolved ? <div className="bg-green-500 rounded-full p-1">Solved</div> : <div className="bg-red-500 rounded-full p-1">Opened</div>}</div>
                    </div>
                   <div>
                   <div className="flex items-center gap-2 mt-1">
                    <div className="text-gray-600"><Tag size={18}/></div>
                    <div className="font-bold">{issue.issue}</div>
                    </div>
                    <div className="text-xs mt-1 text-gray-400">{dateTime(new Date(issue.date))}</div>
                   </div>
                </div>
            ))
        }
        </div> : <Loading/>}
      </div>



      <div className="border px-2 py-2 rounded-xl">
        <div className=" font-medium">Select a feature where you are facing issue:</div>
        <div className="mt-3 font-medium grid lg:grid-cols-10 md:grid-cols-3 gap-2">
          {allfeatures.map((feature, index) => (
            <div
              key={index}
              onClick={() => handleFeatureSelect(index)}
              className="flex items-center gap-1 border p-1 justify-center rounded-xl cursor-pointer hover:bg-gray-100 text-sm"
            >
              <div>{feature.title}</div>
              {feature.selected ? (
                <CheckCircle size={10} />
              ) : (
                <PlusCircle size={10} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleIssueSubmit} className="flex justify-center items-center border-2 rounded-full px-3">
        <input
          type="text"
          name="issue"
          placeholder="Enter your issue here"
          className="w-full p-3 rounded-full border-2 border-none outline-none focus:border-blue-500 text-sm"
        />
        <button className="p-2 rounded-full text-sm flex justify-center items-center bg-red-500 text-white">
          <Send size={18} />
        </button>
      </form>
    </>
  );
};

export default Issue;
