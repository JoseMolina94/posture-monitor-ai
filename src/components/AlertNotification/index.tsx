/* Notificación Animada (Deslizable en el navegador) */

type AlertNotificationProps = {
  className: string
  title: string
  description: string
}

export const AlertNotification = ({
  className,
  title,
  description
}: AlertNotificationProps) => {

  return (
    <div
      className={`
        fixed bottom-4 right-4 p-4 bg-white shadow-2xl rounded-xl transition-all duration-500 ease-in-out border-4 
        ${className}
      `}
    >
      <p className="text-xl font-bold text-red-600">{title}</p>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  )
}