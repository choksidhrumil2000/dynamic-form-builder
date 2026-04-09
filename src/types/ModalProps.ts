export interface ModalProps {
    open:boolean;
    setOpen:(open:boolean)=>void;
    children:React.ReactNode
}