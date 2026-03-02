import {Footer} from './components/Footer';
import {Header} from './components/Header';
import {HomePage} from './pages/HomePage'
import {Routes, Route, Router, Link} from 'react-router';

//import axios from "axios";


function App(){
  return(
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Main Content */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/about" element={<AboutPage />} /> */}
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}

export default App