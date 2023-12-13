import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import { Header } from "./components/Header";
import { SampleView } from "./components/SampleView";
import { useStore } from "./store";

const queryClient = new QueryClient();

function App() {
  const words = useStore((state) => state.words);

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
