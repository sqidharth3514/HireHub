import { useEffect } from "react";
import api from "./api/axios";

function App() {
  useEffect(() => {
    const testBackend = async () => {
      try{
        const response = await api.get("/job");
        console.log("Backend response:", response.data);
      }
      catch(error){
        console.error("Backend error", error);
      }
};
testBackend(); 
 }, []);

 return(
  <div>
    <h1>Job Portal</h1>
    </div>
 );
}
export default App;