import Container from 'react-bootstrap/Container';
import HelloWorld from './pages/greeting'
import CsvUploader from './pages/upload';

function App() {

  return (
    <Container>
      <HelloWorld />
      <CsvUploader />
    </Container>
  );
}

export default App;
