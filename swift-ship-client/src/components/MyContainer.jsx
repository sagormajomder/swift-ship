export default function MyContainer({ children, style = '' }) {
  return <div className={`max-w-7xl mx-auto px-4 ${style}`}>{children}</div>;
}
