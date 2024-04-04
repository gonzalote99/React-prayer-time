import {QueryClient, QueryClientProvider} from 'react-query';
import AllTime from './AllTime';
const queryClient = new QueryClient();

function App() {
  return(
    <>
    <QueryClientProvider client={queryClient}>
        <AllTime />
    </QueryClientProvider>
    </>
  )
}

export default App;