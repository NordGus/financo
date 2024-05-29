import { ComponentPropsWithoutRef, useEffect, useRef } from "react";

type ModalProps = ComponentPropsWithoutRef<"dialog"> & {
    onClose: () => void
}

export default function Modal(props: ModalProps) {
    const { children, open, className, onClose, ...rest } = props
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
        <dialog ref={ref} className={`group ${className}`} {...rest}>
            <div
                className="fixed inset-0 flex flex-col justify-end items-center bg-neutral-500/20 opacity-0 group-data-[open]:opacity-100 backdrop-blur-sm transition-all duration-200"
            >
                <div
                    className="mb-2 w-[45dvw] border dark:border-neutral-800 rounded shadow overflow-clip max-h-[90dvh] translate-y-full group-data-[open]:translate-y-0 transition-all duration-200 bg-neutral-50 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50"
                >
                    {children}
                </div>
            </div>
        </dialog>
    )

}