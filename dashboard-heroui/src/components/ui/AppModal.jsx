import {Modal} from '@heroui/react';

export function AppModal({open,setOpen,title,children,footer}){
  return <Modal><Modal.Backdrop isOpen={open} onOpenChange={setOpen}>
    <Modal.Container><Modal.Dialog className="app-dialog">
      <Modal.CloseTrigger aria-label="إغلاق"/>
      <Modal.Header><Modal.Heading>{title}</Modal.Heading></Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {footer?<Modal.Footer>{footer}</Modal.Footer>:null}
    </Modal.Dialog></Modal.Container>
  </Modal.Backdrop></Modal>;
}
