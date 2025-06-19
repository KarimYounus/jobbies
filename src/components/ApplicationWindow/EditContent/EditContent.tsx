import React from "react";
import { ApplicationWindowContext } from "../ApplicationWindow";

const EditContent: React.FC = () => {
  const { jobApplication } = React.useContext(ApplicationWindowContext);

    if (!jobApplication) return null;
    return (
        // Todo: Implement the edit content UI
        <div className='flex bg-amber-300'></div>
    );
}

export default EditContent;