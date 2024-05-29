
import { TriangleAlert } from 'lucide-react';
import PropTypes from 'prop-types';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';


const Alert2 = ({title, subtitle, link, linktitle, trigger, triggerTitle, triggerAPI}) => {
    return (
        <div className="text-gray-500 flex justify-center">
        <div className="flex m-5 shadow-sm p-3 border rounded-xl items-center gap-5">
        <div className="bg-gray-200 p-2 rounded-lg "><TriangleAlert size={30}/></div>
        <div>
        <div className=" font-medium text-xl">
                {title}
        </div>
        <div className="text-sm">{subtitle}</div>
        </div>
        {
            link && <div>
                    <Link to={link}><Button variant="outline">{linktitle}</Button></Link>
            </div>
        }
      </div>
      </div>
    );
};

Alert2.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    link: PropTypes.string,
    linktitle: PropTypes.string,
    trigger: PropTypes.string,
    triggerTitle: PropTypes.string,
    triggerAPI: PropTypes.string,
}



export default Alert2;