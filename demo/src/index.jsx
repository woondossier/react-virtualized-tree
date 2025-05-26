import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import NavBar from './NavBar.jsx';
import ExamplesContainer from './containers/ExamplesContainer.jsx';
import DocumentsContainer from './containers/DocumentsContainer.jsx';
import Home from './Home.jsx';

import './index.css';
import 'react-virtualized/styles.css';
import 'material-icons/css/material-icons.css';
import '../../src/main.css';
import 'semantic-ui-css/semantic.min.css';

// Find target DOM element
const container = document.getElementById('demo');
const root = createRoot(container); // ✅ React 18

root.render(
    <HashRouter>
        <NavBar>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/examples/*" element={<ExamplesContainer />} />
                <Route path="/docs/*" element={<DocumentsContainer />} />
            </Routes>
        </NavBar>
    </HashRouter>
);
