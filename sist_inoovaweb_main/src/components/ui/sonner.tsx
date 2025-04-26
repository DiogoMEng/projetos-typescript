
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="bottom-right"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-medical-dark/95 group-[.toaster]:text-white group-[.toaster]:border-2 group-[.toaster]:border-medical-primary group-[.toaster]:shadow-2xl group-[.toaster]:rounded-lg group-[.toaster]:backdrop-blur-xl group-[.toaster]:min-w-[300px] group-[.toaster]:max-w-md group-[.toaster]:z-[10000] group-[.toaster]:transform group-[.toaster]:transition-all group-[.toaster]:duration-300 group-[.toaster]:animate-in group-[.toaster]:fade-in-0 group-[.toaster]:slide-in-from-right-2",
          description: "group-[.toast]:text-gray-300",
          actionButton:
            "group-[.toast]:bg-medical-primary group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-medical-accent group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
