import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import NavBar from './NavBar.jsx';
import Home from './Home.jsx';
import ExamplesContainer from './containers/ExamplesContainer.jsx';
import DocumentsContainer from './containers/DocumentsContainer.jsx';

import './main.css';
import 'semantic-ui-css/semantic.min.css'
import 'react-virtualized/styles.css';
import 'material-icons/css/material-icons.css';

const root = createRoot(document.getElementById('demo'));

root.render(
    <DndProvider backend={HTML5Backend}>
        <HashRouter>
            <NavBar>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/examples/*" element={<ExamplesContainer />} />
                    <Route path="/docs/*" element={<DocumentsContainer />} />
                </Routes>
            </NavBar>
        </HashRouter>
    </DndProvider>
);
