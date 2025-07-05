// Example usage of useConfirmationDialog hook
import { useConfirmationDialog } from './useConfirmationDialog';
import ConfirmationDialog from '../components/General/ConfirmationDialog';

export const ExampleUsage = () => {
  const deleteDialog = useConfirmationDialog();
  const saveDialog = useConfirmationDialog();

  const handleDeleteClick = () => {
    deleteDialog.showDialog({
      title: "Delete Item",
      message: "Are you sure you want to delete this item?",
      primaryButton: {
        text: "Cancel",
        onClick: deleteDialog.hideDialog
      },
      secondaryButton: {
        text: "Delete",
        onClick: () => {
          // Perform delete operation
          console.log("Item deleted");
          deleteDialog.hideDialog();
        },
        className: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
      }
    });
  };

  const handleSaveClick = () => {
    saveDialog.showDialog({
      title: "Save Changes",
      message: "Do you want to save your changes?",
      primaryButton: {
        text: "Save",
        onClick: () => {
          // Perform save operation
          console.log("Changes saved");
          saveDialog.hideDialog();
        }
      },
      secondaryButton: {
        text: "Cancel",
        onClick: saveDialog.hideDialog
      }
    });
  };

  return (
    <div>
      <button onClick={handleDeleteClick}>Delete Item</button>
      <button onClick={handleSaveClick}>Save Changes</button>
      
      {/* Render the dialog components directly */}
      {deleteDialog.config && (
        <ConfirmationDialog
          isOpen={deleteDialog.isOpen}
          {...deleteDialog.config}
          onClose={deleteDialog.config.onClose || deleteDialog.hideDialog}
        />
      )}
      
      {saveDialog.config && (
        <ConfirmationDialog
          isOpen={saveDialog.isOpen}
          {...saveDialog.config}
          onClose={saveDialog.config.onClose || saveDialog.hideDialog}
        />
      )}
    </div>
  );
};
