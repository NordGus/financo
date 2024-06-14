import { ComponentPropsWithoutRef, useEffect, useRef } from "react";

type ModalProps = ComponentPropsWithoutRef<"dialog"> & {
    bodyClassName?: string
    onClose: () => void,
    variant?: "small" | "medium" | "full" // for small and medium you most provide height
}

export default function Modal(props: ModalProps) {
    const { children, open, className, onClose, variant = "small", bodyClassName, ...rest } = props
    const ref = useRef<HTMLDialogElement>(null)
    const variants = {
        small: "sm:w-[30dvw] sm:max-w-[30dvw]",
        medium: "sm:w-[60dvw] sm:max-w-[60dvw]",
        full: "sm:w-full sm:max-w-full sm:h-full sm:max-h-full"
    }

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
                className="fixed inset-0 flex justify-center items-end bg-neutral-500/20 opacity-0 group-data-[open]:opacity-100 backdrop-blur-sm transition-all duration-200 sm:p-2"
            >
                <div
                    className={`w-full max-w-[400px] sm:min-w-[400px] ${variants[variant]} translate-y-full group-data-[open]:translate-y-0 transition-transform duration-500 ${bodyClassName ? bodyClassName : ""}`}
                >
                    {children}
                </div>
            </div>
        </dialog>
    )

}