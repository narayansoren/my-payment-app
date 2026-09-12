// import { useEffect } from "react";

// function App() {
//   useEffect(() => {
//     fetch("http://localhost:5000/")
//       .then((res) => res.json())
//       .then((data) => console.log(data))
//       .catch((error) => console.error(error));
//   }, []);

//   return (
//     <div>
//       <h1>MERN + Razorpay</h1>
//     </div>
//   );
// }

// export default App;
import PaymentButton from "./components/PaymentButton";

function App() {
  return (
    <div>
      <h1>Razorpay MERN Payment</h1>

      <PaymentButton />
    </div>
  );
}

export default App;
