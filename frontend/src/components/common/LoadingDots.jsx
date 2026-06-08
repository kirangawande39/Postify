const LoadingDots = ({
  text = "Loading",
  textClassName = "text-white",
  fontSize = "text-sm",
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-1 font-medium ${textClassName} ${fontSize}`}
    >
      <span>{text}</span>

      <div className="flex gap-1 mt-2">
        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>

        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>

        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default LoadingDots;