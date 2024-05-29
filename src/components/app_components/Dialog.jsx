
import PropTypes from 'prop-types';
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

const ShowDialog = ({title, message, buttonText, handler, openModal, closeModal, isOpen, name}) =>{

    return (
        <>
     
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
                                    <AlertDialogAction>Continue</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
    </>
    );
};

ShowDialog.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    buttonText: PropTypes.string,
    handler: PropTypes.func,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    isOpen: PropTypes.bool,
    name: PropTypes.string
}

export default ShowDialog;