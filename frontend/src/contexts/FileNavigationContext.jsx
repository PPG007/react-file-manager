import { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useFiles } from "./FilesContext";
import sortFiles from "../utils/sortFiles";

const FileNavigationContext = createContext();

export const FileNavigationProvider = forwardRef(({ children, initialPath, onFolderChange }, ref) => {
  const { files } = useFiles();
  const isMountRef = useRef(false);
  const [currentPath, setCurrentPath] = useState("");
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentPathFiles, setCurrentPathFiles] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  useImperativeHandle(ref, () => {
    return {
      getCurrentPath: () => (currentPath),
      getCurrentFolder: () => (currentFolder),
      getCurrentPathFiles: () => (currentPathFiles),
      getSortConfig: () => (sortConfig),
    }
  }, [currentPath, currentFolder, currentPathFiles, sortConfig])

  useEffect(() => {
    if (Array.isArray(files) && files.length > 0) {
      setCurrentPathFiles(() => {
        const currPathFiles = files.filter((file) => file.path === `${currentPath}/${file.name}`);
        return sortFiles(currPathFiles, sortConfig.key, sortConfig.direction);
      });

      setCurrentFolder(() => {
        return files.find((file) => file.path === currentPath) ?? null;
      });
    }
  }, [files, currentPath, sortConfig]);

  useEffect(() => {
    if (!isMountRef.current && Array.isArray(files) && files.length > 0) {
      const activePath = files.some((file) => file.path === initialPath) ? initialPath : "";
      setCurrentPath(activePath);
      onFolderChange?.(activePath);
      isMountRef.current = true;
    }
  }, [initialPath, files]);

  return (
    <FileNavigationContext.Provider
      value={{
        currentPath,
        setCurrentPath,
        currentFolder,
        setCurrentFolder,
        currentPathFiles,
        setCurrentPathFiles,
        sortConfig,
        setSortConfig,
        onFolderChange,
      }}
    >
      {children}
    </FileNavigationContext.Provider>
  );
});

FileNavigationProvider.displayName = "FileNavigationProvider";

export const useFileNavigation = () => useContext(FileNavigationContext);
