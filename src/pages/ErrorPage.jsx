export default function ErrorPage(props) {
  const errorType = props.type;
  switch (errorType) {
    case "not found":
      return <div>משהו השתבש אנא נסה שוב מאוחר יותר</div>;
    default:
      return <div>משהו השתבש אנא נסה שוב מאוחר יותר</div>;
  }
}
