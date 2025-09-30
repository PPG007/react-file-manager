import { MdClose, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useEffect, useRef } from "react";
import { useTranslation } from "../../contexts/TranslationProvider";
import "./Modal.scss";

const Modal = ({
  children,
  show,
  setShow,
  onPrev,
  onNext,
  heading,
  dialogWidth = "25%",
  contentClassName = "",
  closeButton = true,
  prev = false,
  next = false
}) => {
  const modalRef = useRef(null);
  const t = useTranslation();

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShow(false);
    }
  };

  useEffect(() => {
    if (show) {
      modalRef.current.showModal();
    } else {
      modalRef.current.close();
    }
  }, [show]);

  return (
    <dialog
      ref={modalRef}
      className={`fm-modal dialog`}
      style={{ width: dialogWidth }}
      onKeyDown={handleKeyDown}
    >
      <div className="fm-modal-header">
        <span className="fm-modal-heading">{heading}</span>
        <div className="fm-modal-buttons">
          {
            prev && (<MdNavigateBefore className="close-icon" size={40} onClick={() => { onPrev() }} />)
          }
          {
            next && (<MdNavigateNext className="close-icon" size={40} onClick={() => { onNext() }} />)
          }
          {closeButton && (
            <MdClose
              size={40}
              onClick={() => setShow(false)}
              className="close-icon"
              title={t("close")}
            />
          )}
        </div>
      </div>
      {children}
    </dialog>
  );
};

export default Modal;
