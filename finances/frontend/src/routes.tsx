import {
  createBrowserRouter,
} from "react-router-dom";

// PAGE
import  Balance  from './pages/Balance';
import Overheads from "./pages/Overheads";
import FinancialRecord from "./pages/FinancialRecord";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Balance />
  },
  {
    path: "/overheads",
    element: <Overheads />
  },
  {
    path: "/financialRecord",
    element: <FinancialRecord />
  }
]);

export default router;