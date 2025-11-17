export default function MyBody({ children, style = '' }) {
  return (
    <div
      className={`grid grid-rows-[auto_1fr_auto] min-h-dvh text-gray ${style}`}>
      {children}
    </div>
  );
}
