
// import { Dialog } from '@headlessui/react'
import Spinner from './Spinner';
import PropTypes from 'prop-types'

const UploadDialog = ({progress, isOpen,}) => {

  return (
   <div className={isOpen ? "block" : "hidden"}>
     <div className='flex items-center justify-center'>
      <div>
      <div className='fixed left-[50%] z-[9999999999] bg-white border shadow-lg p-10 rounded-xl'>
        <div>
          <div className='flex items-center gap-3 font-bold'><Spinner/> Uploading({progress}%)</div>
        </div>
      </div>
      </div>
    </div>
   </div>
  )
};


UploadDialog.propTypes = {
    progress: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
}

export default UploadDialog;