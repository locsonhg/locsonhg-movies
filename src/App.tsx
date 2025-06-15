import { QueryProvider } from "@/lib/react-query";
import { AppRouter } from "@/router";

function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  );
}

export default App;
