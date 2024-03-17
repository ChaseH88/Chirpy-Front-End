import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";

interface ModalContextType {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const modalRoot = useRef(document.createElement("div"));

  const showModal = useCallback((content: ReactNode) => {
    setModalContent(content);
    setIsOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    modalRoot.current.id = "modal-root";
    if (!document.getElementById("modal-root")) {
      document.body.appendChild(modalRoot.current);
    }
  }, []);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {isOpen &&
        modalContent &&
        createPortal(
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 13000,
              backdropFilter: "blur(2px)",
              transition: "all 0.3s",
            }}
          >
            <Box
              sx={{
                backgroundColor: "white",
                padding: "3em 4em",
                borderRadius: 3,
                boxShadow: 3,
                position: "relative",
              }}
            >
              <IconButton
                onClick={hideModal}
                sx={{
                  position: "absolute",
                  top: 1,
                  right: 1,
                }}
              >
                <CloseIcon />
              </IconButton>
              {modalContent}
            </Box>
          </Box>,
          modalRoot.current
        )}
    </ModalContext.Provider>
  );
};
