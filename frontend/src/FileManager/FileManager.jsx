import Loader from "../components/Loader/Loader";
import Toolbar from "./Toolbar/Toolbar";
import NavigationPane from "./NavigationPane/NavigationPane";
import BreadCrumb from "./BreadCrumb/BreadCrumb";
import FileList from "./FileList/FileList";
import Actions from "./Actions/Actions";
import { FilesProvider } from "../contexts/FilesContext";
import { IconProvider } from "../contexts/IconContext";
import { FileNavigationProvider } from "../contexts/FileNavigationContext";
import { SelectionProvider } from "../contexts/SelectionContext";
import { ClipBoardProvider } from "../contexts/ClipboardContext";
import { LayoutProvider } from "../contexts/LayoutContext";
import { useTriggerAction } from "../hooks/useTriggerAction";
import { useColumnResize } from "../hooks/useColumnResize";
import PropTypes from "prop-types";
import { dateStringValidator, urlValidator } from "../validators/propValidators";
import { TranslationProvider } from "../contexts/TranslationProvider";
import { useMemo, useState, forwardRef, useRef, useImperativeHandle } from "react";
import { defaultPermissions } from "../constants";
import "./FileManager.scss";

const FileManager = forwardRef(({
  files,
  fileUploadConfig,
  isLoading,
  onCreateFolder,
  onFileUploading = () => { },
  onFileUploaded = () => { },
  onCut,
  onCopy,
  onPaste,
  onRename,
  onDownload,
  onDelete = () => null,
  onLayoutChange = () => { },
  onRefresh,
  onFileOpen = () => { },
  onFolderChange = () => { },
  onSelect,
  onError = () => { },
  onUploadClick = () => {},
  onConfirm = () => {},
  onConvertPDF = () => {},
  onPrev = () => {},
  onNext = () => {},
  allowCreateInRoot = false,
  layout = "grid",
  enableFilePreview = true,
  maxFileSize,
  filePreviewPath,
  acceptedFileTypes,
  height = "600px",
  width = "100%",
  initialPath = "",
  filePreviewComponent,
  primaryColor = "#6155b4",
  fontFamily = "Nunito Sans, sans-serif",
  language = "en",
  permissions: userPermissions = {},
  collapsibleNav = false,
  defaultNavExpanded = true,
  iconSize = 48,
}, ref) => {
  const [isNavigationPaneOpen, setNavigationPaneOpen] = useState(defaultNavExpanded);
  const triggerAction = useTriggerAction(onUploadClick);
  const { containerRef, colSizes, isDragging, handleMouseMove, handleMouseUp, handleMouseDown } =
    useColumnResize(20, 80);
  const customStyles = {
    "--file-manager-font-family": fontFamily,
    "--file-manager-primary-color": primaryColor,
    height,
    width,
  };

  const permissions = useMemo(
    () => ({ ...defaultPermissions, ...userPermissions }),
    [userPermissions]
  );

  return (
    <main className="file-explorer" onContextMenu={(e) => e.preventDefault()} style={customStyles}>
      <Loader loading={isLoading} />
      <TranslationProvider language={language}>
        <FilesProvider filesData={files} onError={onError}>
          <FileNavigationProvider initialPath={initialPath} onFolderChange={onFolderChange} ref={el => ref.current.fileNavigation = el}>
            <SelectionProvider ref={el => ref.current.selection = el} onDownload={onDownload} onSelect={onSelect} triggerAction={triggerAction}>
              <ClipBoardProvider onPaste={onPaste} onCut={onCut} onCopy={onCopy}>
                <IconProvider iconSize={iconSize}>
                  <LayoutProvider layout={layout}>
                    <Toolbar
                      onLayoutChange={onLayoutChange}
                      onRefresh={onRefresh}
                      triggerAction={triggerAction}
                      permissions={permissions}
                      onUploadClick={onUploadClick}
                      onConfirm={onConfirm}
                    />
                    <section
                      ref={containerRef}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      className="files-container"
                    >
                      <div
                        className={`navigation-pane ${isNavigationPaneOpen ? "open" : "closed"}`}
                        style={{
                          width: colSizes.col1 + "%",
                        }}
                      >
                        <NavigationPane onFileOpen={onFileOpen} />
                        <div
                          className={`sidebar-resize ${isDragging ? "sidebar-dragging" : ""}`}
                          onMouseDown={handleMouseDown}
                        />
                      </div>

                      <div
                        className="folders-preview"
                        style={{ width: (isNavigationPaneOpen ? colSizes.col2 : 100) + "%" }}
                      >
                        <BreadCrumb
                          collapsibleNav={collapsibleNav}
                          isNavigationPaneOpen={isNavigationPaneOpen}
                          setNavigationPaneOpen={setNavigationPaneOpen}
                        />
                        <FileList
                          onCreateFolder={onCreateFolder}
                          onRename={onRename}
                          onFileOpen={onFileOpen}
                          onRefresh={onRefresh}
                          onUploadClick={onUploadClick}
                          onConvertPDF={onConvertPDF}
                          enableFilePreview={enableFilePreview}
                          triggerAction={triggerAction}
                          permissions={permissions}
                        />
                      </div>
                    </section>

                    <Actions
                      fileUploadConfig={fileUploadConfig}
                      onFileUploading={onFileUploading}
                      onFileUploaded={onFileUploaded}
                      onDelete={onDelete}
                      onRefresh={onRefresh}
                      onPrev={onPrev}
                      onNext={onNext}
                      maxFileSize={maxFileSize}
                      filePreviewPath={filePreviewPath}
                      filePreviewComponent={filePreviewComponent}
                      acceptedFileTypes={acceptedFileTypes}
                      triggerAction={triggerAction}
                      permissions={permissions}
                    />
                  </LayoutProvider>
                </IconProvider>
              </ClipBoardProvider>
            </SelectionProvider>
          </FileNavigationProvider>
        </FilesProvider>
      </TranslationProvider>
    </main>
  );
});

FileManager.displayName = "FileManager";

FileManager.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      isDirectory: PropTypes.bool.isRequired,
      path: PropTypes.string.isRequired,
      updatedAt: dateStringValidator,
      size: PropTypes.number,
    })
  ).isRequired,
  fileUploadConfig: PropTypes.shape({
    url: urlValidator,
    headers: PropTypes.objectOf(PropTypes.string),
    method: PropTypes.oneOf(["POST", "PUT"]),
  }),
  isLoading: PropTypes.bool,
  onCreateFolder: PropTypes.func,
  onFileUploading: PropTypes.func,
  onFileUploaded: PropTypes.func,
  onRename: PropTypes.func,
  onDelete: PropTypes.func,
  onCut: PropTypes.func,
  onCopy: PropTypes.func,
  onPaste: PropTypes.func,
  onDownload: PropTypes.func,
  onLayoutChange: PropTypes.func,
  onRefresh: PropTypes.func,
  onFileOpen: PropTypes.func,
  onFolderChange: PropTypes.func,
  onSelect: PropTypes.func,
  onError: PropTypes.func,
  onUploadClick: PropTypes.func,
  onConfirm: PropTypes.func,
  onConvertPDF: PropTypes.func,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  allowCreateInRoot: PropTypes.bool,
  layout: PropTypes.oneOf(["grid", "list"]),
  maxFileSize: PropTypes.number,
  enableFilePreview: PropTypes.bool,
  filePreviewPath: urlValidator,
  acceptedFileTypes: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialPath: PropTypes.string,
  filePreviewComponent: PropTypes.func,
  primaryColor: PropTypes.string,
  fontFamily: PropTypes.string,
  language: PropTypes.string,
  permissions: PropTypes.shape({
    create: PropTypes.bool,
    upload: PropTypes.bool,
    move: PropTypes.bool,
    copy: PropTypes.bool,
    rename: PropTypes.bool,
    download: PropTypes.bool,
    delete: PropTypes.bool,
  }),
  collapsibleNav: PropTypes.bool,
  defaultNavExpanded: PropTypes.bool,
};

export default FileManager;
