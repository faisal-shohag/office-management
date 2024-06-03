import { issueAdd } from "@/lib/api";
import { CheckCircle, PlusCircle, Send } from "lucide-react";
import { useState } from "react";
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
            }),
        {
            loading: "Reporting an issue...",
            success: <b>Issue added successfully!</b>,
            error: (error) => <b>{error.message}</b>,
        }
    );
  };


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
          Feeling lost? Drop your issues here. We will fixed them as soon as
          possible.
        </div>
      </div>

      <div className="">
        <div className="mt-2 font-medium">Select a feature where you are facing issue:</div>
        <div className="mt-3 font-medium grid lg:grid-cols-10 md:grid-cols-3 gap-2">
          {allfeatures.map((feature, index) => (
            <div
              key={feature.id}
              onClick={() => handleFeatureSelect(index)}
              className="flex items-center gap-1 border p-1 justify-center rounded-xl cursor-pointer hover:bg-gray-100 text-sm"
            >
              <div>{feature.title}</div>{" "}
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
