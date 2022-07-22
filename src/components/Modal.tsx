interface ModalProps {
    visible: boolean
    children: any
}
export function Modal(props: ModalProps) {
    return (
        <div className={`${props.visible ? '' : 'hidden'} absolute top-0 left-0 w-full h-full bg-slate-800 bg-opacity-70`}>
            {props.children}
        </div>
    )

}