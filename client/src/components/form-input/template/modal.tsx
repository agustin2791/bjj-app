import { Box, Modal } from "@mui/material"
import { ComponentType, FC, ReactElement, ReactNode } from "react"
import SlotCard from "./card"


const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    p: 4,
  };

type ModalProps = {
    modal_content: JSX.Element,
    open: boolean,
    close: any
}

const SlotModal: FC<ModalProps> = (props) => {
    const {modal_content, open, close} = props
    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="modal-modal-title">
                <Box sx={modalStyle}>
                    <SlotCard content={modal_content}></SlotCard>
                </Box>
                
            </Modal>
    )
}

export default SlotModal;