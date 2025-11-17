export default function Main({ children, style = '' }) {
  return <main className={`${style}`}>{children}</main>;
}
