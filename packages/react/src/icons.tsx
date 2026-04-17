import type { ToastVariant } from '@modal-toast/core';

interface IconProps {
  className?: string;
  size?: number;
}

export function SuccessIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path
        d="M6.5 10.5L8.5 12.5L13.5 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ErrorIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path
        d="M7.5 7.5L12.5 12.5M12.5 7.5L7.5 12.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InfoIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path
        d="M10 9V14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function CloseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Returns the icon component for a given variant */
export function VariantIcon({
  variant,
  className,
  size,
}: {
  variant: ToastVariant;
  className?: string;
  size?: number;
}) {
  switch (variant) {
    case 'success':
      return <SuccessIcon className={className} size={size} />;
    case 'error':
      return <ErrorIcon className={className} size={size} />;
    case 'info':
      return <InfoIcon className={className} size={size} />;
  }
}
