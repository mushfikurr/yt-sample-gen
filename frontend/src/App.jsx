import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { Header } from "./components/Header";
import { SampleView } from "./components/SampleView";
import { useStore } from "./store";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
  const setUniqueId = useStore((state) => state.setUniqueId);
  const uniqueId = useStore((state) => state.uniqueId);
  useEffect(() => {
    setUniqueId();
  }, []);

  useEffect(() => {
    console.log(uniqueId);
  }, [uniqueId]);

  return (
    <div className="flex flex-col min-h-screen w-full max-sm:px-0 max-sm:py-0 px-10 py-5">
      <QueryClientProvider client={queryClient}>
        <Header />
        <SampleView />
      </QueryClientProvider>
    </div>
  );
}

export default App;
