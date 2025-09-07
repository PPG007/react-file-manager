import { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import { validateApiCallback } from "../utils/validateApiCallback";

const SelectionContext = createContext();

export const SelectionProvider = forwardRef(({ children, onDownload, onSelect }, ref) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileToPreview, setFileToPreview] = useState();

  useImperativeHandle(ref, () => {
    return {
      setSelectedFiles
    }
  })

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedFiles);
    }
  }, [selectedFiles]);

  const handleDownload = () => {
    validateApiCallback(onDownload, "onDownload", selectedFiles);
  };

  return (
    <SelectionContext.Provider value={{ selectedFiles, setSelectedFiles, handleDownload, fileToPreview, setFileToPreview }}>
      {children}
    </SelectionContext.Provider>
  );
});

SelectionProvider.displayName = "SelectionProvider";

export const useSelection = () => useContext(SelectionContext);
