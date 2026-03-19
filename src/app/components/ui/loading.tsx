type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function LoadingSpinner({ size = "md", className = "" }: Props) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}