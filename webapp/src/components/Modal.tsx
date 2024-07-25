import { ComponentPropsWithoutRef, useEffect, useRef } from "react";

type ModalProps = ComponentPropsWithoutRef<"dialog"> & {
    bodyClassName?: string
    onClose: () => void,
}

export default function Modal(props: ModalProps) {
    const { children, open, className, onClose, bodyClassName, ...rest } = props
    const ref = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = ref.current!

        if (open) {
            dialog.showModal()
            dialog.dataset.open = ""
        } else {
            delete dialog.dataset.open

            const handler = () => dialog.close()
            const inner = dialog.children[0] as HTMLElement

            inner.addEventListener("transitionend", handler)
            return () => inner.removeEventListener("transitionend", handler)
        }
    }, [open])

    useEffect(() => {
        const dialog = ref.current!;
        const handler = (e: Event) => {
            e.preventDefault();
            onClose();
        };
        dialog.addEventListener("close", handler);
        dialog.addEventListener("cancel", handler);
        return () => {
            dialog.removeEventListener("close", handler);
            dialog.removeEventListener("cancel", handler);
        };
    }, [onClose]);

    return (
        <dialog ref={ref} className={`group ${className ? className : ""}`} {...rest}>
            <div
                className="fixed inset-0 flex justify-center items-end bg-zinc-50/50 dark:bg-zinc-950/50 opacity-0 group-data-[open]:opacity-100 backdrop-blur-sm transition-all duration-400 sm:p-2"
            >
                <div
                    className={`w-full max-w-[400px] sm:min-w-[400px] sm:w-full sm:max-w-full sm:h-full sm:max-h-full translate-y-full group-data-[open]:translate-y-0 transition-transform duration-400 ${bodyClassName ? bodyClassName : ""}`}
                >
                    {children}
                </div>
            </div>
        </dialog>
    )
}